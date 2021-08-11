/* eslint-disable @typescript-eslint/no-unused-vars */
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

import { convertLocalTime, isExpiredInTenDays } from '../utils';
import {
  Vaccine,
  VaccineOrdersArrivedByDateData,
  VaccineOrdersArrivedOnDateData,
} from '../queries';

interface Props {
  dataArrivedByDate?: VaccineOrdersArrivedByDateData;
  dataArrivedOnDate?: VaccineOrdersArrivedOnDateData;
  convertedDate: string | null;
  loadingOrders: boolean;
}

const SearchResultList = ({
  dataArrivedByDate,
  dataArrivedOnDate,
  convertedDate,
  loadingOrders,
}: Props) => {
  const [interestingData, setInterestingData] = React.useState<InterestingData>(
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

  interface Producer {
    [key: string]: {
      orders: number;
      vaccines: number;
    };
  }

  interface InterestingData {
    ordersArrived: number;
    vaccinesArrived: number;
    vaccinationsUsed: number;
    producer: Producer;
    bottlesExpiredOnDay: number;
    expiredVaccinesBeforeUsage: number;
    vaccinesLeftNotExpired: number;
    vaccinesExpiringNextTenDays: number;
  }

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
      // doesn't work, currentProducer is type SOLAR_BUDDHICA, not SolarBuddhica
      let currentProducer = order.vaccine.toString();
      if (currentProducer === 'SOLAR_BUDDHICA')
        currentProducer = 'SolarBuddhica';
      if (currentProducer === 'ANTIQUA') currentProducer = 'Antiqua';
      if (currentProducer === 'ZERPFY') currentProducer = 'Zerpfy';

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
  React.useEffect(() => {
    if (!dataArrivedByDate) return;
    emptyCachedData();
    parseData(dataArrivedByDate);
  }, [dataArrivedByDate]);
  if (interestingData) console.log(interestingData);

  const emptyCachedData = () => {
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

  if (loadingOrders)
    return (
      <Box
        display="flex"
        justifyContent="center"
        style={{ marginTop: 50 }}
      >
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
              {interestingData.producer.SolarBuddhica.orders}
              {' / '}
              {interestingData.producer.SolarBuddhica.vaccines}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Orders / Vaccines per producer: Antiqua</TableCell>
            <TableCell>
              {interestingData.producer.Antiqua.orders}
              {' / '}
              {interestingData.producer.Antiqua.vaccines}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Orders / Vaccines per producer: Zerpfy</TableCell>
            <TableCell>
              {interestingData.producer.Zerpfy.orders}
              {' / '}
              {interestingData.producer.Zerpfy.vaccines}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SearchResultList;
