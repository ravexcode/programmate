export default function genDays(
  year: number,
  monthNumber: number
){
  const firstDayMonth = new Date(year, monthNumber, 1);
  const lastDayMonth = new Date(year, monthNumber + 1, 0);

  const monthStart = new Date(firstDayMonth);
  monthStart.setDate(monthStart.getDate() - monthStart.getDay());

  const monthEnd = new Date(lastDayMonth);
  monthEnd.setDate(monthEnd.getDate() + (6 - monthEnd.getDay()));

  const days = [];
  let now = new Date(monthStart);

  while (now <= monthEnd) {
    days.push({
      num: now.getDate(),
      month_index: now.getMonth(),
      isOff: now.getMonth() !== monthNumber,
    });
    now.setDate(now.getDate() + 1);
  }

  return days;
}