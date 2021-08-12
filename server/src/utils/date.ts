import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import { format, add, sub } from 'date-fns';

export const getStartOfDayISO = (date: string) => {
  const dayStart = startOfDay(new Date(date));
  const dayStartISO = format(dayStart, "yyyy-MM-dd'T'HH:mm:ss'.000Z'");
  return dayStartISO;
};

export const getEndOfDayISO = (date: string) => {
  const dayEnd = endOfDay(new Date(date));
  const dayEndISO = format(dayEnd, "yyyy-MM-dd'T'HH:mm:ss'.999Z'");
  return dayEndISO;
};

export const getExpirationDate = (arrivalDate: string) => {
  const date = new Date(arrivalDate);
  const added30Days = add(date, { days: 30 });
  if (!isDaylightSavingTime(date) && isDaylightSavingTime(added30Days)) {
    const addedOneHourForDST = add(added30Days, { hours: 1 });
    return addedOneHourForDST.toISOString();
  }
  if (isDaylightSavingTime(date) && !isDaylightSavingTime(added30Days)) {
    const substractedOneHourForDST = sub(added30Days, { hours: 1 });
    return substractedOneHourForDST.toISOString();
  }
  const dateISO = added30Days.toISOString();
  return dateISO;
};

export const isDaylightSavingTime = (date: Date) => {
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
