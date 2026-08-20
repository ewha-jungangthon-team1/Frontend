import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import MyBagHeader from "../components/MyBagHeader";
import { MY_BAG_CATEGORIES } from "../data/myBags";
import useMyBags from "../hooks/useMyBags";
import useBagStore from "../store/bagStore";

const DEFAULT_BAG_DETAIL_STYLE = {
  width: 256,
  height: 222,
  top: 0,
};

const BAG_SLIDE_WIDTH = 228;
const CENTER_SLIDE_INDEX = 1;
const MIN_SWIPE_DISTANCE = 50;
const MOUSE_DRAG_START_THRESHOLD = 5;
const CENTER_POSITION_TOLERANCE = 8;
const CAROUSEL_ANIMATION_DURATION = 520;

const BAG_DETAIL_STYLE = {
  "top-handle-01": { width: 256, height: 222, top: 0 },
  "top-handle-02": { width: 262, height: 196, top: -1 },
  "top-handle-03": { width: 242, height: 172, top: 31 },
  "top-handle-04": { width: 252, height: 219, top: -12 },

  "shoulder-01": { width: 306, height: 174, top: 40 },
  "shoulder-02": { width: 258, height: 154, top: 37 },
  "shoulder-03": { width: 205, height: 192, top: -8 },

  "mini-01": { width: 276, height: 208, top: 8 },
  "mini-02": { width: 232, height: 232, top: 12 },
  "mini-03": { width: 308, height: 252, top: -24 },

  "other-01": { width: 212, height: 168, top: 42 },
  "other-02": { width: 284, height: 186, top: 26 },
};

