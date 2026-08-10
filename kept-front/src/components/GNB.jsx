const MENUS = [
  { id: "home", label: "Home" },
  { id: "care", label: "Care" },
  { id: "report", label: "Report" },
];

function GNB({ currentPage, onSelect, onClose }) {
  return (
    <nav className="gnb" aria-label="전체 메뉴">
      <ul className="gnb_list">
        {MENUS.map((menu) => {
          const isActive = currentPage === menu.id;

          return (
            <li key={menu.id}>
              <button
                type="button"
                className={`gnb_item ${isActive ? "is-active" : ""}`}
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
        className="gnb__close"
        aria-label="메뉴 닫기"
        onClick={onClose}
      >
        <span aria-hidden="true">×</span>
      </button>
    </nav>
  );
}

export default GNB;
