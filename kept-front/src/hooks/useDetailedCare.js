import { useMutation } from "@tanstack/react-query";
import { requestDetailedCare } from "../api/care";

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function fetchDetailedCare(sessionId) {
  if (!sessionId) {
    throw new Error("케어 정보를 요청할 세션이 없어요.");
  }

  const maxAttempts = 10;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const result = await requestDetailedCare(sessionId);

    if (result.status === "READY") {
      return result;
    }

    if (result.status !== "GENERATING") {
      throw new Error("상세 케어 정보를 불러오지 못했어요.");
    }

    if (attempt < maxAttempts - 1) {
      await wait(1500);
    }
  }

  throw new Error("상세 케어 생성 시간이 오래 걸리고 있어요.");
}

function useDetailedCare() {
  return useMutation({
    mutationFn: fetchDetailedCare,
  });
}

export default useDetailedCare;
