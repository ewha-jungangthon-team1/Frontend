import { REPORT_TABS } from "../hooks/useReportNavigation";

// 리포트 화면 상단의 탭(최근 / 사용기록 / 패턴분석) 전환 UI
function ReportTabs({ activeTab, onChangeTab }) {
  return (
    <div className="flex gap-5 border-b border-gray-10 px-6">
      {REPORT_TABS.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id)}
            className={`relative pb-3 text-[15px] leading-[1.5] tracking-[-0.01em] ${
              isActive ? "font-bold text-gray-90" : "font-medium text-gray-40"
            }`}
          >
            {tab.label}

            {/* 활성 탭 밑줄 */}
            {isActive && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-gray-90" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default ReportTabs;
