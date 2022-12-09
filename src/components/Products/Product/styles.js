import { makeStyles } from '@material-ui/core/styles';
import { hover } from '@testing-library/user-event/dist/hover';

export default makeStyles(() => ({
    root: {
        maxWidth: '100%',
        height: '100%',
        backgroundColor: 'whitesmoke',
        boxShadow: ` 10px 10px 10px 2px lightblue`,
        position: 'relative',
    },
    media: {
        height: 0,
        paddingTop: '56.25%',
        height: '50%',
        width:'100%',
    },
    cardActions: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    cardContent: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    emptyheart: {
         width: 50,
        padding: 0,
        position: 'absolute',
        top: 10,
        cursor: 'pointer',
        color: 'brown',
        // opacity: 0.6
     },
     filledheart: {
        width: 50,
       padding: 0,
       position: 'absolute',
       top: 10,
       cursor: 'pointer',
       color: 'red'
    }, 
    hover: {
        height: 0,
        paddingTop: '56.25%',
        height: '50%',
        width:'100%',
        transform: 'scale(1.1)',
        transition: 'transform 1s',
    }
}));