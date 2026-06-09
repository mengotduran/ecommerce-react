import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  title: {
    fontWeight: 700,
    color: '#1a1a2e',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  emptyCart: {
    textAlign: 'center',
    padding: theme.spacing(10, 0),
  },
  continueBtn: {
    marginTop: theme.spacing(2),
    backgroundColor: '#1a1a2e',
    color: '#fff',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': { backgroundColor: '#0f3460' },
  },
  summary: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(4),
    paddingTop: theme.spacing(3),
    marginBottom: theme.spacing(4),
    borderTop: '2px solid #e0e0e0',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      gap: '16px',
      alignItems: 'stretch',
    },
  },
  subtotal: {
    color: '#1a1a2e',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  emptyButton: {
    borderColor: '#e63946',
    color: '#e63946',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': { borderColor: '#c1121f', color: '#c1121f', backgroundColor: 'rgba(230,57,70,0.05)' },
  },
  checkoutButton: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    minWidth: '140px',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': { backgroundColor: '#0f3460' },
  },
}));
