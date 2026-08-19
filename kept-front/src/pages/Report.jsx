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

  // GET /api/bags/{token}/reports/latest/ 하나로 리포트 화면 전체를 구성한다
  const {
    isLoading,
    isError,
    isEmpty,
    report,
    recentSummary,
    usageRecords,
    patternInsight,
  } = useReportData();

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
            careComment={report?.ai_result?.content?.care_comment}
            onBack={closeUsageDetail}
          />
        ) : (
          <>
            {/* 공통 내비바: 제목 + 메뉴 + 탭(최근/사용 기록/형태 분석) */}
            <ReportNavBar
              activeTab={activeTab}
              onChangeTab={changeTab}
              onOpenMenu={onOpenMenu}
            />

            {/* 탭별 콘텐츠 영역 (스크롤 가능) */}
            <div className="flex-1 overflow-y-auto">
              {isLoading && (
                <p className="px-6 pt-10 text-center text-[13px] text-gray-40">
                  리포트를 불러오고 있어요...
                </p>
              )}

              {isEmpty && !isLoading && (
                <p className="px-6 pt-10 text-center text-[13px] leading-[1.6] text-gray-40">
                  아직 완료된 리포트가 없어요.
                  <br />
                  가방을 사용하면 리포트가 생성돼요.
                </p>
              )}

              {isError && !isLoading && (
                <p className="px-6 pt-10 text-center text-[13px] leading-[1.6] text-gray-40">
                  리포트를 불러오지 못했어요.
                  <br />
                  잠시 후 다시 시도해 주세요.
                </p>
              )}

              {report && (
                <>
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
                </>
              )}
            </div>
          </>
        )}
      </main>
    </ScreenFrame>
  );
}

export default Report;
