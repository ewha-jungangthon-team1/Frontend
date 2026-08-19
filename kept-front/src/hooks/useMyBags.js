import { useQuery } from "@tanstack/react-query";
import { getBags } from "../api/myBag";

function useMyBags() {
  return useQuery({
    queryKey: ["myBags"],
    queryFn: getBags,
  });
}

export default useMyBags;
