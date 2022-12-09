import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(( theme ) => ({
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        // backgroundColor: theme.palette.background.default,
        backgroundColor: '#eaf5f9',
        padding: theme.spacing(2),
    }, 
    root: {
        flexGrow: 1,
    },
    heart: {
        width: 50,
       padding: 0,
       position: 'absolute',
       top: 10,
       cursor: 'pointer',
    } 
}));

