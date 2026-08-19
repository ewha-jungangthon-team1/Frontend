import { Link } from "react-router";
import useBagStore from "../store/bagStore";
import useLiveSession from "../hooks/useLiveSession";

const CARE_BACKGROUND_BY_COLOR = {
  red: "/images/2-care-red.png",
  yellow: "/images/2-care-yellow.png",
  blue: "/images/2-care-blue.png",
};

function formatUpdateTime(isoString) {
  if (!isoString) return "--:-- update";

  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes} update`;
}

function getCareBackgroundColor(themeKey = "") {
  const normalizedThemeKey = themeKey.toLowerCase();

  if (
    normalizedThemeKey.includes("humidity") ||
    normalizedThemeKey.includes("moisture") ||
    normalizedThemeKey.includes("water")
  ) {
    return "blue";
  }

  if (
    normalizedThemeKey.includes("load") ||
    normalizedThemeKey.includes("shape") ||
    normalizedThemeKey.includes("deformation")
  ) {
    return "yellow";
  }

  return "red";
}

function CareBackground({ themeKey }) {
  const color = getCareBackgroundColor(themeKey);

  return (
    <img
      src={CARE_BACKGROUND_BY_COLOR[color]}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
    />
  );
}

function Care({ onOpenMenu }) {
  const publicToken = useBagStore((state) => state.publicToken);

  const { reading, isLoading, isError, error } = useLiveSession(publicToken);

  const presentation = reading?.presentation;
  const careState = presentation?.state;
  const displayMetrics = presentation?.display_metrics ?? [];

  if (!publicToken) {
    return (
      <main className="relative mx-auto flex min-h-dvh w-full max-w-[393px] items-center justify-center bg-white px-6 text-center">
        <p className="text-[15px] text-gray-50">
          My Bag에서 메인 가방을 먼저 등록해 주세요.
        </p>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="relative mx-auto flex min-h-dvh w-full max-w-[393px] items-center justify-center bg-white">
        <p className="text-[15px] text-gray-50">불러오는 중...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="relative mx-auto flex min-h-dvh w-full max-w-[393px] items-center justify-center bg-white px-6 text-center">
        <p className="text-[15px] text-gray-50">
          {error?.message ?? "가방 상태를 불러오지 못했어요."}
        </p>
      </main>
    );
  }

  return (
    <main className="relative mx-auto min-h-dvh w-full max-w-[393px] overflow-hidden bg-white">
      {/*배경 그라데이션*/}
      <CareBackground themeKey={careState?.theme_key} />

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
            {formatUpdateTime(reading?.observed_at)}
          </p>

          <h2 className="mt-2 whitespace-pre-line break-keep text-balance text-[28px] font-bold leading-[1.4] tracking-[-0.03em] text-gray-90">
            {careState?.quick_care ?? "가방 상태를 확인해 주세요."}
          </h2>

          <p className="mt-2 whitespace-pre-line break-keep text-balance text-[18px] font-medium leading-[1.5] tracking-[-0.03em] text-gray-60">
            {careState?.description ?? "현재 가방 상태를 확인하고 있어요."}
          </p>

          <ul className="mt-[19px] flex flex-col items-start gap-2">
            {displayMetrics.map((metric) => (
              <li
                key={metric.key}
                className="rounded-full bg-white/80 px-3 py-2 text-[16px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-60"
              >
                {metric.label} {metric.value}
                {metric.unit}
              </li>
            ))}
          </ul>
        </section>

        {/*하단 버튼 영역*/}
        <div className="mt-auto px-6 pb-[55px]">
          <Link
            to="/care/personal"
            className="flex w-full items-center justify-center rounded-lg bg-gray-70 px-3 py-2.5 text-[16px] font-bold leading-[1.5] tracking-[-0.01em] text-white"
          >
            전체 케어 방법 보기
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Care;
