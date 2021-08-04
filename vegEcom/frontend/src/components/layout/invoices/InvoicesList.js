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
import Skeleton from 'react-loading-skeleton';


export default function InvoicesList() {

    const [invoiceId , setInvoiceId ] = useState(0)
    const [rows,setRows] = useState([]);

    const [isLoading,setIsLoading] = useState(false)

    function createData(id,InvoiceID, date, name, totalAmount, phoneNo) {
        return { id,InvoiceID, date, name, totalAmount, phoneNo };
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
            setIsLoading(false)
        }).catch(err => {
            console.log(err)
            setIsLoading(false)
        })

    },[])


    const cols = [
        { field: 'InvoiceID', headerName: 'Invoice #', width: 150 },
        { field: 'phoneNo', headerName: 'Phone No.', width: 160 },
        { field: 'date', headerName: 'Invoice Date', width: 170 },
        { field: 'totalAmount', headerName: 'Bill Amount', width: 200 },
        {
            field: 'id',
            headerName: ' ',
            renderCell: (GridCellParams) => (
                    <Button
                        color="primary"
                        size="small"
                        onClick={()=>setInvoiceId(GridCellParams.value)}
                    >
                        View
                  </Button>
            ),
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
                    />
                    {isLoading ?
                        <Skeleton count={12} />
                        :
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
                    }
                </div>
            }
        </Fragment>
    );
}