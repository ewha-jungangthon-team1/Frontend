import { useEffect, useState } from "react";
import useLiveSession from "./useLiveSession";

// 그래프 한 칸의 간격 (5분)
const BUCKET_MS = 5 * 60 * 1000;
// 그래프에 보여줄 칸 개수 (최근 30분 = 5분 × 6칸)
const BUCKET_COUNT = 6;

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
 * 실시간 세션(useLiveSession)을 2초마다 폴링하지만, 그래프에 반영되는 시점은
 * "5분에 한 번"으로 분리한 훅입니다.
 *
 * - 폴링 자체(2초 간격)는 그대로 둡니다. 배지/실시간 수치는 여전히 매 폴링마다
 *   최신값(reading)을 그대로 쓰면 되고, 이 훅도 값 조회 자체는 계속합니다.
 * - 다만 그래프용 points 배열은 폴링될 때마다 새로 만들지 않고,
 *   "committed(확정)" 상태로 따로 관리해서 5분에 한 번만 갱신합니다.
 *   → 그래프가 2초마다 리렌더링/애니메이션되던 문제가 사라집니다.
 *
 * 동작 방식:
 * 1) 이 지표를 처음 관측하는 순간 즉시 1번째 점을 확정(commit)한다.
 *    (그래서 세션 시작 첫 5분 동안은 그래프에 점이 1개만 있다)
 * 2) 그 후로 5분이 지날 때마다(폴링으로 시계를 체크) 그 시점의 최신 값을
 *    새 점으로 확정해서 추가한다. → 점이 2개, 3개, ... 6개로 점점 늘어난다.
 * 3) 6개가 다 차면, 그 다음 5분마다 가장 오래된 점이 빠지고 새 점이 오른쪽에
 *    붙는 슬라이딩 윈도우가 된다 (= 항상 "최근 30분"만 보여준다).
 *
 * ⚠️ 현재 백엔드에는 "과거 기록 조회" 전용 API가 없고 latest-reading만 있어서,
 * 5분마다 폴링에서 얻은 "그 시점의 최신값"을 그대로 확정 값으로 씁니다.
 * → 새로고침하면 지금까지 확정된 점들은 초기화됩니다.
 * → 추후 "세션별 기록 목록"을 내려주는 API가 추가되면, committed 누적 로직 대신
 *   그 API 응답을 그대로 points로 매핑하도록 바꾸면 됩니다.
 */
function useBagMetrics(publicToken) {
  const { reading, isLoading, isError, error } = useLiveSession(publicToken);

  // key(right_load_percent 등) → { points: [{ time, value }], nextCommitAtMs }
  const [committed, setCommitted] = useState({});

  // 선택된 가방(publicToken)이 바뀌면 이전 세션의 확정 기록을 초기화한다
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCommitted({});
  }, [publicToken]);

  useEffect(() => {
    const values = reading?.presentation?.values;
    if (!values) return;

    const timeMs = new Date(reading.observed_at).getTime();

    // 매 폴링마다 "5분이 지났는지" 확인해서, 지났을 때만 새 점을 확정해야 하므로
    // (외부 폴링 데이터를 시간 기준으로 누적하는 것이라 렌더링 중 순수 계산으로 대체할 수 없음)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCommitted((prevCommitted) => {
      let changed = false;
      const nextCommitted = { ...prevCommitted };

      Object.keys(METRIC_PRESENTATION).forEach((key) => {
        const value = values[key];
        if (value == null) return;

        const prevEntry = prevCommitted[key];

        // 이 지표를 처음 관측한 순간 → 즉시 1번째 점을 확정
        if (!prevEntry) {
          nextCommitted[key] = {
            points: [{ time: formatClock(timeMs), value }],
            nextCommitAtMs: timeMs + BUCKET_MS,
          };
          changed = true;
          return;
        }

        // 아직 다음 5분 경계에 도달하지 않았으면 그대로 둔다(그래프 업데이트 없음)
        if (timeMs < prevEntry.nextCommitAtMs) return;

        // 5분 경계를 넘었으면(오래 자리를 비웠다가 돌아온 경우 여러 번일 수도 있음)
        // 경계마다 그 시점의 최신 값으로 점을 하나씩 확정해서 따라잡는다
        let points = prevEntry.points;
        let nextCommitAtMs = prevEntry.nextCommitAtMs;
        while (timeMs >= nextCommitAtMs) {
          points = [
            ...points,
            { time: formatClock(nextCommitAtMs), value },
          ].slice(-BUCKET_COUNT);
          nextCommitAtMs += BUCKET_MS;
        }

        nextCommitted[key] = { points, nextCommitAtMs };
        changed = true;
      });

      return changed ? nextCommitted : prevCommitted;
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

    const points = committed[metric.key]?.points ?? [
      {
        time: formatClock(new Date(reading.observed_at).getTime()),
        value: metric.value,
      },
    ];

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
