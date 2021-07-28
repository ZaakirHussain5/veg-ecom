import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import OrdersList from '../layout/orders/OrdersList'
import Admin from '../layout/common/Admin';



const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
}))

export default function Customers() {
    const classes = useStyles();
    
    return (
        <Admin>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                    <Paper className={classes.paper}>
                        <OrdersList /> 
                    </Paper>
                </Grid>
            </Grid>
        </Admin>
    );
}
