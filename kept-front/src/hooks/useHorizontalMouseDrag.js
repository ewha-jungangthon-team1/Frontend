import { useRef } from "react";

const DRAG_START_THRESHOLD = 5;

function useHorizontalMouseDrag() {
  const dragStateRef = useRef({
    element: null,
    pointerId: null,
    startX: 0,
    startScrollLeft: 0,
    hasDragged: false,
  });
  const mouseDragOccurredRef = useRef(false);

  const handlePointerDown = (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    dragStateRef.current = {
      element: event.currentTarget,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: event.currentTarget.scrollLeft,
      hasDragged: false,
    };
    mouseDragOccurredRef.current = false;

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

    const dragDistance = event.clientX - dragState.startX;

    if (Math.abs(dragDistance) >= DRAG_START_THRESHOLD) {
      dragState.hasDragged = true;
      mouseDragOccurredRef.current = true;
    }

    if (!dragState.hasDragged) return;

    event.preventDefault();
    dragState.element.scrollLeft =
      dragState.startScrollLeft - dragDistance;
  };

  const finishPointerDrag = (event) => {
    const dragState = dragStateRef.current;

    if (
      dragState.element === null ||
      dragState.pointerId !== event.pointerId
    ) {
      return;
    }

    if (dragState.element.hasPointerCapture?.(event.pointerId)) {
      dragState.element.releasePointerCapture(event.pointerId);
    }

    dragStateRef.current = {
      element: null,
      pointerId: null,
      startX: 0,
      startScrollLeft: 0,
      hasDragged: false,
    };

    window.setTimeout(() => {
      mouseDragOccurredRef.current = false;
    }, 0);
  };

  const consumeMouseDrag = () => {
    const hasDragged = mouseDragOccurredRef.current;
    mouseDragOccurredRef.current = false;
    return hasDragged;
  };

  return {
    mouseDragProps: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: finishPointerDrag,
      onPointerCancel: finishPointerDrag,
    },
    consumeMouseDrag,
  };
}

export default useHorizontalMouseDrag;
