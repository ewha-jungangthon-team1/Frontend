import MetricGraph from "./MetricGraph";
import LoadDistributionGraph from "./LoadDistributionGraph";

// 지표 배지를 클릭했을 때 화면 아래에서 올라오는 그래프 바텀시트
// metric이 없으면(null) 화면 아래로 숨겨진 상태를 유지한다
function MetricDrawer({ metric, onClose }) {
  const isOpen = Boolean(metric);

  return (
    <>
      {/* 어두운 배경(딤 처리): 바텀시트가 열려 있을 때만 클릭 가능하도록 */}
      <div
        className={`fixed inset-0 z-30 mx-auto w-full max-w-[393px] bg-gray-100/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* 그래프 바텀시트 본체 */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[393px] transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="rounded-t-[28px] bg-white px-6 pb-10 pt-3 shadow-[0_-4px_24px_rgba(0,0,0,0.12)]">
          {/* 드래그 핸들 */}
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-20" />

          <div className="flex items-start justify-between">
            <p className="text-[14px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-50">
              {metric?.drawerTitle}
            </p>

            <button
              type="button"
              aria-label="닫기"
              onClick={onClose}
              className="-mr-1 -mt-1 text-[22px] font-light leading-none text-gray-40"
            >
              ×
            </button>
          </div>

          <p className="mt-1 text-[28px] font-bold leading-[1.32] tracking-[-0.03em] text-gray-90">
            {metric?.displayValue}
          </p>

          {/* 그래프는 metric이 있을 때만 그린다 (닫혀 있을 때 불필요한 렌더링 방지) */}
          {metric && (
            <div className="mt-5">
              {metric.type === "load" ? (
                <LoadDistributionGraph points={metric.points} />
              ) : (
                <MetricGraph points={metric.points} />
              )}
            </div>
          )}

          <button
            type="button"
            className="mt-5 flex items-center gap-0.5 text-[14px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-60"
          >
            {metric?.moreLabel ?? "관련 기록 더 보기"}
            <img src="/icons/right.svg" alt="" className="size-4" />
          </button>

          <p className="mt-4 text-[11px] leading-[1.5] tracking-[-0.01em] text-gray-40">
            *리포트 탭 완성된 후 그래프 내용이 수정될 수 있습니다.
          </p>
        </div>
      </div>
    </>
  );
}

export default MetricDrawer;
