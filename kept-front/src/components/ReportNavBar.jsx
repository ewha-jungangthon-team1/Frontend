import PageHeader from "./PageHeader";
import ReportTabs from "./ReportTabs";

// 리포트 화면 최상단 공통 내비바: 제목 + 메뉴 버튼 + 탭(최근/사용기록/패턴분석)
// 3.1(최근), 3.2.1(사용기록 목록), 3.3(패턴분석) 화면에서 공통으로 사용한다
// 사용기록 상세(3.2.2) 화면에서는 이 대신 DetailHeader(뒤로가기 헤더)를 사용한다
function ReportNavBar({ activeTab, onChangeTab, onOpenMenu }) {
  return (
    <div className="relative z-10">
      <PageHeader title="Report" onOpenMenu={onOpenMenu} />

      <div className="mt-4">
        <ReportTabs activeTab={activeTab} onChangeTab={onChangeTab} />
      </div>
    </div>
  );
}

export default ReportNavBar;
