import DetailHeader from "./DetailHeader";
import { USAGE_DATA_NOTICE } from "../hooks/useReportData";

// 하루치 상태를 간단한 규칙으로 요약하는 문구
// (API는 리포트 단위의 AI 코멘트만 제공하고, 날짜별 상태 요약은 내려주지 않아서
//  presentation 값을 바탕으로 화면단에서 간단히 만들어준다)
function buildStatusSummary({ presentation, moistureDetected }) {
  if (moistureDetected) {
    return "이 날은 소재에서 수분이 감지됐어요.";
  }
  if (presentation.bias_magnitude_percent >= 10) {
    return "이 날은 한쪽으로 하중이 쏠린 상태로 사용됐어요.";
  }
  if (presentation.shape_deviation_percent >= 5) {
    return "이 날은 형태 편차가 평소보다 크게 나타났어요.";
  }
  return "특별한 이상 없이 안정적으로 사용됐어요.";
}

// 리포트 '사용 기록 상세' 화면 (3.2.2)
// 사용 기록 목록에서 선택한 날짜 하나의 상세 지표를 보여준다
// careComment: 리포트 단위 AI 코멘트(ai_result.content.care_comment).
//   API가 날짜별 AI 코멘트를 별도로 제공하지 않아, 리포트 전체 코멘트를 함께 보여준다
function ReportUsageDetail({ record, careComment, onBack }) {
  const { presentation } = record;

  const detailRows = [
    { label: "하중", value: `${presentation.total_load_kg}kg` },
    {
      label: "좌/우 하중",
      value: `${presentation.left_load_percent}% / ${presentation.right_load_percent}%`,
    },
    { label: "형태 편차", value: `${presentation.shape_deviation_percent}%` },
    { label: "온도", value: `${presentation.temperature_c}°C` },
    { label: "내부 습도", value: `${presentation.internal_humidity_percent}%` },
    {
      label: "수분 노출",
      value: record.moistureDetected ? "노출" : "안전",
    },
  ];

  return (
    <div className="h-full overflow-y-auto pb-[55px]">
      <DetailHeader title="사용 기록 상세" onBack={onBack} />

      <div className="px-6 pt-2">
        <p className="text-[18px] font-bold leading-[1.5] tracking-[-0.03em] text-gray-90">
          {record.date}
        </p>

        {/* 상태 요약 */}
        <div className="mt-4 rounded-lg bg-gray-5 px-5 py-5">
          <p className="text-[18px] font-bold leading-[1.5] tracking-[-0.03em] text-gray-100">
            상태 요약
          </p>
          <p className="mt-2 text-[15px] leading-[1.5] tracking-[-0.01em] text-gray-90">
            {buildStatusSummary(record)}
          </p>
        </div>

        {/* 상세 지표 */}
        <div className="mt-4 rounded-lg bg-gray-5 px-5 py-5">
          <p className="text-[18px] font-bold leading-[1.5] tracking-[-0.03em] text-gray-100">
            상세지표
          </p>

          <ul className="mt-3 flex flex-col">
            {detailRows.map((row) => (
              <li
                key={row.label}
                className="flex items-center justify-between border-b border-gray-10 py-3 last:border-b-0"
              >
                <span className="text-[15px] leading-[1.5] tracking-[-0.01em] text-gray-100">
                  {row.label}
                </span>
                <span className="text-[16px] font-bold leading-[1.5] tracking-[-0.02em] text-gray-100">
                  {row.value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* AI 코멘트 (리포트 단위) */}
        {careComment && (
          <div className="mt-4 rounded-lg bg-gray-5 px-5 py-5">
            <p className="text-[18px] font-bold leading-[1.5] tracking-[-0.03em] text-gray-100">
              AI 코멘트
            </p>
            <p className="mt-2 text-[15px] leading-[1.5] tracking-[-0.01em] text-gray-90">
              {careComment}
            </p>
          </div>
        )}

        {/* 안내 문구 */}
        <p className="mt-5 text-center text-[12px] leading-[1.6] tracking-[-0.01em] text-gray-30/70">
          {USAGE_DATA_NOTICE[0]}
          <br />
          {USAGE_DATA_NOTICE[1]}
        </p>
      </div>
    </div>
  );
}

export default ReportUsageDetail;
