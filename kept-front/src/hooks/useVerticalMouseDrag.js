import { useRef } from "react";

const DRAG_START_THRESHOLD = 5;
const SWIPE_PAGE_THRESHOLD = 50;

function useVerticalMouseDrag() {
  const dragStateRef = useRef({
    element: null,
    pointerId: null,
    startY: 0,
    startScrollTop: 0,
    hasDragged: false,
  });

  const handlePointerDown = (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    dragStateRef.current = {
      element: event.currentTarget,
      pointerId: event.pointerId,
      startY: event.clientY,
      startScrollTop: event.currentTarget.scrollTop,
      hasDragged: false,
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const dragState = dragStateRef.current;

    if (
      dragState.element === null ||
      dragState.pointerId !== event.pointerId
    ) {
      return;
    }

    const dragDistance = event.clientY - dragState.startY;

    if (Math.abs(dragDistance) >= DRAG_START_THRESHOLD) {
      dragState.hasDragged = true;
    }

    if (!dragState.hasDragged) return;

    event.preventDefault();
    dragState.element.scrollTop = dragState.startScrollTop - dragDistance;
  };

  const finishPointerDrag = (event) => {
    const dragState = dragStateRef.current;

    if (
      dragState.element === null ||
      dragState.pointerId !== event.pointerId
    ) {
      return;
    }

    const dragElement = dragState.element;
    const swipeDistance = dragState.startY - event.clientY;

    if (dragElement.hasPointerCapture?.(event.pointerId)) {
      dragElement.releasePointerCapture(event.pointerId);
    }

    if (dragState.hasDragged) {
      const pageHeight = dragElement.clientHeight;
      const lastPageIndex = Math.max(
        0,
        Math.ceil(dragElement.scrollHeight / pageHeight) - 1,
      );
      const currentPageIndex = Math.round(
        dragState.startScrollTop / pageHeight,
      );

      let nextPageIndex = currentPageIndex;

      if (swipeDistance >= SWIPE_PAGE_THRESHOLD) {
        nextPageIndex = currentPageIndex + 1;
      } else if (swipeDistance <= -SWIPE_PAGE_THRESHOLD) {
        nextPageIndex = currentPageIndex - 1;
      }

      const safePageIndex = Math.min(
        lastPageIndex,
        Math.max(0, nextPageIndex),
      );
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      dragElement.scrollTo({
        top: safePageIndex * pageHeight,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }

    dragStateRef.current = {
      element: null,
      pointerId: null,
      startY: 0,
      startScrollTop: 0,
      hasDragged: false,
    };
  };

  return {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: finishPointerDrag,
    onPointerCancel: finishPointerDrag,
  };
}

export default useVerticalMouseDrag;
