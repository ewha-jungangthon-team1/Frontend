import { useState } from "react";
import { Link } from "react-router";

const CARE_STEPS = [
  {
    number: "01",
    title: "가방을 서늘한 곳으로 옮겨 주세요.",
    description: "높은 온도에 오래 노출돼\n먼저 열을 식혀 주세요.",
    details: [
      {
        label: "어떻게",
        content: "직사광선을 피하고 통풍이 되는 실내에 두어 주세요.",
      },
      {
        label: "언제까지",
        content: "가방의 온도가 안정될 때까지 유지해 주세요.",
      },
    ],
  },

  {
    number: "02",
    title: "내용물을 비워 주세요.",
    description:
      "오른쪽에 무게가 집중돼 있어\n가방에 실리는 하중을 줄여 주세요.",
    details: [
      {
        label: "어떻게",
        content:
          "내용물을 모두 꺼내고, 한쪽 면에 무게가 남지 않도록\n정리해 주세요.",
      },
      {
        label: "피해주세요",
        content:
          "형태가 안정되기 전에는 무거운 물건을\n다시 넣지 않는 것이 좋아요.",
      },
    ],
  },
  {
    number: "03",
    title: "오른쪽 형태가 눌리지 않도록\n안정적으로 보관해 주세요.",
    description:
      "형태 변화가 더 커지지 않도록\n원래 형태가 유지되는 자세로 두는 것이 좋아요.",
    details: [
      {
        label: "어떻게",
        content:
          "오른쪽 면이 다른 물건이나 벽에 눌리지 않도록\n공간을 두고 세워 주세요.",
      },
      {
        label: "보관할 때",
        content: "가방의 형태를 유지할 수 있도록 안정된 곳에\n두어 주세요.",
      },
    ],
  },
];

const SCENE_POSITION_CLASSES = [
  "pt-[154px]",
  "pt-[40px]",
  "-translate-y-[71px]",
];

function CareScene({ activeIndex, isVisible }) {
  return (
    <section
      className={`h-dvh pl-8 pr-[22px] ${SCENE_POSITION_CLASSES[activeIndex]}`}
    >
      <ol className="flex flex-col gap-2">
        {CARE_STEPS.map((step, index) => (
          <CareStep
            key={step.number}
            step={step}
            isActive={index === activeIndex}
            isSceneVisible={isVisible}
          />
        ))}
      </ol>
    </section>
  );
}

function CareStep({ step, isActive, isSceneVisible }) {
  const stepHeight = isActive
    ? step.number === "03"
      ? "h-[313px]"
      : "h-[292px]"
    : "h-[104px]";

  return (
    <li
      aria-current={isActive ? "step" : undefined}
      className={`shrink-0 border-l-[5px] pl-[17px] ${
        isActive
          ? `${stepHeight} border-main-2 pt-[14px]`
          : "h-[104px] border-white pt-[22px]"
      }`}
    >
      <div
        className={`whitespace-pre-line transition-transform duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isSceneVisible ? "translate-y-0" : "translate-y-1"
        } ${isActive ? "" : "opacity-30"}`}
      >
        <p className="text-[18px] font-medium leading-[1.5] tracking-[-0.03em] text-gray-40">
          {step.number}
        </p>

        <h2
          className={`text-[18px] font-bold leading-[1.5] tracking-[-0.03em] text-gray-80 ${
            step.number === "03" ? "max-w-[241px]" : ""
          }`}
        >
          {step.title}
        </h2>

        {isActive && (
          <>
            <p className="mt-1 text-[15px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-70">
              {step.description}
            </p>

            <div className="mt-4 flex flex-col gap-4 text-gray-70">
              {step.details.map((detail) => (
                <div key={detail.label}>
                  <h3 className="text-[13px] font-medium leading-[1.5] tracking-[-0.01em]">
                    {detail.label}
                  </h3>

                  <p className="mt-[3px] text-[14px] font-light leading-[1.5] tracking-[-0.01em]">
                    {detail.content}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </li>
  );
}

function PersonalCare() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const { scrollTop, clientHeight } = event.currentTarget;

    const nextIndex = Math.round(scrollTop / clientHeight);

    const safeIndex = Math.min(CARE_STEPS.length - 1, Math.max(0, nextIndex));

    setActiveIndex(safeIndex);
  };

  return (
    <main className="relative h-dvh overflow-hidden bg-white">
      {/* 배경 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <img
          src="/images/2-1.personalcare-red.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      </div>

      {/* 고정 뒤로가기 */}
      <header className="absolute left-6 top-[83px] z-30">
        <Link
          to="/care"
          aria-label="Care 화면으로 돌아가기"
          className="block size-6"
        >
          <img src="/icons/left.svg" alt="" className="size-full" />
        </Link>
      </header>

      {/* 스크롤 감지 영역 */}
      <div
        className="relative z-10 h-dvh snap-y snap-mandatory overflow-y-auto"
        onScroll={handleScroll}
      >
        {/* 화면에 고정되는 콘텐츠 */}
        <div className="sticky top-0 h-dvh">
          {CARE_STEPS.map((step, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={step.number}
                aria-hidden={!isActive}
                className={`absolute inset-0 transition-opacity duration-[750ms] ease-out ${
                  isActive ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <CareScene activeIndex={index} isVisible={isActive} />
              </div>
            );
          })}
        </div>

        {/* 실제 스크롤 높이를 만드는 투명 영역 */}
        <div className="-mt-[100dvh]">
          {CARE_STEPS.map((step) => (
            <div
              key={step.number}
              aria-hidden="true"
              className="h-dvh snap-start"
            />
          ))}
        </div>
      </div>

      {/* 하단 안내 영역 */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {activeIndex < CARE_STEPS.length - 1 ? (
          <img
            src="/icons/down-arrow.svg"
            alt=""
            aria-hidden="true"
            className="absolute bottom-[84px] left-1/2 size-6 -translate-x-1/2 brightness-0 invert"
          />
        ) : (
          <Link
            to="/care"
            className="pointer-events-auto absolute inset-x-6 bottom-[55px] flex items-center justify-center rounded-lg bg-white px-3 py-2.5 text-[16px] font-bold leading-[1.5] tracking-[-0.01em] text-gray-60"
          >
            케어 홈으로 돌아가기
          </Link>
        )}
      </div>
    </main>
  );
}

export default PersonalCare;
