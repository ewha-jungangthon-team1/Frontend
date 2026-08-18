import { USAGE_DATA_NOTICE } from "../hooks/useReportData";

// 리포트 '사용 기록' 탭 (3.2.1 주요 사용 지표 제공)
// metrics.daily_series(최근 7일)를 최신순으로 보여주고, 각 항목을 클릭하면 상세 화면으로 이동한다
function ReportUsageList({ records, onSelectRecord }) {
  return (
    <div className="px-6 pb-[55px] pt-5">
      <p className="text-[13px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-30">
        최근 7일
      </p>

      {/* 사용 기록 목록 */}
      <ul className="mt-4 flex flex-col gap-3">
        {records.map((record) => (
          <li key={record.id}>
            <button
              type="button"
              onClick={() => onSelectRecord(record.id)}
              className="flex w-full items-center justify-between rounded-lg bg-gray-5 px-5 py-4 text-left"
            >
              <div className="flex flex-1 flex-col gap-1">
                <p className="text-[16px] font-bold leading-[1.5] tracking-[-0.02em] text-gray-100">
                  {record.date}
                </p>

                <div className="flex items-center gap-3 text-[13px] leading-[1.5] tracking-[-0.01em] text-gray-60">
                  <span className="flex flex-col items-center">
                    <span>하중</span>
                    <span className="text-[16px] font-bold text-gray-90">
                      {record.loadKg}kg
                    </span>
                  </span>
                  <span className="h-6 w-px bg-gray-10" />
                  <span className="flex flex-col items-center">
                    <span>변형 누적</span>
                    <span className="text-[16px] font-bold text-gray-90">
                      {record.deformationPercent}%
                    </span>
                  </span>
                  <span className="h-6 w-px bg-gray-10" />
                  <span className="flex flex-col items-center">
                    <span>수분 노출</span>
                    <span className="text-[16px] font-bold text-gray-90">
                      {record.moistureDetected ? "노출" : "안전"}
                    </span>
                  </span>
                </div>
              </div>

              <img src="/icons/right.svg" alt="" className="size-6 shrink-0" />
            </button>
          </li>
        ))}
      </ul>

      {records.length === 0 && (
        <p className="mt-8 text-center text-[13px] leading-[1.6] text-gray-40">
          아직 표시할 사용 기록이 없어요
        </p>
      )}

      {/* 안내 문구 */}
      <p className="mt-5 text-center text-[12px] leading-[1.6] tracking-[-0.01em] text-gray-30/70">
        {USAGE_DATA_NOTICE[0]}
        <br />
        {USAGE_DATA_NOTICE[1]}
      </p>
    </div>
  );
}

export default ReportUsageList;
