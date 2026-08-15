// 화면 최상단 공통 헤더: 페이지 제목 + 전체 메뉴 버튼
// Home, Report 등 최상위(탭) 화면에서 공통으로 사용한다
function PageHeader({ title, onOpenMenu }) {
  return (
    <header className="flex items-start justify-between px-6 pt-[83px]">
      <h1 className="text-[28px] leading-[1.32] tracking-[-0.03em] text-gray-80">
        {title}
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
  );
}

export default PageHeader;
