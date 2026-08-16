import { BAG_METRICS } from "./useBagStatus";

// 홈 화면 지표(BAG_METRICS)를 id로 바로 찾아 쓰기 위한 매핑
const metricById = Object.fromEntries(
  BAG_METRICS.map((metric) => [metric.id, metric]),
);

// 3.1 최근 리포트 요약 데이터
// 그래프는 홈 화면과 동일한 온도 데이터(useBagStatus)를 그대로 재사용한다
const RECENT_SUMMARY = {
  updatedAt: "09.14(일) 기준",
  headline: "최근 7일 온도 평균 유지 시간이",
  highlight: "평균보다 5% 부족했어요",
  description:
    "높은 온도에 노출된 시간이 늘면서 소재 회복에 필요한 시간이 부족했어요.",
  graphMetric: metricById.temperature,
  // 최근 7일 요약 카드: 홈 화면 지표 값을 그대로 재사용
  stats: [
    { label: "현재 온도", value: metricById.temperature.displayValue },
    { label: "우측 하중", value: metricById.rightLoad.displayValue },
    { label: "형태 편차", value: metricById.shapeDeviation.displayValue },
  ],
};

// 지표의 시간대별 값에 비율을 곱해 새로운 더미 기록을 만든다
// (실제로는 기록마다 다른 값이 있겠지만, 지금은 홈 화면 데이터를 재사용해 만든 값)
function scalePoints(metric, ratio) {
  const points = metric.points.map((point) => ({
    ...point,
    value: Math.round(point.value * ratio),
  }));

  // 마지막 값에 맞춰 표시용 값과 y축 눈금도 함께 조정한다
  const lastValue = points[points.length - 1].value;

  return {
    ...metric,
    points,
    displayValue: `${lastValue}${metric.unit}`,
    yAxisLabels: metric.yAxisLabels.map((label) => Math.round(label * ratio)),
  };
}

// 3.2.1 사용 기록 목록 (최신순)
// 각 기록은 홈 화면과 같은 3개 지표(온도 / 우측 하중 / 형태 편차) 데이터를 담고 있고
// 3.2.2 상세 화면에서는 이 metrics 값으로 그래프를 그린다
const USAGE_RECORDS = [
  {
    id: "usage-0914",
    date: "09.14(일)",
    timeRange: "12:40 - 17:00",
    metrics: BAG_METRICS,
  },
  {
    id: "usage-0910",
    date: "09.10(수)",
    timeRange: "09:20 - 14:10",
    metrics: BAG_METRICS.map((metric) => scalePoints(metric, 0.8)),
  },
  {
    id: "usage-0905",
    date: "09.05(금)",
    timeRange: "18:00 - 21:30",
    metrics: BAG_METRICS.map((metric) => scalePoints(metric, 0.5)),
  },
];

// 사용 기록 목록/상세 화면 하단에 공통으로 보여주는 안내 문구
export const USAGE_DATA_NOTICE = [
  "스마트 소재 데이터가 발생한 기록만 표시됩니다",
  "미사용 기간은 데이터에 포함되지 않습니다",
];

// 3.3 AI 사용 패턴 분석 데이터
// changeText의 방향(direction)은 홈 화면 지표와 같은 id를 기준으로 연결된다
const PATTERN_INSIGHT = {
  headline: "최근 사용 기록을 분석했어요",
  description:
    "스마트소재가 감지한 최근 데이터를 바탕으로 반복되는 사용 패턴을 알려드려요.",
  changes: [
    {
      id: "temperature",
      label: "평균 온도 노출",
      changeText: "+8%p",
      direction: "up",
      description: "지난주보다 높은 온도에 노출되는 시간이 늘었어요.",
    },
    {
      id: "rightLoad",
      label: "우측 하중 편중",
      changeText: "+12%p",
      direction: "up",
      description: "오른쪽으로 무게가 쏠리는 습관이 반복되고 있어요.",
    },
    {
      id: "shapeDeviation",
      label: "형태 편차",
      changeText: "-3%p",
      direction: "down",
      description: "형태 변형은 지난주보다 개선됐어요.",
    },
  ],
  cautions: [
    "무거운 물건은 가방 중앙에 담아 하중을 분산해 주세요.",
    "장시간 고온 환경에 두지 않도록 주의해 주세요.",
  ],
};

// 리포트 화면 전체에서 사용하는 데이터를 반환하는 훅
function useReportData() {
  return {
    recentSummary: RECENT_SUMMARY,
    usageRecords: USAGE_RECORDS,
    patternInsight: PATTERN_INSIGHT,
  };
}

export default useReportData;
