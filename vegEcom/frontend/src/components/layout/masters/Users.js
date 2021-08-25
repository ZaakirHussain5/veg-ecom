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

export default function Users() {
    const classes = useStyles();

    const [usersList,setUsersList] = useState([])
    const [name,setName] = useState("")
    const [nameError,setNameError] = useState(false)
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [passwordError,setPasswordError] = useState(false)
    const [phoneNo,setPhoneNo] = useState("")
    const [userId,setUserId] = useState(0)
    const [phoneNoError,setPhoneNoError] = useState(false)

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

    const loadUserList = function () {
        setIsLoading(true)
        fetch('/api/w/users/', {
            headers: {
                Authorization: `Token ${localStorage.getItem("AdminToken")}`
            }
        })
        .then(res => res.json())
        .then(users => {
            setIsLoading(false)
            setUsersList(users)
        })
    }

    useEffect(()=>{
        loadUserList();
    },[])

    const editBtnClick = function(user){
        setName(user.first_name)
        setEmail(user.email)
        setPhoneNo(user.username)
        setUserId(user.id)
    }

    const confirmDelete = function() {
        setIsDeleteLoading(true)
        fetch(`/api/w/users/${userId}/`,{
            method:'DELETE',
            headers:{
                Authorization:`Token ${localStorage.getItem("AdminToken")}`
            }
        })
        .then(res=>{
            if(!res.ok) throw Error("User Delettion Falied")
            setIsDeleteLoading(false)
            setConfirmOpen(false)
            setAlert({
                message:"User Deleted Successfully",
                color:"success"
            })
            setIsAlert(true)
            loadUserList()
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

    const saveUser = function(){
        setNameError(false)
        setPhoneNoError(false)
        setPasswordError(false)

        var errCount = 0;
        if(name==""){
            setNameError(true)
            errCount++;
        }
        if(phoneNo == ""){
            setPhoneNoError(true)
            errCount++;
        }
        if(!isEditMode && password == ""){
            setPasswordError(true)
            errCount++;
        }

        if(errCount)
            return

        let url = isEditMode ? `/api/w/users/${userId}/` : `/api/w/users/`;
        let method = isEditMode ? 'PUT' : 'POST';

        let body = {
            username:phoneNo,
            first_name:name,
            email,
            password
        }

        if (isEditMode)
            delete body.password
        
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
            if(!res.ok) throw Error("Couldn't Save User")
            return res.json()
        })
        .then(data=>{
            setIsSaveLoading(false)
            resetForm(); 
            setIsAlert(true)
            setAlert({
                message:"User Saved Successfully!",
                color:"success"
            })
            loadUserList();
        }).catch(err => {
            setIsSaveLoading(false)
            setIsAlert(true)
            setAlert({
                message:"User Saving Failed!",
                color:"error"
            })
        })
    }

    const resetForm = function(){
        setName("")
        setEmail("")
        setPhoneNo("")
        setPassword("")
        setUserId(0)
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
                        Are you sure to delete the user?
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
                            <Title>{isEditMode ? "Edit User" : "New User" }</Title>
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
                            label="Name"
                            fullWidth
                            value={name}
                            error={nameError}
                            onChange={e => setName(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            size="small"
                            className={classes.input}
                            label="Phone No."
                            fullWidth
                            value={phoneNo}
                            error={phoneNoError}
                            onChange={e=>setPhoneNo(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            size="small"
                            className={classes.input}
                            label="Email"
                            fullWidth
                            value={email}
                            onChange={e=>setEmail(e.target.value)}
                        />
                        {!isEditMode &&  <TextField
                            variant="outlined"
                            size="small"
                            className={classes.input}
                            type="password"
                            label="Password"
                            fullWidth
                            value={password}
                            error={passwordError}
                            onChange={e=>setPassword(e.target.value)}
                        /> }
                        <Button variant="contained" color="primary" size="small" onClick={saveUser} disabled={isSaveLoading} fullWidth>
                            {isSaveLoading ? "Saving..." : "Save User" } 
                        </Button>
                    </Grid>
                    <Grid item xs={9}>
                        <Box p={1}>
                            <Title>Users</Title>
                        </Box>
                        
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Name
                                    </TableCell>
                                    <TableCell>
                                        Email
                                    </TableCell>
                                    <TableCell>
                                        Phone No.
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
                                {usersList.length==0 && !isLoading && 
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        No users found!
                                    </TableCell>
                                </TableRow>
                                }
                                {usersList.map(user => (
                                    <TableRow>
                                        <TableCell>
                                            {user.first_name}
                                        </TableCell>
                                        <TableCell>
                                            {user.email}
                                        </TableCell>
                                        <TableCell>
                                            {user.username}
                                        </TableCell>
                                        <TableCell>
                                            <IconButton size="small" color="primary" aria-label="edit" onClick={() => {
                                                setIsEditMode(true)
                                                editBtnClick(user)
                                            }}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="secondary" aria-label="delete" onClick={() => {
                                                setUserId(user.id)
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
