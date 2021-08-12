import { gql } from '@apollo/client';

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
