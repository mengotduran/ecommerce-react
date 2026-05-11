import React, { useState } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';
import FormInput from './CustomTextField';

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IN', name: 'India' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'GH', name: 'Ghana' },
  { code: 'KE', name: 'Kenya' },
];

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard Shipping (5-7 days) — $5.00' },
  { id: 'express', label: 'Express Shipping (1-2 days) — $15.00' },
];

const AddressForm = ({ next }) => {
  const methods = useForm();
  const [country, setCountry] = useState('US');
  const [shippingOption, setShippingOption] = useState('standard');

  return (
    <>
      <Typography variant="h6" gutterBottom style={{ fontWeight: 600, color: '#1a1a2e' }}>
        Shipping Address
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(data => next({ ...data, country, shippingOption }))}>
          <Grid container spacing={3}>
            <FormInput name="firstName" label="First Name" />
            <FormInput name="lastName" label="Last Name" />
            <FormInput name="address1" label="Street Address" />
            <FormInput name="email" label="Email" />
            <FormInput name="city" label="City" />
            <FormInput name="zip" label="ZIP / Postal Code" />
            <Grid item xs={12} sm={6}>
              <InputLabel style={{ marginBottom: '8px', fontSize: '0.85rem' }}>Country</InputLabel>
              <Select fullWidth value={country} onChange={e => setCountry(e.target.value)}>
                {COUNTRIES.map(c => (
                  <MenuItem key={c.code} value={c.code}>{c.name}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel style={{ marginBottom: '8px', fontSize: '0.85rem' }}>Shipping Method</InputLabel>
              <Select fullWidth value={shippingOption} onChange={e => setShippingOption(e.target.value)}>
                {SHIPPING_OPTIONS.map(o => (
                  <MenuItem key={o.id} value={o.id}>{o.label}</MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', flexWrap: 'wrap', gap: '12px' }}>
            <Button component={Link} to="/cart" variant="outlined" style={{ textTransform: 'none' }}>
              Back to Cart
            </Button>
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: '#1a1a2e', color: '#fff', textTransform: 'none', fontWeight: 600, borderRadius: '8px', padding: '8px 24px' }}
            >
              Next
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;
