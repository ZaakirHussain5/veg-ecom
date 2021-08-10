import React, { Fragment, useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import Title from '../dashboard/Title';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import OrderDetails from './OrderDetails'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Skeleton from 'react-loading-skeleton';


export default function OrdersList() {

    const [orderId, setOrderId] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [from_date, setFromDate] = useState('');
    const [to_date, setToDate] = useState('');


    function createData(id, orderID, date, location, phoneNo) {
        return { id, orderID, date, location, phoneNo };
    }

    
    const getOrderData = () =>{
        let url = '/api/w/AdminOrder/';
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
            // console.log(data)
            setRows(data)
        })
    }


    useEffect(() => {
        setIsLoading(true)
        fetch('/api/w/AdminOrder/', {
            method: "GET",
            headers: {
                "Authorization": `Token ${localStorage.getItem('AdminToken')}`
            }
        })
            .then(response => response.json())
            .then(data => {
                var ordersList = data

                setRows(data)
                setIsLoading(false)
            })
    }, [orderId])

    const [rows, setRows] = useState([]);

    const cols = [
        { field: 'orderId', headerName: 'Order #', width: 150},
        { field: 'formattedCreatedAt', headerName: 'Ordered Date', width: 170
        
        },
        { field: 'location', headerName: 'Shipping Address', width: 200,
        renderCell: (GridCellParams) => {
            // console.log(GridCellParams)
            return (
                <div>{GridCellParams.row.shippingAddress.address} </div>
            )}
        },
        {
            field: 'id',
            headerName: ' ',
            renderCell: (GridCellParams) => (
                <Button
                    color="primary"
                    size="small"
                    onClick={() => setOrderId(GridCellParams.value)}
                >
                    View
                </Button>
            ),
        },
    ]

    return (
        <Fragment>

            {orderId ?
                <div>
                    <Button
                        color="primary"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => {
                            setOrderId(0)
                        }}>
                        Back to List
                    </Button>
                    <OrderDetails id={orderId} />
                </div>
                :
                <div>
                    <Title>Orders</Title>
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
                        Get Orders
                    </Button>
                    {isLoading ?
                        <Skeleton count={15} />
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
    );
}