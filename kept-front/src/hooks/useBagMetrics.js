import { useEffect, useRef, useState } from "react";
import useLiveSession from "./useLiveSession";

// 그래프 한 칸의 간격 (5분)
const BUCKET_MS = 5 * 60 * 1000;
// 그래프에 보여줄 칸 개수 (세션 하나 = 5분 × 6칸 = 30분 분량의 시나리오)
const BUCKET_COUNT = 6;

// 새로고침해도 지금까지 확정된 점들이 날아가지 않도록 "가방(publicToken)" 단위로
// sessionStorage에 백업해둔다.
// (백엔드에 "과거 기록 조회" API가 생기면 이 캐시는 걷어내고 그 응답을 그대로 쓰면 된다)
const COMMITTED_STORAGE_PREFIX = "kept:bagMetrics:committed:";

function loadCommittedFromStorage(publicToken) {
  if (!publicToken) return null;
  try {
    const raw = window.sessionStorage.getItem(
      `${COMMITTED_STORAGE_PREFIX}${publicToken}`,
    );
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCommittedToStorage(publicToken, committed) {
  if (!publicToken) return;
  try {
    window.sessionStorage.setItem(
      `${COMMITTED_STORAGE_PREFIX}${publicToken}`,
      JSON.stringify(committed),
    );
  } catch {
    // sessionStorage를 못 쓰는 환경(프라이빗 모드 등)이면 그냥 메모리 상태로만 동작
  }
}

// presentation.display_metrics의 key → 화면에서 쓰는 지표 id 매핑
// (Home.jsx, MetricDrawer 등 다른 곳에서도 이 id로 지표를 구분한다)
export const METRIC_KEY_TO_ID = {
  temperature_c: "temperature",
  right_load_percent: "rightLoad",
  shape_deviation_percent: "shapeDeviation",
  internal_humidity_percent: "humidity",
  material_moisture_percent: "moisture",
};

// 지표별 그래프 종류/문구 설정
// - type: "area"  → 온도, 형태 편차 등 일반 지표 그래프 (그라데이션 영역 + 원형 점)
// - type: "load"  → 좌우 하중 분포 그래프 (균형선 + 사각형 점)
const METRIC_PRESENTATION = {
  temperature_c: {
    id: "temperature",
    type: "area",
    drawerTitle: "측정 시작 후 온도 변화",
    moreLabel: "리포트 더 보기",
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
    moreLabel: "리포트 더 보기",
  },
  internal_humidity_percent: {
    id: "humidity",
    type: "area",
    drawerTitle: "측정 시작 후 습도 변화",
    moreLabel: "리포트 더 보기",
  },
  material_moisture_percent: {
    id: "moisture",
    type: "area",
    drawerTitle: "측정 시작 후 수분도 변화",
    moreLabel: "리포트 더 보기",
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
 * 1) LIVE Session 하나 = 시나리오 하나(약 180초) = 그래프 하나입니다.
 *    세션을 새로 관측하는 순간 그 세션 전용으로 그래프를 새로 그리기 시작합니다.
 * 2) 그 세션 안에서 5분(measured_at 기준 논리 시간)이 지날 때마다 그 시점의
 *    최신 값을 새 점으로 확정해서 추가합니다. → 점이 2개, 3개, ... 6개로 늘어납니다.
 *    x축 라벨은 "몇 번째 칸인지"가 아니라, 이 세션을 보기 시작한 실제 현재
 *    시각을 기준으로 5분씩 더한 시계 형태("14:20", "14:25", ...)로 보여줍니다.
 *    (측정 자체는 180초짜리 압축 시나리오 안에서 빠르게 일어나지만, 화면에는
 *    "실제로 5분마다 측정된 것처럼" 보이도록 라벨만 합성하는 것입니다)
 * 3) 세션이 끝나고(180초 재사용 정책 등으로) 새 세션이 시작되면, 그래프는
 *    이전 세션 점들을 지우고 1번부터(=그 시점의 현재 시각 기준으로) 다시 시작합니다.
 *
 * ⚠️ observed_at은 "API를 호출한 실제 real 시각"이라 5분 버킷 비교에 쓰면 진짜
 * real 5분을 기다려야 점이 찍힌다. measured_at이 "논리 센서 측정 시각"(하나의
 * 시나리오 안에서 압축되어 흘러가는 시간)이라, 그래프에 "언제 점을 새로 찍을지"
 * 판단은 measured_at 기준으로 해야 짧은 시연 시간 안에서도 여러 점이 채워지는
 * 걸 보여줄 수 있다. 다만 각 점에 표시되는 라벨 자체는 measured_at 값을 그대로
 * 쓰지 않고, 첫 점을 찍은 실제 현재 시각(Date.now())을 기준점 삼아 5분씩
 * 더한 값으로 합성한다. observed_at은 Home 상단의 "12:00 update" 같은
 * "언제 마지막으로 봤는지" 표시에만 쓴다.
 *
 * ⚠️ measured_at은 세션(시나리오) 하나 안에서만 유효한 타임라인이라, 세션이
 * 바뀌면 이전 세션의 값보다 작은 값으로 다시 시작될 수 있다. 그래서 세션이
 * 바뀐 걸 감지하면(session_id 변화) 무조건 그래프를 새로 시작한다.
 *
 * ⚠️ poll(2초) 한 번에 여러 5분 경계를 한꺼번에 따라잡지 않는다(while이 아니라
 * if로 최대 1개만 커밋). measured_at이 poll 사이에 여러 경계를 훌쩍 건너뛰어도,
 * 점은 반드시 poll마다 하나씩만 추가되어 순서대로 드러나며 쌓인다.
 * (한꺼번에 여러 점이 동시에 나타나는 걸 방지하기 위함)
 *
 * ⚠️ 현재 백엔드에는 "과거 기록 조회" 전용 API가 없어서, 5분마다 폴링에서 얻은
 * "그 시점의 최신값"을 그대로 확정 값으로 쓴다. committed 상태 자체는 컴포넌트
 * 메모리에만 있으므로, 가방(publicToken) 기준으로 sessionStorage에도 같이
 * 백업해서 새로고침해도 복원되도록 한다.
 * → 추후 "세션별 기록 목록"을 내려주는 API가 추가되면, committed 누적 로직 대신
 *   그 API 응답을 그대로 points로 매핑하도록 바꾸면 됩니다.
 */
function useBagMetrics(publicToken) {
  const { reading, isLoading, isError, error } = useLiveSession(publicToken);

  // key(right_load_percent 등) → { points: [{ time, value }], nextCommitAtMs }
  //
  // useState의 lazy initializer로 렌더링 시점에 곧바로 이 가방(publicToken)의
  // 저장된 기록을 복원한다 (쿼리가 로딩되길 기다리지 않아도 돼서, 화면 전환 직후
  // 잠깐 빈 그래프가 보이는 것도 방지된다).
  const [committed, setCommitted] = useState(
    () => loadCommittedFromStorage(publicToken) ?? {},
  );
  const currentPublicTokenRef = useRef(publicToken);
  // 세션이 바뀌는 걸 감지하기 위한 ref. 세션마다 measured_at 타임라인이 완전히
  // 새로 시작되고, 그래프도 그 세션 전용으로 새로 그려야 하기 때문.
  const lastSessionIdRef = useRef(reading?.session_id ?? null);

  // 진짜 다른 가방을 선택했을 때만 그 가방 기준으로 완전히 새로 시작한다
  useEffect(() => {
    if (currentPublicTokenRef.current === publicToken) return;
    currentPublicTokenRef.current = publicToken;
    lastSessionIdRef.current = null;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCommitted(loadCommittedFromStorage(publicToken) ?? {});
  }, [publicToken]);

  // committed가 갱신될 때마다 이 가방(publicToken) 기준으로 sessionStorage에도 반영해둔다
  useEffect(() => {
    if (!publicToken || Object.keys(committed).length === 0) return;
    saveCommittedToStorage(publicToken, committed);
  }, [publicToken, committed]);

  useEffect(() => {
    const values = reading?.presentation?.values;
    if (!values) return;

    // measured_at("논리 센서 측정 시각") 기준으로 5분 경계를 판단한다.
    const timeMs = new Date(reading.measured_at).getTime();

    // 세션이 바뀌었으면(=새 시나리오 시작) 그래프를 완전히 새로 그린다
    const isNewSession = reading.session_id !== lastSessionIdRef.current;
    lastSessionIdRef.current = reading.session_id;

    // 매 폴링마다 "5분이 지났는지" 확인해서, 지났을 때만 새 점을 확정해야 하므로
    // (외부 폴링 데이터를 시간 기준으로 누적하는 것이라 렌더링 중 순수 계산으로 대체할 수 없음)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCommitted((prevCommitted) => {
      let changed = false;
      const nextCommitted = { ...prevCommitted };

      Object.keys(METRIC_PRESENTATION).forEach((key) => {
        const value = values[key];
        if (value == null) return;

        const prevEntry = isNewSession ? null : prevCommitted[key];

        // 이 세션에서 이 지표를 처음 관측한 순간 → 그래프를 새로 시작하며
        // 즉시 1번째 점을 확정한다. 라벨의 기준 시각(baseClockMs)은 measured_at이
        // 아니라 "지금 실제 현재 시각"으로 잡는다 (이후 점들은 여기서 5분씩 더한다).
        if (!prevEntry) {
          const baseClockMs = Date.now();
          nextCommitted[key] = {
            points: [{ time: formatClock(baseClockMs), value }],
            nextCommitAtMs: timeMs + BUCKET_MS,
            baseClockMs,
          };
          changed = true;
          return;
        }

        // 아직 다음 5분 경계에 도달하지 않았으면 그대로 둔다(그래프 업데이트 없음)
        if (timeMs < prevEntry.nextCommitAtMs) return;
        if (prevEntry.points.length >= BUCKET_COUNT) return;

        // 5분 경계를 넘었으면 새 점을 하나 확정한다.
        // ⚠️ 한 번의 poll에서 여러 경계를 한꺼번에 따라잡지 않고(while이 아니라
        // if), 반드시 poll당 최대 1개만 찍는다. 그래야 여러 경계가 한 poll 안에
        // 몰려 있어도 점들이 한꺼번에 나타나지 않고 poll마다(2초 간격) 하나씩
        // 순서대로 드러나며 쌓인다.
        const points = [
          ...prevEntry.points,
          {
            time: formatClock(
              prevEntry.baseClockMs + prevEntry.points.length * BUCKET_MS,
            ),
            value,
          },
        ];
        const nextCommitAtMs = prevEntry.nextCommitAtMs + BUCKET_MS;

        nextCommitted[key] = {
          points,
          nextCommitAtMs,
          baseClockMs: prevEntry.baseClockMs,
        };
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
      // committed에 아직 값이 없을 때(첫 폴링~effect 커밋 사이)의 임시 라벨.
      // 렌더링 중에는 Date.now() 같은 순수하지 않은 함수를 호출하면 안 되므로,
      // 이미 갖고 있는 값(reading.observed_at)으로 대체한다.
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
