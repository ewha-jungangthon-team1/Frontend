const MENUS = [
  { id: "home", label: "Home" },
  { id: "care", label: "Care" },
  { id: "report", label: "Report" },
];

function GNB({ currentPage, onSelect, onClose }) {
  return (
    <nav className="fixed inset-0 z-50 bg-gray-70" aria-label="전체 메뉴">
      <ul className="absolute left-6 top-[83px] flex flex-col gap-[14px]">
        {MENUS.map((menu) => {
          const isActive = currentPage === menu.id;

          return (
            <li key={menu.id}>
              <button
                type="button"
                className={`text-left text-[28px] font-normal leading-[1.32] tracking-[-0.03em] ${
                  isActive ? "text-white" : "text-gray-40"
                }`}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onSelect(menu.id)}
              >
                {menu.label}
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className="absolute right-6 top-[88px] flex size-6 items-center justify-center text-white"
        aria-label="메뉴 닫기"
        onClick={onClose}
      >
        <span
          aria-hidden="true"
          className="text-[32px] font-light leading-none"
        >
          ×
        </span>
      </button>
    </nav>
  );
}

export default GNB;
