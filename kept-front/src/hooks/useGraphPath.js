// 데이터 포인트 배열({time, value})을 받아서
// 라인 그래프를 그리는 데 필요한 좌표와 SVG path 문자열을 계산하는 훅
// minValue/maxValue를 직접 넘기면 그 값을 기준으로 스케일을 고정한다
// (그래프가 애니메이션되는 동안 축이 계속 다시 계산되어 흔들리는 것을 방지)
function useGraphPath(
  points,
  { width, height, padding = 0, minValue: minOverride, maxValue: maxOverride },
) {
  const values = points.map((point) => point.value);
  const minValue = minOverride ?? Math.min(...values);
  const maxValue = maxOverride ?? Math.max(...values);

  // 값이 모두 같을 때 0으로 나누는 것을 방지
  const valueRange = maxValue - minValue || 1;

  const innerWidth = width - padding * 2;

  // 점이 1개뿐일 때 (points.length - 1 === 0) stepX가 Infinity가 되고
  // x = index * stepX(=0 * Infinity)가 NaN이 되어 점이 화면 밖 이상한
  // 위치에 그려지던 버그가 있었다. 점이 1개일 때도 다른 점들과 마찬가지로
  // 그래프 시작 지점(왼쪽 끝, x = padding)에 놓는다. (가운데가 아님 —
  // 이후 점이 추가되면 첫 점은 계속 왼쪽 끝에 남아있어야 하므로)
  const stepX = points.length > 1 ? innerWidth / (points.length - 1) : 0;

  // 각 데이터 포인트를 실제 svg 좌표(x, y)로 변환
  const coords = points.map((point, index) => {
    const x = padding + index * stepX;
    const ratio = (point.value - minValue) / valueRange;
    const y = height - padding - ratio * (height - padding * 2);

    return { ...point, x, y };
  });

  // 좌표들을 이어주는 선(M, L 커맨드) 생성
  const linePath = coords
    .map((coord, index) => `${index === 0 ? "M" : "L"} ${coord.x} ${coord.y}`)
    .join(" ");

  return { coords, linePath };
}

export default useGraphPath;
