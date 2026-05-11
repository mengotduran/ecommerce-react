import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
    '&:hover': {
      boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
      transform: 'translateY(-4px)',
    },
  },
  mediaWrapper: {
    position: 'relative',
  },
  media: {
    height: 220,
  },
  heartBtn: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: '6px',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,1)',
    },
  },
  heartFilled: {
    color: '#e63946',
    fontSize: '1.3rem',
  },
  heartEmpty: {
    color: '#6b7280',
    fontSize: '1.3rem',
  },
  cardContent: {
    flexGrow: 1,
    padding: '16px 16px 8px',
  },
  nameRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
    gap: '8px',
  },
  productName: {
    fontWeight: 600,
    color: '#1a1a2e',
    fontSize: '1rem',
    lineHeight: 1.3,
  },
  price: {
    color: '#e63946',
    fontWeight: 700,
    fontSize: '1rem',
    whiteSpace: 'nowrap',
  },
  description: {
    color: '#6b7280',
    fontSize: '0.85rem',
    '& p': { margin: 0 },
  },
  cardActions: {
    padding: '8px 16px 16px',
  },
  addButton: {
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    padding: '10px',
    '&:hover': {
      backgroundColor: '#0f3460',
    },
  },
}));
