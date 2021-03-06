import React, {useState, useEffect} from 'react'
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import Title from '../dashboard/Title';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

export default function Invoices(props) {
    const date = new Date();
    const todayDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
    const [rows, setRows] = useState([]);
    const [from_date, setFromDate] = useState(todayDate);
    const [to_date, setToDate] = useState(todayDate)

    const getOrderData = () =>{
        let url = '/api/w/invoices/';
        let params = []
        if (to_date !== ''){
            params.push(`to_date=${to_date}`)
        }
        if (from_date !== ''){
            params.push(`from_date=${from_date}`)
        }
        params.push(`customer=${props.id}`)

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


    useEffect(() => {
        return getOrderData()
    }, [])



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
        <div>
            <Title>Invoice</Title>
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
                label="To Date"
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
                Get invoices
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