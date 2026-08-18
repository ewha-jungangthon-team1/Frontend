import { useEffect, useState } from "react";
import useLiveSession from "./useLiveSession";

// 그래프에 남겨둘 최근 기록 최대 개수 (디자인 목업과 동일하게 6개)
const MAX_HISTORY_POINTS = 6;

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

// observed_at("2026-08-16T12:00:05+09:00") → "00:05"(분:초) 형태로 변환
// 폴링 간격이 짧아 같은 "시:분" 안에 여러 점이 찍힐 수 있어서 초 단위까지 써야
// 라벨이 겹치지 않는데, 그렇다고 "시:분:초"를 다 쓰면 x축이 붐비므로
// (한 세션이 보통 시간을 안 넘긴다는 전제 하에) 시는 빼고 "분:초"만 표시한다
function formatTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${mm}:${ss}`;
}

// 그래프는 최소 2개의 점이 있어야 선을 그릴 수 있으므로,
// 기록이 1개뿐일 때는 같은 값을 가진 점을 하나 앞에 채워 넣는다
function padSinglePoint(points) {
  if (points.length !== 1) return points;
  return [{ time: "", value: points[0].value }, points[0]];
}

/**
 * 실시간 세션(useLiveSession)을 폴링하면서, 매번 새로 들어오는 reading을
 * 지표별 시계열 배열로 누적해서 그래프 바텀시트(MetricDrawer)가 바로 쓸 수
 * 있는 형태로 가공해주는 훅입니다.
 *
 * ⚠️ 현재 백엔드에는 "과거 기록 조회" 전용 API가 없고 latest-reading만 있어서,
 * 폴링될 때마다 들어오는 값을 프론트에서 직접 쌓아 그래프를 그립니다.
 * → 세션이 갓 시작되면 기록이 1~2개뿐이라 그래프가 납작하게 보일 수 있고,
 *   새로고침하면 지금까지 쌓인 기록은 초기화됩니다.
 * → 추후 "세션별 기록 목록"을 내려주는 API가 추가되면, 이 훅의 history 누적
 *   로직(useEffect + setHistory) 대신 그 API 응답을 그대로 points로 매핑하도록
 *   바꾸면 됩니다.
 */
function useBagMetrics(publicToken) {
  const { reading, isLoading, isError, error } = useLiveSession(publicToken);

  // key(right_load_percent 등) → [{ time, value }] 누적 기록
  const [history, setHistory] = useState({});

  useEffect(() => {
    const values = reading?.presentation?.values;
    if (!values) return;

    const time = formatTime(reading.observed_at);

    // 매 폴링마다 "이전까지 쌓은 기록 + 이번에 새로 온 값"을 합쳐야 하므로
    // (외부 폴링 데이터를 누적하는 것이라 렌더링 중 순수 계산으로 대체할 수 없음)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory((prevHistory) => {
      const nextHistory = { ...prevHistory };

      Object.keys(METRIC_PRESENTATION).forEach((key) => {
        const value = values[key];
        if (value == null) return;

        const list = prevHistory[key] ?? [];

        // 이 effect는 reading.sequence가 바뀔 때만 실행되므로(중복 호출 없음),
        // 폴링될 때마다 항상 새 점을 추가하고 최근 MAX_HISTORY_POINTS개만 유지한다
        nextHistory[key] = [...list, { time, value }].slice(
          -MAX_HISTORY_POINTS,
        );
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

    const points = padSinglePoint(
      history[metric.key] ?? [{ time: "", value: metric.value }],
    );

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
