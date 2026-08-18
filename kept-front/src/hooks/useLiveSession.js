import { useQuery } from "@tanstack/react-query";
import { ensureLiveSession, getLatestReading } from "../api/bag";

/**
 * LIVE Session을 시작하고, 진행되는 동안 최신 센서 데이터를
 * 자동으로 반복 조회(폴링)해서 돌려주는 훅입니다.
 *
 * 안에서 하는 일 (총 2단계):
 *
 *  1단계) ensureLiveSession(publicToken) 호출
 *         → 세션을 만들거나 이미 있으면 재사용하고, session_id를 받아옴
 *
 *  2단계) session_id가 생기면 그때부터 getLatestReading(session_id)를
 *         polling_interval_seconds(기본 2초)마다 자동으로 반복 호출
 *         → is_finished가 true로 오는 순간 자동으로 반복을 멈춤
 *
 * @param {string | null} publicToken - bagStore에 저장된 Bag UUID
 * @returns {{
 *   session: object | undefined,
 *   reading: object | undefined,
 *   isLoading: boolean,
 *   isError: boolean,
 *   error: Error | null,
 * }}
 */

function useLiveSession(publicToken) {
  // ── 1단계: 세션 확보 ────────────────────────────────────────
  const sessionQuery = useQuery({
    //queryKey - 캐시된 데이터와 비교해 새로운 데이터를 가져올지, 캐시된 데이터를 사용할지 결정하는 기준
    queryKey: ["liveSession", "ensure", publicToken],
    queryFn: () => ensureLiveSession(publicToken),

    //enabled - publicToken이 null이면 이 쿼리를 아예 실행하지 않음
    enabled: !!publicToken,
    staleTime: Infinity,
  });

  //ensureLiveSession의 응답 전체 중 session_id만 꺼내 저장

  const sessionId = sessionQuery.data?.session_id;

  // ── 2단계: 최신 센서 데이터 폴링 ────────────────────────────
  const readingQuery = useQuery({
    queryKey: ["liveSession", "reading", sessionId],
    queryFn: () => getLatestReading(sessionId),
    enabled: !!sessionId,

    refetchInterval: (query) => {
      if (query.state.data?.is_finished) return false;
      const seconds = sessionQuery.data?.polling_interval_seconds ?? 2;
      return seconds * 1000;
    },

    refetchIntervalInBackground: true,

    // 폴링 시작 직후 404("아직 생성된 데이터가 없습니다")가 짧게 날 수 있어
    // 즉시 에러 처리하지 않고 최대 3번까지는 재시도
    retry: 3,
    retryDelay: 1000,
  });

  return {
    //ensure API 응답 그대로
    session: sessionQuery.data,

    //latest-reading API 응답 그대로
    reading: readingQuery.data,

    //둘 중 하나라도 로딩 중이면 true
    isLoading: sessionQuery.isLoading || readingQuery.isLoading,
    isError: sessionQuery.isError || readingQuery.isError,
    error: sessionQuery.error ?? readingQuery.error ?? null,
  };
}

export default useLiveSession;
