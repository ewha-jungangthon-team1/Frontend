import useReportNavigation from "../hooks/useReportNavigation";
import useReportData from "../hooks/useReportData";
import ReportNavBar from "../components/ReportNavBar";
import ReportRecentTab from "../components/ReportRecentTab";
import ReportUsageList from "../components/ReportUsageList";
import ReportUsageDetail from "../components/ReportUsageDetail";
import ReportPatternTab from "../components/ReportPatternTab";

// Report 기능 전체(최근/사용 기록/사용 기록 상세/형태 분석)가 공유하는 배경
function ReportBackground() {
  return (
    <img
      src="/images/3-reportimage.png"
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
    />
  );
}

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
    // Home / Care와 동일한 레이아웃 방식 (393px 폭 모바일 프레임, mx-auto로 중앙 정렬)
    <main className="relative mx-auto h-dvh w-full max-w-[393px] overflow-hidden bg-white">
      <ReportBackground />

      <div className="relative z-10 flex h-full min-h-0 flex-col">
        {selectedRecord ? (
          // 사용기록 상세(3.2.2): 탭 내비바 대신 뒤로가기 헤더를 보여준다
          <div className="h-full overflow-y-auto overscroll-contain touch-pan-y">
            <ReportUsageDetail
              record={selectedRecord}
              report={report}
              onBack={closeUsageDetail}
            />
          </div>
        ) : (
          <>
            {/* 공통 내비바: 제목 + 메뉴 + 탭(최근/사용 기록/형태 분석) */}
            <div className="shrink-0">
              <ReportNavBar
                activeTab={activeTab}
                onChangeTab={changeTab}
                onOpenMenu={onOpenMenu}
              />
            </div>

            {/* 배경은 고정하고 탭별 카드·문구 영역만 스크롤한다 */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain touch-pan-y">
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
      </div>
    </main>
  );
}

export default Report;
