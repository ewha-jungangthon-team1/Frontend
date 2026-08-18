import { useEffect, useState } from "react";
import useLiveSession from "./useLiveSession";

// 그래프 한 칸의 간격 (5분) — "x축 5분 단위" 요구사항
const BUCKET_MS = 5 * 60 * 1000;
// 그래프에 보여줄 칸 개수 (최근 30분 = 5분 × 6칸)
const BUCKET_COUNT = 6;
const WINDOW_MS = BUCKET_MS * BUCKET_COUNT;
// 원본 기록은 창(30분)보다 조금 더 길게 보관해서, 가장 오래된 칸도
// "그 이전의 마지막 값"을 이어받을 수 있게 해준다 (라인이 뚝 끊기지 않도록)
const RAW_HISTORY_MAX_AGE_MS = WINDOW_MS + BUCKET_MS;

// presentation.display_metrics의 key → 화면에서 쓰는 지표 id 매핑
// (Home.jsx, MetricDrawer 등 다른 곳에서도 이 id로 지표를 구분한다)
export const METRIC_KEY_TO_ID = {
  temperature_c: "temperature",
  right_load_percent: "rightLoad",
  shape_deviation_percent: "shapeDeviation",
};

// 지표별 그래프 종류/문구 설정
// - type: "area"  → 온도, 형태 편차 등 일반 지표 그래프 (그라데이션 영역 + 원형 점)
// - type: "load"  → 좌우 하중 분포 그래프 (균형선 + 사각형 점)
const METRIC_PRESENTATION = {
  temperature_c: {
    id: "temperature",
    type: "area",
    drawerTitle: "측정 시작 후 온도 변화",
    moreLabel: "온도 기록 더 보기",
  },
  right_load_percent: {
    id: "rightLoad",
    type: "load",
    drawerTitle: "실시간 좌우 하중 분포",
    moreLabel: "리포트 더 보기",
  },
  shape_deviation_percent: {
    id: "shapeDeviation",
    type: "area",
    drawerTitle: "측정 시작 후 형태 편차 변화",
    moreLabel: "형태 편차 기록 더 보기",
  },
};

// ms 타임스탬프 → "14:20" 형태로 변환
function formatClock(ms) {
  const date = new Date(ms);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * 원본 기록(rawList: 시간순 [{ timeMs, value }])을 받아서,
 * "최근 30분을 5분 간격 6칸"으로 나눈 시계열로 변환한다.
 *
 * - 가장 최근 칸은 최신 reading의 시각을 5분 단위로 내림한 시각이고,
 *   거기서 5분씩 거슬러 올라가며 총 6칸을 만든다.
 *   예) 최신 값이 14:42에 들어왔다면 칸은 14:15/14:20/.../14:40.
 * - 각 칸에는 "그 칸 시각 이전의 가장 최근 값"을 채운다(계단식 보간).
 *   아직 데이터가 없는 칸(세션이 30분이 채 안 됐을 때)은 가장 오래된
 *   원본 값으로 채워서 라인이 끊기지 않게 한다.
 * - 다음 폴링에서 5분 경계를 넘어가면 가장 오래된 칸이 자동으로 빠지고
 *   새 칸이 오른쪽에 생기는 "최근 30분" 슬라이딩 윈도우가 된다.
 */
function bucketize(rawList) {
  if (rawList.length === 0) return [];

  const latestMs = rawList[rawList.length - 1].timeMs;
  const lastBucketMs = Math.floor(latestMs / BUCKET_MS) * BUCKET_MS;

  const bucketPoints = [];
  for (let i = BUCKET_COUNT - 1; i >= 0; i -= 1) {
    const bucketMs = lastBucketMs - i * BUCKET_MS;

    // 이 칸 시각 이전(≤)에 관측된 값 중 가장 최근 값을 찾는다
    let candidate = rawList[0];
    for (const entry of rawList) {
      if (entry.timeMs > bucketMs) break;
      candidate = entry;
    }

    bucketPoints.push({ time: formatClock(bucketMs), value: candidate.value });
  }

  return bucketPoints;
}

