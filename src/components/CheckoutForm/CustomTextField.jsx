import React from 'react';
import { TextField, Grid } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

const FormInput = ({ name, label }) => {
  const { control } = useFormContext();
  return (
    <Grid item xs={12} sm={6} style={{ width: '100%' }}>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ onChange, value }) => (
          <TextField
            fullWidth
            label={label}
            required
            value={value}
            onChange={onChange}
            variant="outlined"
            size="small"
          />
        )}
      />
    </Grid>
  );
};

export default FormInput;
