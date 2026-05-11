import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  media: {
    height: 180,
  },
  cardContent: {
    flexGrow: 1,
    padding: '12px 16px 8px',
  },
  name: {
    fontWeight: 600,
    color: '#1a1a2e',
    fontSize: '1rem',
  },
  price: {
    color: '#e63946',
    fontWeight: 700,
    marginTop: '4px',
  },
  cardActions: {
    justifyContent: 'space-between',
    padding: '8px 16px 12px',
    borderTop: '1px solid #f0f0f0',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  qtyBtn: {
    minWidth: '32px',
    height: '32px',
    padding: 0,
    border: '1px solid #d0d0d0',
    borderRadius: '6px',
    color: '#1a1a2e',
    fontWeight: 700,
  },
  qty: {
    fontWeight: 600,
    minWidth: '20px',
    textAlign: 'center',
    color: '#1a1a2e',
  },
  removeBtn: {
    color: '#e63946',
    textTransform: 'none',
    fontSize: '0.8rem',
    fontWeight: 600,
  },
}));
