import React , { useState , useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {
TextField,
Table,
TableBody,
TableRow,
TableHead,
Grid,
Paper,
TableCell,
Button,
IconButton,
Box,
Dialog,
DialogActions,
DialogContent,
DialogContentText,
CircularProgress
}
from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import Skeleton from 'react-loading-skeleton'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import Title from '../dashboard/Title'
import Admin from '../common/Admin'

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    input: {
        marginBottom: theme.spacing(2),
    },
    paper: {
        padding: theme.spacing(2),
        overflow: 'auto',
    },
}))

export default function pincodes() {
    const classes = useStyles();

    const [codesList,setCodesList] = useState([])
    const [code,setCode] = useState("")
    const [pincodeId,setpincodeId] = useState(0)
    const [codeError,setCodeError] = useState(false)

    const [isEditMode,setIsEditMode] = useState(false)
    const [isLoading,setIsLoading] = useState(false)
    const [isSaveLoading,setIsSaveLoading] = useState(false)
    const [isDeleteLoading,setIsDeleteLoading] = useState(false)
    const [confirmOpen,setConfirmOpen] = useState(false)

    const [isAlert,setIsAlert] = useState(false)
    const [alert,setAlert] = useState({
        message:"",
        color:"error"
    })

    const loadPincodeList = function () {
        setIsLoading(true)
        fetch('/api/w/pincodes/', {
            headers: {
                Authorization: `Token ${localStorage.getItem("AdminToken")}`
            }
        })
        .then(res => res.json())
        .then(pincodes => {
            setIsLoading(false)
            setCodesList(pincodes)
        })
    }

    useEffect(()=>{
        loadPincodeList();
    },[])

    const editBtnClick = function(pincode){
        setCode(pincode.pincode)
        setpincodeId(pincode.id)
    }

    const confirmDelete = function() {
        setIsDeleteLoading(true)
        fetch(`/api/w/pincodes/${pincodeId}/`,{
            method:'DELETE',
            headers:{
                Authorization:`Token ${localStorage.getItem("AdminToken")}`
            }
        })
        .then(res=>{
            if(!res.ok) throw Error("pincode Delettion Falied")
            setIsDeleteLoading(false)
            setConfirmOpen(false)
            setAlert({
                message:"pincode Deleted Successfully",
                color:"success"
            })
            setIsAlert(true)
            loadPincodeList()
        }).catch(err => {
            setIsDeleteLoading(false)
            setConfirmOpen(false)
            setAlert({
                message:err.message,
                color:"error"
            })
            setIsAlert(true)
        })
    }

    const savepincode = function(){
        setCodeError(false)

        if(code==""){
            setCodeError(true)
            return
        }

        let url = isEditMode ? `/api/w/pincodes/${pincodeId}/` : `/api/w/pincodes/`;
        let method = isEditMode ? 'PUT' : 'POST';

        let body = {
            pincode:code,
        }
        
        setIsSaveLoading(true)
        fetch(url,{
            method,
            body:JSON.stringify(body),
            headers:{
                Authorization:`Token ${localStorage.getItem("AdminToken")}`,
                "Content-type":"application/json"
            }
        })
        .then(res => {
            if(!res.ok) throw Error("Couldn't Save pincode")
            return res.json()
        })
        .then(data=>{
            setIsSaveLoading(false)
            resetForm(); 
            setIsAlert(true)
            setAlert({
                message:"pincode Saved Successfully!",
                color:"success"
            })
            loadPincodeList();
        }).catch(err => {
            setIsSaveLoading(false)
            setIsAlert(true)
            setAlert({
                message:"pincode Saving Failed!",
                color:"error"
            })
        })
    }

    const resetForm = function(){
        setCode("")
        setpincodeId(0)
        setIsEditMode(false)
    }

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setIsAlert(false);
    };

    return (
        <Admin>
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
                        Are you sure to delete the pincode?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained" onClick={confirmDelete}>
                        {isDeleteLoading ? <CircularProgress size={24} color="#fff" /> : "Yes"}
                    </Button>
                    <Button onClick={() => setConfirmOpen(false)} color="secondary" variant="contained">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Paper className={classes.paper}>
                <Grid container>
                    <Grid item xs={3}>
                    <Box display="flex" p={1} bgcolor="background.paper">
                        <Box flexGrow={1}>
                            <Title>{isEditMode ? "Edit pincode" : "New pincode" }</Title>
                        </Box>
                        <Box>
                            {isEditMode && 
                            <IconButton size="small" onClick={resetForm}>
                                <CloseIcon />
                            </IconButton>}
                        </Box>
                    </Box>
                        <TextField
                            variant="outlined"
                            size="small"
                            className={classes.input}
                            label="Pincode"
                            fullWidth
                            value={code}
                            error={codeError}
                            onChange={e => setCode(e.target.value)}
                        />
                        <Button variant="contained" color="primary" size="small" onClick={savepincode} disabled={isSaveLoading}>
                            {isSaveLoading ? "Saving..." : "Save pincode" } 
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Box p={1} pt={3}>
                            <Title>Pincodes</Title>
                        </Box>
                        
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Pincode
                                    </TableCell>
                                    <TableCell>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading && 
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            <Skeleton count={12}/>
                                        </TableCell>
                                    </TableRow>}
                                {codesList.length==0 && !isLoading && 
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No pincodes found!
                                    </TableCell>
                                </TableRow>
                                }
                                {codesList.map(pincode => (
                                    <TableRow>
                                        <TableCell>
                                            {pincode.pincode}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton size="small" color="primary" aria-label="edit" onClick={() => {
                                                setIsEditMode(true)
                                                editBtnClick(pincode)
                                            }}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="secondary" aria-label="delete" onClick={() => {
                                                setpincodeId(pincode.id)
                                                setConfirmOpen(true)
                                            }}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </Paper>
        </Admin>
    )
}
