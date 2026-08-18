import { useState } from "react";

// 리포트 화면 상단 탭 목록
export const REPORT_TABS = [
  { id: "recent", label: "최근" },
  { id: "history", label: "사용기록" },
  { id: "pattern", label: "패턴분석" },
];

// 리포트 화면의 탭 전환과, 사용기록 목록 -> 상세 화면 이동 상태를 함께 관리하는 훅
function useReportNavigation() {
  // 현재 활성화된 탭 (기본값: 최근)
  const [activeTab, setActiveTab] = useState("recent");

  // 사용기록 상세로 들어갔을 때 선택된 기록의 id (없으면 목록 화면)
  const [selectedUsageId, setSelectedUsageId] = useState(null);

  // 탭을 전환하면 열려 있던 사용기록 상세는 자동으로 닫는다
  const changeTab = (tabId) => {
    setActiveTab(tabId);
    setSelectedUsageId(null);
  };

  // 사용 기록 목록에서 날짜(항목)를 클릭했을 때 상세 화면을 연다
  const openUsageDetail = (usageId) => {
    setSelectedUsageId(usageId);
  };

  // 상세 화면에서 뒤로가기: 다시 사용 기록 목록으로 돌아간다
  const closeUsageDetail = () => {
    setSelectedUsageId(null);
  };

  return {
    activeTab,
    changeTab,
    selectedUsageId,
    openUsageDetail,
    closeUsageDetail,
  };
}

export default useReportNavigation;
