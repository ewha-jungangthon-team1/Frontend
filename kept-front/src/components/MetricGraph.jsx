import { useId } from "react";
import useGraphPath from "../hooks/useGraphPath";
import useGraphAnimation from "../hooks/useGraphAnimation";

const GRAPH_WIDTH = 264;
const GRAPH_HEIGHT = 160;
const GRAPH_PADDING = 6;
const TICK_COUNT = 4;

// 실제 값 범위를 보기 좋은 간격(step)의 눈금 4개로 변환
// 예: 29~47 → step 5 → [45, 40, 35, 30] (온도 목업과 동일한 느낌)
function computeYAxisTicks(values) {
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    const base = Math.max(0, Math.round(min) - TICK_COUNT + 1);
    return Array.from(
      { length: TICK_COUNT },
      (_, i) => base + (TICK_COUNT - 1 - i),
    );
  }

  const rawStep = (max - min) / (TICK_COUNT - 1);
  // 1, 2, 5, 10 단위로 보기 좋게 반올림
  const niceSteps = [1, 2, 5, 10, 15, 20, 25, 50, 100];
  const step =
    niceSteps.find((candidate) => candidate >= rawStep) ?? Math.ceil(rawStep);

  const top = Math.ceil(max / step) * step;

  return Array.from({ length: TICK_COUNT }, (_, i) => top - i * step);
}

// 지표 하나의 시간대별 변화를 보여주는 그래프
// points: [{ time, value }]
// variant:
//  - "area" (기본값) → Home/Care 바텀시트용. 그라데이션 영역(그림자) + 각 지점 원형 점
//  - "line" → Report용. 영역 채움 없이 선만, 지점 점도 찍지 않는다
function MetricGraph({ points, variant = "area" }) {
  const gradientId = useId();
  const isArea = variant === "area";

  // 실제(목표) 값 기준으로 축 범위를 고정해둔다
  const values = points.map((point) => point.value);
  const yAxisLabels = computeYAxisTicks(values);
  const minValue = yAxisLabels[yAxisLabels.length - 1];
  const maxValue = yAxisLabels[0];

  // 화면에 나타날 때 0 -> 실제 값으로 부드럽게 차오르는 애니메이션 포인트
  const animatedPoints = useGraphAnimation(points);

  const { coords, linePath } = useGraphPath(animatedPoints, {
    width: GRAPH_WIDTH,
    height: GRAPH_HEIGHT,
    padding: GRAPH_PADDING,
    minValue,
    maxValue,
  });

  // 라인 아래를 채우는 영역(area) path: 라인 path에 바닥선을 이어붙인다
  // (line variant에서는 애초에 그리지 않는다)
  const areaPath =
    isArea && coords.length > 0
      ? `${linePath} L ${coords[coords.length - 1].x} ${GRAPH_HEIGHT} L ${coords[0].x} ${GRAPH_HEIGHT} Z`
      : "";

  return (
    <div>
      <div className="flex">
        {/* y축 눈금 라벨 */}
        <div className="flex h-[160px] flex-col justify-between pr-8 text-[11px] leading-none text-gray-40">
          {yAxisLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        {/* 그래프 본문 */}
        <div className="relative min-w-0 flex-1">
          <svg
            viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
            className="h-[160px] w-full"
            preserveAspectRatio="none"
          >
            {isArea && (
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-main-2)"
                    stopOpacity="0.28"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-main-2)"
                    stopOpacity="0"
                  />
                </linearGradient>
              </defs>
            )}

            {/* 라인 아래 그라데이션 영역(그림자): area variant에서만 그린다 */}
            {areaPath && (
              <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
            )}

            {/* 데이터를 잇는 선 */}
            <path
              d={linePath}
              className="fill-none stroke-main-2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 각 측정 지점: area variant에서만 점을 찍는다 (동그라미 대신 네모) */}
            {isArea &&
              coords.map((coord, index) => (
                <rect
                  key={`${coord.time}-${index}`}
                  x={coord.x - 3.5}
                  y={coord.y - 3.5}
                  width="7"
                  height="7"
                  className="fill-main-2"
                />
              ))}
          </svg>
        </div>
      </div>

      {/* x축 시간 라벨 */}
      <div className="mt-2 flex justify-between pl-8 text-[11px] leading-none text-gray-40">
        {points.map((point, index) => (
          <span key={`${point.time}-${index}`}>{point.time}</span>
        ))}
      </div>
    </div>
  );
}

export default MetricGraph;
