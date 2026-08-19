import { useQuery } from "@tanstack/react-query";
import { getLatestReport } from "../api/report";
import useBagStore, { TEMP_PUBLIC_TOKEN } from "../store/bagStore";

// 사용 기록 목록/상세 화면 하단에 공통으로 보여주는 안내 문구
export const USAGE_DATA_NOTICE = [
  "스마트 소재 데이터가 발생한 기록만 표시됩니다",
  "미사용 기간은 데이터에 포함되지 않습니다",
];

// 3.1 최근 탭의 하중/형태/환경 서브탭 정의
// chart 배열의 어떤 필드를 그래프에 그릴지, 단위는 무엇인지 여기서 관리한다
export const RECENT_CHART_TABS = [
  {
    id: "load",
    label: "하중",
    chartKey: "load",
    valueKey: "total_load_kg",
    unit: "kg",
  },
  {
    id: "shape",
    label: "형태",
    chartKey: "shape",
    valueKey: "shape_deviation_percent",
    unit: "%",
  },
  {
    id: "environment",
    label: "환경",
    chartKey: "environment",
    valueKey: "temperature_c",
    unit: "°C",
  },
];

// {display_date: "2026-08-09"} → 그래프 x축에 쓰는 짧은 라벨 "08.09"
function toShortLabel(displayDate) {
  if (!displayDate) return "";
  const [, month, day] = displayDate.split("-");
  return month && day ? `${month}.${day}` : displayDate;
}

// 소수를 퍼센트 문자열로: 0.0109 → "1.1%"
function toPercent(ratio, digits = 1) {
  if (ratio === null || ratio === undefined) return null;
  return `${(ratio * 100).toFixed(digits)}%`;
}

// 리포트 화면 전체에서 사용하는 데이터를 반환하는 훅
// Report 화면(최근/사용기록/사용기록상세/형태분석)은 이 훅 하나가 감싸는
// GET /api/bags/{token}/reports/latest/ 응답만으로 전부 구성된다
function useReportData() {
  const storedToken = useBagStore((state) => state.publicToken);
  // Home.jsx와 동일하게, 아직 가방을 선택하지 않았다면 임시 토큰으로 폴백한다
  const publicToken = storedToken ?? TEMP_PUBLIC_TOKEN;

  const query = useQuery({
    queryKey: ["report", "latest", publicToken],
    queryFn: () => getLatestReport(publicToken),
    enabled: !!publicToken,
    // 404(아직 리포트 없음)는 재시도해도 결과가 바뀌지 않으므로 재시도하지 않는다
    retry: (failureCount, error) => error?.status !== 404 && failureCount < 2,
  });

  const report = query.data;
  const isNotFound = query.isError && query.error?.status === 404;

  // ── 3.1 최근 탭에서 쓰기 좋은 형태로 가공 ────────────────────────
  const recentSummary = report
    ? {
        periodLabel: `${report.display_period.start_date} ~ ${report.display_period.end_date}`,
        // AI 요약이 아직 없을 수 있으므로(ai_result === {}) 항상 폴백 문구를 둔다
        headline:
          report.ai_result?.content?.weekly_summary ??
          "최근 7일 사용 기록을 정리하고 있어요.",
        stats: [
          {
            label: "평균하중",
            value:
              report.metrics.load.average_kg != null
                ? `${report.metrics.load.average_kg}kg`
                : "-",
          },
          {
            label: "최대하중",
            value:
              report.metrics.load.max_kg != null
                ? `${report.metrics.load.max_kg}kg`
                : "-",
          },
          {
            label: "과부하 발생 횟수",
            sublabel: "(하중 초과)",
            value:
              report.metrics.load.overload_detected_days != null
                ? `${report.metrics.load.overload_detected_days}회`
                : "-",
          },
          {
            label: "변형 누적량",
            value: toPercent(report.metrics.deformation.max_ratio) ?? "-",
          },
        ],
        // 하중/형태/환경 서브탭 각각의 그래프 데이터
        charts: Object.fromEntries(
          RECENT_CHART_TABS.map((tab) => {
            const points = (report.charts[tab.chartKey] ?? []).map((point) => ({
              time: toShortLabel(point.display_date),
              value: point[tab.valueKey] ?? 0,
            }));
            const latest = points[points.length - 1];

            return [
              tab.id,
              {
                points,
                unit: tab.unit,
                latestDisplayValue: latest ? `${latest.value}${tab.unit}` : "-",
              },
            ];
          }),
        ),
      }
    : null;

  // ── 3.2.1 사용 기록 목록: metrics.daily_series 그대로 사용 ──────────
  const usageRecords = report
    ? report.metrics.daily_series.map((day) => ({
        // daily_series에는 별도 id가 없어 date를 고유 키로 사용한다
        id: day.date,
        date: day.display_date,
        loadKg: day.load_kg,
        deformationPercent: day.deformation_percent,
        moistureDetected: day.moisture_detected,
        presentation: day.presentation,
      }))
    : [];

  // ── 3.3 형태 분석(패턴) 탭 ───────────────────────────────────────
  const comparisonMetrics = report?.comparison?.available
    ? report.comparison.metrics
    : null;

  const patternInsight = report
    ? {
        // ai_result가 {}(빈 객체)일 수 있으므로 폴백 문구를 둔다
        headline: report.ai_result?.content
          ? "최근 사용 기록을 분석했어요"
          : "AI 분석을 준비하고 있어요",
        description:
          report.ai_result?.content?.pattern_insight ??
          "리포트가 조금 더 쌓이면 사용 패턴을 알려드릴게요.",
        comparisonAvailable: !!report.comparison?.available,
        comparisonReason: report.comparison?.reason ?? null,
        changes: comparisonMetrics
          ? [
              {
                id: "loadBias",
                label: "하중 편중",
                metric: comparisonMetrics.load_bias?.max_absolute,
              },
              {
                id: "overload",
                label: "과부하 발생 횟수",
                metric: comparisonMetrics.load?.overload_detected_days,
              },
              {
                id: "deformation",
                label: "변형 누적량",
                metric: comparisonMetrics.deformation?.max_ratio,
              },
            ].filter((change) => change.metric)
          : [],
        // priority_actions는 최대 2개 문자열
        cautions: report.ai_result?.content?.priority_actions ?? [],
      }
    : null;

  return {
    isLoading: query.isLoading,
    isError: query.isError && !isNotFound,
    isEmpty: isNotFound,
    error: query.error,
    report,
    recentSummary,
    usageRecords,
    patternInsight,
  };
}

export default useReportData;
