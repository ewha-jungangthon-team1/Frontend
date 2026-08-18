import { Link } from "react-router";
import useBagStatus from "../hooks/useBagStatus";
import useLiveSession from "../hooks/useLiveSession";
import useBagStore from "../store/bagStore";
import MetricBadge from "../components/MetricBadge";
import MetricDrawer from "../components/MetricDrawer";

// Care 화면과 동일한 경고 상태 배경(핑크 그라데이션)을 재사용
// ⚠️ 테스트용 임시 토큰

const TEMP_PUBLIC_TOKEN = "11111111-1111-1111-1111-111111111111";

// display_metrics의 key → 기존 그래프 바텀시트(useBagStatus)의 id 매핑
const METRIC_KEY_TO_DRAWER_ID = {
  right_load_percent: "rightLoad",
  shape_deviation_percent: "shapeDeviation",
  temperature_c: "temperature",
};

// 배지가 가방 이미지 위 어디에 놓일지는 고정 (3번째 지표까지만 대응)
const BADGE_POSITION_CLASSES = [
  "absolute -right-6 top-10",
  "absolute -left-8 bottom-20",
  "absolute -right-4 bottom-6",
];

// Care 화면과 동일한 배경
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

// observed_at("2026-08-16T12:00:00+09:00") → "12:00 update" 형태로 변환
function formatUpdateTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm} update`;
}

function Home({ onOpenMenu }) {
  const { selectedMetric, openMetric, closeMetric } = useBagStatus();

  const storedToken = useBagStore((state) => state.publicToken);
  const publicToken = storedToken ?? TEMP_PUBLIC_TOKEN;

  const { reading, isLoading, isError, error } = useLiveSession(publicToken);

  if (isLoading) {
    return (
      <main className="relative mx-auto flex min-h-[852px] w-full max-w-[393px] items-center justify-center bg-white">
        <p className="text-[15px] text-gray-50">불러오는 중...</p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="relative mx-auto flex min-h-[852px] w-full max-w-[393px] items-center justify-center bg-white px-6 text-center">
        <p className="text-[15px] text-gray-50">{error.message}</p>
      </main>
    );
  }

  const { state, display_metrics } = reading.presentation;

  return (
    <main className="relative mx-auto min-h-[852px] w-full max-w-[393px] overflow-hidden bg-white">
      <HomeBackground />

      <div className="relative z-10 flex min-h-[852px] flex-col">
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

        <section className="px-6 pt-[18px]">
          <div className="flex items-center justify-between">
            <p className="text-[16px] leading-[1.32] tracking-[-0.01em] text-gray-50">
              {formatUpdateTime(reading.observed_at)}
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
            {state?.headline ?? "가방 상태를 확인하고 있어요"}
          </h2>

          <p className="mt-2 text-[15px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-60">
            {state?.description ?? ""}
          </p>
        </section>

        <section className="relative mt-6 flex flex-1 flex-col items-center px-6">
          <div className="relative flex h-[300px] w-full max-w-[220px] items-center justify-center">
            <span className="text-[13px] text-gray-30">가방 이미지 영역</span>

            {display_metrics.map((metric, index) => (
              <MetricBadge
                key={metric.key}
                label={metric.label}
                value={`${metric.value}${metric.unit}`}
                onClick={() => openMetric(METRIC_KEY_TO_DRAWER_ID[metric.key])}
                className={BADGE_POSITION_CLASSES[index]}
              />
            ))}
          </div>

          <button
            type="button"
            className="mt-2 flex items-center gap-0.5 text-[14px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-70"
          >
            MCM Vela Visetos Sling Bag
            <img src="/icons/right.svg" alt="" className="size-4" />
          </button>
        </section>

        <div className="px-6 pb-[55px] pt-4">
          <p className="mb-2 text-[13px] leading-[1.5] tracking-[-0.01em] text-gray-50">
            지금 필요한 케어
          </p>

          <Link
            to="/care"
            className="flex w-full items-center justify-between gap-3 rounded-lg bg-gray-70 px-4 py-3.5 text-white"
          >
            <span className="text-[15px] font-bold leading-[1.4] tracking-[-0.01em]">
              {state?.quick_care ?? "가방 상태를 확인해 주세요."}
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

      <MetricDrawer metric={selectedMetric} onClose={closeMetric} />
    </main>
  );
}

export default Home;
