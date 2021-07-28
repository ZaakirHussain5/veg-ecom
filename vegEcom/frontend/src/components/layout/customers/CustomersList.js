import React, { Fragment , useState , useEffect} from 'react';
import { DataGrid, GridToolbar  } from '@material-ui/data-grid';
import Title from '../dashboard/Title';
import Button from '@material-ui/core/Button';
import CustomerDetails from './CustomerDetails'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Skeleton from 'react-loading-skeleton';


export default function CutomersList() {

    const [customerId , setCustomerId ] = useState(0)
    
    const [isLoading, setIsLoading ] = useState(false)
    
    function createData(id , name, date, phoneNo) {
        return { id, date, name, phoneNo };
    }

    const [rows,setRows] = useState([]);

    useEffect(()=>{
        setIsLoading(true)
        fetch('/api/w/AdminCustomer',{
            method:"GET",
            headers:{
                Authorization:`Token ${localStorage.getItem('AdminToken')}`
            }
        })
        .then(response => response.json())
        .then(customers => {
            var newCustomersList = []
            customers.map(customer => {
                newCustomersList.push(
                    createData(customer.id,customer.first_name+' '+customer.last_name,customer.date_joined,customer.username)
                )
            })
            setRows(newCustomersList)
            setIsLoading(false)
        })
    },[customerId])

    const cols = [
        { field: 'name', headerName: 'Name', width: 160 },
        { field: 'phoneNo', headerName: 'Phone No.', width: 160 },
        {
            field: 'id',
            headerName: ' ',
            renderCell: (GridCellParams) => (
                    <Button
                        color="primary"
                        size="small"
                        onClick={()=>setCustomerId(GridCellParams.value)}
                    >
                        View
                  </Button>
            ),
        },
    ]

    return (
        <Fragment>
            
            {customerId ?
                <div>
                   <Button 
                     color="primary"
                     startIcon={<ArrowBackIcon />}
                     onClick={()=>{
                         setCustomerId(0)
                     }}>
                      Back to List
                   </Button>
                   <CustomerDetails id={customerId} /> 
                </div>
                 :
                <div>
                    <Title>Customers</Title>
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