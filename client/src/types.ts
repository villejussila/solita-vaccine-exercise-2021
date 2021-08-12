interface Producer {
  [key: string]: {
    orders: number;
    vaccines: number;
  };
}

export interface InterestingData {
  ordersArrived: number;
  vaccinesArrived: number;
  vaccinationsUsed: number;
  producer: Producer;
  bottlesExpiredOnDay: number;
  expiredVaccinesBeforeUsage: number;
  vaccinesLeftNotExpired: number;
  vaccinesExpiringNextTenDays: number;
}

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

export interface VaccineOrdersArrivedByDateData {
  vaccineOrdersArrivedByDate: VaccineOrdersArrived[];
}
export interface VaccineOrdersArrivedOnDateData {
  vaccineOrdersArrivedOnDate: VaccineOrdersArrived[];
}

export interface VaccineOrdersArrived extends VaccineOrderBase {
  bottleExpires: string;
  isBottleExpiredOnDate: boolean;
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