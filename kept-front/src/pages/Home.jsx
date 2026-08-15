import { Link } from "react-router";
import useBagStatus from "../hooks/useBagStatus";
import MetricBadge from "../components/MetricBadge";
import MetricDrawer from "../components/MetricDrawer";

// Care 화면과 동일한 경고 상태 배경(핑크 그라데이션)을 재사용
function HomeBackground() {
  return (
    <img
      src="/images/2-care-red.png"
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
    />
  );
}

function Home({ onOpenMenu }) {
  // 가방 상태 지표 데이터 + 그래프 바텀시트 열림/닫힘 상태
  const { selectedMetric, openMetric, closeMetric } = useBagStatus();

  return (
    // 화면 크기 393 x 852 기준으로 디자인 (모바일 실기기에서는 w-full로 화면 너비에 맞춰짐)
    <main className="relative mx-auto min-h-[852px] w-full max-w-[393px] overflow-hidden bg-white">
      {/* 배경 그라데이션 */}
      <HomeBackground />

      <div className="relative z-10 flex min-h-[852px] flex-col">
        {/* 상단 영역 */}
        <header className="flex items-start justify-between px-6 pt-[83px]">
          <h1 className="text-[28px] leading-[1.32] tracking-[-0.03em] text-gray-80">
            Home
          </h1>

          <button
            type="button"
            aria-label="전체 메뉴 열기"
            className="mt-[5px] size-6 shrink-0"
            onClick={onOpenMenu}
          >
            <img src="/icons/menu.svg" alt="" className="size-full" />
          </button>
        </header>

        {/* 상태 요약 영역 */}
        <section className="px-6 pt-[18px]">
          <div className="flex items-center justify-between">
            <p className="text-[16px] leading-[1.32] tracking-[-0.01em] text-gray-50">
              14:42 update
            </p>

            {/* 더보기(옵션) 버튼: 점 3개 */}
            <button
              type="button"
              aria-label="옵션 더보기"
              className="text-[16px] leading-none tracking-[2px] text-gray-40"
            >
              ···
            </button>
          </div>

          <h2 className="mt-2 text-[26px] font-bold leading-[1.4] tracking-[-0.03em] text-gray-90">
            가방 오른쪽에
            <br />
            형태 변화가 시작됐어요
          </h2>

          <p className="mt-2 text-[15px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-60">
            높은 온도에 노출된 상태에서
            <br />
            내용물의 무게가 오른쪽에 집중되고 있어요.
          </p>
        </section>

        {/* 가방 이미지 + 지표 배지 영역 */}
        <section className="relative mt-6 flex flex-1 flex-col items-center px-6">
          {/* 가방 이미지 자리 (이미지는 비워두고 추후 채워질 예정) */}
          <div className="relative flex h-[300px] w-full max-w-[220px] items-center justify-center">
            <span className="text-[13px] text-gray-30">가방 이미지 영역</span>

            {/* 우측 하중 배지 */}
            <MetricBadge
              label="우측 하중"
              value="68%"
              onClick={() => openMetric("rightLoad")}
              className="absolute -right-6 top-10"
            />

            {/* 형태 편차 배지 */}
            <MetricBadge
              label="형태 편차"
              value="7%"
              onClick={() => openMetric("shapeDeviation")}
              className="absolute -left-8 bottom-20"
            />

            {/* 현재 온도 배지 */}
            <MetricBadge
              label="현재 온도"
              value="47°C"
              onClick={() => openMetric("temperature")}
              className="absolute -right-4 bottom-6"
            />
          </div>

          {/* 제품명 */}
          <button
            type="button"
            className="mt-2 flex items-center gap-0.5 text-[14px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-70"
          >
            MCM Vela Visetos Sling Bag
            <img src="/icons/right.svg" alt="" className="size-4" />
          </button>
        </section>

        {/* 지금 필요한 케어 영역 */}
        <div className="px-6 pb-[55px] pt-4">
          <p className="mb-2 text-[13px] leading-[1.5] tracking-[-0.01em] text-gray-50">
            지금 필요한 케어
          </p>

          <Link
            to="/care"
            className="flex w-full items-center justify-between gap-3 rounded-lg bg-gray-70 px-4 py-3.5 text-white"
          >
            <span className="text-[15px] font-bold leading-[1.4] tracking-[-0.01em]">
              가방을 서늘한 곳으로 옮기고
              <br />
              내용물을 비워 주세요.
            </span>

            <span className="flex shrink-0 items-center gap-0.5 text-[13px] font-medium leading-[1.5] tracking-[-0.01em] text-white/80">
              케어 방법 보기
              <img
                src="/icons/right.svg"
                alt=""
                className="size-3 brightness-0 invert"
              />
            </span>
          </Link>
        </div>
      </div>

      {/* 지표를 클릭하면 아래에서 올라오는 그래프 바텀시트 */}
      <MetricDrawer metric={selectedMetric} onClose={closeMetric} />
    </main>
  );
}

export default Home;
