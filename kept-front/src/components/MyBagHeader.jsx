import { Link } from "react-router";

function MyBagHeader({ onOpenMenu, backTo }) {
  return (
    <header className="flex items-start justify-between px-6 pt-[83px]">
      {backTo ? (
        <Link
          to={backTo}
          aria-label="My Bag 화면으로 돌아가기"
          className="mt-[5px] size-6 shrink-0"
        >
          <img src="/icons/left.svg" alt="" className="size-full" />
        </Link>
      ) : (
        <h1 className="text-[28px] leading-[1.32] tracking-[-0.03em] text-gray-80">
          My Bag
        </h1>
      )}

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

export default MyBagHeader;
