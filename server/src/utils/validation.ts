import { VaccineInput, Vaccine } from '../entities/vaccineOrder';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isVaccineProducer = (vaccine: any): vaccine is VaccineInput => {
  if (!vaccine || !Object.values(Vaccine).includes(vaccine)) {
    console.log(Object.values(Vaccine));
    console.log(vaccine);
    return false;
  }
  return true;
};

export const parseVaccineProducer = (vaccine: unknown): VaccineInput => {
  if (!vaccine || !isVaccineProducer(vaccine)) {
    throw new Error('invalid vaccine producer: ' + vaccine);
  }
  return vaccine;
};
