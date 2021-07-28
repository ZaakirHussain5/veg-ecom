import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InvoiceFormLayout from './InvoiceFormLayout'
import Admin from '../common/Admin';
import { useParams } from 'react-router-dom';



const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
}))

export default function InvoiceForm() {
    const classes = useStyles();
    const { id , order } = useParams();
    
    return (
        <Admin>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                    <Paper className={classes.paper}>
                        <InvoiceFormLayout orderId={order} id={id} /> 
                    </Paper>
                </Grid>
            </Grid>
        </Admin>
    );
}
