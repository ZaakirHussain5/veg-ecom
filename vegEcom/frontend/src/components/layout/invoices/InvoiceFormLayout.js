import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Title from '../dashboard/Title'
import CheckIcon from '@material-ui/icons/Check';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    input: {
        marginTop: theme.spacing(2),
    },
    btn: {
        margin: theme.spacing(1),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: 'primary',
    }
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function InvoiceFormLayout(props) {
    const classes = useStyles();
    const history = useHistory();

    const [invoiceId, setInvoiceId] = useState(props.id)
    const [orderId, setOrderId] = useState(props.orderId)

    const [customerName, setCustomerName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [phoneNoError, setPhoneNoError] = useState(false);
    const [address, setAddress] = useState("");
    const [addressError, setAddressError] = useState(false);

    const [orderItems, setOrderItems] = useState([]);
    const [itemName, setItemName] = useState("");
    const [qty, setQty] = useState(1.00);
    const [price, setPrice] = useState(0.00);
    const [amount, setAmount] = useState(0.00);
    const [subTotal, setSubTotal] = useState(0.00);
    const [discount, setDiscount] = useState(0.00);
    const [grandTotal, setGrandTotal] = useState(0.00);
    const [itemNameError, setItemNameError] = useState(false);
    const [qtyError, setQtyError] = useState(false);
    const [priceError, setPriceError] = useState(false);
    const [amountError, setAmountError] = useState(false);

    const [paidAmount, setPaidAmount] = useState(0.00);
    const [balance, setBalance] = useState(0.00);

    const [editRowIndex, setEditRowIndex] = useState(-1)
    const [editQty, setEditQty] = useState(0)
    const [editPrice, setEditPrice] = useState(0)
    const [editAmount, setEditAmount] = useState(0)

    const [chargeName,setChargeName] = useState("")
    const [chargeAmount,setChargeAmount] = useState(0.00)
    const [charges,setCharges] = useState([])

    const [isLoading, setIsLoading] = useState(false)
    const [isAlert, setIsAlert] = useState(false)
    const [alert, setAlert] = useState({
        message: "", color: "success"
    })

    const [submitUrl,setSubmitUrl] = useState("/api/w/invoices/")
    const [submitMethod,setSubmitMethod] = useState("POST")

    useEffect(() => {
        calculate()
    }, [discount, orderItems,charges])

    useEffect(() => {
        loadOrderDetails()
    }, [orderId])

    const loadOrderDetails = function () {
        if (!orderId || orderId == 0)
            return
        setIsLoading(true)

        fetch(`/api/w/AdminOrder/${orderId}`, {
            headers: {
                Authorization: `Token ${localStorage.getItem("AdminToken")}`
            }
        })
            .then(res => res.json())
            .then(order => {
                setCustomerName(order.user.first_name)
                setPhoneNo(order.user.username)
                if(order.billingAddress)
                    setAddress(order.billingAddress.address)

                var newItemsList = []

                console.log(order)

                order.items.map(orderItem => {
                    var _itemName = "";
                    var _qty = orderItem.qty;
                    var _price = 0.00;
                    if (order.user.deliveryType == "R") {
                        _price = orderItem.productType.rPrice
                        _price = _price / orderItem.productType.rPriceQuantity
                    }
                    if (order.user.deliveryType == "G") {
                        _price = orderItem.productType.gPrice
                        _price = _price / orderItem.productType.gPriceQuantity
                    }
                    if (order.user.deliveryType == "H") {
                        _price = orderItem.productType.hPrice
                        _price = _price / orderItem.productType.hPriceQuantity
                    }

                    for (let i = 0; i < _qty; i++) {
                        _itemName = `${orderItem.productType.name} B${i + 1}`
                        newItemsList.push({
                            itemName: _itemName, qty: 1, price: _price, amount: _price
                        })
                    }
                })

                setOrderItems(newItemsList)

                setIsLoading(false)
            })
    }

    useEffect(() => {
        loadInvoiceDetails()
    }, [invoiceId])

    const loadInvoiceDetails = function (){
        if (!invoiceId || invoiceId == 0)
            return
        setIsLoading(true)
        fetch(`/api/w/invoices/${invoiceId}/`,{
            method:"GET",
            headers:{
                Authorization:`Token ${localStorage.getItem("AdminToken")}`
            }
        })
        .then(res=> res.json())
        .then(invoice => {
            setSubmitUrl(`/api/w/UpdateInvoice/`)
            setCustomerName(invoice.user.first_name)
            setPhoneNo(invoice.user.username)
            setAddress(invoice.billingAddress)
            setIsLoading(false)
            
            var invoiceItemsList = []
            var invoiceChargesList = []

            invoice.invoiceItems.map(({item,qty,price,total})=>{
                invoiceItemsList.push({
                    itemName:item,
                    qty,
                    price,
                    amount:total
                })
            })
            
            invoice.invoiceCharges.map(({chargeName,chargeAmount})=>{
                invoiceChargesList.push({
                    chargeName,chargeAmount
                })
            })

            setOrderItems(invoiceItemsList)
            setCharges(invoiceChargesList)
        })
    }

    const removeItem = (name) => {
        var newList = orderItems.filter((item) => item.itemName != name)

        setOrderItems(newList)
    }

    const addItem = () => {
        setItemNameError(false);
        setQtyError(false);
        setPriceError(false);
        setAmountError(false);

        if (itemName == '') {
            setItemNameError(true)
            return
        }
        if (qty == 0) {
            setQtyError(true)
            return
        }

        setAmount(price * qty)
        const newOrderItemsList = orderItems.concat({
            itemName, price, qty, amount
        })

        setOrderItems(newOrderItemsList)
        calculate()
        setItemName('')
        setQty(1)
        setPrice(10.00)
        setAmount(0.00)
    }

    const calculate = () => {
        var sumSubTotal = 0.00
        orderItems.forEach(function (item) {
            sumSubTotal += parseFloat(item.amount)
        })

        setSubTotal(sumSubTotal)

        var _grandTotal = sumSubTotal - (sumSubTotal * (discount / 100))

        var totalCharges = 0.00
        charges.map(charge=>{
            totalCharges += parseFloat(charge.chargeAmount)
        })

        _grandTotal += totalCharges

        setGrandTotal(_grandTotal)
        setPaidAmount(_grandTotal)
    }

    const handlePaidAmountChange = function () {
        var _balance = grandTotal - paidAmount
        console.log(grandTotal, paidAmount)
        setBalance(_balance)
    }

    const submitInvoice = function () {
        if (orderItems.length == 0) {
            setAlert({
                message: "Atleast one item should be added to the Invoice.",
                color: "error"
            })
            setIsAlert(true)
            return
        }

        if (paidAmount == '' ){
            setAlert({
                message: "Enter Paid Amount.",
                color: "error"
            })
            setIsAlert(true)
            return
        }

        setIsLoading(true)

        var itemsList = []
        orderItems.map(({ itemName, price, qty, amount }) => {
            itemsList.push({
                item: itemName,
                price,
                qty,
                unit: "KGS",
                total: amount
            })
        })

        var reqBody = {
            fullname: customerName,
            phoneNo,
            shippingAddress: address,
            billingAddress: address,
            total: subTotal,
            discount,
            grandTotal,
            status: "Pending",
            paid: paidAmount,
            balance,
            items: itemsList,
            charges,
            orderId,
            invoiceId
        }

        fetch(submitUrl, {
            method: submitMethod,
            headers: {
                Authorization: `Token ${localStorage.getItem("AdminToken")}`,
                "Content-type": "application/json"
            },
            body: JSON.stringify(reqBody)
        }).then(res => {
            console.log(res)
            if (!res.ok)
                throw Error(res.body)
            return res.json()
        }).then(data => {
            setAlert({
                message: "Invoice Saved Successfuly.",
                color: "success"
            })
            refreshPage()
            setIsLoading(false)
        }).catch(err => {
            setAlert({
                message: err.message,
                color: "error"
            })
            setIsAlert(true)
            setIsLoading(false)
            refreshPage()
        })
    }

    const refreshPage = function () {
        setIsAlert(true)
        setOrderItems([])
        setPaidAmount(0.00)
        setBalance(0.00)
        setSubTotal(0.00)
        setDiscount(0.00)
        setGrandTotal(0.00)
        setCustomerName("")
        setPhoneNo("")
        setAddress("")
        loadOrderDetails()
        loadInvoiceDetails()
    }

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setIsAlert(false);
    };

    const activateEditMode = (index, curQty, curPrice,curAmount) => {
        setEditQty(curQty)
        setEditPrice(curPrice)
        setEditAmount(curAmount)
        setEditRowIndex(index)
    }

    const confirmEdit = (index) => {
        var newOrderItems = orderItems
        newOrderItems[index].qty = editQty
        newOrderItems[index].price = editPrice
        newOrderItems[index].amount = editQty * editPrice
        setOrderItems(newOrderItems)
        calculate()

        setEditRowIndex(-1)
    }

    const editQtyChange = function (e){
        setEditQty(e.target.value)
        setEditAmount(editPrice*editQty)
    }

    const editPriceChange = function (e){
        setEditPrice(e.target.value)
        setEditAmount(editPrice*editQty)
    }
    
    const addCharge = function(){
        var newChargesItemList = charges.concat({
            chargeAmount,chargeName
        })
        setCharges(newChargesItemList)
        setChargeName("")
        setChargeAmount(0.00)
    }

    return (
        <div>
            <Snackbar open={isAlert} anchorOrigin={{ vertical: "top", horizontal: "center" }} autoHideDuration={6000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity={alert.color}>
                    {alert.message}
                </Alert>
            </Snackbar>
            <Backdrop className={classes.backdrop} open={isLoading} >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Title>
                New Invoice
            </Title>
            <Grid container spacing={3}>
                <Grid item xs={6} md={4} lg={3}>
                    <Title>
                        Invoice Details
                    </Title>
                    <TextField className={classes.input}
                        label="Customer Name"
                        variant="outlined"
                        size="small"
                        value={customerName}
                        onChange={event => setCustomerName(event.target.value)}
                    />
                    <TextField className={classes.input}
                        label="Customer Phone No."
                        variant="outlined"
                        size="small"
                        value={phoneNo}
                        onChange={event => setPhoneNo(event.target.value)}
                    />
                    <TextField className={classes.input}
                        label="Billing Address"
                        variant="outlined"
                        size="small"
                        multiline
                        rows={4}
                        value={address}
                        onChange={event => setAddress(event.target.value)}
                    />
                </Grid>
                <Grid item xs={6} md={8} lg={9}>
                    <Title>
                        Invoice Item Details
                    </Title>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ width: 160 }}>
                                        Item
                                    </TableCell>
                                    <TableCell style={{ width: 80 }}>
                                        Qty
                                    </TableCell>
                                    <TableCell>
                                        Price
                                    </TableCell>
                                    <TableCell>
                                        Amount
                                    </TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            label="Item Name"
                                            value={itemName}
                                            variant="outlined"
                                            style={{ width: 160 }}
                                            error={itemNameError}
                                            onChange={(e) => setItemName(e.target.value)} />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            label="Quantity"
                                            value={qty}
                                            min={1}
                                            type="number"
                                            style={{ width: 80 }}
                                            error={qtyError}
                                            variant="outlined"
                                            onChange={(e) => {
                                                setQty(e.target.value)
                                                setAmount(e.target.value * price)
                                            }} />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            type="number"
                                            label="Price"
                                            value={price}
                                            style={{ width: 100 }}
                                            error={priceError}
                                            variant="outlined"
                                            onChange={(e) => {
                                                setPrice(e.target.value)
                                                setAmount(e.target.value * qty)
                                            }} />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            size="small"
                                            disabled
                                            label="Amount"
                                            value={amount}
                                            style={{ width: 100 }}
                                            error={amountError}
                                            variant="outlined" />
                                    </TableCell>
                                    <TableCell>
                                        <Button size="small" variant="contained" color="primary" aria-label="add" style={{ width: 40 }} onClick={addItem}>
                                            <AddIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                {orderItems.map((orderItem, idx) => {
                                    return (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                {orderItem.itemName}
                                            </TableCell>
                                            <TableCell>
                                                {editRowIndex == orderItems.indexOf(orderItem) ?
                                                    <TextField type="number" value={editQty} 
                                                    onChange={e => editQtyChange(e)} 
                                                    onKeyUp={e => editQtyChange(e)} 
                                                    />
                                                    :
                                                    orderItem.qty
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {editRowIndex == orderItems.indexOf(orderItem) ?
                                                    <TextField type="number" value={editPrice} 
                                                    onChange={e => editPriceChange(e)} 
                                                    onKeyUp={e => editPriceChange(e)} 
                                                    />
                                                    :
                                                    orderItem.price
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {editRowIndex == orderItems.indexOf(orderItem) ?
                                                    editAmount
                                                    :
                                                    orderItem.amount
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {editRowIndex != orderItems.indexOf(orderItem) ?
                                                    <IconButton size="small" aria-label="edit" color="primary" onClick={() => {
                                                        activateEditMode(orderItems.indexOf(orderItem), orderItem.qty, orderItem.price,orderItem.amount)
                                                    }}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                    :
                                                    <IconButton size="small" aria-label="edit" color="primary" onClick={() => {
                                                        confirmEdit(orderItems.indexOf(orderItem))
                                                    }}>
                                                        <CheckIcon fontSize="small" />
                                                    </IconButton>
                                                }

                                                <IconButton size="small" aria-label="delete" onClick={() => removeItem(orderItem.itemName)} color="secondary">
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                <TableRow>
                                    <TableCell colSpan="2">
                                        <TextField
                                            size="small"
                                            min={0}
                                            label="Charge Name"
                                            variant="outlined"
                                            fullWidth
                                            value={chargeName}
                                            onChange={e => setChargeName(e.target.value)}/>
                                    </TableCell>
                                    <TableCell colSpan="2">
                                        <TextField
                                            size="small"
                                            min={0}
                                            label="Charge Amount"
                                            variant="outlined"
                                            fullWidth 
                                            value={chargeAmount}
                                            onChange={e => setChargeAmount(e.target.value)}/>
                                    </TableCell>
                                    <TableCell>
                                        <Button size="small" variant="contained" color="primary" aria-label="add" style={{ width: 40 }} onClick={addCharge} >
                                            <AddIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 500 }}>
                                        Paid Amount
                                    </TableCell>
                                    <TableCell colSpan="2" align="right">
                                        <TextField
                                            size="small"
                                            min={0}
                                            value={paidAmount}
                                            label="Paid Amount"
                                            variant="outlined"
                                            onChange={event => {
                                                setPaidAmount(event.target.value)
                                                handlePaidAmountChange()
                                            }}
                                            onKeyUp={event => {
                                                setPaidAmount(event.target.value)
                                                handlePaidAmountChange()
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell style={{ fontWeight: 500 }}>
                                        Subtotal
                                    </TableCell>
                                    <TableCell align="right">
                                        {subTotal}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 500 }}>
                                        Balance
                                    </TableCell>
                                    <TableCell colSpan="2" align="right">
                                        <TextField
                                            size="small"
                                            disabled
                                            min={0}
                                            value={balance}
                                            label="Balance"
                                            variant="outlined" />
                                    </TableCell>
                                    <TableCell style={{ fontWeight: 500 }}>
                                        Discount (%)
                                    </TableCell>
                                    <TableCell align="right">
                                        <TextField
                                            size="small"
                                            min={0}
                                            value={discount}
                                            label="Discount"
                                            style={{ width: 100 }}
                                            variant="outlined"
                                            onChange={(e) => {
                                                setDiscount(e.target.value)
                                            }} />
                                    </TableCell>
                                </TableRow>
                                {charges.map((charge,idx) => {
                                    return (
                                    <TableRow key={idx}>
                                        <TableCell colSpan="3" />
                                        <TableCell style={{ fontWeight: 500 }}>
                                           {charge.chargeName}
                                        </TableCell>
                                        <TableCell align="right">
                                            {charge.chargeAmount}
                                        </TableCell>
                                    </TableRow>
                                    )
                                })}
                                <TableRow >
                                    <TableCell colSpan="3" />
                                    <TableCell bgcolor="#c1c1c1" style={{ fontWeight: 500 }}>
                                        Grand Total
                                    </TableCell>
                                    <TableCell bgcolor="#c1c1c1" align="right">
                                        {grandTotal}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={6} md={8} lg={9}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={submitInvoice}
                    >
                        Save Invoice
                    </Button>
                    <Button
                        variant="contained"
                        color="default"
                        startIcon={<RotateLeftIcon />}
                        className={classes.btn}
                        onClick={refreshPage}
                    >
                        Reset
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}