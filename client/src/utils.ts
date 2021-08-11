import { sub, add, differenceInHours } from 'date-fns';

export const convertLocalTime = (date: string) => {
  const inSeconds = Date.parse(date);
  const tzoffset = new Date().getTimezoneOffset() * 60000;
  const time = new Date(inSeconds - tzoffset);
  const today = new Date();
  if (!isDaylightSavingTime(time) && isDaylightSavingTime(today)) {
    const timeDST = sub(time, { hours: 1 });
    return timeDST.toISOString();
  }
  if (isDaylightSavingTime(time) && !isDaylightSavingTime(today)) {
    const timeDST = add(time, { hours: 1 });
    return timeDST.toISOString();
  }
  return time.toISOString();
};
export const removeTimeFromDate = (date: string) => {
  return date.split('T')[0];
};

export const isExpiredInTenDays = (
  date: number,
  expirationDate: number
): boolean => {
  const differenceInDaysExcludingDST =
    Math.floor(differenceInHours(expirationDate, date) / 24) | 0;
  if (differenceInDaysExcludingDST <= 10 && differenceInDaysExcludingDST >= 0) {
    return true;
  }
  return false;
};

const isDaylightSavingTime = (date: Date) => {
  const stdTimezoneOffset = (date: Date) => {
    const jan = new Date(date.getFullYear(), 0, 1);
    const jul = new Date(date.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
  };

  const isDstObserved = (date: Date) => {
    return date.getTimezoneOffset() < stdTimezoneOffset(date);
  };

  if (isDstObserved(date)) {
    return true;
  }
  return false;
};