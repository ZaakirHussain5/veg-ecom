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
import InputAdornment from '@material-ui/core/InputAdornment';
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
    unit:{
        marginRight:"15px",
        fontSize:"20px",
    },
}));

export default function InventoryForm(props) {
    const classes = useStyles();
    const [displayImage,setDisPlayImage] = useState("/static/images/vegetables.png") 

    const [productImage,setProductImage] = useState(null)
    const [productName,setProductName] = useState("")
    const [productNameError,setProductNameError] = useState(false)
    const [productDescription,setProductDescription] = useState("")
    const [productDescriptionError,setProductDescriptionError] = useState(false)
    const [productTypes,setProductTypes] = useState([])

    const [typeName,setTypeName] = useState("")
    const [typeNameError,setTypeNameError] = useState(false)
    const [rPrice,setRPrice] = useState(0.00)
    const [rPriceError,setRPriceError] = useState(false)
    const [rQty,setRQty] = useState(0.00)
    const [rQtyError,setRQtyError] = useState(false)
    const [gPrice,setGPrice] = useState(0.00)
    const [gPriceError,setGPriceError] = useState(false)
    const [gQty,setGQty] = useState(0.00)
    const [gQtyError,setGQtyError] = useState(false)
    const [hPrice,setHPrice] = useState(0.00)
    const [hPriceError,setHPriceError] = useState(false)
    const [hQty,setHQty] = useState(0.00)
    const [hQtyError,setHQtyError] = useState(false)
    const [avlQty,setAvlQty] = useState(0.00)
    const [avlQtyError,setAvlQtyError] = useState(false)

    const onFileInputChange = function(e){
        var file = e.target.files[0]
        var reader = new FileReader()
        reader.onload = function(e){
            setDisPlayImage(e.target.result)
        }
        reader.readAsDataURL(file);
        setProductImage(file)
    }

    const addType = function(){
        let errorCount =0;
        setTypeNameError(false)
        setRPriceError(false)
        setRQtyError(false)
        setGPriceError(false)
        setGQtyError(false)
        setHPriceError(false)
        setHQtyError(false)
        setAvlQtyError(false)

        if(typeName==""){
            setTypeNameError(true)
            errorCount++
        }
        if(rPrice==0.00){
            setRPriceError(true)
            errorCount++
        }
        if(gPrice==0.00){
            setGPriceError(true)
            errorCount++
        }
        if(hPrice==0.00){
            setHPriceError(true)
            errorCount++
        }
        if(rQty==0.00){
            setRQtyError(true)
            errorCount++
        }
        if(hQty==0.00){
            setHQtyError(true)
            errorCount++
        }
        if(gQty==0.00){
            setGQtyError(true)
            errorCount++
        }
        if(avlQty==0.00){
            setAvlQtyError(true)
            errorCount++
        }

        if(errorCount)
            return

        var productTypesList = productTypes.concat({
            typeName,rPrice,rQty,gPrice,gQty,hPrice,hQty,avlQty
        })

        setProductTypes(productTypesList)
        setTypeName("")
        setRPrice(0.00)
        setGPrice(0.00)
        setHPrice(0.00)
        setRQty(0.00)
        setGQty(0.00)
        setHQty(0.00)
        setAvlQty(0.00)
    }

    const removeItem = function(index){
        var productTypesList = productTypes.filter((item,idx) => idx!=index)
        setProductTypes(productTypesList)
    }

    const saveProduct = function(){
        let errorCount = 0 
        setProductNameError(false)
        setProductDescriptionError(false)
        if(productName == ""){
            setProductNameError(true)
            errorCount++
        }

        if(productDescription == ""){
            setProductDescriptionError(true)
            errorCount++
        }

        if(errorCount)
            return

        let productTypesList = []
        productTypes.map(({typeName,rPrice,gPrice,hPrice,rQty,gQty,hQty,avlQty}) => {
            productTypesList.push({
                name:typeName,
                rPrice,
                hPrice,
                gPrice,
                rPriceQuantity:rQty,
                gPriceQuantity:gQty,
                hPriceQuantity:hQty,
                avlQty
            })
        })

        let productData = new FormData()
        productData.append("image",productImage,productImage.name)
        productData.append("name",productName)
        productData.append("description",productDescription)
        productData.append("typesJson",JSON.stringify({
            types:productTypesList
        }))
        
        fetch('/api/w/product/',{
            method:"POST",
            body:productData,
            headers:{
                "Authorization":`Token ${localStorage.getItem("AdminToken")}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setProductName("")
            setProductDescription("")
            setProductTypes([])
        })
    }

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
                    <img style={{ height: "216px", width: '100%' }} src={displayImage} />
                    <Button startIcon={<PhotoCamera />} component="label" fullWidth color="primary" variant="contained">
                        <input type="file" style={{display:"none"}} accept="image/*" onChange={onFileInputChange} />
                        Select Picture
                    </Button>
                </Grid>
                <Grid item xl={9} lg={9} md={6} sm={6}>
                    <TextField
                        className={classes.input}
                        value={productName}
                        label="Product Name"
                        variant="outlined"
                        size="small"
                        onChange={e => setProductName(e.target.value)}
                        helperText="Enter Product Name"
                        error={productNameError}
                    />
                    <TextField
                        className={classes.input}
                        value={productDescription}
                        label="Description"
                        variant="outlined"
                        size="small"
                        fullWidth
                        multiline
                        rows={10}
                        onChange={e => setProductDescription(e.target.value)}
                        helperText="Enter Description"
                        error={productDescriptionError}
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
                                            value={typeName}
                                            label="Enter Type Name"
                                            onChange={e=> setTypeName(e.target.value)}
                                            error={typeNameError}
                                            helperText="Entrer Type Name"
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
                                            value={rPrice}
                                            className={classes.inputHor}
                                            size="small"
                                            label="Price"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            onChange={e => setRPrice(e.target.value)}
                                            error={rPriceError}
                                            helperText="Enter Restraunt Price"
                                        />
                                        <Typography component="span" className={classes.slash}>
                                            /
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            value={rQty}
                                            className={classes.inputHor}
                                            size="small"
                                            label="Quantity"
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">KGS</InputAdornment>,
                                            }}
                                            onChange={e => setRQty(e.target.value) }
                                            error={rQtyError}
                                            helperText="Enter Qunatity"
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        General Store Price
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="outlined"
                                            value={gPrice}
                                            className={classes.inputHor}
                                            size="small"
                                            label="Price"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            onChange = {e => setGPrice(e.target.value) }
                                            error={gPriceError}
                                            helperText="Enter General Strore Price"
                                        />
                                        <Typography component="span" className={classes.slash}>
                                            /
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            value={gQty}
                                            className={classes.inputHor}
                                            size="small"
                                            label="Quantity"
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">KGS</InputAdornment>,
                                            }}
                                            onChange={e => setGQty(e.target.value)}
                                            error={gQtyError}
                                            helperText="Enter Qunatity"
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        Household Price
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="outlined"
                                            value={hPrice}
                                            className={classes.inputHor}
                                            size="small"
                                            label="Price"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                            }}
                                            onChange={e=>setHPrice(e.target.value)}
                                            error={hPriceError}
                                            helperText="Enter Household Price"
                                        />
                                        <Typography component="span" className={classes.slash}>
                                            /
                                        </Typography>
                                        <TextField
                                            variant="outlined"
                                            value={hQty}
                                            className={classes.inputHor}
                                            size="small"
                                            label="Quantity"
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">KGS</InputAdornment>,
                                            }}
                                            onChange={e => setHQty(e.target.value)}
                                            error={hQtyError}
                                            helperText="Enter Qunatity"
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                <TableCell>
                                        Available Quantity
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            variant="outlined"
                                            value={avlQty}
                                            className={classes.inputHor}
                                            size="small"
                                            label="Avl. Quantity"
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">KGS</InputAdornment>,
                                            }}
                                            onChange={e => setAvlQty(e.target.value)}
                                            error={avlQtyError}
                                            helperText="Enter Avl. Qunatity"
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell/>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={addType}
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
                                {productTypes.map((productType,idx) => {
                                    return (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                {productType.typeName}
                                            </TableCell>
                                            <TableCell>
                                                {productType.rPrice}/{rQty}KGS
                                            </TableCell>
                                            <TableCell>
                                                {productType.gPrice}/{gQty}KGS
                                            </TableCell>
                                            <TableCell>
                                                {productType.hPrice}/{hQty}KGS
                                            </TableCell>
                                            <TableCell>
                                                {productType.avlQty} KGS
                                            </TableCell>
                                            <TableCell>
                                                <IconButton size="small" color="primary" aria-label="delete">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="secondary" aria-label="delete" onClick={
                                                    ()=>{
                                                        removeItem(productTypes.indexOf(productType))
                                                    }
                                                }>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
                <Grid item xs={12} md={12} lg={12} align="right">
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={saveProduct}
                        >
                        Save Product
                    </Button>
                </Grid>
            </Grid>
        </Fragment>

    )
}