function MyBagDetail({ onOpenMenu }) {
  const { categoryId } = useParams();

  const { data: apiBags = [] } = useMyBags();

  const storedProduct = useBagStore((state) => state.product);
  const saveSelectedBag = useBagStore((state) => state.setSelectedBag);

  const selectedCategory = MY_BAG_CATEGORIES.find(
    (category) => category.id === categoryId,
  );

  const bags = selectedCategory?.bags ?? [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const carouselRef = useRef(null);
  const scrollEndTimerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isCarouselAnimatingRef = useRef(false);
  const touchStartXRef = useRef(null);
  const isTouchDraggingRef = useRef(false);
  const mouseStartXRef = useRef(null);
  const mouseStartScrollLeftRef = useRef(0);
  const mousePointerIdRef = useRef(null);
  const mouseDidDragRef = useRef(false);
  const isMouseDraggingRef = useRef(false);

  useLayoutEffect(() => {
    if (!carouselRef.current) return;

    carouselRef.current.scrollLeft = BAG_SLIDE_WIDTH;
  }, [categoryId, selectedIndex]);

  useEffect(
    () => () => {
      window.clearTimeout(scrollEndTimerRef.current);

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    },
    [],
  );

  if (!selectedCategory || bags.length === 0) {
    return (
      <main className="relative mx-auto min-h-[852px] w-full max-w-[393px] bg-white">
        <MyBagHeader onOpenMenu={onOpenMenu} backTo="/mybag" />

        <p className="px-6 pt-8 text-center text-[15px] text-gray-50">
          가방 정보를 찾을 수 없어요.
        </p>
      </main>
    );
  }

  const safeSelectedIndex = selectedIndex % bags.length;
  const selectedBag = bags[safeSelectedIndex];
  const previousBag = bags[(safeSelectedIndex - 1 + bags.length) % bags.length];
  const nextBag = bags[(safeSelectedIndex + 1) % bags.length];

  const selectedApiBag = apiBags.find(
    (apiBag) => apiBag.product.model_name === selectedBag.apiModelName,
  );

  const isSelectable = Boolean(selectedApiBag);

  const isMainBag =
    isSelectable && selectedBag.apiModelName === storedProduct?.model_name;

  const carouselBags = [
    { bag: previousBag, key: `previous-${previousBag.id}` },
    { bag: selectedBag, key: `selected-${selectedBag.id}` },
    { bag: nextBag, key: `next-${nextBag.id}` },
  ];

  const handleCarouselScroll = (event) => {
    const carouselElement = event.currentTarget;

    if (
      isMouseDraggingRef.current ||
      isTouchDraggingRef.current ||
      isCarouselAnimatingRef.current
    ) {
      return;
    }

    window.clearTimeout(scrollEndTimerRef.current);
    scrollEndTimerRef.current = window.setTimeout(() => {
      if (
        isMouseDraggingRef.current ||
        isTouchDraggingRef.current ||
        isCarouselAnimatingRef.current
      ) {
        return;
      }

      const centeredSlide = Math.round(
        carouselElement.scrollLeft / BAG_SLIDE_WIDTH,
      );
      const centeredPosition = centeredSlide * BAG_SLIDE_WIDTH;

      if (
        Math.abs(carouselElement.scrollLeft - centeredPosition) >
        CENTER_POSITION_TOLERANCE
      ) {
        return;
      }

      if (centeredSlide === 0) {
        setSelectedIndex(
          (currentIndex) => (currentIndex - 1 + bags.length) % bags.length,
        );
      } else if (centeredSlide === 2) {
        setSelectedIndex((currentIndex) => (currentIndex + 1) % bags.length);
      }
    }, 100);
  };

  const stopCarouselAnimation = () => {
    window.clearTimeout(scrollEndTimerRef.current);

    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    isCarouselAnimatingRef.current = false;

    if (carouselRef.current) {
      carouselRef.current.style.scrollSnapType = "";
    }
  };

  const scrollToSlide = (slideIndex) => {
    const carouselElement = carouselRef.current;

    if (!carouselElement) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const targetScrollLeft = slideIndex * BAG_SLIDE_WIDTH;

    stopCarouselAnimation();
    isCarouselAnimatingRef.current = true;
    carouselElement.style.scrollSnapType = "none";

    const finishSlideChange = () => {
      carouselElement.scrollLeft = targetScrollLeft;

      if (slideIndex === 0) {
        setSelectedIndex(
          (currentIndex) => (currentIndex - 1 + bags.length) % bags.length,
        );
      } else if (slideIndex === 2) {
        setSelectedIndex((currentIndex) => (currentIndex + 1) % bags.length);
      }

      window.requestAnimationFrame(() => {
        carouselElement.style.scrollSnapType = "";
        isCarouselAnimatingRef.current = false;
      });
    };

    if (prefersReducedMotion) {
      finishSlideChange();
      return;
    }

    const startScrollLeft = carouselElement.scrollLeft;
    const scrollDistance = targetScrollLeft - startScrollLeft;
    const startTime = window.performance.now();

    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(
        elapsedTime / CAROUSEL_ANIMATION_DURATION,
        1,
      );
      const easedProgress =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      carouselElement.scrollLeft =
        startScrollLeft + scrollDistance * easedProgress;

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(animateScroll);
        return;
      }

      animationFrameRef.current = null;
      finishSlideChange();
    };

    animationFrameRef.current = window.requestAnimationFrame(animateScroll);
  };

  const handleMousePointerDown = (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    window.clearTimeout(scrollEndTimerRef.current);
    stopCarouselAnimation();

    mouseStartXRef.current = event.clientX;
    mouseStartScrollLeftRef.current = event.currentTarget.scrollLeft;
    mousePointerIdRef.current = event.pointerId;
    mouseDidDragRef.current = false;
    isMouseDraggingRef.current = true;

    event.currentTarget.style.scrollSnapType = "none";
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handleMousePointerMove = (event) => {
    if (
      event.pointerType !== "mouse" ||
      mouseStartXRef.current === null ||
      mousePointerIdRef.current !== event.pointerId
    ) {
      return;
    }

    const swipeDistance = mouseStartXRef.current - event.clientX;

    if (Math.abs(swipeDistance) < MOUSE_DRAG_START_THRESHOLD) return;

    mouseDidDragRef.current = true;
    event.preventDefault();

    const previewDistance = Math.max(
      -BAG_SLIDE_WIDTH,
      Math.min(BAG_SLIDE_WIDTH, swipeDistance),
    );

    if (carouselRef.current) {
      carouselRef.current.scrollLeft =
        mouseStartScrollLeftRef.current + previewDistance * 0.8;
    }
  };

  const handleMousePointerUp = (event) => {
    if (
      event.pointerType !== "mouse" ||
      mouseStartXRef.current === null ||
      mousePointerIdRef.current !== event.pointerId
    ) {
      return;
    }

    const swipeDistance = mouseStartXRef.current - event.clientX;
    const carouselElement = carouselRef.current;

    if (carouselElement?.hasPointerCapture?.(event.pointerId)) {
      carouselElement.releasePointerCapture(event.pointerId);
    }

    if (carouselElement) {
      carouselElement.style.scrollSnapType = "";
    }

    isMouseDraggingRef.current = false;
    mouseStartXRef.current = null;
    mousePointerIdRef.current = null;

    if (mouseDidDragRef.current) {
      if (swipeDistance >= MIN_SWIPE_DISTANCE) {
        scrollToSlide(2);
      } else if (swipeDistance <= -MIN_SWIPE_DISTANCE) {
        scrollToSlide(0);
      } else {
        scrollToSlide(CENTER_SLIDE_INDEX);
      }
    }

    window.setTimeout(() => {
      mouseDidDragRef.current = false;
    }, 0);
  };

  const handleMousePointerCancel = (event) => {
    if (event.pointerType !== "mouse") return;

    const carouselElement = carouselRef.current;

    if (carouselElement?.hasPointerCapture?.(event.pointerId)) {
      carouselElement.releasePointerCapture(event.pointerId);
    }

    if (carouselElement) {
      carouselElement.style.scrollSnapType = "";
    }

    isMouseDraggingRef.current = false;
    mouseStartXRef.current = null;
    mousePointerIdRef.current = null;
    mouseDidDragRef.current = false;
    scrollToSlide(CENTER_SLIDE_INDEX);
  };

  const handleTouchStart = (event) => {
    stopCarouselAnimation();
    isTouchDraggingRef.current = true;
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartXRef.current === null) {
      isTouchDraggingRef.current = false;
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX;

    if (touchEndX === undefined) {
      touchStartXRef.current = null;
      isTouchDraggingRef.current = false;
      scrollToSlide(CENTER_SLIDE_INDEX);
      return;
    }

    const swipeDistance = touchStartXRef.current - touchEndX;
    touchStartXRef.current = null;
    isTouchDraggingRef.current = false;

    if (swipeDistance > MIN_SWIPE_DISTANCE) {
      scrollToSlide(2);
    } else if (swipeDistance < -MIN_SWIPE_DISTANCE) {
      scrollToSlide(0);
    } else {
      scrollToSlide(CENTER_SLIDE_INDEX);
    }
  };

  return (
    <main className="relative mx-auto min-h-[852px] w-full max-w-[393px] overflow-hidden bg-white">
      <MyBagHeader onOpenMenu={onOpenMenu} backTo="/mybag" />

      <p className="px-[26px] pt-6 text-[13px] leading-[1.5] tracking-[-0.01em] text-gray-40">
        {selectedCategory.label}
      </p>

      <section
        aria-label="가방 선택"
        className="relative mt-[27px] h-[222px] overflow-hidden"
      >
        <img
          src="/images/my-bag/bag-shelf.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-[13px] top-[183px] h-[5px] w-[367px]"
        />

        <div
          ref={carouselRef}
          className="absolute inset-0 z-10 cursor-grab select-none snap-x snap-mandatory overflow-x-auto overscroll-x-contain active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
          onScroll={handleCarouselScroll}
          onPointerDown={handleMousePointerDown}
          onPointerMove={handleMousePointerMove}
          onPointerUp={handleMousePointerUp}
          onPointerCancel={handleMousePointerCancel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => {
            touchStartXRef.current = null;
            isTouchDraggingRef.current = false;
            scrollToSlide(CENTER_SLIDE_INDEX);
          }}
          onDragStart={(event) => event.preventDefault()}
        >
          <div className="flex h-full w-max px-[82.5px]">
            {carouselBags.map(({ bag, key }, slideIndex) => {
              const bagStyle =
                BAG_DETAIL_STYLE[bag.id] ?? DEFAULT_BAG_DETAIL_STYLE;
              const isCentered = slideIndex === CENTER_SLIDE_INDEX;
              const showMainDecoration = isCentered && isMainBag;

              return (
                <button
                  key={key}
                  type="button"
                  aria-label={`${bag.alt} 보기`}
                  aria-current={isCentered ? "true" : undefined}
                  className="relative h-full w-[228px] shrink-0 snap-center snap-always"
                  onClick={() => {
                    if (mouseDidDragRef.current) {
                      mouseDidDragRef.current = false;
                      return;
                    }
                    scrollToSlide(slideIndex);
                  }}
                >
                  {showMainDecoration && (
                    <img
                      src="/images/my-bag/main-bag-highlight.svg"
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none absolute left-1/2 top-4 h-[190px] w-[262px] -translate-x-1/2"
                    />
                  )}

                  <img
                    src={bag.image}
                    alt={isCentered ? bag.alt : ""}
                    draggable="false"
                    className={`pointer-events-none absolute left-1/2 object-contain ${
                      isCentered ? "z-20" : "z-10"
                    }`}
                    style={{
                      width: `${bagStyle.width}px`,
                      height: `${bagStyle.height}px`,
                      top: `${bagStyle.top}px`,
                      transform: "translateX(-50%)",
                    }}
                  />

                  {showMainDecoration && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute left-1/2 top-[182px] z-10 h-[6px] w-[165px] -translate-x-1/2"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, #ffb936 20%, #ffb936 80%, transparent 100%)",
                        mixBlendMode: "multiply",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="absolute left-1/2 top-[414px] flex w-[306px] -translate-x-1/2 flex-col items-center text-center">
        <h2 className="max-w-[258px] whitespace-pre-line text-[28px] leading-[1.32] tracking-[-0.03em] text-gray-100">
          {selectedBag.name ?? selectedBag.alt}
        </h2>

        <p className="mt-2 whitespace-pre-line text-[15px] leading-[1.5] tracking-[-0.01em] text-gray-90">
          {selectedBag.description ?? "가방 상세 정보가 준비 중이에요."}
        </p>

        {selectedBag.materials?.length > 0 ? (
          <ul className="mt-[19px] list-inside list-disc text-[13px] leading-[1.5] tracking-[-0.01em] text-gray-50">
            {selectedBag.materials.map((material) => (
              <li key={material}>{material}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-[19px] text-[13px] text-gray-50">
            소재 정보가 준비 중이에요.
          </p>
        )}

        {selectedBag.note && (
          <p className="mt-[19px] text-[13px] leading-[1.5] tracking-[-0.01em] text-gray-50">
            {selectedBag.note}
          </p>
        )}
      </section>

      <button
        type="button"
        disabled={isMainBag || !isSelectable}
        onClick={() => {
          if (!selectedApiBag) return;

          saveSelectedBag(selectedApiBag.public_token, selectedApiBag.product);
        }}
        className={`absolute bottom-[56px] left-1/2 z-30 flex w-[345px] -translate-x-1/2 items-center justify-center rounded-lg px-3 py-2.5 text-[16px] font-bold leading-[1.5] tracking-[-0.01em] ${
          isMainBag || !isSelectable
            ? "bg-gray-5 text-gray-70"
            : "bg-gray-80 text-white"
        }`}
      >
        {isMainBag
          ? "메인 가방으로 등록중"
          : isSelectable
            ? "메인 가방으로 등록하기"
            : "현재 선택할 수 없는 가방이에요"}
      </button>
    </main>
  );
}

export default MyBagDetail;
