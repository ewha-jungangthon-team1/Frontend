import { useState } from "react";
import { Link } from "react-router";
import useBagMetrics, { METRIC_KEY_TO_ID } from "../hooks/useBagMetrics";
import useBagStore from "../store/bagStore";
import MetricBadge from "../components/MetricBadge";
import MetricDrawer from "../components/MetricDrawer";

// Care 화면과 동일한 경고 상태 배경(핑크 그라데이션)을 재사용
// ⚠️ 테스트용 임시 토큰

const TEMP_PUBLIC_TOKEN = "11111111-1111-1111-1111-111111111111";

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
      src="/images/1-homeimage.png"
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
  // 그래프 바텀시트에 표시할 지표 id (없으면 닫힌 상태)
  const [selectedMetricId, setSelectedMetricId] = useState(null);
  const openMetric = (metricId) => setSelectedMetricId(metricId);
  const closeMetric = () => setSelectedMetricId(null);

  const storedToken = useBagStore((state) => state.publicToken);
  const publicToken = storedToken ?? TEMP_PUBLIC_TOKEN;

  const {
    reading,
    state,
    displayMetrics,
    metricsById,
    isLoading,
    isError,
    error,
  } = useBagMetrics(publicToken);

  const selectedMetric = metricsById[selectedMetricId] ?? null;

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
          </div>

          <h2 className="mt-2 text-[28px] font-bold leading-[1.4] tracking-[-0.03em] text-gray-90">
            {state?.headline ?? "가방 상태를 확인하고 있어요"}
          </h2>

          <p className="mt-2 text-[18px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-60">
            {state?.description ?? ""}
          </p>
        </section>

        <section className="relative mt-6 flex flex-1 flex-col items-center px-6">
          <div className="relative flex h-[300px] w-full max-w-[220px] items-center justify-center">
            {displayMetrics.map((metric, index) => (
              <MetricBadge
                key={metric.key}
                label={metric.label}
                value={`${metric.value}${metric.unit}`}
                onClick={() => openMetric(METRIC_KEY_TO_ID[metric.key])}
                className={BADGE_POSITION_CLASSES[index]}
              />
            ))}
          </div>

          {/* <button
              type="button"
              className="mt-2 flex items-center gap-0.5 text-[14px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-70"
            >
              MCM Vela Visetos Sling Bag
              <img src="/icons/right.svg" alt="" className="size-4" />
            </button> */}
        </section>
        <div className="px-6 pb-[55px] pt-4">
          <p className="mb-2 text-[14px] leading-[1.5] tracking-[-0.01em] text-gray-50">
            지금 필요한 케어
          </p>

          <Link
            to="/care"
            className="flex w-full flex-col gap-3 rounded-lg bg-white px-4 py-3.5 text-gray-90"
          >
            {/*quick_care 값을 받아 안내 문구 표시 */}
            <span className="text-[20px] font-regular leading-[1.4] tracking-[-0.01em]">
              {state?.quick_care ?? "가방 상태를 확인해 주세요."}
            </span>

            <span className="flex shrink-0 items-center gap-0.5 self-end text-[13px] font-medium leading-[1.5] tracking-[-0.01em] text-main-1">
              케어 방법 보기
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M15.632 12L10.884 3.03198L9.11597 3.96798L13.368 12L9.11597 20.032L10.884 20.968L15.632 12Z"
                  fill="#892A17"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>

      <MetricDrawer metric={selectedMetric} onClose={closeMetric} />
    </main>
  );
}

export default Home;
