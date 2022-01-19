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
import Skeleton from 'react-loading-skeleton';
import Reports from './Reports'

const useStyles = makeStyles((theme) => ({
    btn: {
        margin: theme.spacing(1),
    },
}));

export default function CustomerDetails(props) {
    const classes = useStyles();
    const [customerName, setCustomerName] = useState("")
    const [customerPhoneNo, setCustomerPhoneNo] = useState("")
    const [customerRegDate, setCustomerRegDate] = useState("")

    const [isLoading,setIsLoading] = useState(false)
    const [error,setError] = useState(false)
    
    useEffect(()=>{
        setIsLoading(true)
        fetch(`/api/w/AdminCustomer/${props.id}/`,{
            method:"GET",
            headers:{
                Authorization:`Token ${localStorage.getItem('AdminToken')}`
            }
        })
        .then(response => {
            if(!response.ok)
                throw Error("An Error Occured")
            return response.json()
        })
        .then(data => {
            setCustomerName(data.fullName)
            setCustomerPhoneNo(data.username)
            setCustomerRegDate(data.date_joined)

            setIsLoading(false)
        })
        .catch(err=>{
            setIsLoading(false)
            setError(err.message)
        })
    },[props.id])

    return (
        <Fragment>
            {error && <div>{ error }</div>}
            {isLoading ? 
            <Skeleton count={6} /> 
            :
            <div>
                <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" colSpan="2" >Customer Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
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
                                {customerPhoneNo}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2} align="right">
                                <Button variant="contained" size="small" className={classes.btn} color="primary">
                                    Edit Details
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <Reports id={props.id} />
            </div>
            }
         </Fragment>

    )
}