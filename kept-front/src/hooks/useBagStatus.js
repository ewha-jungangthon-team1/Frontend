import { useState } from "react";

// 가방 상태 지표 목록
// 실제 서비스에서는 API 응답으로 대체될 데이터이며, 지금은 화면 확인용 더미 데이터
const METRICS = [
  {
    id: "temperature",
    label: "현재 온도",
    displayValue: "47°C",
    unit: "°C",
    drawerTitle: "측정 시작 후 온도 변화",
    yAxisLabels: [45, 40, 35, 30],
    points: [
      { time: "13:30", value: 29 },
      { time: "13:45", value: 31 },
      { time: "14:00", value: 34 },
      { time: "14:10", value: 39 },
      { time: "14:25", value: 44 },
      { time: "14:40", value: 47 },
    ],
  },
  {
    id: "rightLoad",
    label: "우측 하중",
    displayValue: "68%",
    unit: "%",
    drawerTitle: "측정 시작 후 하중 변화",
    yAxisLabels: [60, 50, 40, 30],
    points: [
      { time: "13:30", value: 32 },
      { time: "13:45", value: 38 },
      { time: "14:00", value: 45 },
      { time: "14:10", value: 55 },
      { time: "14:25", value: 63 },
      { time: "14:40", value: 68 },
    ],
  },
  {
    id: "shapeDeviation",
    label: "형태 편차",
    displayValue: "7%",
    unit: "%",
    drawerTitle: "측정 시작 후 형태 편차 변화",
    yAxisLabels: [6, 4, 2, 0],
    points: [
      { time: "13:30", value: 1 },
      { time: "13:45", value: 2 },
      { time: "14:00", value: 3 },
      { time: "14:10", value: 4 },
      { time: "14:25", value: 6 },
      { time: "14:40", value: 7 },
    ],
  },
];

// 홈 화면의 가방 상태 데이터와, 지표를 눌렀을 때 올라오는
// 그래프 바텀시트의 열림/닫힘 상태를 함께 관리하는 훅
function useBagStatus() {
  // 현재 선택된 지표의 id (선택된 것이 없으면 null)
  const [selectedMetricId, setSelectedMetricId] = useState(null);

  const selectedMetric =
    METRICS.find((metric) => metric.id === selectedMetricId) ?? null;

  // 지표 배지를 클릭하면 해당 지표를 선택해 바텀시트를 연다
  const openMetric = (metricId) => {
    setSelectedMetricId(metricId);
  };

  // 바텀시트를 닫는다
  const closeMetric = () => {
    setSelectedMetricId(null);
  };

  return { metrics: METRICS, selectedMetric, openMetric, closeMetric };
}

export default useBagStatus;
