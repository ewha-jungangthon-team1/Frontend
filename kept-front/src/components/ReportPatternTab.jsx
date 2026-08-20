const CHANGE_ICONS = {
  loadBias: "/icons/report-load-bias.svg",
  overload: "/icons/report-overload.svg",
  deformation: "/icons/report-deformation.svg",
};

const CHANGE_ICON_SIZES = {
  loadBias: "size-4",
  overload: "size-[17px]",
  deformation: "size-[13px]",
};

const CHANGE_LABELS = {
  loadBias: "하중 편중",
  overload: "과부하\n발생 횟수",
  deformation: "변형\n누적량",
};

function formatChangeNumber(value) {
  if (value == null || Number.isNaN(Number(value))) return "-";

  return Number(value)
    .toFixed(2)
    .replace(/\.00$/, "")
    .replace(/(\.\d)0$/, "$1");
}

// 리포트 '형태 분석' 탭 (3.3 AI 사용 패턴 분석)
// ai_result.content(패턴 인사이트) + comparison.metrics(이전 7일 대비 변화)를 보여준다
function ReportPatternTab({ insight }) {
  return (
    <div className="px-6 pb-[55px] pt-5">
      {/* AI 인사이트 */}
      <div className="relative h-[188px] overflow-hidden rounded-lg bg-white">
        <img
          src="/images/report-bag.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 top-0 h-auto w-[210px] object-contain opacity-10"
        />

        <div className="relative z-10 flex items-center gap-[6px] px-5 pt-5">
          <img
            src="/icons/report-ai.svg"
            alt=""
            className="h-[21px] w-[19px] shrink-0"
          />
          <p className="text-[18px] font-bold leading-[1.5] tracking-[-0.03em] text-gray-100">
            <span className="font-medium">AI</span> 인사이트
          </p>
        </div>
        <p className="relative z-10 mt-3 px-4 text-[15px] leading-[1.5] tracking-[-0.01em] text-gray-60">
          {insight.description}
        </p>
      </div>

      {/* 주요 변화 요약 (이전 7일 대비) */}
      <div className="mt-2 rounded-lg bg-white px-[23px] py-[25px]">
        <div className="flex items-center justify-between">
          <p className="text-[18px] font-bold leading-[1.5] tracking-[-0.03em] text-gray-100">
            주요 변화 요약
          </p>
          <div className="flex items-center gap-3 text-[13px] text-black/50">
            <span className="flex items-center gap-1">
              <span className="size-2.5 bg-gray-100" />
              현재 사용
            </span>
            <span className="flex items-center gap-1">
              <span className="size-2.5 bg-gray-20" />
              평소
            </span>
          </div>
        </div>

        {insight.comparisonAvailable ? (
          <ul className="mt-[19px] flex flex-col gap-[17px]">
            {insight.changes.map((change) => {
              const { metric } = change;
              const maxAbs = Math.max(
                Math.abs(metric.current ?? 0),
                Math.abs(metric.previous ?? 0),
                1,
              );
              const currentWidth = `${(Math.abs(metric.current ?? 0) / maxAbs) * 100}%`;
              const previousWidth = `${(Math.abs(metric.previous ?? 0) / maxAbs) * 100}%`;
              const rawChange =
                metric.change_percent != null
                  ? metric.change_percent
                  : metric.change;
              const formattedChange = formatChangeNumber(rawChange);
              const isUp = (rawChange ?? 0) >= 0;

              return (
                <li
                  key={change.id}
                  className="grid min-h-10 grid-cols-[17px_60px_minmax(0,1fr)_54px] items-center gap-x-2"
                >
                  <img
                    src={CHANGE_ICONS[change.id]}
                    alt=""
                    className={`${CHANGE_ICON_SIZES[change.id] ?? "size-4"} justify-self-center object-contain`}
                  />
                  <span className="whitespace-pre-line text-[13px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-100">
                    {CHANGE_LABELS[change.id] ?? change.label}
                  </span>
                  <div className="flex w-full max-w-[114px] min-w-0 flex-col gap-1">
                    <span
                      className="block h-2.5 bg-gray-100"
                      style={{ width: currentWidth }}
                    />
                    <span
                      className="block h-2.5 bg-gray-20"
                      style={{ width: previousWidth }}
                    />
                  </div>
                  <span className="text-right font-['Apple_SD_Gothic_Neo'] text-[15px] font-semibold leading-[1.5] tracking-[-0.01em] text-gray-90">
                    {formattedChange !== "-" && isUp ? "+" : ""}
                    {formattedChange}
                    {formattedChange !== "-" &&
                    metric.change_percent != null
                      ? "%"
                      : ""}
                  </span>
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
        <div className="mt-2 rounded-lg bg-white px-5 py-5">
          <div className="flex items-center gap-2">
            <img
              src="/icons/report-caution.svg"
              alt=""
              className="size-4 shrink-0 object-contain"
            />
            <p className="text-[18px] font-bold leading-[1.5] tracking-[-0.03em] text-gray-100">
              주의할 점
            </p>
          </div>
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
