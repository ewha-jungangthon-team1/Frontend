import { useState } from "react";
import { Link, useLocation } from "react-router";
import useVerticalMouseDrag from "../hooks/useVerticalMouseDrag";

const PERSONAL_CARE_BACKGROUND_BY_COLOR = {
  red: "/images/2-1.personalcare-red.png",
  yellow: "/images/2-1.personalcare-yellow.png",
  blue: "/images/2-1.personalcare-blue.png",
};

function getPersonalCareBackgroundColor(themeKey = "") {
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

function normalizeCareSteps(steps = []) {
  return steps.map((step) => ({
    number: String(step.step).padStart(2, "0"),
    title: step.title,
    description: step.description,
    details: step.details ?? [],
  }));
}

const SCENE_POSITION_CLASSES = [
  "pt-[154px]",
  "pt-[40px]",
  "-translate-y-[71px]",
];

function CareScene({ activeIndex, isVisible, careSteps }) {
  return (
    <section
      className={`h-dvh pl-8 pr-[22px] ${SCENE_POSITION_CLASSES[activeIndex]}`}
    >
      <ol className="flex flex-col gap-2">
        {careSteps.map((step, index) => (
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
  const { state } = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const mouseDragProps = useVerticalMouseDrag();

  const careSteps = normalizeCareSteps(state?.careResult?.care?.steps);

  const backgroundColor = getPersonalCareBackgroundColor(state?.themeKey);

  const backgroundImage = PERSONAL_CARE_BACKGROUND_BY_COLOR[backgroundColor];

  if (careSteps.length === 0) {
    return (
      <main className="relative mx-auto flex h-dvh w-full max-w-[393px] items-center justify-center bg-white px-6 text-center">
        <div>
          <p className="text-[15px] text-gray-60">
            불러온 상세 케어 정보가 없어요.
          </p>

          <Link
            to="/care"
            className="mt-4 inline-flex rounded-lg bg-gray-70 px-4 py-2.5 text-[15px] font-bold text-white"
          >
            Care 화면으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const handleScroll = (event) => {
    const { scrollTop, clientHeight } = event.currentTarget;

    const nextIndex = Math.round(scrollTop / clientHeight);

    const safeIndex = Math.min(careSteps.length - 1, Math.max(0, nextIndex));

    setActiveIndex(safeIndex);
  };

  return (
    <main className="relative mx-auto h-dvh w-full max-w-[393px] overflow-hidden bg-white">
      {/* 배경 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <img
          src={backgroundImage}
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
        {...mouseDragProps}
        className="relative z-10 h-dvh cursor-grab select-none snap-y snap-mandatory overflow-y-auto active:cursor-grabbing"
        onScroll={handleScroll}
        onDragStart={(event) => event.preventDefault()}
      >
        {/* 화면에 고정되는 콘텐츠 */}
        <div className="sticky top-0 h-dvh">
          {careSteps.map((step, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={step.number}
                aria-hidden={!isActive}
                className={`absolute inset-0 transition-opacity duration-[750ms] ease-out ${
                  isActive ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <CareScene
                  activeIndex={index}
                  isVisible={isActive}
                  careSteps={careSteps}
                />
              </div>
            );
          })}
        </div>

        {/* 실제 스크롤 높이를 만드는 투명 영역 */}
        <div className="-mt-[100dvh]">
          {careSteps.map((step) => (
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
        {activeIndex < careSteps.length - 1 ? (
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
