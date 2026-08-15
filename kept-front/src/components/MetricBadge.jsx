// 가방 이미지 위에 떠 있는 지표 배지 버튼
// 클릭하면 해당 지표의 상세 그래프 바텀시트가 열린다
function MetricBadge({ label, value, onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full bg-white/85 px-3 py-2 text-[13px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-70 shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${className}`}
    >
      {label} {value}
    </button>
  );
}

export default MetricBadge;
