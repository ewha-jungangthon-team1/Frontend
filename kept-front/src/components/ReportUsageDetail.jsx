import DetailHeader from "./DetailHeader";
import { USAGE_DATA_NOTICE } from "../hooks/useReportData";

// ⚠️ 평균하중 / 최대하중 관련 주의 (백엔드 문의
// API의 daily_series에는 하루당 하중 값이 1개(load_kg)만 있어서
// 그날의 평균/최대"라는 개념 자체가 없음, 현재 표시되는 항목은
//   - 평균하중 → 그날의 실제 측정값(record.loadKg)
//   - 최대하중 → 리포트 전체(7일) 중 최댓값(report.metrics.load.max_kg)

function buildDetailRows(record, report) {
  const comparisonLoad = report?.comparison?.available
    ? report.comparison.metrics?.load
    : null;

  return [
    {
      id: "average",
      icon: "/icons/bag_1.svg",
      label: "평균하중",
      value: `${record.loadKg}kg`,
      // "평소" 값: 지난 7일(이전 기간) 평균과 비교 (comparison.metrics.load 기준)
      caption:
        comparisonLoad?.previous != null
          ? `평소 ${comparisonLoad.previous}kg`
          : null,
    },
    {
      id: "max",
      icon: "/icons/bag_2.svg",
      label: "최대하중",
      // TODO: 하루 단위 최댓값이 아니라 리포트(7일) 전체 최댓값입니다 (백엔드 확인 대기)
      value: `${report.metrics.load.max_kg}kg`,
      caption:
        comparisonLoad?.previous != null
          ? `평소 ${comparisonLoad.previous}kg`
          : null,
    },
    {
      id: "deformation",
      icon: "/icons/pen.svg",
      label: "변형누적",
      value: `${record.deformationPercent}%`,
      // 명확한 안전/위험 임계값이 API에 없어 판정 문구는 아직 표시하지 않습니다
      caption: null,
    },
    {
      id: "moisture",
      icon: "/icons/waterdrop.svg",
      label: "수분 노출",
      value: record.moistureDetected ? "노출" : "안전",
      caption: null,
    },
  ];
}

// 리포트 '사용 기록 상세' 화면 (3.2.2)
// 사용 기록 목록에서 선택한 날짜 하나의 상세 지표를 보여준다
// report: careComment 등 리포트 단위 값을 함께 쓰기 위해 리포트 전체를 그대로 받는다
function ReportUsageDetail({ record, report, onBack }) {
  const detailRows = buildDetailRows(record, report);
  const careComment = report?.ai_result?.content?.care_comment;

  return (
    <div className="pb-[55px]">
      <DetailHeader title="사용 기록 상세" onBack={onBack} />

      <div className="px-6 pt-2">
        <p className="text-[18px] font-bold leading-[1.5] tracking-[-0.03em] text-gray-90">
          {record.date}
        </p>

        {/* 상태 요약 */}
        <div className="mt-4 rounded-lg bg-white px-5 py-5">
          <p className="text-[18px] font-bold leading-[1.5] tracking-[-0.03em] text-gray-100">
            상태 요약
          </p>
          <p className="mt-2 text-[15px] font-light leading-[1.5] tracking-[-0.01em] text-gray-90">
            {record.moistureDetected
              ? "소재에서 수분이 감지됐어요."
              : "특별한 이상 없이 안정적으로 사용됐어요."}
          </p>
        </div>

        {/* 상세지표 */}
        <div className="mt-4 rounded-lg bg-white px-5 py-5">
          <p className="text-[18px] font-bold leading-[1.5] tracking-[-0.03em] text-gray-100">
            상세지표
          </p>

          <ul className="mt-3 flex flex-col gap-[18px]">
            {detailRows.map((row) => (
              <li key={row.id} className="flex items-center gap-3">
                <img src={row.icon} alt="" className="size-4 shrink-0" />

                <span className="flex-1 text-[15px] font-light leading-[1.5] tracking-[-0.01em] text-gray-100">
                  {row.label}
                </span>

                <div className="flex flex-col items-end">
                  <span className="text-[16px] font-bold leading-[1.5] tracking-[-0.01em] text-gray-100">
                    {row.value}
                  </span>
                  {row.caption && (
                    <span className="text-[13px] font-light leading-[1.5] tracking-[-0.01em] text-gray-40">
                      {row.caption}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* AI 코멘트 (리포트 단위) */}
        {careComment && (
          <div className="mt-4 rounded-lg bg-white px-5 py-5">
            <p className="text-[18px] font-bold leading-[1.5] tracking-[-0.03em] text-gray-100">
              AI 코멘트
            </p>
            <p className="mt-2 text-[15px] font-light leading-[1.5] tracking-[-0.01em] text-gray-90">
              {careComment}
            </p>
          </div>
        )}

        {/* 안내 문구 */}
        <p className="mt-5 text-center text-[13px] font-light leading-[1.6] tracking-[-0.01em] text-gray-30/70">
          {USAGE_DATA_NOTICE[0]}
          <br />
          {USAGE_DATA_NOTICE[1]}
        </p>
      </div>
    </div>
  );
}

export default ReportUsageDetail;
