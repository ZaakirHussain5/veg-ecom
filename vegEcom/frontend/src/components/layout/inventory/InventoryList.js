import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Title from '../dashboard/Title';
import Button from '@material-ui/core/Button';
import InventoryForm from './InventoryForm'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Avatar from '@material-ui/core/Avatar';

const useRowStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

function Row(props) {
    const { row , editItemFunc } = props;
    const [open, setOpen] = useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                <Avatar alt="Product Image" src={row.image} className={classes.large} />
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.name}
                </TableCell>
                <TableCell>
                    <IconButton size="small" color="primary" aria-label="edit" onClick={
                        ()=> editItemFunc(row.id)
                    }>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="secondary" aria-label="delete">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Types
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Type
                                        </TableCell>
                                        <TableCell>
                                            Rest. Price
                                        </TableCell>
                                        <TableCell>
                                            Gen. Price
                                        </TableCell>
                                        <TableCell>
                                            House. Price
                                        </TableCell>
                                        <TableCell>
                                            Avl. Qty
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.types.map((typeRow) => (
                                        <TableRow key={typeRow.date}>
                                            <TableCell component="th" scope="row">
                                                {typeRow.name}
                                            </TableCell>
                                            <TableCell>{typeRow.rPrice}/{typeRow.rPriceQuantity}KGS</TableCell>
                                            <TableCell>{typeRow.rPrice}/{typeRow.rPriceQuantity}KGS</TableCell>
                                            <TableCell>{typeRow.rPrice}/{typeRow.rPriceQuantity}KGS</TableCell>
                                            <TableCell>{typeRow.avlQty}KGS</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}


export default function InventoryList() {

    const [itemId, setItemId] = useState(0)

    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        fetch('/api/w/product/', {
            headers: {
                "Authorization": `Token  ${localStorage.getItem("AdminToken")}`
            }
        })
            .then(res => res.json())
            .then(products => {
                setRows(products)
                setIsLoading(false)
            })
    }, [itemId])

    const editItem = (id) => {
        setItemId(id)
    }

    return (
        <Fragment>
            {itemId ?
                <div>
                    <Button
                        color="primary"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => {
                            setItemId(0)
                        }}>
                        Back to List
                    </Button>
                    <InventoryForm id={itemId} />
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
                                onClick={() => setItemId(-1)}
                            >
                                Add New Product
                            </Button>
                        </Box>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>
                                        Image
                                    </TableCell>
                                    <TableCell>
                                        Product Name
                                    </TableCell>
                                    <TableCell>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, idx) => (
                                    <Row key={idx} row={row} editItemFunc={editItem} />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                </div>
            }
        </Fragment>
    );
}