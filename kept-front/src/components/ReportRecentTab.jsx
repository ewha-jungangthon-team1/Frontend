import { useState } from "react";
import MetricGraph from "./MetricGraph";
import { RECENT_CHART_TABS } from "../hooks/useReportData";

// 리포트 '최근' 탭 (3.1 최근 리포트)
// AI 요약 헤드라인 + 하중/형태/환경 서브탭 그래프 + 최근 사용 기록(2x2) 카드를 보여준다
function ReportRecentTab({ summary }) {
  const [activeChart, setActiveChart] = useState(RECENT_CHART_TABS[0].id);

  const chart = summary.charts[activeChart];

  return (
    <div className="px-6 pb-[55px] pt-5">
      <p className="text-[13px] leading-[1.5] tracking-[-0.01em] text-gray-30">
        최근 7일 요약
      </p>

      <h2 className="mt-2 text-[18px] font-bold leading-[1.5] tracking-[-0.03em] text-gray-90">
        {summary.headline}
      </h2>

      {/* 하중 / 형태 / 환경 서브탭 */}
      <div className="mt-5 flex gap-1">
        {RECENT_CHART_TABS.map((tab) => {
          const isActive = tab.id === activeChart;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveChart(tab.id)}
              className={`relative px-2.5 py-1.5 text-[14px] leading-[1.5] tracking-[-0.01em] ${
                isActive
                  ? "border-b border-gray-90 font-medium text-gray-90"
                  : "font-light text-gray-50"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 선택된 서브탭의 최근 7일 추이 그래프 */}
      <div className="mt-4">
        <p className="text-[24px] font-bold leading-[1.32] tracking-[-0.03em] text-gray-90">
          {chart.latestDisplayValue}
        </p>

        <div className="mt-3">
          {chart.points.length > 0 ? (
            <MetricGraph points={chart.points} variant="line" />
          ) : (
            <p className="py-10 text-center text-[13px] text-gray-40">
              표시할 데이터가 없어요
            </p>
          )}
        </div>
      </div>

      {/* 최근 사용 기록 요약 카드 (2x2) */}
      <div className="mt-6">
        <p className="text-[13px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-30">
          최근 사용 기록
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {summary.stats.map((stat) => (
            <div key={stat.label} className="rounded-lg bg-gray-5 px-4 py-3">
              <p className="text-[13px] leading-[1.5] tracking-[-0.01em] text-gray-90">
                {stat.label}
                {stat.sublabel && (
                  <span className="ml-1 text-[13px] text-black/50">
                    {stat.sublabel}
                  </span>
                )}
              </p>
              <p className="mt-1 text-[22px] font-bold leading-[1.5] tracking-[-0.03em] text-gray-100">
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
