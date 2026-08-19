// 뒤로가기 버튼이 있는 상세 화면용 헤더 (예: 사용기록 상세)
// 좌측 뒤로가기 버튼과 동일한 크기(24px)의 빈 공간을 오른쪽에 둬서
// 제목이 화면 중앙에 정확히 오도록 맞춘다 (Figma Header 컴포넌트와 동일한 구조)
function DetailHeader({ title, onBack }) {
  return (
    <header className="flex items-center gap-2 px-6 pt-[83px] pb-3">
      <button
        type="button"
        aria-label="뒤로 가기"
        onClick={onBack}
        className="size-6 shrink-0"
      >
        <img src="/icons/left.svg" alt="" className="size-full" />
      </button>

      <h1 className="flex-1 text-center text-[16px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-90">
        {title}
      </h1>

      {/* 좌측 뒤로가기 버튼과 크기를 맞춘 빈 공간 (제목 중앙 정렬용) */}
      <div className="size-6 shrink-0" aria-hidden="true" />
    </header>
  );
}

export default DetailHeader;
