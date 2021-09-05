import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';
import Skeleton from 'react-loading-skeleton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import {Link} from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
    btn: {
        margin: theme.spacing(1),
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function OrderDetails(props) {
    const classes = useStyles();

    const [orderId,setOrderId] = useState("")
    const [phoneNo,setPhoneNo] = useState("")
    const [customerName,setCustomerName] = useState("")
    const [deliveryAddress,setDeliveryAddress] = useState("")
    const [orderStatus, setOrderStatus] = useState("Pending")
    const [orderItems, setOrderItems] = useState([]);
    const [isInvoiceCreated, setIsInvoiceCreated] = useState(false);
    const [isCashOnDelivery, setIsCashOnDelivery] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false)
    const [isOrderProcessing, setIsOrderProcessing] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        fetch(`/api/w/AdminOrder/${props.id}/`, {
            method: "GET",
            headers: {
                "Authorization": `Token ${localStorage.getItem('AdminToken')}`
            }
        })
            .then(response => response.json())
            .then(order => {
                setOrderId(order.orderId)
                setIsInvoiceCreated(order.isInvoiceCreated)
                setOrderStatus(order.status)
                setIsCashOnDelivery(order.isCashOnDelivery)
                if(order.shippingAddress)
                    setDeliveryAddress(order.shippingAddress.address)
                if(order.user){
                    setPhoneNo(order.user.username)
                    setCustomerName(order.user.fullName)
                }
                
                
                var orderItemsFromAPI = order.items
                var newOrderItems = []

                orderItemsFromAPI.map(orderItem => {
                    newOrderItems.push({
                        id:orderItem.id,
                        ProductName: orderItem.productType.name,
                        qty: orderItem.qty,
                        unit: orderItem.unit
                    })
                })

                setOrderItems(newOrderItems)
                setIsLoading(false)
            })
    }, [props.id])

    const processOrder = function(){
        setIsOrderProcessing(true)
        fetch(`/api/w/AdminOrder/${props.id}/`,{
            method:"PATCH",
            body:JSON.stringify({"status":orderStatus}),
            headers:{
                "Authorization": `Token ${localStorage.getItem('AdminToken')}`,
                "Content-type":"application/json"
            },
        })
        .then(response => {
            if(response.ok){
                setIsOrderProcessing(false)
                setAlertOpen(true);
            }
        }).catch(err => console.log(err))
    }

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setAlertOpen(false);
    };

    return (
        <Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={6}>
                    {isLoading ?
                        <div>
                            <Skeleton count={9} />
                        </div>
                        :
                        <TableContainer component={Paper}>
                            <Table className={classes.table} size="small" aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" colSpan="2" >Order Details</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            Order ID
                                        </TableCell>
                                        <TableCell>
                                            {orderId}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Customer Name
                                        </TableCell>
                                        <TableCell>
                                            {customerName}
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
                                            Delivery Address
                                        </TableCell>
                                        <TableCell>
                                            {deliveryAddress}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Cash on Delivery
                                        </TableCell>
                                        <TableCell>
                                            {isCashOnDelivery ? "Yes" : "No"}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Status
                                        </TableCell>
                                        <TableCell>
                                            <FormControl fullWidth variant="outlined" size="small">
                                                <InputLabel id="demo-simple-select-outlined-label">Status</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-outlined-label"
                                                    id="demo-simple-select-outlined"
                                                    value={orderStatus}
                                                    label="Status"
                                                    onChange={(e) => setOrderStatus(e.target.value)}
                                                >
                                                    <MenuItem value="Pending">Pending</MenuItem>
                                                    <MenuItem value="Processing">Processing</MenuItem>
                                                    <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
                                                    <MenuItem value="Delivered">Delivered</MenuItem>
                                                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={2} align="right">
                                            <Button variant="contained" size="small" className={classes.btn} color="primary" onClick={processOrder}>
                                                { isOrderProcessing ? <CircularProgress size={24} style={{color:"#fff"}}/> : "Save Changes"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>

                    }
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                    {isLoading ?
                        <div>
                            <Skeleton count={12} />
                        </div>
                        :
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center" colSpan="2" >Order Item Details</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            Item
                                        </TableCell>
                                        <TableCell>
                                            Quantity
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orderItems.map((orderItem) => {
                                        return (
                                            <TableRow key={orderItem.id}>
                                                <TableCell>
                                                    {orderItem.ProductName}
                                                </TableCell>
                                                <TableCell>
                                                    {orderItem.qty + ' ' + orderItem.unit}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                    <TableRow>
                                        <TableCell colSpan="2" align="right">
                                            {!isInvoiceCreated &&
                                                <Link to={"/NewInvoice/" + props.id}>
                                                    <Button variant="contained" size="small" className={classes.btn} color="primary">
                                                        Create Invoice
                                                    </Button>
                                                </Link>}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                </Grid>
            </Grid>
            <Snackbar  anchorOrigin={{ vertical:"top", horizontal:"center" }} open={alertOpen} autoHideDuration={6000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity="success">
                    Changes Saved Successfully!
                </Alert>
            </Snackbar>
        </Fragment>

    )
}