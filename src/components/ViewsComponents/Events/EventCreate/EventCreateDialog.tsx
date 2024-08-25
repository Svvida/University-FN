import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCreateEventMutation } from 'Redux/ApiSlices/Community/Community.Api.Slice';
import RHFDateRangePicker from 'Components/Shared/FormComponents/DateRangePicker/RHFDateRangePicker';
import RHFTextField from 'Components/Shared/FormComponents/TextField/RHFTextField';
import { eventValidationSchema, type EventFormValuesType } from './EventCreateDialogYup';
import { newDate } from 'react-datepicker/dist/date_utils';

interface IProps {
  onClose: () => void;
}

const EventCreateDialog: React.FC<IProps> = ({ onClose }) => {
  const methods = useForm<EventFormValuesType>({
    resolver: yupResolver(eventValidationSchema),
    defaultValues: {
      title: 'abc',
      description: 'defg',
      dateRange: { startDate: new Date(), endDate: new Date() },
      startTime: '05:00',
      endTime: '07:00',
    },
  });

  const [createEvent] = useCreateEventMutation();
  const { handleSubmit } = methods;

  const onSubmit = (data: EventFormValuesType) => {
    const {
      title,
      description,
      dateRange: { startDate, endDate },
    } = data;

    createEvent({ title, description, startDate, endDate, organizators: [] });
    onClose();
  };

  return (
    <FormProvider {...methods}>
      <Dialog open onClose={onClose}>
        <DialogTitle>Create New Event</DialogTitle>
        <DialogContent>
          <RHFTextField name="title" label="Event Title" fullWidth margin="normal" />
          <RHFTextField name="description" label="Description" fullWidth margin="normal" multiline rows={4} />
          <RHFDateRangePicker
            name="dateRange"
            withTime={{
              startTimeName: 'startTime',
              endTimeName: 'endTime',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
};

export default EventCreateDialog;
