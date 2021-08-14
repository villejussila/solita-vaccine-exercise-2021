import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { Button, Checkbox, Typography } from '@material-ui/core';

interface Props {
  selectedDate: Date | null;
  handleDateChange: (
    date: MaterialUiPickersDate,
    value?: string | null | undefined
  ) => void;
  handleClick?: () => void;
  handleCheckedChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}

export default function MaterialUIPickers({
  selectedDate,
  handleDateChange,
  handleClick,
  handleCheckedChange,
  checked,
}: Props) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justifyContent="center" alignItems="center">
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-inline"
          label="Date"
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
        <KeyboardTimePicker
          margin="normal"
          ampm={false}
          id="time-picker"
          format="HH:mm:ss"
          label="Time"
          views={['hours', 'minutes', 'seconds']}
          value={selectedDate}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
          disabled={!checked}
        />
        <Button
          color="primary"
          variant="contained"
          id="search-button"
          style={{ height: 48, marginLeft: 12 }}
          onClick={handleClick}
        >
          Search
        </Button>
        <Checkbox checked={checked} onChange={handleCheckedChange}></Checkbox>
        <Typography variant="body2">Include time?</Typography>
      </Grid>
    </MuiPickersUtilsProvider>
  );
}
