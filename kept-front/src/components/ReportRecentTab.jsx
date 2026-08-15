import MetricGraph from "./MetricGraph";

// 리포트 '최근' 탭 (3.1 최근 리포트)
// 최근 7일 요약 문구 + 대표 그래프 + 주요 지표 카드를 보여준다
function ReportRecentTab({ summary }) {
  return (
    <div className="px-6 pb-[55px] pt-5">
      <p className="text-[13px] leading-[1.5] tracking-[-0.01em] text-gray-50">
        {summary.updatedAt}
      </p>

      <h2 className="mt-2 text-[22px] font-bold leading-[1.4] tracking-[-0.03em] text-gray-90">
        {summary.headline}
        <br />
        {summary.highlight}
      </h2>

      <p className="mt-2 text-[14px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-60">
        {summary.description}
      </p>

      {/* 최근 7일 대표 그래프 (홈 화면과 같은 온도 데이터를 재사용) */}
      <div className="mt-6 rounded-2xl bg-gray-5 p-5">
        <p className="text-[13px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-50">
          {summary.graphMetric.drawerTitle}
        </p>

        <p className="mt-1 text-[24px] font-bold leading-[1.32] tracking-[-0.03em] text-gray-90">
          {summary.graphMetric.displayValue}
        </p>

        <div className="mt-4">
          <MetricGraph
            points={summary.graphMetric.points}
            yAxisLabels={summary.graphMetric.yAxisLabels}
            unit={summary.graphMetric.unit}
          />
        </div>
      </div>

      {/* 최근 사용 기록 요약 카드 */}
      <div className="mt-6">
        <p className="text-[15px] font-bold leading-[1.5] tracking-[-0.01em] text-gray-90">
          최근 사용 기록
        </p>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {summary.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-gray-5 px-3 py-4 text-center"
            >
              <p className="text-[12px] leading-[1.5] tracking-[-0.01em] text-gray-50">
                {stat.label}
              </p>
              <p className="mt-1 text-[16px] font-bold leading-[1.4] tracking-[-0.01em] text-gray-90">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReportRecentTab;
