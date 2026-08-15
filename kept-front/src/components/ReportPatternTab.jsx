// 리포트 '패턴분석' 탭 (3.3 AI 사용 패턴 분석)
// 최근 사용 기록을 바탕으로 한 변화 요약과 주의할 점을 보여준다
function ReportPatternTab({ insight }) {
  return (
    <div className="px-6 pb-[55px] pt-5">
      <h2 className="text-[20px] font-bold leading-[1.4] tracking-[-0.03em] text-gray-90">
        {insight.headline}
      </h2>

      <p className="mt-2 text-[14px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-60">
        {insight.description}
      </p>

      {/* 주요 변화 요약 */}
      <div className="mt-6">
        <p className="text-[15px] font-bold leading-[1.5] tracking-[-0.01em] text-gray-90">
          주요 변화 요약
        </p>

        <ul className="mt-3 flex flex-col gap-2">
          {insight.changes.map((change) => (
            <li
              key={change.id}
              className="flex items-center justify-between rounded-2xl bg-gray-5 px-4 py-3.5"
            >
              <div>
                <p className="text-[14px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-80">
                  {change.label}
                </p>
                <p className="mt-0.5 text-[12px] leading-[1.5] tracking-[-0.01em] text-gray-50">
                  {change.description}
                </p>
              </div>

              {/* 변화 방향(상승/하락)에 따라 색을 다르게 표시 */}
              <span
                className={`shrink-0 text-[15px] font-bold leading-[1.4] ${
                  change.direction === "up" ? "text-main-2" : "text-gray-60"
                }`}
              >
                {change.direction === "up" ? "▲" : "▼"} {change.changeText}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* 주의할 점 */}
      <div className="mt-6">
        <p className="text-[15px] font-bold leading-[1.5] tracking-[-0.01em] text-gray-90">
          주의할 점
        </p>

        <ul className="mt-3 flex flex-col gap-2">
          {insight.cautions.map((caution) => (
            <li
              key={caution}
              className="rounded-xl bg-main-1/5 px-4 py-3 text-[13px] leading-[1.6] tracking-[-0.01em] text-gray-70"
            >
              {caution}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ReportPatternTab;
