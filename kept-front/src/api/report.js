import client from "./client";

/**
 * 선택한 Bag의 "가장 최근 완료된 HISTORY Report"를 조회합니다.
 * GET /api/bags/{public_token}/reports/latest/
 *
 * Report 화면(최근 / 사용기록 / 사용기록 상세 / 형태 분석)은 기본적으로
 * 이 API 하나의 응답만으로 전부 구성됩니다.
 *
 * ── 선택 기준 (백엔드) ────────────────────────────────────────
 * 해당 Bag + purpose=HISTORY + status=COMPLETED + include_in_report=true
 * + ended_at 존재 + ended_at <= 현재 시각인 Report 중
 * ended_at DESC, started_at DESC, report.id DESC 순으로 가장 앞의 1건.
 *
 * ── 화면에서 반드시 지킬 것 ────────────────────────────────────
 * 1) 날짜는 source(period, daily_series.date, comparison.previous_period)가 아니라
 *    display 계열(display_period, daily_series.display_date,
 *    comparison.display_previous_period)을 사용할 것.
 * 2) comparison.available이 false면 비교 그래프/카드를 숨기거나
 *    "비교 데이터 없음"으로 처리할 것.
 * 3) ai_result가 {}(빈 객체)로 올 수 있으므로 AI 영역은 반드시 존재 여부를
 *    먼저 확인할 것. status는 "SUCCESS" | "FALLBACK" 둘 다 정상 노출 가능.
 *
 * ── 실패 응답 ──────────────────────────────────────────────────
 * 404: 조건을 만족하는 Report가 아직 없음
 *   { detail: "No eligible analysis report was found." }
 *
 * @param {string} publicToken - 선택된 Bag의 UUID (bagStore.publicToken)
 * @returns {Promise<{
 *   id: number,
 *   session_id: number,
 *   scenario_code: string,
 *   period: { started_at: string, ended_at: string, timezone: string },
 *   display_period: { start_date: string, end_date: string, timezone: string },
 *   metrics: {
 *     reading_count: number,
 *     load: { average_kg: number, max_kg: number, overload_detected_days: number | null },
 *     temperature: { average_c: number, max_c: number, high_temperature_detected_days: number | null },
 *     humidity: { average_percent: number, max_percent: number, high_humidity_detected_days: number | null },
 *     moisture: { detected_days: number | null, detected_any: boolean },
 *     load_bias: { max_absolute: number, latest: number, biased_days: number | null },
 *     deformation: { max_ratio: number, latest_ratio: number, deformation_detected_days: number | null },
 *     daily_series: Array<{
 *       date: string,
 *       display_date: string,
 *       load_kg: number,
 *       deformation_ratio: number,
 *       deformation_percent: number,
 *       moisture_detected: boolean,
 *       presentation: {
 *         total_load_kg: number,
 *         bias_magnitude_percent: number,
 *         left_load_percent: number,
 *         right_load_percent: number,
 *         shape_deviation_percent: number,
 *         temperature_c: number,
 *         internal_humidity_percent: number,
 *         material_moisture_percent: number | null,
 *       },
 *     }>,
 *   },
 *   charts: {
 *     load: Array<{ date: string, display_date: string, total_load_kg: number, left_load_percent: number, right_load_percent: number }>,
 *     shape: Array<{ date: string, display_date: string, shape_deviation_percent: number }>,
 *     environment: Array<{ date: string, display_date: string, temperature_c: number, internal_humidity_percent: number, material_moisture_percent: number | null }>,
 *   },
 *   comparison: {
 *     available: boolean,
 *     reason: "NO_PREVIOUS_PERIOD" | "AMBIGUOUS_PREVIOUS_PERIOD" | "INVALID_PERIOD_SHAPE" | null,
 *     previous_session_id: number | null,
 *     previous_period: { started_at: string, ended_at: string, timezone: string } | null,
 *     metrics: object | null,
 *     display_previous_period: { start_date: string, end_date: string, timezone: string },
 *   },
 *   ai_result: {} | {
 *     schema_version: number,
 *     status: "SUCCESS" | "FALLBACK",
 *     generated_at: string,
 *     provider: string,
 *     model: string | null,
 *     fallback_reason: string | null,
 *     content: {
 *       weekly_summary: string,
 *       care_comment: string,
 *       pattern_insight: string,
 *       priority_actions: string[],
 *     },
 *   },
 *   severity: string,
 *   active_rules: string[],
 *   unavailable_rules: string[],
 *   care_guideline_snapshot: object,
 *   created_at: string,
 *   updated_at: string,
 * }>}
 */
export const getLatestReport = (publicToken) =>
  client.get(`api/bags/${publicToken}/reports/latest/`);
