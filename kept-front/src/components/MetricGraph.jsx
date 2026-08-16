import useGraphPath from "../hooks/useGraphPath";
import useGraphAnimation from "../hooks/useGraphAnimation";

const GRAPH_WIDTH = 264;
const GRAPH_HEIGHT = 160;
const GRAPH_PADDING = 6;

// 지표 하나의 시간대별 변화를 보여주는 라인 그래프
// points: [{ time, value }], yAxisLabels: 좌측에 표시할 눈금 값
function MetricGraph({ points, yAxisLabels, unit }) {
  // 실제(목표) 값 기준으로 축 범위를 고정해둔다
  const values = points.map((point) => point.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  // 화면에 나타날 때 0 -> 실제 값으로 부드럽게 차오르는 애니메이션 포인트
  const animatedPoints = useGraphAnimation(points);

  const { coords, linePath } = useGraphPath(animatedPoints, {
    width: GRAPH_WIDTH,
    height: GRAPH_HEIGHT,
    padding: GRAPH_PADDING,
    minValue,
    maxValue,
  });

  const lastCoord = coords[coords.length - 1];

  return (
    <div>
      <div className="flex">
        {/* y축 눈금 라벨 */}
        <div className="flex h-[160px] flex-col justify-between pr-2 text-[11px] leading-none text-gray-40">
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
            {/* 가로 보조선 */}
            {yAxisLabels.map((label, index) => {
              const y = (GRAPH_HEIGHT / (yAxisLabels.length - 1)) * index;

              return (
                <line
                  key={label}
                  x1="0"
                  x2={GRAPH_WIDTH}
                  y1={y}
                  y2={y}
                  className="stroke-gray-10"
                  strokeWidth="1"
                />
              );
            })}

            {/* 데이터를 잇는 선 */}
            <path
              d={linePath}
              className="fill-none stroke-main-2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 각 측정 지점 */}
            {coords.map((coord) => (
              <circle
                key={coord.time}
                cx={coord.x}
                cy={coord.y}
                r="3"
                className="fill-main-2"
              />
            ))}
          </svg>

          {/* 가장 최근 값 강조 마커 */}
          {lastCoord && (
            <span
              aria-hidden="true"
              className="absolute flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-main-2 text-[11px] font-bold leading-none text-white shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
              style={{
                left: `${(lastCoord.x / GRAPH_WIDTH) * 100}%`,
                top: `${(lastCoord.y / GRAPH_HEIGHT) * 100}%`,
              }}
            >
              {Math.round(lastCoord.value)}
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* x축 시간 라벨 */}
      <div className="mt-2 flex justify-between pl-8 text-[11px] leading-none text-gray-40">
        {points.map((point) => (
          <span key={point.time}>{point.time}</span>
        ))}
      </div>
    </div>
  );
}

export default MetricGraph;
