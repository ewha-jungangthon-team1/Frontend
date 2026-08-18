import client from "./client";

/**
 * LIVE Session을 생성하거나(없으면) 기존 세션을 재사용합니다.
 * POST /api/bags/{public_token}/live-sessions/ensure/
 *
 * @param {string} publicToken - GET /api/bags/ 에서 받은 Bag UUID
 * @returns {Promise<{
 *   session_id: number,
 *   status: "RUNNING",
 *   created: boolean,
 *   polling_interval_seconds: number,
 *   started_at: string,       // ISO-8601
 *   scheduled_end_at: string, // ISO-8601
 * }>}
 */

export const ensureLiveSession = (publicToken) =>
  client.post(`/bags/${publicToken}/live-sessions/ensure/`);

/**
 * 진행 중인 LIVE Session의 "가장 최신 센서 데이터 1건"을 조회
 * GET /api/sessions/{session_id}/latest-reading/
 *
 * ── 언제 호출? ────────────────────────────────────────────
 * ensureLiveSession()으로 받은 polling_interval_seconds(기본 2초)에 맞춰
 * 이 함수를 setInterval처럼 "반복 호출"해서 화면을 실시간으로 갱신합니다.
 * (실제 폴링 로직은 이 함수를 감싸는 훅에서 만들 예정 — 이 함수는 "1번 호출"만 담당)
 *
 * ── 응답을 화면에 쓸 때 주의할 점 ──────────────────────────────
 * 1) raw 값(temperature, strap_load, load_bias 등)을 직접 계산해서 쓰지 말 것.
 *    → presentation.values 안에 이미 %, kg 단위로 정규화된 값이 들어있습니다.
 *    → 예: 우측 하중 %가 필요하면 load_bias로 직접 계산하지 말고
 *      presentation.values.right_load_percent를 그대로 쓰세요.
 *
 * 2) Home 화면에 보여줄 "핵심 3개 지표"는 제품(Product A/B)마다 다릅니다.
 *    → 어떤 필드를 보여줄지 프론트에서 하드코딩해서 분기하지 말고,
 *      presentation.display_metrics 배열을 그대로 순회하며 렌더링하세요.
 *
 * 3) presentation.state는 Home 상단의 안내 문구(헤드라인/설명/케어 방법)를
 *    그대로 채워주는 필드입니다.
 *
 * 4) is_finished가 true로 오면 그 즉시 폴링(반복 호출)을 멈춰야 합니다.
 *    (세션이 종료됐다는 뜻이라, 이후에는 더 호출해도 새 데이터가 없습니다)
 *
 * ── 실패 응답(404) ──────────────────────────────────────────────
 * - session_id 자체가 존재하지 않는 경우: { detail: "존재하지 않는 세션입니다." }
 * - 세션은 있는데 아직 첫 데이터가 안 쌓인 경우: { detail: "아직 생성된 데이터가 없습니다." }
 *   → 폴링 시작 직후 아주 잠깐(첫 1~2회) 이 에러가 날 수 있으므로,
 *     화면에서 바로 에러 UI를 띄우기보다는 "로딩 중"으로 처리하고
 *     다음 폴링에서 정상 데이터가 오는지 한 번 더 기다려주는 게 좋습니다.
 *
 * @param {number} sessionId - ensureLiveSession()에서 받은 session_id
 * @returns {Promise<{
 *   session_id: number,
 *   sequence: number,
 *   measured_at: string,
 *   observed_at: string,
 *   scenario_type: string,
 *   progress_ratio: number,
 *   is_finished: boolean,
 *   moisture_detected: boolean,
 *   strap_load: number,
 *   humidity: number,
 *   temperature: number,
 *   load_bias: number,
 *   body_deformation_ratio: number,
 *   material_moisture_percent: number | null,
 *   presentation: {
 *     values: {
 *       total_load_kg: number,
 *       bias_magnitude_percent: number,
 *       left_load_percent: number,
 *       right_load_percent: number,
 *       shape_deviation_percent: number,
 *       temperature_c: number,
 *       internal_humidity_percent: number,
 *       material_moisture_percent: number | null,
 *     },
 *     display_metrics: Array<{
 *       key: string,
 *       label: string,
 *       value: number,
 *       unit: string,
 *     }>,
 *     state: {
 *       code: string,
 *       primary_rule: string,
 *       active_rules: string[],
 *       unavailable_rules: string[],
 *       headline: string,
 *       description: string,
 *       quick_care: string,
 *       theme_key: string,
 *     } | null,
 *   },
 * }>}
 */
export const getLatestReading = (sessionId) =>
  client.get(`/sessions/${sessionId}/latest-reading/`);
