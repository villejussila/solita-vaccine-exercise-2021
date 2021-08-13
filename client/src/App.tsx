import React from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { VACCINE_ORDER_ARRIVED_BY_DATE } from './queries';
import {
  VaccineOrdersArrivedVars,
  VaccineOrdersArrivedByDateData,
} from './types';
import { AppBar, Container, Toolbar, Typography } from '@material-ui/core';
import DateAndTimePicker from './components/DateAndTimePicker';
import { convertLocalTime, removeTimeFromDate } from './utils';
import SearchResultList from './components/SearchResultList';

function App() {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date('2021-04-12T11:10:06')
  );
  const [convertedDate, setConvertedDate] = React.useState<string | null>(
    (selectedDate && convertLocalTime(selectedDate.toISOString())) || null
  );
  const [isTimeIncludedChecked, setIsTimeIncludedChecked] =
    React.useState<boolean>(true);

  const [hasSearched, setHasSearched] = React.useState(false);

  const { loading: initialLoading, data: initialVaccineOrderData } = useQuery<
    VaccineOrdersArrivedByDateData,
    VaccineOrdersArrivedVars
  >(VACCINE_ORDER_ARRIVED_BY_DATE, {
    variables: { date: convertedDate },
  });

  const [
    getVaccineOrdersArrivedBy,
    { loading: loadingOrders, data: vaccineOrdersArrivedByDate },
  ] = useLazyQuery<VaccineOrdersArrivedByDateData, VaccineOrdersArrivedVars>(
    VACCINE_ORDER_ARRIVED_BY_DATE,
    {
      variables: {
        date: isTimeIncludedChecked
          ? convertedDate
          : (convertedDate && removeTimeFromDate(convertedDate)) || null,
      },
    }
  );

  const handleDateChange = (newDate: Date | null) => {
    if (!newDate) return null;
    const dateWithoutTimeZone = convertLocalTime(newDate.toISOString());
    setConvertedDate(dateWithoutTimeZone);
    setSelectedDate(newDate);
  };

  const handleClickSearch = () => {
    setHasSearched(true);
    if (isTimeIncludedChecked === false) {
      const dateWithoutTime =
        convertedDate && removeTimeFromDate(convertedDate);
      getVaccineOrdersArrivedBy({
        variables: {
          date: dateWithoutTime || null,
        },
      });
      return;
    }
    getVaccineOrdersArrivedBy({
      variables: {
        date: convertedDate || null,
      },
    });
  };
  const handleCheckedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsTimeIncludedChecked(event.target.checked);
  };

  return (
    <Container>
      <AppBar position="fixed">
        <Toolbar color="inherit">
          <Typography>Vaccine data</Typography>
        </Toolbar>
      </AppBar>
      <Typography variant="h2" style={{ marginTop: '64px' }} align="center">
        Search vaccine data
      </Typography>
      <DateAndTimePicker
        selectedDate={selectedDate}
        handleDateChange={handleDateChange}
        handleClick={handleClickSearch}
        handleCheckedChange={handleCheckedChange}
        checked={isTimeIncludedChecked}
      />
      {hasSearched && (
        <SearchResultList
          dataArrivedByDate={vaccineOrdersArrivedByDate}
          convertedDate={convertedDate}
          loadingOrders={loadingOrders}
          initialLoading={initialLoading}
          initialData={initialVaccineOrderData}
        />
      )}
    </Container>
  );
}

export default App;
