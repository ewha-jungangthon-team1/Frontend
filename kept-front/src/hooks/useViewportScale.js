import { useEffect, useState } from "react";

// 디자인 기준 화면 크기 (모바일 앱 화면 기준, 393 x 852)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

// 브라우저 창 크기에 맞춰 393x852 화면을 얼마나 확대해서 보여줄지 계산하는 훅
// - 폰 화면(너비가 기준 너비 이하): 배율 1 => 393x852 그대로 보여준다
// - 웹(기준 너비보다 큰 화면): 세로/가로 비율을 유지한 채 화면에 꽉 차도록 확대한다
function useViewportScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const { innerWidth, innerHeight } = window;

      // 폰 화면에서는 확대/축소 없이 기준 크기 그대로 보여준다
      if (innerWidth <= BASE_WIDTH) {
        setScale(1);
        return;
      }

      // 웹(큰 화면)에서는 가로/세로 중 더 작게 확대되는 쪽 비율을 사용해서
      // 393:852 비율이 깨지지 않으면서 화면을 최대한 채우도록 한다
      const widthRatio = innerWidth / BASE_WIDTH;
      const heightRatio = innerHeight / BASE_HEIGHT;

      setScale(Math.min(widthRatio, heightRatio));
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return { scale, baseWidth: BASE_WIDTH, baseHeight: BASE_HEIGHT };
}

export default useViewportScale;
