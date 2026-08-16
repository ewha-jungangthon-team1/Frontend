import DetailHeader from "./DetailHeader";
import MetricGraph from "./MetricGraph";
import { USAGE_DATA_NOTICE } from "../hooks/useReportData";

// 리포트 '사용기록 상세' 화면 (3.2.2)
// 사용 기록 목록에서 선택한 날짜 하나의 지표별 상세 그래프를 보여준다
function ReportUsageDetail({ record, onBack }) {
  return (
    <div className="h-full overflow-y-auto pb-[55px]">
      <DetailHeader title="사용 기록 상세" onBack={onBack} />

      <div className="px-6 pt-2">
        <p className="text-[15px] font-bold leading-[1.5] tracking-[-0.01em] text-gray-90">
          {record.date}
        </p>
        <p className="mt-0.5 text-[13px] leading-[1.5] tracking-[-0.01em] text-gray-50">
          {record.timeRange}
        </p>

        {/* 지표별 상세 그래프 (온도 / 우측 하중 / 형태 편차) */}
        <div className="mt-5 flex flex-col gap-4">
          {record.metrics.map((metric) => (
            <div key={metric.id} className="rounded-2xl bg-gray-5 p-5">
              <p className="text-[13px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-50">
                {metric.drawerTitle}
              </p>
              <p className="mt-1 text-[22px] font-bold leading-[1.32] tracking-[-0.03em] text-gray-90">
                {metric.displayValue}
              </p>

              <div className="mt-4">
                <MetricGraph
                  points={metric.points}
                  yAxisLabels={metric.yAxisLabels}
                  unit={metric.unit}
                />
              </div>
            </div>
          ))}
        </div>

        {/* AI 코멘트 */}
        <div className="mt-5 rounded-2xl bg-main-1/5 p-4">
          <p className="text-[13px] font-bold leading-[1.5] tracking-[-0.01em] text-main-2">
            AI 코멘트
          </p>
          <p className="mt-1 text-[13px] leading-[1.6] tracking-[-0.01em] text-gray-70">
            이 시간대에는 온도와 우측 하중이 함께 높아지는 패턴이 있었어요. 사용
            후에는 서늘한 곳에서 형태를 정돈해 주세요.
          </p>
        </div>

        {/* 안내 문구 */}
        <p className="mt-5 text-center text-[12px] leading-[1.6] tracking-[-0.01em] text-gray-30">
          {USAGE_DATA_NOTICE[0]}
          <br />
          {USAGE_DATA_NOTICE[1]}
        </p>
      </div>
    </div>
  );
}

export default ReportUsageDetail;
