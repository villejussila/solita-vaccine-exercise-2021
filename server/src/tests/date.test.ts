import {
  getEndOfDayISO,
  getStartOfDayISO,
} from '../utils/date';

describe('getStartOfDayISO', () => {
  test('returns start of day correctly', () => {
    const testDate = '2021-03-01T11:11:11';
    const result = getStartOfDayISO(testDate);

    expect(result).toBe('2021-03-01T00:00:00.000Z');
  });
});
describe('getEndOfDayISO', () => {
  test('returns end of day correctly', () => {
    const testDate = '2021-05-01T11:11:11';
    const result = getEndOfDayISO(testDate);

    expect(result).toBe('2021-05-01T23:59:59.999Z');
  });
});
