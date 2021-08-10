import React, { useState, useEffect } from 'react'
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import Title from '../dashboard/Title';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

export default function CustomerPayments() {
    const date = new Date();
    const todayDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    const [rows, setRows] = useState([]);
    const [from_date, setFromDate] = useState(todayDate);
    const [to_date, setToDate] = useState(todayDate)

    const getOrderData = () => {
        let url = '/api/w/payments/';
        let params = []
        if (to_date !== '') {
            params.push(`to_date=${to_date}`)
        }
        if (from_date !== '') {
            params.push(`from_date=${from_date}`)
        }
        const queryParams = params.join('&')
        if (queryParams !== '') {
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


    useEffect(() => {
        return getOrderData()
    }, [])



    const cols = [
        { field: 'refId', headerName: 'RefId #', width: 150 },
        {
            field: 'description', headerName: 'Description', width: 320

        },
        {
            field: 'amount', headerName: 'Amount', width: 200
        },
        {
            field: 'formattedTransactionDateTime',
            headerName: 'Date'
            , width: 200
        },
    ]

    return (
        <div>
            <Title>Payments </Title>
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
                onChange={(e) => setFromDate(e.target.value)}

            />
            <TextField
                size="small"
                variant="outlined"
                label="To Date"
                helperText="Select To date"
                type="date"
                style={{ marginRight: "30px" }}
                InputLabelProps={{
                    shrink: true,
                }}
                value={to_date}
                onChange={(e) => setToDate(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={getOrderData}>
                Get Payments
            </Button>
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

        </div>
    )
}