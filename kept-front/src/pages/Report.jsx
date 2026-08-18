import useReportNavigation from "../hooks/useReportNavigation";
import useReportData from "../hooks/useReportData";
import ScreenFrame from "../components/ScreenFrame";
import ReportNavBar from "../components/ReportNavBar";
import ReportRecentTab from "../components/ReportRecentTab";
import ReportUsageList from "../components/ReportUsageList";
import ReportUsageDetail from "../components/ReportUsageDetail";
import ReportPatternTab from "../components/ReportPatternTab";

function Report({ onOpenMenu }) {
  // 탭 전환 + 사용기록 상세 진입/이탈 상태
  const {
    activeTab,
    changeTab,
    selectedUsageId,
    openUsageDetail,
    closeUsageDetail,
  } = useReportNavigation();

  // 리포트에서 사용하는 데이터 (홈 화면 지표를 재사용)
  const { recentSummary, usageRecords, patternInsight } = useReportData();

  // 사용기록 탭에서 선택된 날짜의 상세 기록
  const selectedRecord = usageRecords.find(
    (record) => record.id === selectedUsageId,
  );

  return (
    // 393 x 852 기준 화면 (Home과 동일하게 웹에서는 확대, 폰에서는 원래 크기)
    <ScreenFrame>
      <main className="relative flex h-full w-full flex-col overflow-hidden bg-white">
        {selectedRecord ? (
          // 사용기록 상세(3.2.2): 탭 내비바 대신 뒤로가기 헤더를 보여준다
          <ReportUsageDetail
            record={selectedRecord}
            onBack={closeUsageDetail}
          />
        ) : (
          <>
            {/* 공통 내비바: 제목 + 메뉴 + 탭(최근/사용기록/패턴분석) */}
            <ReportNavBar
              activeTab={activeTab}
              onChangeTab={changeTab}
              onOpenMenu={onOpenMenu}
            />

            {/* 탭별 콘텐츠 영역 (스크롤 가능) */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === "recent" && (
                <ReportRecentTab summary={recentSummary} />
              )}

              {activeTab === "history" && (
                <ReportUsageList
                  records={usageRecords}
                  onSelectRecord={openUsageDetail}
                />
              )}

              {activeTab === "pattern" && (
                <ReportPatternTab insight={patternInsight} />
              )}
            </div>
          </>
        )}
      </main>
    </ScreenFrame>
  );
}

export default Report;
