import React from 'react'
import { DataGrid, GridToolbar } from '@material-ui/data-grid';
import Title from '../dashboard/Title';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

export default function Orders() {

    function createData(id, orderID, date, name, location, phoneNo) {
        return { id, orderID, date, name, location, phoneNo };
    }

    const rows = [
        createData("1", "VBO2021-1", '16 Mar, 2021', 'Elvis Presley', 'Tupelo, MS', '9845714254'),
        createData("2", "VBO2021-2", '16 Mar, 2021', 'Paul McCartney', 'London, UK', '9568589898'),
        createData("3", "VBO2021-3", '16 Mar, 2021', 'Tom Scholz', 'Boston, MA', '7584787475'),
        createData("4", "VBO2021-4", '16 Mar, 2021', 'Michael Jackson', 'Gary, IN', '7373256525'),
        createData("5", "VBO2021-5", '15 Mar, 2021', 'Bruce Springsteen', 'Long Branch, NJ', '9568747145'),
    ];

    const cols = [
        { field: 'orderID', headerName: 'Order #', width: 150 },
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
    )
}