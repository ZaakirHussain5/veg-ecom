import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Title from '../dashboard/Title';
import Typography from '@material-ui/core/Typography';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import IconButton from '@material-ui/core/IconButton';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    input: {
        marginTop: theme.spacing(2),
    },
    inputHor: {
        marginRight: theme.spacing(2),
    },
    btn: {
        margin: theme.spacing(1),
    },
    slash:{
        marginRight:"15px",
        fontSize:"25px",
    },
}));

export default function OrderDetails(props) {
    const classes = useStyles();

    return (
        <Fragment>
            <Grid container spacing={3}>
                <Grid item xl={12} md={12} sm={12}>
                    {props.id == -1 ?
                        <Title>
                            New Product
                        </Title>
                        :
                        <Title>
                            Edit Product
                        </Title>
                    }
                </Grid>
                <Grid item xl={3} lg={3} md={6} sm={6}>
                    <img style={{ height: "216px", width: '100%' }} src="/static/images/vegetables.png" />
                    <Button startIcon={<PhotoCamera />} fullWidth color="primary" variant="contained">
                        Upload Picture
                    </Button>
                </Grid>
                <Grid item xl={9} lg={9} md={6} sm={6}>
                    <TextField
                        className={classes.input}
                        label="Product Name"
                        variant="outlined"
                        size="small"
                    />
                    <TextField
                        className={classes.input}
                        label="Description"
                        variant="outlined"
                        size="small"
                        fullWidth
                        multiline
                        rows={10}
                    />
                </Grid>
                <Grid item xl={12} md={12} sm={12}>
                    <Title>
                        Product Types
                    </Title>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="simple table">
                            <TableBody>
                                <TableRow>
                                    <TableCell>
                                        Type
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            label="Enter Type Name"
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Restraunt Price
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="outlined"
                                            className={classes.inputHor}
                                            size="small"
                                            label="Enter Price"
                                        />
                                        <Typography component="span" className={classes.slash}>
                                            /
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            className={classes.inputHor}
                                            size="small"
                                            label="Enter Quantity"
                                        />
                                        <FormControl variant="outlined" size="small">
                                        <InputLabel id="demo-simple-select-outlined-label">Unit</InputLabel>
                                        <Select
                                            label="Unit"
                                            style={{width:170}}
                                        >
                                            <MenuItem value="Select Unit">Select Unit</MenuItem>
                                            <MenuItem value="KGS">KGS</MenuItem>
                                            <MenuItem value="BAGS">BAGS</MenuItem>
                                            <MenuItem value="POUNDS">POUNDS</MenuItem>
                                            <MenuItem value="OUNCES">OUNCES</MenuItem>
                                        </Select>
                                    </FormControl>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        General Store Price
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="outlined"
                                            className={classes.inputHor}
                                            size="small"
                                            label="Enter Price"
                                        />
                                        <Typography component="span" className={classes.slash}>
                                            /
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            className={classes.inputHor}
                                            size="small"
                                            label="Enter Quantity"
                                        />
                                        <FormControl variant="outlined" size="small">
                                        <InputLabel id="demo-simple-select-outlined-label">Unit</InputLabel>
                                        <Select
                                            label="Unit"
                                            style={{width:170}}
                                        >
                                            <MenuItem value="Select Unit">Select Unit</MenuItem>
                                            <MenuItem value="KGS">KGS</MenuItem>
                                            <MenuItem value="BAGS">BAGS</MenuItem>
                                            <MenuItem value="POUNDS">POUNDS</MenuItem>
                                            <MenuItem value="OUNCES">OUNCES</MenuItem>
                                        </Select>
                                    </FormControl>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Household Price
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="outlined"
                                            className={classes.inputHor}
                                            size="small"
                                            label="Enter Price"
                                        />
                                        <Typography component="span" className={classes.slash}>
                                            /
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            className={classes.inputHor}
                                            size="small"
                                            label="Enter Quantity"
                                        />
                                        <FormControl variant="outlined" size="small">
                                        <InputLabel id="demo-simple-select-outlined-label">Unit</InputLabel>
                                        <Select
                                            label="Unit"
                                            style={{width:170}}
                                        >
                                            <MenuItem value="">Select Unit</MenuItem>
                                            <MenuItem value="KGS">KGS</MenuItem>
                                            <MenuItem value="BAGS">BAGS</MenuItem>
                                            <MenuItem value="POUNDS">POUNDS</MenuItem>
                                            <MenuItem value="OUNCES">OUNCES</MenuItem>
                                        </Select>
                                    </FormControl>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell>
                                        Available Quantity
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="outlined"
                                            className={classes.inputHor}
                                            size="small"
                                            label="Enter Quantity"
                                        />
                                        <FormControl variant="outlined" size="small">
                                        <InputLabel id="demo-simple-select-outlined-label">Unit</InputLabel>
                                        <Select
                                            label="Unit"
                                            style={{width:200}}
                                        >
                                            <MenuItem value="Select Unit">Select Unit</MenuItem>
                                            <MenuItem value="KGS">KGS</MenuItem>
                                            <MenuItem value="BAGS">BAGS</MenuItem>
                                            <MenuItem value="POUNDS">POUNDS</MenuItem>
                                            <MenuItem value="OUNCES">OUNCES</MenuItem>
                                        </Select>
                                    </FormControl>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell/>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                        >
                                           Add Type
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xl={12} md={12} sm={12}>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="simple table">
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
                                    <TableCell />
                                </TableRow>

                            </TableHead>
                            <TableBody>
                                <TableCell>
                                    Large Potatoes
                                </TableCell>
                                <TableCell>
                                    1200/100KGS
                                </TableCell>
                                <TableCell>
                                    1200/100KGS
                                </TableCell>
                                <TableCell>
                                    12/1KGS
                                </TableCell>
                                <TableCell>
                                    18000 KGS
                                </TableCell>
                                <TableCell>
                                    <IconButton size="small" color="primary" aria-label="delete">
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="secondary" aria-label="delete">
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} md={12} lg={12} align="right">
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        >
                        Save Product
                    </Button>
                </Grid>
            </Grid>
        </Fragment>

    )
}