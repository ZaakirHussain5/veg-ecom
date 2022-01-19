import React, { Fragment, useState ,useEffect} from 'react';
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
import Skeleton from 'react-loading-skeleton';

const useStyles = makeStyles((theme) => ({
    btn: {
        margin: theme.spacing(1),
    },
}));

export default function InvoiceDetails(props) {
    const classes = useStyles();

    const [invoiceId, setInvoiceId] = useState(props.id)
    const [invoiceNo, setInvoiceNo] = useState("")
    const [customerName, setCustomerName] = useState("")
    const [phoneNo, setPhoneNo] = useState("")
    const [address, setAddress] = useState("")

    const [isLoading, setIsLoading ] = useState(false)

    const [invoiceItems, setInvoiceItems] = useState([]);

    useEffect(()=>{
        setIsLoading(true)
        fetch(`/api/w/invoices/${invoiceId}/`,{
            method:'GET',
            headers:{
                Authorization: `Token ${localStorage.getItem('AdminToken')}`
            }
        })
        .then(res => res.json())
        .then(invoice => {
            
            setInvoiceNo(invoice.invoiceID)
            setCustomerName(invoice.user.first_name)
            setPhoneNo(invoice.user.username)
            setAddress(invoice.billingAddress)

            var invoiceItemsList = []
            invoice.invoiceItems.map(({ item, qty, price, total }) => {
                invoiceItemsList.push({
                    ProductName: item,
                    qty,
                    price,
                    amount: total,
                    unit:"KGS"
                })
            })

            setInvoiceItems(invoiceItemsList)
            setIsLoading(false)
        })
    },[invoiceId])

    return (
        <Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={6}>
                    {isLoading ?
                        <Skeleton count={6} />
                        :
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
                                            {invoiceNo}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Customer Phone No.
                                        </TableCell>
                                        <TableCell>
                                            {phoneNo}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Customer Address
                                        </TableCell>
                                        <TableCell>
                                            {address}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                    {isLoading ?
                        <Skeleton count={10} />
                        : 
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
                                            <a target="_blank" href={'/api/invoice?invoice='+invoiceNo}>
                                            <Button variant="contained" size="small" className={classes.btn} color="primary">
                                                Print Invoice
                                            </Button>
                                            </a>
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
                    }
                   </Grid>
            </Grid>
        </Fragment>

    )
}