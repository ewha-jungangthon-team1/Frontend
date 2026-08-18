// 리포트 '형태 분석' 탭 (3.3 AI 사용 패턴 분석)
// ai_result.content(패턴 인사이트) + comparison.metrics(이전 7일 대비 변화)를 보여준다
function ReportPatternTab({ insight }) {
  return (
    <div className="px-6 pb-[55px] pt-5">
      {/* AI 인사이트 */}
      <div className="rounded-lg bg-gray-5 px-5 py-5">
        <p className="text-[18px] font-bold leading-[1.5] tracking-[-0.03em] text-gray-100">
          AI 인사이트
        </p>
        <p className="mt-3 text-[15px] leading-[1.5] tracking-[-0.01em] text-gray-60">
          {insight.description}
        </p>
      </div>

      {/* 주요 변화 요약 (이전 7일 대비) */}
      <div className="mt-4 rounded-lg bg-gray-5 px-5 py-5">
        <div className="flex items-center justify-between">
          <p className="text-[18px] font-bold leading-[1.5] tracking-[-0.03em] text-gray-100">
            주요 변화 요약
          </p>
          <div className="flex items-center gap-3 text-[13px] text-black/50">
            <span className="flex items-center gap-1">
              <span className="size-2.5 rounded-sm bg-gray-100" />
              현재 사용
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2.5 rounded-sm bg-gray-20" />
              평소
            </span>
          </div>
        </div>

        {insight.comparisonAvailable ? (
          <ul className="mt-4 flex flex-col gap-5">
            {insight.changes.map((change) => {
              const { metric } = change;
              const maxAbs = Math.max(
                Math.abs(metric.current ?? 0),
                Math.abs(metric.previous ?? 0),
                1,
              );
              const currentWidth = `${(Math.abs(metric.current ?? 0) / maxAbs) * 100}%`;
              const previousWidth = `${(Math.abs(metric.previous ?? 0) / maxAbs) * 100}%`;
              const isUp = (metric.change ?? 0) >= 0;

              return (
                <li key={change.id} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-100">
                        {change.label}
                      </span>
                      <span
                        className={`text-[15px] font-bold leading-[1.5] tracking-[-0.01em] ${
                          isUp ? "text-main-2" : "text-gray-60"
                        }`}
                      >
                        {isUp ? "+" : ""}
                        {metric.change_percent != null
                          ? `${metric.change_percent}%`
                          : metric.change}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-col gap-1">
                      <span
                        className="block h-2.5 rounded-sm bg-gray-100"
                        style={{ width: currentWidth }}
                      />
                      <span
                        className="block h-2.5 rounded-sm bg-gray-20"
                        style={{ width: previousWidth }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 text-[13px] leading-[1.6] text-gray-40">
            비교할 이전 7일 데이터가 아직 없어요.
          </p>
        )}
      </div>

      {/* 주의할 점 */}
      {insight.cautions.length > 0 && (
        <div className="mt-4 rounded-lg bg-gray-5 px-5 py-5">
          <p className="text-[18px] font-bold leading-[1.5] tracking-[-0.03em] text-gray-100">
            주의할 점
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {insight.cautions.map((caution) => (
              <li
                key={caution}
                className="text-[15px] leading-[1.5] tracking-[-0.01em] text-gray-90"
              >
                {caution}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ReportPatternTab;
