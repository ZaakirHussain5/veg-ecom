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

    function createData(id, orderID, date, location, phoneNo) {
        return { id, orderID, date, location, phoneNo };
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
                var newOrdersList = []
                ordersList.map(order => {
                    newOrdersList.push(
                        createData(order.id, order.orderId, order.formattedCreatedAt, order.shippingAddress.address, order.user.username)
                    )
                })

                setRows(newOrdersList)
                setIsLoading(false)
            })
    }, [orderId])

    const [rows, setRows] = useState([]);

    const cols = [
        { field: 'orderID', headerName: 'Order #', width: 150 },
        { field: 'phoneNo', headerName: 'Phone No.', width: 160 },
        { field: 'date', headerName: 'Ordered Date', width: 170 },
        { field: 'location', headerName: 'Shipping Address', width: 200 },
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
                    <Button variant="contained" color="primary">
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