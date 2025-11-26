const CENTER_INDEX = 12;

export function getMonthDate(index: number): Date {
  const today = new Date();
  const offset = index - CENTER_INDEX;
  return new Date(today.getFullYear(), today.getMonth() + offset, 1);
}

export { CENTER_INDEX };