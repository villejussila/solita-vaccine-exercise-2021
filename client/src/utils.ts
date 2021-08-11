export const convertLocalTime = (date: string) => {
  const inSeconds = Date.parse(date);
  const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
  const ISOTime = new Date(inSeconds - tzoffset).toISOString();
  return ISOTime;
};
export const removeTimeFromDate = (date: string) => {
  return date.split('T')[0];
};
