export function groupForecastByDate(list) {
  const grouped = {};

  list.forEach((item) => {
    const dateKey = item.dt_txt.split(" ")[0]; // ex: "2025-05-23"
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(item);
  });

  return grouped;
}
