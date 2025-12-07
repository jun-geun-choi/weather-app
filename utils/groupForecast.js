/**
 *  전달 받은 날씨 데이터 리스트를
 *  날짜별로 묶어서 배열에 담는 로직.
 * @param {*} list 전달받은 날씨 리스트
 * @returns 날짜별 날씨 리스트
 */
export function groupForecastByDate(list) {
  const grouped = {};

  list.forEach((item) => {
    const dateKey = item.dt_txt.split(" ")[0]; // ex: "2025-05-23"
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(item);
  });

  return grouped;
}
