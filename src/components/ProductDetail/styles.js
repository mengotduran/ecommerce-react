import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
    paddingBottom: theme.spacing(6),
  },
  toolbar: theme.mixins.toolbar,
  backBtn: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    color: '#1a1a2e',
    textTransform: 'none',
    fontWeight: 600,
  },
  content: {
    marginTop: theme.spacing(1),
  },

  // ── Image section ──
  imageSection: {
    display: 'flex',
    gap: theme.spacing(1.5),
    alignItems: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
    },
  },
  thumbnailStrip: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
      overflowX: 'auto',
      paddingBottom: '4px',
    },
  },
  thumb: {
    width: '70px',
    height: '70px',
    padding: 0,
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: '#fff',
    flexShrink: 0,
    transition: 'border-color 0.2s',
    '&:hover': {
      borderColor: '#1a1a2e',
    },
    [theme.breakpoints.down('sm')]: {
      width: '60px',
      height: '60px',
    },
  },
  thumbActive: {
    width: '70px',
    height: '70px',
    padding: 0,
    border: '2px solid #1a1a2e',
    borderRadius: '8px',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: '#fff',
    flexShrink: 0,
    [theme.breakpoints.down('sm')]: {
      width: '60px',
      height: '60px',
    },
  },
  thumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  mainImageWrapper: {
    flex: 1,
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  mainImage: {
    width: '100%',
    height: '440px',
    objectFit: 'cover',
    display: 'block',
    transition: 'opacity 0.2s ease',
    [theme.breakpoints.down('sm')]: {
      height: '280px',
    },
  },

  // ── Product info ──
  info: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: theme.spacing(3),
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing(0.5),
  },
  name: {
    fontWeight: 700,
    color: '#1a1a2e',
    lineHeight: 1.2,
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.5rem',
    },
  },
  likeBtn: {
    marginLeft: theme.spacing(1),
    marginTop: '-4px',
  },
  heartFilled: {
    color: '#e63946',
    fontSize: '1.8rem',
  },
  heartEmpty: {
    color: '#9ca3af',
    fontSize: '1.8rem',
  },
  price: {
    color: '#e63946',
    fontWeight: 700,
    fontSize: '1.8rem',
    marginBottom: theme.spacing(1),
  },
  inStock: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  description: {
    color: '#4b5563',
    lineHeight: 1.7,
    marginBottom: theme.spacing(2),
    '& p': { margin: 0 },
  },
  section: {
    marginBottom: theme.spacing(2),
  },
  sectionLabel: {
    color: '#6b7280',
    marginBottom: theme.spacing(0.5),
    fontWeight: 500,
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  qtyBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: '1px solid #d0d0d0',
    backgroundColor: '#f9f9f9',
    fontSize: '1.2rem',
    cursor: 'pointer',
    fontWeight: 700,
    color: '#1a1a2e',
    '&:hover': { backgroundColor: '#e9e9e9' },
  },
  qtyValue: {
    fontSize: '1.1rem',
    fontWeight: 600,
    minWidth: '24px',
    textAlign: 'center',
    color: '#1a1a2e',
  },
  addButton: {
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    borderRadius: '10px',
    textTransform: 'none',
    fontWeight: 600,
    padding: '12px',
    fontSize: '1rem',
    marginBottom: theme.spacing(3),
    '&:hover': { backgroundColor: '#0f3460' },
  },
  addedButton: {
    backgroundColor: '#00b894',
    color: '#ffffff',
    borderRadius: '10px',
    textTransform: 'none',
    fontWeight: 600,
    padding: '12px',
    fontSize: '1rem',
    marginBottom: theme.spacing(3),
    '&:hover': { backgroundColor: '#00a381' },
  },
  featuresTitle: {
    fontWeight: 700,
    color: '#1a1a2e',
    marginBottom: theme.spacing(1),
  },
  featuresList: {
    paddingLeft: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  featureItem: {
    marginBottom: theme.spacing(0.5),
    color: '#4b5563',
  },
  badges: {
    display: 'flex',
    gap: theme.spacing(2),
    paddingTop: theme.spacing(2),
    borderTop: '1px solid #f0f0f0',
    flexWrap: 'wrap',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#6b7280',
  },
  badgeIcon: {
    fontSize: '1.1rem',
    color: '#457b9d',
  },
}));
