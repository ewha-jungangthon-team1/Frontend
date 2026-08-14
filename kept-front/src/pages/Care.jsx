const CARE_METRICS = ["현재 온도 47°C", "우측 하중 68%", "형태 편차 7%"];

function CareBackground() {
  return (
    <img
      src="/images/2-care.png"
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
    />
  );
}

function Care({ onOpenMenu }) {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-white">
      {/*배경 그라데이션*/}
      <CareBackground />

      <div className="relative z-10 flex min-h-dvh flex-col">
        {/*상단 영역*/}
        <header className="flex items-start justify-between px-6 pt-[83px]">
          <h1 className="text-[28px] leading-[1.32] tracking-[-0.03em] text-gray-80">
            Care
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

        {/*케어 안내 영역*/}
        <section className="px-6 pt-[18px]">
          <p className="text-[16px] leading-[1.32] tracking-[-0.01em] text-gray-50">
            14:42 update
          </p>

          <h2 className="mt-2 text-[28px] font-bold leading-[1.4] tracking-[-0.03em] text-gray-90">
            가방을 서늘한 곳으로
            <br />
            옮겨 주세요
          </h2>

          <p className="mt-2 text-[18px] font-medium leading-[1.5] tracking-[-0.03em] text-gray-60">
            현재 온도가 높고 형태 변화가 감지되어
            <br />
            먼저 열을 식혀 주는 것이 좋아요.
          </p>

          <ul className="mt-[19px] flex flex-col items-start gap-2">
            {CARE_METRICS.map((metric) => (
              <li
                key={metric}
                className="rounded-full bg-gray-5/80 px-3 py-2 text-[16px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-60"
              >
                {metric}
              </li>
            ))}
          </ul>
        </section>

        {/*하단 버튼 영역*/}
        <div className="mt-auto px-6 pb-[55px]">
          <button
            type="button"
            className="w-full rounded-lg bg-gray-70 px-3 py-2.5 text-[16px] font-bold leading-[1.5] tracking-[-0.01em] text-white"
          >
            전체 케어 방법 보기
          </button>
        </div>
      </div>
    </main>
  );
}

export default Care;
