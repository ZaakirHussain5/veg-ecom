import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Title from '../dashboard/Title';
import Button from '@material-ui/core/Button';
import InventoryForm from './InventoryForm'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Avatar from '@material-ui/core/Avatar';
import Skeleton from 'react-loading-skeleton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useRowStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

function Row(props) {
    const { row, editItemFunc , deleteItemFunc} = props;
    const [open, setOpen] = useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Avatar alt="Product Image" src={row.image} className={classes.large} />
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell>
                    <IconButton size="small" color="primary" aria-label="edit" onClick={
                        () => editItemFunc(row.id)
                    }>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="secondary" aria-label="delete" onClick={
                        () => deleteItemFunc(row.id)
                    }>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Types
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Type
                                        </TableCell>
                                        <TableCell>
                                            Rest. Price
                                        </TableCell>
                                        <TableCell>
                                            Gen. Price
                                        </TableCell>
                                        <TableCell>
                                            House. Price
                                        </TableCell>
                                        <TableCell>
                                            Avl. Qty
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.types.map((typeRow) => (
                                        <TableRow key={typeRow.date}>
                                            <TableCell component="th" scope="row">
                                                {typeRow.name}
                                            </TableCell>
                                            <TableCell>{typeRow.rPrice}/{typeRow.rPriceQuantity}KGS</TableCell>
                                            <TableCell>{typeRow.rPrice}/{typeRow.rPriceQuantity}KGS</TableCell>
                                            <TableCell>{typeRow.rPrice}/{typeRow.rPriceQuantity}KGS</TableCell>
                                            <TableCell>{typeRow.avlQty}KGS</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}


export default function InventoryList() {

    const [itemId, setItemId] = useState(0)
    const [deleteItemId, setDeleteItemId] = useState(0)

    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [isAlert, setIsAlert] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [alert, setAlert] = useState({
        message: "", color: "success"
    })

    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = function () {
        setIsLoading(true)
        fetch('/api/w/product/', {
            headers: {
                "Authorization": `Token  ${localStorage.getItem("AdminToken")}`
            }
        })
            .then(res => res.json())
            .then(products => {
                setRows(products)
                setIsLoading(false)
            })
    }

    const editItem = (id) => {
        setItemId(id)
    }

    const deleteItem = (id) => {
        setDeleteItemId(id)
        setConfirmOpen(true)
    }
    
    const confirmDelete = () => {
        setIsDeleteLoading(true)
        setTimeout(()=>{
            setIsDeleteLoading(false)
            setAlert({
                color:"success",
                message:"Product Deleted Successfully!"
            })
            setIsAlert(true)
            setConfirmOpen(false)
            loadProducts()
        },2000)
    }

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setIsAlert(false);
    };

    return (
        <Fragment>
            {itemId ?
                <div>
                    <Button
                        color="primary"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => {
                            setItemId(0)
                        }}>
                        Back to List
                    </Button>
                    <InventoryForm id={itemId} />
                </div>
                :
                <div>
                    <Snackbar open={isAlert} anchorOrigin={{ vertical: "top", horizontal: "center" }} autoHideDuration={6000} onClose={handleAlertClose}>
                        <Alert onClose={handleAlertClose} severity={alert.color}>
                            {alert.message}
                        </Alert>
                    </Snackbar>
                    <Dialog
                        fullWidth
                        maxWidth="xs"
                        open={confirmOpen}
                        onClose={() => setConfirmOpen(false)}
                        aria-labelledby="max-width-dialog-title"
                    >
                        <DialogContent>
                            <DialogContentText>
                                Are You Sure Delete the Product permenantly?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" variant="contained" onClick={confirmDelete}>
                                {isDeleteLoading ? <CircularProgress size={24} color="#fff" /> : "Yes" }
                            </Button>
                            <Button onClick={() => setConfirmOpen(false)} color="secondary" variant="contained">
                                No
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Box display="flex" p={1} bgcolor="background.paper">
                        <Box flexGrow={1}>
                            <Title>Inventory List</Title>
                        </Box>
                        <Box>
                            <Button
                                color="primary"
                                variant="contained"
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={() => setItemId(-1)}
                            >
                                Add New Product
                            </Button>
                        </Box>
                    </Box>

                    {isLoading ?
                        <Skeleton count={12} />
                        :
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell />
                                        <TableCell>
                                            Image
                                        </TableCell>
                                        <TableCell>
                                            Product Name
                                        </TableCell>
                                        <TableCell>
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row, idx) => (
                                        <Row key={idx} row={row} editItemFunc={editItem} deleteItemFunc={deleteItem} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                </div>
            }
        </Fragment>
    );
}