import { Link } from "react-router";
import MyBagHeader from "../components/MyBagHeader";
import { MY_BAG_CATEGORIES } from "../data/myBags";
import useMyBags from "../hooks/useMyBags";
import useBagStore from "../store/bagStore";
import useHorizontalMouseDrag from "../hooks/useHorizontalMouseDrag";

const BAG_LIST_STYLE = {
  "top-handle-01": { width: 129, height: 111, top: 4, offsetX: 8 },
  "top-handle-02": { width: 131, height: 98, top: 1, offsetX: 7 },
  "top-handle-03": { width: 121, height: 86, top: 16, offsetX: 0 },

  "shoulder-01": { width: 153, height: 87, top: 24, offsetX: 8 },
  "shoulder-02": { width: 129, height: 77, top: 20, offsetX: 7 },
  "shoulder-03": { width: 137, height: 120, top: -18, offsetX: 0 },

  "mini-01": { width: 138, height: 104, top: 7, offsetX: 8 },
  "mini-02": { width: 116, height: 116, top: 8, offsetX: 7 },
  "mini-03": { width: 154, height: 135, top: -19, offsetX: 0 },

  "other-01": { width: 106, height: 84, top: 24, offsetX: 8 },
  "other-02": { width: 142, height: 93, top: 15, offsetX: 7 },
};

function MyBag({ onOpenMenu }) {
  useMyBags();
  const storedProduct = useBagStore((state) => state.product);
  const { mouseDragProps } = useHorizontalMouseDrag();

  return (
    <main className="relative mx-auto min-h-[852px] w-full max-w-[393px] overflow-hidden bg-white">
      <MyBagHeader onOpenMenu={onOpenMenu} />

      <section className="pt-8">
        {MY_BAG_CATEGORIES.map((category) => (
          <article key={category.id} className="relative h-[150px]">
            <h2 className="absolute left-[26px] top-0 z-20 text-[13px] leading-[1.5] tracking-[-0.01em] text-gray-40">
              {category.label}
            </h2>

            <Link
              to={`/mybag/${category.id}`}
              aria-label={`${category.label} 상세 보기`}
              className="absolute right-[26px] top-0 z-20 size-5"
            >
              <img src="/icons/right.svg" alt="" className="size-full" />
            </Link>

            <div
              {...mouseDragProps}
              className="absolute inset-x-0 top-[-12px] z-10 h-[154px] cursor-grab select-none overflow-x-auto active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
              onDragStart={(event) => event.preventDefault()}
            >
              <div className="flex h-full min-w-max gap-[7px] px-[30px]">
                {category.bags.map((bag) => {
                  const bagStyle = BAG_LIST_STYLE[bag.id] ?? {
                    width: 137,
                    height: 116,
                    top: 0,
                    offsetX: 0,
                  };
                  const isMainBag =
                    bag.apiModelName &&
                    bag.apiModelName === storedProduct?.model_name;

                  return (
                    <div
                      key={bag.id}
                      className="relative h-full w-[137px] shrink-0"
                    >
                      {isMainBag && (
                        <img
                          src="/images/my-bag/main-bag-highlight.svg"
                          alt=""
                          aria-hidden="true"
                          className="pointer-events-none absolute left-1/2 top-[20px] h-[89px] w-[148px]"
                          style={{
                            transform: "translateX(calc(-50% + 7px))",
                          }}
                        />
                      )}

                      <img
                        src={bag.image}
                        alt={bag.alt}
                        className="absolute left-1/2 z-10 object-contain"
                        style={{
                          width: `${bagStyle.width}px`,
                          height: `${bagStyle.height}px`,
                          top: `${bagStyle.top + 12}px`,
                          transform: `translateX(calc(-50% + ${bagStyle.offsetX}px))`,
                        }}
                      />

                      {isMainBag && (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute left-1/2 top-[109px] z-20 h-[5px] w-[90px]"
                          style={{
                            transform: "translateX(calc(-50% + 7px))",
                            background:
                              "linear-gradient(90deg, rgba(255, 185, 54, 0) 0%, rgba(255, 185, 54, 0.62) 20%, rgba(255, 185, 54, 0.62) 80%, rgba(255, 185, 54, 0) 100%)",
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <img
              src="/images/my-bag/bag-shelf.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-[13px] top-[97px] h-[5px] w-[367px]"
            />
          </article>
        ))}
      </section>

      <button
        type="button"
        className="absolute bottom-[56px] left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full bg-gray-80 px-[14px] py-2 text-[15px] leading-[1.5] tracking-[-0.01em] whitespace-nowrap text-white"
      >
        <span className="text-[20px] leading-none">+</span>
        가방 추가
      </button>
    </main>
  );
}

export default MyBag;
