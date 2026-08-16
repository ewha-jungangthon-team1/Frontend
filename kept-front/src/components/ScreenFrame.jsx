import useViewportScale from "../hooks/useViewportScale";

// 393x852 모바일 화면을 감싸는 프레임
// - 웹(큰 화면)에서는 비율을 유지한 채 확대해서 크게 보여주고
// - 폰 화면(너비 393px 이하)에서는 배율 1, 즉 원래 크기 그대로 보여준다
// transform이 적용된 요소는 CSS상 새로운 containing block이 되므로
// 이 프레임 내부의 fixed 요소(바텀시트 등)는 항상 이 프레임 기준으로만 위치한다
function ScreenFrame({ children }) {
  const { scale, baseWidth, baseHeight } = useViewportScale();

  const isScaledUp = scale > 1;

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-gray-90">
      <div
        style={{
          width: baseWidth,
          height: baseHeight,
          transform: `scale(${scale})`,
        }}
        className={`relative shrink-0 overflow-hidden bg-white ${
          isScaledUp ? "shadow-[0_0_60px_rgba(0,0,0,0.35)]" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default ScreenFrame;
