export default function getCurrentDateTimeString() {
  const date = new Date();

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
}

export function getMostRecentDateKey(obj) {
  let keys = Object.keys(obj);
  let mostRecentDate = keys.reduce((a, b) => (a > b ? a : b));
  return mostRecentDate;
}
