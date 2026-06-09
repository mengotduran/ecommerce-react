import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(6),
    [theme.breakpoints.up(640 + theme.spacing(2) * 2)]: {
      width: 640,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(4),
    borderRadius: '16px',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
  },
  heading: {
    fontWeight: 700,
    color: '#1a1a2e',
  },
  stepper: {
    padding: theme.spacing(3, 0, 4),
  },
  divider: {
    margin: '20px 0',
  },
  confirmation: {
    textAlign: 'center',
    padding: theme.spacing(4, 0),
  },
  confirmIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#00b894',
    color: '#fff',
    fontSize: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  confirmTitle: {
    fontWeight: 700,
    color: '#1a1a2e',
  },
  backHomeButton: {
    marginTop: theme.spacing(3),
    backgroundColor: '#1a1a2e',
    color: '#fff',
    borderRadius: '8px',
    textTransform: 'none',
    fontWeight: 600,
    padding: '10px 28px',
    '&:hover': { backgroundColor: '#0f3460' },
  },
}));
