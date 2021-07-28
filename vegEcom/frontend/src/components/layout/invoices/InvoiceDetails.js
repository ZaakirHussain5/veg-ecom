import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    btn: {
        margin: theme.spacing(1),
    },
}));

export default function InvoiceDetails(props) {
    const classes = useStyles();

    const [invoiceId, setInvoiceId] = useState(0)

    const [invoiceItems, setInvoiceItems] = useState([
        { id: "1", ProductName: "Large Potatoes Bag1", qty: "100", unit: "KGS",price:"₹12/100 KGS",amount:"₹1200" },
        { id: "2", ProductName: "Large Tomatoes Bag2", qty: "100", unit: "KGS",price:"₹12/100 KGS",amount:"₹1200" },
        { id: "3", ProductName: "Small Potatoes Bag1", qty: "100", unit: "KGS",price:"₹12/100 KGS",amount:"₹1200" },
        { id: "4", ProductName: "Large Garlic Bag1", qty: "100", unit: "KGS",price:"₹12/100 KGS",amount:"₹1200" },
        { id: "5", ProductName: "Red Chillies Bag2", qty: "100", unit: "KGS",price:"₹12/100 KGS",amount:"₹1200" },
    ]);

    return (
        <Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={6}>
                    <TableContainer component={Paper}>
                        <Table className={classes.table} size="small" aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" colSpan="2" >Invoice Details</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        Invoice ID
                                    </TableCell>
                                    <TableCell>
                                        VBO2021-11
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Customer Phone No.
                                    </TableCell>
                                    <TableCell>
                                        +91 9878647556
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Customer Address
                                    </TableCell>
                                    <TableCell>
                                        #12345 Loki Road,MCU Layout,
                                        Avn Nagar.
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" colSpan="4" >Invoice Item Details</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Item
                                </TableCell>
                                    <TableCell>
                                        Quantity
                                </TableCell>
                                    <TableCell>
                                        Price
                                </TableCell>
                                    <TableCell>
                                        Amount
                                </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {invoiceItems.map((InvoiceItem) => {
                                    return (
                                        <TableRow key={InvoiceItem.id}>
                                            <TableCell>
                                                {InvoiceItem.ProductName}
                                            </TableCell>
                                            <TableCell>
                                                {InvoiceItem.qty + ' ' + InvoiceItem.unit}
                                            </TableCell>
                                            <TableCell>
                                                {InvoiceItem.price}
                                            </TableCell>
                                            <TableCell>
                                                {InvoiceItem.amount}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                <TableRow>
                                    <TableCell colSpan="4" align="right">
                                        <Link to={"/EditInvoice/" + invoiceId}>
                                            <Button variant="contained" size="small" className={classes.btn} color="primary">
                                                Edit Invoice
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>

                    </TableContainer>
                </Grid>
            </Grid>
        </Fragment>

    )
}