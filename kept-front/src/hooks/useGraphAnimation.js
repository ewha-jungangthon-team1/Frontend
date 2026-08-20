import { useEffect, useRef, useState } from "react";

const ANIMATION_DURATION_MS = 700;

// 처음엔 빠르게 움직이다가 끝에서 서서히 멈추는 이징 함수
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// 그래프가 화면에 나타날 때 각 데이터 값이 시작 기준값에서 실제 값까지
// 부드럽게 차오르는 것처럼 보이도록, 매 프레임 보간된 포인트 배열을 반환하는 훅
function useGraphAnimation(points, startValue = 0) {
  const [progress, setProgress] = useState(0);
  const frameIdRef = useRef(null);

  useEffect(() => {
    const startTime = performance.now();

    const tick = (now) => {
      const elapsedRatio = Math.min(
        (now - startTime) / ANIMATION_DURATION_MS,
        1,
      );

      setProgress(easeOutCubic(elapsedRatio));

      if (elapsedRatio < 1) {
        frameIdRef.current = requestAnimationFrame(tick);
      }
    };

    // 새로운 지표(points)로 바뀌면 애니메이션을 처음부터 다시 시작한다
    // (progress는 첫 애니메이션 프레임에서 0에 가깝게 다시 계산된다)
    frameIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [points, startValue]);

  // 시작 기준값(진행 전) -> 실제 값(진행 완료) 사이를 보간한 포인트 배열
  return points.map((point) => ({
    ...point,
    value: startValue + (point.value - startValue) * progress,
  }));
}

export default useGraphAnimation;
