// 뒤로가기 버튼이 있는 상세 화면용 헤더 (예: 사용기록 상세)
function DetailHeader({ title, onBack }) {
  return (
    <header className="flex items-center gap-2 px-6 pt-[83px]">
      <button
        type="button"
        aria-label="뒤로 가기"
        onClick={onBack}
        className="size-6 shrink-0"
      >
        <img src="/icons/left.svg" alt="" className="size-full" />
      </button>

      <h1 className="text-[18px] font-bold leading-[1.4] tracking-[-0.02em] text-gray-90">
        {title}
      </h1>
    </header>
  );
}

export default DetailHeader;
