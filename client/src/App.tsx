import React from 'react';
import { useLazyQuery } from '@apollo/client';
import {
  VaccineOrdersArrived,
  VaccineOrdersArrivedVars,
  VACCINE_ORDER_ARRIVED_BY_DATE,
  VACCINE_ORDER_ARRIVED_ON_DATE,
} from './queries';
import { AppBar, Container, Toolbar, Typography } from '@material-ui/core';
import DateAndTimePicker from './components/DateAndTimePicker';
import { convertLocalTime, removeTimeFromDate } from './utils';

function App() {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date('2021-04-12T11:10:06')
  );
  const [convertedDate, setConvertedDate] = React.useState<string | null>(
    (selectedDate && convertLocalTime(selectedDate.toISOString())) || null
  );
  const [isTimeIncludedChecked, setIsTimeIncludedChecked] =
    React.useState<boolean>(true);

  const [getVaccineOrdersArrivedBy, { data: vaccineOrdersArrivedByDate }] =
    useLazyQuery<VaccineOrdersArrived, VaccineOrdersArrivedVars>(
      VACCINE_ORDER_ARRIVED_BY_DATE,
      {
        variables: {
          date: isTimeIncludedChecked
            ? convertedDate
            : (convertedDate && removeTimeFromDate(convertedDate)) || null,
        },
        fetchPolicy: 'cache-and-network',
      }
    );

  const [getVaccineOrdersArrivedOn, { data: vaccineOrdersArrivedOnDate }] =
    useLazyQuery<VaccineOrdersArrived, VaccineOrdersArrivedVars>(
      VACCINE_ORDER_ARRIVED_ON_DATE,
      {
        variables: {
          date: isTimeIncludedChecked
            ? convertedDate
            : (convertedDate && removeTimeFromDate(convertedDate)) || null,
        },
        fetchPolicy: 'cache-and-network',
      }
    );

  const handleDateChange = (newDate: Date | null) => {
    if (!newDate) return null;
    const parsedDate = convertLocalTime(newDate.toISOString());
    setConvertedDate(parsedDate);
    setSelectedDate(newDate);
    console.log(convertedDate);
  };

  const handleClickSearch = () => {
    if (isTimeIncludedChecked === false) {
      const dateWithoutTime =
        convertedDate && removeTimeFromDate(convertedDate);
      getVaccineOrdersArrivedBy({
        variables: {
          date: dateWithoutTime || null,
        },
      });
      getVaccineOrdersArrivedOn({
        variables: {
          date: dateWithoutTime || null,
        },
      });
      return;
    }
    console.log(JSON.stringify(convertedDate));
    getVaccineOrdersArrivedBy({
      variables: {
        date: convertedDate || null,
      },
    });
    getVaccineOrdersArrivedOn({
      variables: {
        date: convertedDate || null,
      },
    });
  };
  const handleCheckedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsTimeIncludedChecked(event.target.checked);
  };
  if (vaccineOrdersArrivedByDate) console.log(vaccineOrdersArrivedByDate);
  if (vaccineOrdersArrivedOnDate) console.log(vaccineOrdersArrivedOnDate);
  return (
    <Container>
      <AppBar position="fixed">
        <Toolbar color="inherit">
          <Typography>Vaccine data</Typography>
        </Toolbar>
      </AppBar>
      <Typography variant="h2" style={{ marginTop: '64px' }} align="center">
        Vaccine data
      </Typography>
      <DateAndTimePicker
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
        handleClick={handleClickSearch}
        handleCheckedChange={handleCheckedChange}
        checked={isTimeIncludedChecked}
      />
    </Container>
  );
}

export default App;
