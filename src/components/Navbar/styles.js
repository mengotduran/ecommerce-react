import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  appBar: {
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  toolbar: {
    minHeight: '64px',
  },
  title: {
    flexGrow: 1,
    color: '#1a1a2e',
    fontWeight: 700,
    textDecoration: 'none',
    fontSize: '1.4rem',
    letterSpacing: '1px',
  },
  cartButton: {
    color: '#1a1a2e',
  },
}));
