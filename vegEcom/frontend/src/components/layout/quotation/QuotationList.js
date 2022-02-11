import React, { Fragment , useState , useEffect} from 'react';
import { DataGrid, GridToolbar  } from '@material-ui/data-grid';
import Title from '../dashboard/Title';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddIcon from '@material-ui/icons/Add';
import Skeleton from 'react-loading-skeleton';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PrintIcon from '@material-ui/icons/Print';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import NewQuotation from './NewQuotation';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function QuotationList() {
    const [quotationId,setQuotationId] = useState(-1);
    const [deleteQuotationId,setDeleteQuotationId] = useState(0);
    const [rows,setRows] = useState([]);

    const [isLoading,setIsLoading] = useState(false)
    const [from_date, setFromDate] = useState('');
    const [to_date, setToDate] = useState('');

    const [isDeleteLoading, setIsDeleteLoading] = useState(false)
    const [isAlert, setIsAlert] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [alert, setAlert] = useState({
        message: "", color: "success"
    })

    useEffect(()=>{
        getQuotations()
    },[quotationId])

    const cols = [
        {field : "quotationNo",headerName:"Quotation No.",width:150},
        {field : "name", headerName:"Customer Name",width:180},
        {field : "phoneNumber", headerName:"Phone No.",width:150},
        {field : "total", headerName:"Total",width:120},
        {field : "discount", headerName:"discount",width:120},
        {field : "grandTotal", headerName:"Grand Total",width:120},
        {
            field: 'id',
            headerName: ' ',
            width:200,
            renderCell: (GridCellParams) => (
                <div>
                    <IconButton size="small" color="primary" aria-label="edit"
                    onClick={e => setQuotationId(GridCellParams.value)}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="secondary" aria-label="delete" 
                    onClick={e => {
                        setDeleteQuotationId(GridCellParams.value)
                        setConfirmOpen(true)
                    }}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                    <a href={`/api/quotation?quotation=${GridCellParams.value}`} target="_blank">
                    <IconButton size="small" color="primary" aria-label="delete">
                        <PrintIcon fontSize="small" />
                    </IconButton>
                    </a>
                </div>
            ),
        },
    ];


    const getQuotations = ()=>{
        setIsLoading(true)
        fetch('/api/w/quotations',{
            method:"GET",
            headers:{
                Authorization:`Token ${localStorage.getItem('AdminToken')}`
            }
        })
        .then(response => response.json())
        .then(data => {
            setRows(data)
            setIsLoading(false)
        })
    }

    const deleteQuotation = () => {
        setIsDeleteLoading(true)
        fetch(`/api/w/quotations/${deleteQuotationId}/`,{
            method:'DELETE',
            headers:{Authorization:`Token ${localStorage.getItem('AdminToken')}`}
        })
        .then(response => {
            if(!response.ok)
                throw new Error("Quotation Deleteion Failed.")
            setIsDeleteLoading(false)
            setAlert({
                message:"Quotation Deleted Successfully.",
                color:"success"
            })

            setIsAlert(true)
            setConfirmOpen(false)
            getQuotations()
         
        })
        .catch(err => {
            setAlert({
                message:err.message,
                color:"error"
            })
            setIsAlert(true)
            setIsDeleteLoading(false)

        })
    }

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setIsAlert(false);
    }

    return (
        <Fragment>
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
                        Are You Sure Delete the Quotation permenantly?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained" onClick={deleteQuotation}>
                        {isDeleteLoading ? <CircularProgress size={24} color="#fff" /> : "Yes"}
                    </Button>
                    <Button onClick={() => setConfirmOpen(false)} color="secondary" variant="contained">
                        No
                    </Button>
                </DialogActions>
            </Dialog>
            {quotationId != -1 ?
                <div>
                    <Button
                        color="primary"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => {
                            setQuotationId(-1)
                        }}>
                        Back to List
                    </Button>
                    <NewQuotation id={quotationId} />
                </div>
                :
                <div>
                    <Box display="flex" p={1} bgcolor="background.paper">
                        <Box flexGrow={1}>
                            <Title>Quotation</Title>
                        </Box>
                        <Box>
                            <Button
                                color="primary"
                                variant="contained"
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={e => setQuotationId(0)}
                            >
                                New Quotation
                            </Button>
                        </Box>
                    </Box>
                    {isLoading ?
                        <Skeleton count={12} />
                        :
                        <div style={{ height: 400, width: '100%' }}>
                            <DataGrid
                                density="compact"
                                rows={rows}
                                columns={cols}
                                pageSize={10}
                                components={{
                                    Toolbar: GridToolbar,
                                }} />
                        </div>
                    }
                </div>
            }

        </Fragment>
    )

}
