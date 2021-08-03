import React, { Fragment , useState , useEffect} from 'react';
import { DataGrid, GridToolbar  } from '@material-ui/data-grid';
import Title from '../dashboard/Title';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import InvoiceDetails from './InvoiceDetails'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';


export default function InvoicesList() {

    const [invoiceId , setInvoiceId ] = useState(0)
    const [rows,setRows] = useState([]);

    const [isLoading,setIsLoading] = useState(false)
    const [from_date, setFromDate] = useState('');
    const [to_date, setToDate] = useState('');

    function createData(id,InvoiceID, date, name, totalAmount, phoneNo) {
        return { id,InvoiceID, date, name, totalAmount, phoneNo };
    }

    
    const getOrderData = () =>{
        let url = '/api/w/invoices/';
        let params = []
        if (to_date !== ''){
            params.push(`to_date=${to_date}`)
        }
        if (from_date !== ''){
            params.push(`from_date=${from_date}`)
        }
        const queryParams = params.join('&')
        if(queryParams !== ''){
            url = `${url}?${queryParams}`;
        }

        fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Token ${localStorage.getItem('AdminToken')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setRows(data)
            })
    }

    useEffect(()=>{
        setIsLoading(true)
        fetch('/api/w/invoices/',{
            headers:{
                "Authorization":`Token ${localStorage.getItem('AdminToken')}`
            }
        }).then(response => {
            if(!response.ok)
                throw Error("Error Occured")
            return response.json()
        }).then(invoices => {
            var newInvoicesList = []
            invoices.map(invoice => {                    
                var single = createData(invoice.id,invoice.invoiceID,invoice.created_at,invoice.user.first_name,invoice.grandTotal,invoice.user.username)
                newInvoicesList.push(
                    single
                )
            })
            setRows(newInvoicesList)
        }).catch(err => {
            console.log(err)
        })

    },[])


    const cols = [
        { field: 'invoiceID', headerName: 'Invoice Id #', width: 150},
        { field: 'created_at', headerName: 'Date', width: 170
        
        },
        { field: 'total', headerName: 'Total', width: 200 },
        {
            field: 'discount',
            headerName: 'Discount',
            width: 250
        },
        {
            field: 'grandTotal',
            headerName: 'Grand Total',
            width: 250
        },
    ]

    return (
        <Fragment>
            {invoiceId ?
                <div>
                   <Button 
                     color="primary"
                     startIcon={<ArrowBackIcon />}
                     onClick={()=>{
                         setInvoiceId(0)
                     }}>
                      Back to List
                   </Button>
                   <InvoiceDetails id={invoiceId} /> 
                </div>
                 :
                <div>
                    <Box display="flex" p={1} bgcolor="background.paper">
                        <Box flexGrow={1}>
                            <Title>Invoices</Title>
                        </Box>
                        <Box>
                            <Link to="/NewInvoice/0">
                            <Button
                                color="primary"
                                variant="contained"
                                size="small"
                                startIcon={<AddIcon />}
                            >
                                New Invoice
                            </Button>
                            </Link>
                        </Box>
                    </Box>
                    <TextField
                        label="From Date"
                        size="small"
                        variant="outlined"
                        helperText="Select From date"
                        type="date"
                        style={{ marginRight: "30px" }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={from_date}
                        onChange={(e)=>setFromDate(e.target.value)}
                    />
                    <TextField
                        size="small"
                        variant="outlined"
                        label="From Date"
                        helperText="Select To date"
                        type="date"
                        style={{ marginRight: "30px" }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={to_date}
                        onChange={(e)=>setToDate(e.target.value)}
                    />
                    <Button variant="contained" color="primary" onClick={getOrderData}>
                        Get Invoices
                    </Button>
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            density="compact"
                            rows={rows}
                            columns={cols}
                            pageSize={5}
                            components={{
                                Toolbar: GridToolbar,
                            }} />
                    </div>
                </div>
            }
        </Fragment>
    );
}