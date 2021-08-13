import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
} from '@material-ui/core';
import { startOfDay } from 'date-fns';
import React from 'react';
import { useEffect, useReducer } from 'react';

import { convertLocalTime, isExpiredInTenDays } from '../utils';
import { Vaccine, VaccineOrdersArrivedByDateData } from '../types';

import { ActionType, initialState, interestingDataReducer } from '../reducer';

interface Props {
  dataArrivedByDate?: VaccineOrdersArrivedByDateData;
  convertedDate: string | null;
  loadingOrders: boolean;
  initialLoading: boolean;
  initialData?: VaccineOrdersArrivedByDateData;
}

const SearchResultList = ({
  dataArrivedByDate,
  convertedDate,
  loadingOrders,
  initialLoading,
}: Props) => {
  const [state, dispatch] = useReducer(interestingDataReducer, initialState);

  const parseData = (data: VaccineOrdersArrivedByDateData) => {
    if (!convertedDate) throw new Error('No given day');
    const dayStartMS = Date.parse(
      convertLocalTime(startOfDay(Date.parse(convertedDate)).toISOString())
    );
    data.vaccineOrdersArrivedByDate.forEach((order) => {
      const givenDayMS = Date.parse(convertedDate);
      const bottleExpiresMS = Date.parse(order.bottleExpires);
      let isBottleExpiredOnGivenDate = false;
      if (bottleExpiresMS > dayStartMS && bottleExpiresMS < givenDayMS) {
        isBottleExpiredOnGivenDate = true;
      }
      let isExpiringInTenDays = false;
      if (isExpiredInTenDays(givenDayMS, bottleExpiresMS)) {
        isExpiringInTenDays = true;
      }
      const currentProducer = stringifyCurrentProducerName(order.vaccine);
      dispatch({
        type: ActionType.INCREMENT,
        payload: {
          order,
          currentProducer,
          isBottleExpiredOnGivenDate,
          isExpiringInTenDays,
        },
      });
    });
  };

  useEffect(() => {
    if (!dataArrivedByDate) return;
    emptyCachedData();
    parseData(dataArrivedByDate);
  }, [dataArrivedByDate]);

  const emptyCachedData = () => {
    dispatch({ type: ActionType.INIT });
  };

  const stringifyCurrentProducerName = (vaccine: Vaccine): string => {
    const currentProducer = vaccine.toString();
    switch (currentProducer) {
      case 'SOLAR_BUDDHICA':
        return 'SolarBuddhica';
      case 'ANTIQUA':
        return 'Antiqua';
      case 'ZERPFY':
        return 'Zerpfy';
      default:
        throw new Error('invalid vaccine producer name');
    }
  };

  if (initialLoading && !dataArrivedByDate)
    return (
      <Box display="flex" justifyContent="center" style={{ marginTop: 50 }}>
        <CircularProgress />
      </Box>
    );

  if (loadingOrders)
    return (
      <Box display="flex" justifyContent="center" style={{ marginTop: 50 }}>
        <CircularProgress />
      </Box>
    );
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Interesting data</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Orders Arrived Total</TableCell>
            <TableCell>{state.ordersArrived}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Vaccines Arrived Total</TableCell>
            <TableCell>{state.vaccinesArrived}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Vaccines used</TableCell>
            <TableCell>{state.vaccinationsUsed}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Bottles expired on given day</TableCell>
            <TableCell>{state.bottlesExpiredOnDay}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Vaccines expired before usage</TableCell>
            <TableCell>{state.expiredVaccinesBeforeUsage}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Vaccines left to use</TableCell>
            <TableCell>{state.vaccinesLeftNotExpired}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Vaccines expiring in the next 10 days</TableCell>
            <TableCell>{state.vaccinesExpiringNextTenDays}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Orders / Vaccines per producer: SolarBuddhica</TableCell>
            <TableCell>
              <strong>Orders</strong> {state.producer.SolarBuddhica.orders}
              {' / '}
              <strong>Vaccines</strong> {state.producer.SolarBuddhica.vaccines}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Orders / Vaccines per producer: Antiqua</TableCell>
            <TableCell>
              <strong>Orders</strong> {state.producer.Antiqua.orders}
              {' / '}
              <strong>Vaccines</strong> {state.producer.Antiqua.vaccines}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Orders / Vaccines per producer: Zerpfy</TableCell>
            <TableCell>
              <strong>Orders</strong> {state.producer.Zerpfy.orders}
              {' / '}
              <strong>Vaccines</strong> {state.producer.Zerpfy.vaccines}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SearchResultList;
