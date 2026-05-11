import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
  },
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
    color: '#ffffff',
    padding: theme.spacing(10, 4),
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(6, 2),
    },
  },
  heroTitle: {
    fontWeight: 700,
    color: '#ffffff',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      fontSize: '1.8rem',
    },
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '1.1rem',
    [theme.breakpoints.down('xs')]: {
      fontSize: '0.95rem',
    },
  },

  // Filter bar
  filterBar: {
    backgroundColor: '#ffffff',
    padding: theme.spacing(2, 3),
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1.5, 2),
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderRadius: '10px',
    padding: '6px 14px',
    flex: 1,
    minWidth: '200px',
    border: '1px solid transparent',
    transition: 'border 0.2s',
    '&:focus-within': {
      border: '1px solid #1a1a2e',
      backgroundColor: '#ffffff',
    },
  },
  searchIcon: {
    color: '#9ca3af',
    marginRight: theme.spacing(1),
    fontSize: '1.2rem',
  },
  searchInput: {
    flex: 1,
    fontSize: '0.95rem',
    color: '#1a1a2e',
  },
  chips: {
    display: 'flex',
    gap: theme.spacing(1),
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#f0f2f5',
    color: '#4b5563',
    fontWeight: 500,
    border: '1px solid #e0e0e0',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#e2e5ea',
    },
  },
  chipActive: {
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    fontWeight: 600,
    border: '1px solid #1a1a2e',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#0f3460',
    },
    '&:focus': {
      backgroundColor: '#1a1a2e',
    },
  },

  resultRow: {
    padding: theme.spacing(1.5, 3, 0),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(1, 2, 0),
    },
  },
  resultCount: {
    color: '#6b7280',
    fontSize: '0.85rem',
  },

  grid: {
    padding: theme.spacing(2, 3, 4),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2, 1),
    },
  },

  noResults: {
    textAlign: 'center',
    padding: theme.spacing(8, 0),
  },
}));
