import { InterestingData, VaccineOrdersArrived } from './types';

export const initialState = {
  ordersArrived: 0,
  vaccinesArrived: 0,
  vaccinationsUsed: 0,
  producer: {
    SolarBuddhica: {
      orders: 0,
      vaccines: 0,
    },
    Antiqua: {
      orders: 0,
      vaccines: 0,
    },
    Zerpfy: {
      orders: 0,
      vaccines: 0,
    },
  },
  bottlesExpiredOnDay: 0,
  expiredVaccinesBeforeUsage: 0,
  vaccinesLeftNotExpired: 0,
  vaccinesExpiringNextTenDays: 0,
};

export enum ActionType {
  INCREMENT = 'increment',
  INIT = 'init',
}

interface IncrementPayload {
  order: VaccineOrdersArrived;
  isBottleExpiredOnGivenDate: boolean;
  isExpiringInTenDays: boolean;
  currentProducer: string;
}

type Action =
  | {
      type: ActionType.INCREMENT;
      payload: IncrementPayload;
    }
  | { type: ActionType.INIT };

export const interestingDataReducer = (
  state: InterestingData,
  action: Action
): InterestingData => {
  switch (action.type) {
    case ActionType.INCREMENT: {
      return {
        ...state,
        ordersArrived: state.ordersArrived + 1,
        vaccinesArrived:
          state.vaccinesArrived + action.payload.order.injections,
        vaccinationsUsed:
          state.vaccinationsUsed +
          action.payload.order.vaccinationsDoneWithVaccine.length,
        expiredVaccinesBeforeUsage: action.payload.order.isBottleExpiredOnDate
          ? state.expiredVaccinesBeforeUsage +
            (action.payload.order.injections -
              action.payload.order.vaccinationsDoneWithVaccine.length)
          : state.expiredVaccinesBeforeUsage + 0,
        vaccinesLeftNotExpired: action.payload.order.isBottleExpiredOnDate
          ? state.vaccinesLeftNotExpired
          : state.vaccinesLeftNotExpired +
            (action.payload.order.injections -
              action.payload.order.vaccinationsDoneWithVaccine.length),
        bottlesExpiredOnDay: action.payload.isBottleExpiredOnGivenDate
          ? state.bottlesExpiredOnDay + 1
          : state.bottlesExpiredOnDay,
        vaccinesExpiringNextTenDays: action.payload.isExpiringInTenDays
          ? state.vaccinesExpiringNextTenDays + action.payload.order.injections
          : state.vaccinesExpiringNextTenDays,
        producer: {
          ...state.producer,
          [action.payload.currentProducer]: {
            ...state.producer[action.payload.currentProducer],
            orders: state.producer[action.payload.currentProducer]?.orders + 1,
            vaccines:
              state.producer[action.payload.currentProducer]?.vaccines +
              action.payload.order.injections,
          },
        },
      };
    }
    case ActionType.INIT:
      return initialState;
    default:
      throw new Error(`Unhandled action type ${JSON.stringify(action)}`);
  }
};
