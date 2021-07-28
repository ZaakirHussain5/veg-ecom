import React, { Fragment , useState } from 'react';
import { DataGrid, GridToolbar  } from '@material-ui/data-grid';
import Title from '../dashboard/Title';
import Button from '@material-ui/core/Button';
import InventoryForm from './InventoryForm'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';


export default function InventoryList() {

    const [invoiceId , setInvoiceId ] = useState(0)

    function createData(id ,name, avlQty, rPrice,gPrice,hPrice) {
        return { id, name, avlQty, rPrice,gPrice,hPrice };
    }

    const rows = [
        createData("1","Potatoes", '12000 KGS', '1200/100 KGS', '1200/100 KGS', '12/1 KGS'),
        createData("2","Red chillies", '12000 KGS', '1500/100 KGS', '1500/100 KGS', '15/1 KGS'),
        createData("3","Tomatoes", '12000 KGS', '1500/100 KGS', '1500/100 KGS', '15/1 KGS'),
        createData("4","Garlic", '12000 KGS', '1500/100 KGS', '1500/100 KGS', '15/1 KGS'),
        createData("5","Onion", '12000 KGS', '1500/100 KGS', '1500/100 KGS', '15/1 KGS'),
    ];

    const cols = [
        { field: 'name', headerName: 'Product', width: 160 },
        { field: 'avlQty', headerName: 'Avl. Qty', width: 160 },
        { field: 'rPrice', headerName: 'Restraunt Price', width: 170 },
        { field: 'gPrice', headerName: 'General Stores Price', width: 200 },
        { field: 'hPrice', headerName: 'Household Price', width: 200 },
        {
            field: 'id',
            headerName: ' ',
            renderCell: (GridCellParams) => (
                    <Button
                        color="primary"
                        size="small"
                        onClick={()=>setInvoiceId(GridCellParams.value)}
                    >
                        <EditIcon />
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
                   <InventoryForm id={invoiceId} /> 
                </div>
                 : 
                <div>
                    <Box display="flex" p={1} bgcolor="background.paper">
                        <Box flexGrow={1}>
                            <Title>Inventory List</Title>
                        </Box>
                        <Box>
                            <Button
                                color="primary"
                                variant="contained"
                                size="small"
                                startIcon={<AddIcon />}
                                onClick={()=> setInvoiceId(-1)}
                            >
                                Add New Product
                            </Button>
                        </Box>
                    </Box>
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