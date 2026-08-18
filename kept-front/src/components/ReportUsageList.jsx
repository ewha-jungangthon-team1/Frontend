import { USAGE_DATA_NOTICE } from "../hooks/useReportData";

// 리포트 '사용기록' 탭 (3.2.1 사용 기록 목록)
// 최신순으로 정렬된 사용 기록을 보여주고, 각 항목을 클릭하면 상세 화면으로 이동한다
function ReportUsageList({ records, onSelectRecord }) {
  return (
    <div className="px-6 pb-[55px] pt-5">
      <p className="text-[15px] font-bold leading-[1.5] tracking-[-0.01em] text-gray-90">
        사용 기록
      </p>

      <p className="mt-1 text-[13px] leading-[1.5] tracking-[-0.01em] text-gray-50">
        최근 사용한 순서대로 보여드려요.
      </p>

      {/* 사용 기록 목록 */}
      <ul className="mt-4 flex flex-col gap-3">
        {records.map((record) => (
          <li key={record.id}>
            {/* 항목 전체를 클릭하면 2-4. 사용기록 상세로 이동 */}
            <button
              type="button"
              onClick={() => onSelectRecord(record.id)}
              className="flex w-full flex-col gap-2 rounded-2xl bg-gray-5 px-4 py-4 text-left"
            >
              <div className="flex items-center justify-between">
                <p className="text-[15px] font-bold leading-[1.5] tracking-[-0.01em] text-gray-90">
                  {record.date}
                </p>
                <img src="/icons/right.svg" alt="" className="size-4" />
              </div>

              <p className="text-[13px] leading-[1.5] tracking-[-0.01em] text-gray-50">
                {record.timeRange}
              </p>

              {/* 지표 요약 배지 (온도 / 우측 하중 / 형태 편차) */}
              <div className="flex gap-1.5">
                {record.metrics.map((metric) => (
                  <span
                    key={metric.id}
                    className="rounded-full bg-white px-2.5 py-1 text-[12px] font-medium leading-[1.5] tracking-[-0.01em] text-gray-60"
                  >
                    {metric.label} {metric.displayValue}
                  </span>
                ))}
              </div>
            </button>
          </li>
        ))}
      </ul>

      {/* 안내 문구 */}
      <p className="mt-5 text-center text-[12px] leading-[1.6] tracking-[-0.01em] text-gray-30">
        {USAGE_DATA_NOTICE[0]}
        <br />
        {USAGE_DATA_NOTICE[1]}
      </p>
    </div>
  );
}

export default ReportUsageList;
