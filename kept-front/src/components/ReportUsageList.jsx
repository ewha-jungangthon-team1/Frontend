import { USAGE_DATA_NOTICE } from "../hooks/useReportData";

// 리포트 '사용 기록' 탭 (3.2.1 주요 사용 지표 제공)
// metrics.daily_series(최근 7일)를 최신순으로 보여주고, 각 항목을 클릭하면 상세 화면으로 이동한다
// Figma 스펙: 흰색 rounded-lg 카드 + 얇은 컬럼 구분선, 카드 사이 10px 간격
function ReportUsageList({ records, onSelectRecord }) {
  return (
    <div className="px-6 pb-[55px] pt-5">
      <p className="text-[13px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-30">
        최근 7일
      </p>

      {/* 사용 기록 목록 */}
      <ul className="mt-4 flex flex-col gap-2.5">
        {records.map((record) => (
          <li key={record.id}>
            <button
              type="button"
              onClick={() => onSelectRecord(record.id)}
              className="w-full rounded-lg bg-white px-5 py-4 text-left"
            >
              <div className="flex items-start justify-between">
                <p className="text-[16px] font-bold leading-[1.5] tracking-[-0.01em] text-gray-100">
                  {record.date}
                </p>
                <img
                  src="/icons/right.svg"
                  alt=""
                  className="size-6 shrink-0"
                />
              </div>

              <div className="mt-2.5 flex items-center">
                <div className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[13px] font-light leading-[1.5] tracking-[-0.01em] text-gray-60">
                    하중
                  </span>
                  <span className="text-[16px] font-bold leading-[1.5] tracking-[-0.01em] text-gray-90">
                    {record.loadKg}kg
                  </span>
                </div>

                <span className="h-11 w-px bg-gray-20" />

                <div className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[13px] font-light leading-[1.5] tracking-[-0.01em] text-gray-60">
                    변형 누적
                  </span>
                  <span className="text-[16px] font-bold leading-[1.5] tracking-[-0.01em] text-gray-90">
                    {record.deformationPercent}%
                  </span>
                </div>

                <span className="h-11 w-px bg-gray-20" />

                <div className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[13px] font-light leading-[1.5] tracking-[-0.01em] text-gray-60">
                    수분 노출
                  </span>
                  <span className="text-[16px] font-bold leading-[1.5] tracking-[-0.01em] text-gray-90">
                    {record.moistureDetected ? "노출" : "안전"}
                  </span>
                </div>
              </div>
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
      <p className="mt-5 text-center text-[13px] font-light leading-[1.6] tracking-[-0.01em] text-gray-30/70">
        {USAGE_DATA_NOTICE[0]}
        <br />
        {USAGE_DATA_NOTICE[1]}
      </p>
    </div>
  );
}

export default ReportUsageList;
