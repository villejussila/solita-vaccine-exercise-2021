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
import { useState, useEffect } from 'react';

import { convertLocalTime, isExpiredInTenDays } from '../utils';
import { Vaccine, VaccineOrdersArrivedByDateData } from '../types';

import { InterestingData } from '../types';

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
  initialData,
  initialLoading,
}: Props) => {
  const [interestingData, setInterestingData] = useState<InterestingData>(
    () => {
      return {
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
    }
  );
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

      setInterestingData((prevData) => ({
        ...prevData,
        ordersArrived: prevData.ordersArrived + 1,
        vaccinesArrived: prevData.vaccinesArrived + order.injections,
        vaccinationsUsed:
          prevData.vaccinationsUsed + order.vaccinationsDoneWithVaccine.length,
        expiredVaccinesBeforeUsage: order.isBottleExpiredOnDate
          ? prevData.expiredVaccinesBeforeUsage +
            (order.injections - order.vaccinationsDoneWithVaccine.length)
          : prevData.expiredVaccinesBeforeUsage + 0,
        vaccinesLeftNotExpired: order.isBottleExpiredOnDate
          ? prevData.vaccinesLeftNotExpired
          : prevData.vaccinesLeftNotExpired +
            (order.injections - order.vaccinationsDoneWithVaccine.length),
        bottlesExpiredOnDay: isBottleExpiredOnGivenDate
          ? prevData.bottlesExpiredOnDay + 1
          : prevData.bottlesExpiredOnDay,
        vaccinesExpiringNextTenDays: isExpiringInTenDays
          ? prevData.vaccinesExpiringNextTenDays + order.injections
          : prevData.vaccinesExpiringNextTenDays,
        producer: {
          ...prevData.producer,
          [currentProducer]: {
            ...prevData.producer[currentProducer],
            orders: prevData.producer[currentProducer]?.orders + 1,
            vaccines:
              prevData.producer[currentProducer]?.vaccines + order.injections,
          },
        },
      }));
    });
  };
  useEffect(() => {
    if (initialData) parseData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (!dataArrivedByDate) return;
    emptyCachedStaleData();
    parseData(dataArrivedByDate);
  }, [dataArrivedByDate]);
  
  const emptyCachedStaleData = () => {
    setInterestingData(() => ({
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
    }));
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

  if (loadingOrders || initialLoading)
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
            <TableCell>Orders Arrived</TableCell>
            <TableCell>{interestingData.ordersArrived}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Vaccines Arrived</TableCell>
            <TableCell>{interestingData.vaccinesArrived}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Vaccines used</TableCell>
            <TableCell>{interestingData.vaccinationsUsed}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Bottles expired on given day</TableCell>
            <TableCell>{interestingData.bottlesExpiredOnDay}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Vaccines expired before usage</TableCell>
            <TableCell>{interestingData.expiredVaccinesBeforeUsage}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Vaccines left to use</TableCell>
            <TableCell>{interestingData.vaccinesLeftNotExpired}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Vaccines expiring in the next 10 days</TableCell>
            <TableCell>{interestingData.vaccinesExpiringNextTenDays}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Orders / Vaccines per producer: SolarBuddhica</TableCell>
            <TableCell>
              <strong>Orders</strong>{' '}
              {interestingData.producer.SolarBuddhica.orders}
              {' / '}
              <strong>Vaccines</strong>{' '}
              {interestingData.producer.SolarBuddhica.vaccines}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Orders / Vaccines per producer: Antiqua</TableCell>
            <TableCell>
              <strong>Orders</strong> {interestingData.producer.Antiqua.orders}
              {' / '}
              <strong>Vaccines</strong>{' '}
              {interestingData.producer.Antiqua.vaccines}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Orders / Vaccines per producer: Zerpfy</TableCell>
            <TableCell>
              <strong>Orders</strong> {interestingData.producer.Zerpfy.orders}
              {' / '}
              <strong>Vaccines</strong>{' '}
              {interestingData.producer.Zerpfy.vaccines}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SearchResultList;
