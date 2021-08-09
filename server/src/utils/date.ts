import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';
import { format, add } from 'date-fns';

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
  const dateISO = added30Days.toISOString();
  return dateISO;
};
