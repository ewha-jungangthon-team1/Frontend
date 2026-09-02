import { useEffect } from "react";
import useMyBags from "./useMyBags";
import useBagStore from "../store/bagStore";

// 서버(GET /api/bags/)에 이미 등록된 가방이 있다면, 사용자가 My Bag에서
// "메인 가방으로 등록하기"를 따로 누르지 않아도 그중 하나(서버가 내려주는
// is_main 플래그가 있으면 그것, 없으면 첫 번째 가방)를 자동으로 메인 가방으로
// 지정해서 Home/Care 화면에 곧바로 데이터가 보이도록 한다.
//
// 이미 메인 가방이 정해져 있다면(publicToken이 있음) 아무것도 하지 않는다.
// My Bag 화면은 이후 이 메인 가방을 "다른 가방으로 바꾸는" 용도로만 쓰면 된다.
function useMainBag() {
  const {
    data: apiBags = [],
    isLoading: isBagsLoading,
    isError: isBagsError,
    error: bagsError,
  } = useMyBags();

  const publicToken = useBagStore((state) => state.publicToken);
  const product = useBagStore((state) => state.product);
  const setSelectedBag = useBagStore((state) => state.setSelectedBag);

  useEffect(() => {
    if (publicToken) return; // 이미 메인 가방이 선택돼 있으면 그대로 둔다
    if (!apiBags || apiBags.length === 0) return; // 등록된 가방이 아직 없음

    const defaultBag = apiBags.find((bag) => bag.is_main) ?? apiBags[0];

    if (defaultBag?.public_token && defaultBag?.product) {
      setSelectedBag(defaultBag.public_token, defaultBag.product);
    }
  }, [publicToken, apiBags, setSelectedBag]);

  // 메인 가방이 자동 지정되기 전까지(위 effect가 store를 갱신하는 그 찰나)도
  // "로딩 중"으로 취급할 수 있도록 함께 내려준다.
  const isResolvingMainBag =
    !publicToken && !isBagsError && (isBagsLoading || apiBags.length > 0);

  return {
    publicToken,
    product,
    apiBags,
    hasRegisteredBags: apiBags.length > 0,
    isBagsLoading,
    isBagsError,
    bagsError,
    isResolvingMainBag,
  };
}

export default useMainBag;
