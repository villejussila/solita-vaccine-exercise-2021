import { gql } from '@apollo/client';

export interface AllVaccineOrders {
  vaccine: Vaccine;
  arrived: string;
  injections: number;
}

interface VaccineOrderBase {
  id: string;
  orderNumber: string;
  responsiblePerson: string;
  healthCareDistrict: string;
  vaccine: Vaccine;
  injections: number;
  arrived: string;
}

export interface VaccineOrdersArrived extends VaccineOrderBase {
  bottleExpires: string;
  isBottleExpiredOnDate: (date: string) => boolean;
  vaccinationsDoneWithVaccine: Pick<Vaccination, 'vaccinationDate'>[];
}
export interface VaccineOrdersArrivedVars {
  date: string | null;
  vaccineProducer?: Vaccine;
}
interface Vaccination {
  vaccinationId: string;
  sourceBottle: string;
  gender: string;
  vaccinationDate: string;
}

export enum Vaccine {
  ANTIQUA = 'Antiqua',
  ZERPFY = 'Zerpfy',
  SOLAR_BUDDHICA = 'SolarBuddhica',
}

export const ALL_VACCINE_ORDERS = gql`
  query {
    allVaccineOrders {
      vaccine
      arrived
      injections
    }
  }
`;
export const VACCINE_ORDER_ARRIVED_BY_DATE = gql`
  query vaccineOrdersArrivedByDate($date: String!) {
    vaccineOrdersArrivedByDate(date: $date) {
      vaccine
      arrived
      bottleExpires
      isBottleExpiredOnDate(date: $date)
      injections
      vaccinationsDoneWithVaccine {
        vaccinationDate
      }
    }
  }
`;
export const VACCINE_ORDER_ARRIVED_ON_DATE = gql`
  query vaccineOrdersArrivedOnDate($date: String!) {
    vaccineOrdersArrivedOnDate(date: $date) {
      vaccine
      arrived
      bottleExpires
      isBottleExpiredOnDate(date: $date)
      injections
      vaccinationsDoneWithVaccine {
        vaccinationDate
      }
    }
  }
`;