/**
 * 실시간 세션(useLiveSession)을 폴링하면서, 매번 새로 들어오는 reading을
 * 지표별 원본 기록으로 쌓아두고, "최근 30분 · 5분 간격 6칸" 그래프 데이터로
 * 가공해서 그래프 바텀시트(MetricDrawer)가 바로 쓸 수 있는 형태로 내려주는 훅입니다.
 *
 * ⚠️ 현재 백엔드에는 "과거 기록 조회" 전용 API가 없고 latest-reading만 있어서,
 * 폴링될 때마다 들어오는 값을 프론트에서 직접 쌓아 그래프를 그립니다.
 * → 세션이 갓 시작되면(30분이 안 지났으면) 앞 칸들은 최초 값으로 채워져
 *   그래프가 납작하게 보일 수 있고, 새로고침하면 지금까지 쌓인 기록은 초기화됩니다.
 * → 추후 "세션별 기록 목록"을 내려주는 API가 추가되면, 이 훅의 rawHistory 누적
 *   로직(useEffect + setRawHistory) 대신 그 API 응답을 그대로 bucketize에
 *   넘기도록 바꾸면 됩니다.
 */
function useBagMetrics(publicToken) {
  const { reading, isLoading, isError, error } = useLiveSession(publicToken);

  // key(right_load_percent 등) → [{ timeMs, value }] 원본 기록 (시간순)
  const [rawHistory, setRawHistory] = useState({});

  useEffect(() => {
    const values = reading?.presentation?.values;
    if (!values) return;

    const timeMs = new Date(reading.observed_at).getTime();

    // 매 폴링마다 "이전까지 쌓은 기록 + 이번에 새로 온 값"을 합쳐야 하므로
    // (외부 폴링 데이터를 누적하는 것이라 렌더링 중 순수 계산으로 대체할 수 없음)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRawHistory((prevHistory) => {
      const nextHistory = { ...prevHistory };

      Object.keys(METRIC_PRESENTATION).forEach((key) => {
        const value = values[key];
        if (value == null) return;

        const list = prevHistory[key] ?? [];
        const nextList = [...list, { timeMs, value }];

        // 창(30분)보다 오래된 기록은 정리해서 메모리가 무한히 늘어나지 않게 한다
        const cutoffMs = timeMs - RAW_HISTORY_MAX_AGE_MS;
        nextHistory[key] = nextList.filter((entry) => entry.timeMs >= cutoffMs);
        // 다 걸러졌다면(= 오래된 값 하나도 없이 창을 벗어남) 최소 마지막 값은 남겨둔다
        if (nextHistory[key].length === 0)
          nextHistory[key] = [nextList[nextList.length - 1]];
      });

      return nextHistory;
    });
    // reading.sequence가 바뀔 때만(=새 데이터가 도착했을 때만) 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reading?.sequence]);

  const displayMetrics = reading?.presentation?.display_metrics ?? [];
  const state = reading?.presentation?.state ?? null;
  const values = reading?.presentation?.values;

  // MetricDrawer에 바로 넘길 수 있는 형태로 지표별 데이터를 가공
  const metricsById = {};

  displayMetrics.forEach((metric) => {
    const config = METRIC_PRESENTATION[metric.key];
    if (!config) return;

    const rawList = rawHistory[metric.key] ?? [
      { timeMs: new Date(reading.observed_at).getTime(), value: metric.value },
    ];
    const points = bucketize(rawList);

    // 우측 하중은 "우측 68%" 처럼 우세한 쪽 방향을 함께 보여준다
    let displayValue = `${metric.value}${metric.unit}`;
    if (config.type === "load" && values) {
      const rightPercent = values.right_load_percent;
      const isRightHeavy = rightPercent >= 50;
      const side = isRightHeavy ? "우측" : "좌측";
      const sideValue = isRightHeavy
        ? rightPercent
        : (values.left_load_percent ?? 100 - rightPercent);
      displayValue = `${side} ${Math.round(sideValue)}%`;
    }

    metricsById[config.id] = {
      id: config.id,
      key: metric.key,
      label: metric.label,
      unit: metric.unit,
      type: config.type,
      drawerTitle: config.drawerTitle,
      moreLabel: config.moreLabel,
      displayValue,
      points,
    };
  });

  return {
    reading,
    state,
    displayMetrics,
    metricsById,
    isLoading,
    isError,
    error,
  };
}

export default useBagMetrics;
