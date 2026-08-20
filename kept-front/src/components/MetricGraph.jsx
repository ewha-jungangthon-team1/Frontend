import { useId, useState } from "react";
import useGraphPath from "../hooks/useGraphPath";
import useGraphAnimation from "../hooks/useGraphAnimation";

const AREA_GRAPH_WIDTH = 264;
const REPORT_GRAPH_WIDTH = 288;
const GRAPH_HEIGHT = 160;
const AREA_GRAPH_PADDING = 6;
const REPORT_GRAPH_PADDING = 10;
const TICK_COUNT = 4;
const TOOLTIP_MIN_WIDTH = 42;
const TOOLTIP_HEIGHT = 29;
const TOOLTIP_POINTER_HEIGHT = 6;
const TOOLTIP_POINT_GAP = 28;

function getTooltipWidth(label) {
  const textWidth = [...label].reduce((width, character) => {
    if (character === ".") return width + 4;
    if (character === "%") return width + 11;
    return width + 8;
  }, 0);

  return Math.max(TOOLTIP_MIN_WIDTH, textWidth + 18);
}

function formatTooltipValue(value, unit) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return `-${unit}`;
  }

  if (unit === "%") {
    return `${numericValue.toFixed(1).replace(/\.0$/, "")}%`;
  }

  const roundedValue = Math.round(numericValue * 100) / 100;
  return `${roundedValue}${unit}`;
}

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
function MetricGraph({
  points,
  variant = "area",
  unit = "",
  yAxisTicks,
}) {
  const gradientId = useId();
  const isArea = variant === "area";
  const graphWidth = isArea ? AREA_GRAPH_WIDTH : REPORT_GRAPH_WIDTH;
  const graphPadding = isArea
    ? AREA_GRAPH_PADDING
    : REPORT_GRAPH_PADDING;
  const [selectedIndex, setSelectedIndex] = useState(() =>
    Math.max(points.length - 2, 0),
  );

  // 실제(목표) 값 기준으로 축 범위를 고정해둔다
  const values = points.map((point) => point.value);
  const yAxisLabels = yAxisTicks ?? computeYAxisTicks(values);
  const minValue = yAxisLabels[yAxisLabels.length - 1];
  const maxValue = yAxisLabels[0];

  // 화면에 나타날 때 시작 눈금 -> 실제 값으로 부드럽게 차오르는 포인트
  // Report의 온도처럼 y축 최솟값이 0보다 큰 지표도 그래프 바깥에서
  // 날아오지 않도록, 라인 그래프는 가장 아래 눈금에서 시작한다.
  const animatedPoints = useGraphAnimation(points, isArea ? 0 : minValue);

  const { coords, linePath } = useGraphPath(animatedPoints, {
    width: graphWidth,
    height: GRAPH_HEIGHT,
    padding: graphPadding,
    minValue,
    maxValue,
  });

  const safeSelectedIndex = Math.min(
    selectedIndex,
    Math.max(coords.length - 1, 0),
  );
  const selectedCoord = !isArea ? coords[safeSelectedIndex] : null;
  const tooltipLabel = formatTooltipValue(
    points[safeSelectedIndex]?.value,
    unit,
  );
  const tooltipWidth = getTooltipWidth(tooltipLabel);
  const tooltipX = selectedCoord
    ? Math.min(
        Math.max(selectedCoord.x - tooltipWidth / 2, 0),
        graphWidth - tooltipWidth,
      )
    : 0;
  const tooltipY = selectedCoord
    ? selectedCoord.y -
      TOOLTIP_HEIGHT -
      TOOLTIP_POINTER_HEIGHT -
      TOOLTIP_POINT_GAP
    : 0;

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
        <div className="flex h-[160px] w-[46px] shrink-0 flex-col justify-between font-['Apple_SD_Gothic_Neo'] text-[13px] font-light leading-[1.5] tracking-[-0.01em] text-gray-40">
          {yAxisLabels.map((label) => (
            <span key={label}>
              {label}
              {unit}
            </span>
          ))}
        </div>

        {/* 그래프 본문 */}
        <div className="relative min-w-0 flex-1">
          <svg
            viewBox={`0 0 ${graphWidth} ${GRAPH_HEIGHT}`}
            className="h-[160px] w-full overflow-visible"
            preserveAspectRatio={isArea ? "none" : "xMinYMin meet"}
            overflow="visible"
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
            {/* Report 그래프의 가로 점선 가이드 */}
            {!isArea &&
              Array.from({ length: TICK_COUNT }, (_, index) => {
                const y =
                  graphPadding +
                  ((GRAPH_HEIGHT - graphPadding * 2) / (TICK_COUNT - 1)) *
                    index;

                return (
                  <line
                    key={index}
                    x1="0"
                    x2={graphWidth}
                    y1={y}
                    y2={y}
                    className="stroke-gray-10"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                );
              })}

            {/* Report에서 선택된 날짜를 표시하는 세로 점선 */}
            {selectedCoord && (
              <line
                x1={selectedCoord.x}
                x2={selectedCoord.x}
                y1={tooltipY + TOOLTIP_HEIGHT + TOOLTIP_POINTER_HEIGHT}
                y2={GRAPH_HEIGHT - graphPadding}
                className="stroke-gray-10"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            )}

            {/* 라인 아래 그라데이션 영역(그림자): area variant에서만 그린다 */}
            {areaPath && (
              <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
            )}

            {/* 데이터를 잇는 선 */}
            <path
              d={linePath}
              className={`fill-none ${
                isArea ? "stroke-main-2" : "stroke-gray-80"
              }`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Report에서 선택된 값 말풍선과 포인트 */}
            {selectedCoord && (
              <g pointerEvents="none">
                <rect
                  x={tooltipX}
                  y={tooltipY}
                  width={tooltipWidth}
                  height={TOOLTIP_HEIGHT}
                  rx={TOOLTIP_HEIGHT / 2}
                  className="fill-main-2"
                />
                <polygon
                  points={`${selectedCoord.x - 5},${tooltipY + TOOLTIP_HEIGHT - 1} ${selectedCoord.x + 5},${tooltipY + TOOLTIP_HEIGHT - 1} ${selectedCoord.x},${tooltipY + TOOLTIP_HEIGHT + TOOLTIP_POINTER_HEIGHT}`}
                  className="fill-main-2"
                />
                <text
                  x={tooltipX + tooltipWidth / 2}
                  y={tooltipY + 20}
                  textAnchor="middle"
                  fill="white"
                  fontFamily="Helvetica, Arial, sans-serif"
                  fontSize="15"
                  fontWeight="400"
                  letterSpacing="-0.15"
                >
                  {tooltipLabel}
                </text>
                <circle
                  cx={selectedCoord.x}
                  cy={selectedCoord.y}
                  r="4.5"
                  className="fill-gray-80 stroke-white"
                  strokeWidth="1.25"
                />
              </g>
            )}

            {/* Report의 각 날짜를 클릭·터치할 수 있는 투명 영역 */}
            {!isArea &&
              coords.map((coord, index) => (
                <circle
                  key={`hit-${coord.time}-${index}`}
                  cx={coord.x}
                  cy={coord.y}
                  r="12"
                  fill="transparent"
                  className="cursor-pointer"
                  onPointerDown={() => setSelectedIndex(index)}
                />
              ))}

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
      <div
        className={`mt-2 flex justify-between pl-[46px] font-['Apple_SD_Gothic_Neo'] text-[13px] font-light leading-[1.5] tracking-[-0.01em] text-gray-40 ${
          isArea ? "" : "pr-2"
        }`}
      >
        {points.map((point, index) => (
          <span key={`${point.time}-${index}`}>{point.time}</span>
        ))}
      </div>
    </div>
  );
}

export default MetricGraph;
