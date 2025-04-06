export const toFixedFloor = (num: number | string, fixed: number) => {
  if (isNaN(+num)) return 0;
  return Math.floor(+num * Math.pow(10, fixed)) / Math.pow(10, fixed);
}

export const toFixed = (num: number | string, fixed: number) => {
  if (isNaN(+num)) return 0;
  return Math.round(+num * Math.pow(10, fixed)) / Math.pow(10, fixed);
}
