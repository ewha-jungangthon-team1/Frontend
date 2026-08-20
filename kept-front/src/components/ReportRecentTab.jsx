import { useState } from "react";
import MetricGraph from "./MetricGraph";
import { RECENT_CHART_TABS } from "../hooks/useReportData";

// 리포트 '최근' 탭 (3.1 최근 리포트)
// AI 요약 헤드라인 + 하중/형태/환경 서브탭 그래프 + 최근 사용 기록(2x2) 카드를 보여준다
function ReportRecentTab({ summary }) {
  const [activeChart, setActiveChart] = useState(RECENT_CHART_TABS[0].id);

  const chart = summary.charts[activeChart];
  const headlineSentences = summary.headline.split(/(?<=[.!?])\s+/);

  return (
    <div className="px-6 pb-[55px] pt-5">
      <p className="text-[13px] leading-[1.5] tracking-[-0.01em] text-gray-30">
        최근 7일 요약
      </p>

      <h2 className="mt-2 max-w-[262px] break-keep text-[18px] font-bold leading-[1.5] tracking-[-0.03em] text-gray-90">
        {headlineSentences.map((sentence, index) => (
          <span key={`${sentence}-${index}`} className="block">
            {sentence}
          </span>
        ))}
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
        <div>
          {chart.points.length > 0 ? (
            <MetricGraph
              key={activeChart}
              points={chart.points}
              variant="line"
              unit={chart.unit}
              yAxisTicks={chart.yAxisTicks}
            />
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

        <div className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2.5">
          {summary.stats.map((stat) => (
            <div
              key={stat.label}
              className="h-[97px] rounded-lg bg-white px-6 py-5"
            >
              <p className="text-[13px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-90">
                {stat.label}
              </p>

              <div className="mt-0.5 flex items-baseline gap-1">
                <p className="font-['Apple_SD_Gothic_Neo'] text-[22px] font-bold leading-[1.5] tracking-[-0.03em] text-gray-100">
                  {stat.value}
                </p>

                {stat.sublabel && (
                  <span className="text-[13px] font-light leading-[1.5] tracking-[-0.01em] text-black/50">
                    {stat.sublabel}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReportRecentTab;
