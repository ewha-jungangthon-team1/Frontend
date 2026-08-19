import { REPORT_TABS } from "../hooks/useReportNavigation";

// 리포트 화면 상단의 탭(최근 / 사용 기록 / 형태 분석) 전환 UI
// Figma의 세그먼트 컨트롤(회색 트랙 + 진한 알약 모양 활성 탭) 스타일을 따른다
function ReportTabs({ activeTab, onChangeTab }) {
  return (
    <div className="flex gap-2 rounded-lg bg-gray-5 p-1 mx-6">
      {REPORT_TABS.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id)}
            className={`flex-1 rounded-lg px-[8px] py-[8px] text-[15px] leading-[1.5] tracking-[-0.01em] transition-colors ${
              isActive
                ? "bg-gray-80 font-bold text-white"
                : "font-medium text-gray-60"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default ReportTabs;
