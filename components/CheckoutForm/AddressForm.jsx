import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import FormInput from './CustomTextField';
import SearchableSelect from './SearchableSelect';

export const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' }, { code: 'AL', name: 'Albania' }, { code: 'DZ', name: 'Algeria' },
  { code: 'AD', name: 'Andorra' }, { code: 'AO', name: 'Angola' }, { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' }, { code: 'AM', name: 'Armenia' }, { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' }, { code: 'AZ', name: 'Azerbaijan' }, { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' }, { code: 'BD', name: 'Bangladesh' }, { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' }, { code: 'BE', name: 'Belgium' }, { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' }, { code: 'BT', name: 'Bhutan' }, { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' }, { code: 'BW', name: 'Botswana' }, { code: 'BR', name: 'Brazil' },
  { code: 'BN', name: 'Brunei' }, { code: 'BG', name: 'Bulgaria' }, { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' }, { code: 'CV', name: 'Cabo Verde' }, { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' }, { code: 'CA', name: 'Canada' }, { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' }, { code: 'CL', name: 'Chile' }, { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' }, { code: 'KM', name: 'Comoros' }, { code: 'CD', name: 'Congo (DRC)' },
  { code: 'CG', name: 'Congo (Republic)' }, { code: 'CR', name: 'Costa Rica' }, { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' }, { code: 'CY', name: 'Cyprus' }, { code: 'CZ', name: 'Czech Republic' },
  { code: 'DK', name: 'Denmark' }, { code: 'DJ', name: 'Djibouti' }, { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' }, { code: 'EC', name: 'Ecuador' }, { code: 'EG', name: 'Egypt' },
  { code: 'SV', name: 'El Salvador' }, { code: 'GQ', name: 'Equatorial Guinea' }, { code: 'ER', name: 'Eritrea' },
  { code: 'EE', name: 'Estonia' }, { code: 'SZ', name: 'Eswatini' }, { code: 'ET', name: 'Ethiopia' },
  { code: 'FJ', name: 'Fiji' }, { code: 'FI', name: 'Finland' }, { code: 'FR', name: 'France' },
  { code: 'GA', name: 'Gabon' }, { code: 'GM', name: 'Gambia' }, { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' }, { code: 'GH', name: 'Ghana' }, { code: 'GR', name: 'Greece' },
  { code: 'GD', name: 'Grenada' }, { code: 'GT', name: 'Guatemala' }, { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' }, { code: 'GY', name: 'Guyana' }, { code: 'HT', name: 'Haiti' },
  { code: 'HN', name: 'Honduras' }, { code: 'HU', name: 'Hungary' }, { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' }, { code: 'ID', name: 'Indonesia' }, { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' }, { code: 'IE', name: 'Ireland' }, { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' }, { code: 'JM', name: 'Jamaica' }, { code: 'JP', name: 'Japan' },
  { code: 'JO', name: 'Jordan' }, { code: 'KZ', name: 'Kazakhstan' }, { code: 'KE', name: 'Kenya' },
  { code: 'KI', name: 'Kiribati' }, { code: 'KP', name: 'North Korea' }, { code: 'KR', name: 'South Korea' },
  { code: 'KW', name: 'Kuwait' }, { code: 'KG', name: 'Kyrgyzstan' }, { code: 'LA', name: 'Laos' },
  { code: 'LV', name: 'Latvia' }, { code: 'LB', name: 'Lebanon' }, { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' }, { code: 'LY', name: 'Libya' }, { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' }, { code: 'LU', name: 'Luxembourg' }, { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' }, { code: 'MY', name: 'Malaysia' }, { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' }, { code: 'MT', name: 'Malta' }, { code: 'MH', name: 'Marshall Islands' },
  { code: 'MR', name: 'Mauritania' }, { code: 'MU', name: 'Mauritius' }, { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia' }, { code: 'MD', name: 'Moldova' }, { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolia' }, { code: 'ME', name: 'Montenegro' }, { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' }, { code: 'MM', name: 'Myanmar' }, { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' }, { code: 'NP', name: 'Nepal' }, { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' }, { code: 'NI', name: 'Nicaragua' }, { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' }, { code: 'MK', name: 'North Macedonia' }, { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' }, { code: 'PK', name: 'Pakistan' }, { code: 'PW', name: 'Palau' },
  { code: 'PA', name: 'Panama' }, { code: 'PG', name: 'Papua New Guinea' }, { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' }, { code: 'PH', name: 'Philippines' }, { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' }, { code: 'QA', name: 'Qatar' }, { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' }, { code: 'RW', name: 'Rwanda' }, { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'LC', name: 'Saint Lucia' }, { code: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: 'WS', name: 'Samoa' }, { code: 'SM', name: 'San Marino' }, { code: 'ST', name: 'Sao Tome and Principe' },
  { code: 'SA', name: 'Saudi Arabia' }, { code: 'SN', name: 'Senegal' }, { code: 'RS', name: 'Serbia' },
  { code: 'SC', name: 'Seychelles' }, { code: 'SL', name: 'Sierra Leone' }, { code: 'SG', name: 'Singapore' },
  { code: 'SK', name: 'Slovakia' }, { code: 'SI', name: 'Slovenia' }, { code: 'SB', name: 'Solomon Islands' },
  { code: 'SO', name: 'Somalia' }, { code: 'ZA', name: 'South Africa' }, { code: 'SS', name: 'South Sudan' },
  { code: 'ES', name: 'Spain' }, { code: 'LK', name: 'Sri Lanka' }, { code: 'SD', name: 'Sudan' },
  { code: 'SR', name: 'Suriname' }, { code: 'SE', name: 'Sweden' }, { code: 'CH', name: 'Switzerland' },
  { code: 'SY', name: 'Syria' }, { code: 'TW', name: 'Taiwan' }, { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania' }, { code: 'TH', name: 'Thailand' }, { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' }, { code: 'TO', name: 'Tonga' }, { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TN', name: 'Tunisia' }, { code: 'TR', name: 'Turkey' }, { code: 'TM', name: 'Turkmenistan' },
  { code: 'TV', name: 'Tuvalu' }, { code: 'UG', name: 'Uganda' }, { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' }, { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' }, { code: 'UY', name: 'Uruguay' }, { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' }, { code: 'VE', name: 'Venezuela' }, { code: 'VN', name: 'Vietnam' },
  { code: 'YE', name: 'Yemen' }, { code: 'ZM', name: 'Zambia' }, { code: 'ZW', name: 'Zimbabwe' },
];

export const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard shipping (5–7 days) — $5.00', price: 5 },
  { id: 'express',  label: 'Express shipping (1–2 days) — $15.00', price: 15 },
];

const labelStyle = {
  fontSize: 11, fontWeight: 500, color: 'var(--muted)',
  textTransform: 'uppercase', letterSpacing: '0.5px',
};

const selectStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
  paddingRight: 36, cursor: 'pointer',
};

const AddressForm = ({ next, defaultValues = {} }) => {
  // react-hook-form v6: errors comes directly from useForm(), not formState
  const { register, handleSubmit, errors } = useForm({ defaultValues });
  const [country, setCountry]   = useState(defaultValues.country  || 'US');
  const [shipping, setShipping] = useState(defaultValues.shipping || 'standard');

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
        <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--foreground)', margin: 0 }}>
          Shipping address
        </p>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>
          <span style={{ color: '#e11d48' }}>*</span> Required
        </span>
      </div>

      <form onSubmit={handleSubmit((data) => next({ ...data, country, shipping }))}>
        <div className="address-grid">

          <FormInput register={register} errors={errors} name="firstName" label="First name" required />
          <FormInput register={register} errors={errors} name="lastName"  label="Last name"  required />

          {/* Email */}
          <div className="span-2" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 4 }}>
              Email <span style={{ color: '#e11d48' }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              ref={register({ required: true, pattern: /^\S+@\S+\.\S+$/ })}
              className="form-input"
              style={{ borderColor: errors.email ? '#e11d48' : undefined }}
            />
            {errors.email && (
              <span style={{ fontSize: 11, color: '#e11d48', marginTop: -2 }}>
                {errors.email.type === 'pattern' ? 'Enter a valid email address' : 'This field is required'}
              </span>
            )}
          </div>

          {/* Street address */}
          <div className="span-2" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 4 }}>
              Street address <span style={{ color: '#e11d48' }}>*</span>
            </label>
            <input
              type="text"
              name="address1"
              ref={register({ required: true })}
              className="form-input"
              style={{ borderColor: errors.address1 ? '#e11d48' : undefined }}
            />
            {errors.address1 && <span style={{ fontSize: 11, color: '#e11d48', marginTop: -2 }}>This field is required</span>}
          </div>

          {/* Apartment — optional */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 4 }}>
              Apartment / Suite
              <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 10, letterSpacing: 0, textTransform: 'none' }}>(optional)</span>
            </label>
            <input type="text" name="address2" ref={register()} className="form-input" />
          </div>

          <FormInput register={register} errors={errors} name="city"  label="City"              required />
          <FormInput register={register} errors={errors} name="zip"   label="ZIP / Postal code" required />

          {/* State — optional */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 4 }}>
              State / Province
              <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 10, letterSpacing: 0, textTransform: 'none' }}>(optional)</span>
            </label>
            <input type="text" name="state" ref={register()} className="form-input" />
          </div>

          {/* Country — searchable */}
          <SearchableSelect
            value={country}
            onChange={setCountry}
            options={COUNTRIES}
            label="Country"
            required
          />

          {/* Shipping method */}
          <div className="span-2" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 4 }}>
              Shipping method <span style={{ color: '#e11d48' }}>*</span>
            </label>
            <select
              className="form-input"
              style={selectStyle}
              value={shipping}
              onChange={(e) => setShipping(e.target.value)}
            >
              {SHIPPING_OPTIONS.map((o) => (
                <option key={o.id} value={o.id} style={{ background: 'var(--background)', color: 'var(--foreground)' }}>{o.label}</option>
              ))}
            </select>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 16 }}>
          <button
            type="submit"
            style={{
              width: '100%', padding: '15px 0', borderRadius: 0, border: 'none',
              background: 'var(--accent)', color: '#000',
              fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px',
              cursor: 'pointer',
            }}
          >
            Proceed to payment
          </button>
          <Link
            href="/cart"
            style={{
              fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px',
              color: 'var(--muted)', textDecoration: 'none', textAlign: 'center', transition: 'color 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--foreground)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
          >
            ← Back to cart
          </Link>
        </div>
      </form>
    </>
  );
};

export default AddressForm;
