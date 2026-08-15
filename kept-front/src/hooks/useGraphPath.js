// 데이터 포인트 배열({time, value})을 받아서
// 라인 그래프를 그리는 데 필요한 좌표와 SVG path 문자열을 계산하는 훅
function useGraphPath(points, { width, height, padding = 0 }) {
  const values = points.map((point) => point.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  // 값이 모두 같을 때 0으로 나누는 것을 방지
  const valueRange = maxValue - minValue || 1;

  const stepX = (width - padding * 2) / (points.length - 1);

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
