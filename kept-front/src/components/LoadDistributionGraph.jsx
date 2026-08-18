import useGraphPath from "../hooks/useGraphPath";
import useGraphAnimation from "../hooks/useGraphAnimation";

const GRAPH_WIDTH = 264;
const GRAPH_HEIGHT = 160;
const GRAPH_PADDING = 6;

// 좌우 하중 분포는 0~100(%) 범위가 고정값이라, 실제 값과 무관하게
// 75 / 25 두 눈금과 50(균형) 기준선을 항상 같은 위치에 그린다
const MIN_VALUE = 0;
const MAX_VALUE = 100;
const BALANCE_VALUE = 50;
const Y_AXIS_LABELS = [75, 25];

// 실시간 좌우 하중 분포 그래프
// points: [{ time, value }] — value는 항상 "우측 하중 비율(%)" 기준
function LoadDistributionGraph({ points }) {
  // 화면에 나타날 때 0 -> 실제 값으로 부드럽게 차오르는 애니메이션 포인트
  const animatedPoints = useGraphAnimation(points);

  const { coords, linePath } = useGraphPath(animatedPoints, {
    width: GRAPH_WIDTH,
    height: GRAPH_HEIGHT,
    padding: GRAPH_PADDING,
    minValue: MIN_VALUE,
    maxValue: MAX_VALUE,
  });

  // 균형선(50%)의 y좌표
  const balanceRatio = (BALANCE_VALUE - MIN_VALUE) / (MAX_VALUE - MIN_VALUE);
  const balanceY =
    GRAPH_HEIGHT -
    GRAPH_PADDING -
    balanceRatio * (GRAPH_HEIGHT - GRAPH_PADDING * 2);

  return (
    <div>
      <div className="flex">
        {/* y축 눈금 라벨: 75 / 25만 표시 (50은 균형선으로 대체) */}
        <div className="flex h-[160px] flex-col justify-between pr-2 text-[11px] leading-none text-gray-40">
          <span>{Y_AXIS_LABELS[0]}</span>
          <span className="opacity-0">{BALANCE_VALUE}</span>
          <span>{Y_AXIS_LABELS[1]}</span>
        </div>

        {/* 그래프 본문 */}
        <div className="relative min-w-0 flex-1">
          <svg
            viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
            className="h-[160px] w-full"
            preserveAspectRatio="none"
          >
            {/* 균형(50%) 기준 점선 */}
            <line
              x1="0"
              x2={GRAPH_WIDTH}
              y1={balanceY}
              y2={balanceY}
              className="stroke-gray-30"
              strokeWidth="1"
              strokeDasharray="4 4"
            />

            {/* 데이터를 잇는 선 */}
            <path
              d={linePath}
              className="fill-none stroke-main-2"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 각 측정 지점: 사각형(다이아몬드) 마커 */}
            {coords.map((coord, index) => (
              <rect
                key={`${coord.time}-${index}`}
                x={coord.x - 3.5}
                y={coord.y - 3.5}
                width="7"
                height="7"
                transform={`rotate(45 ${coord.x} ${coord.y})`}
                className="fill-main-2"
              />
            ))}
          </svg>

          {/* 균형선 옆 "균형" 라벨 */}
          <span
            className="absolute right-0 -translate-y-1/2 bg-white pl-1 text-[11px] leading-none text-gray-40"
            style={{ top: `${(balanceY / GRAPH_HEIGHT) * 100}%` }}
          >
            균형
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoadDistributionGraph;
