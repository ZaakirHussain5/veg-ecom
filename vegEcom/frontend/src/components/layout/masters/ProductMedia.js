import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Skeleton from 'react-loading-skeleton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Box from '@material-ui/core/Box';
import DeleteIcon from '@material-ui/icons/Delete';
import CardActions from '@material-ui/core/CardActions';
import Title from '../dashboard/Title';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Admin from '../common/Admin';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';


function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 345,
    },
    page: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    paper: {
        padding: theme.spacing(2),
        overflow: 'auto',
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
    media: {
        height: 180,
    },
}))

const SingleProduct = function (props) {
    const classes = useStyles();

    const [media, setMedia] = useState(null)
    const [gallery, setGallery] = useState(props.product.media)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [isUploadLoading, setIsUploadLoading] = useState(false)
    const [confirmMessage, setConfirmMessage] = useState("")
    const [mediaToDelete, setMediaToDelete] = useState(0)
    const [isAlert, setIsAlert] = useState(false)
    const [isDeleteMode, setIsDeleteMode] = useState(false)
    const [alert, setAlert] = useState({
        message: "",
        color: "error"
    })


    const newMediaUpload = (e) => {
        var file = e.target.files[0]
        setMedia(file)
        setConfirmMessage((<div>Do You want to add <b>{file.name}</b> to  {props.product.name}</div>))
        setConfirmOpen(true)
    }

    const uploadOrDeleteConfirm = () => {
        if (isDeleteMode) {
            setIsUploadLoading(true)
            fetch(`/api/w/removeProductMedia/${mediaToDelete}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Token ${localStorage.getItem('AdminToken')}`
                }
            }).then(res => {
                if (!res.ok)
                    throw Error("Media Deletion Failed!")
                setAlert({
                    message: "Product Media Deleted Successfully.",
                    color: "success"
                })
                setIsAlert(true)
                setIsDeleteMode(false)
                setIsUploadLoading(false)
                setConfirmOpen(false)
                props.loadFunc()
            }).catch(err => {
                setAlert({
                    message: err.message,
                    color: "error"
                })
                setIsAlert(true)
                setIsDeleteMode(false)
                setIsUploadLoading(false)
                setConfirmOpen(false)
            })
        }
        else {
            var mediaType = media.name.endsWith('.mp4') ? "V" : "I"

            var data = new FormData()
            data.append("mediaUrl", media, media.name)
            data.append("mediaType", mediaType)
            data.append("productId", props.product.id)

            setIsUploadLoading(true)
            fetch('/api/w/addProductMedia', {
                method: 'POST',
                body: data,
                headers: {
                    Authorization: `Token ${localStorage.getItem("AdminToken")}`
                }
            })
                .then(res => {
                    if (!res.ok)
                        throw Error("Product Media Adding Failed")
                    return res.json()
                })
                .then(data => {
                    setIsAlert(true)
                    setAlert({
                        message: "Product Media Added Successfully",
                        color: "success"
                    })
                    setIsUploadLoading(false)
                    setConfirmOpen(false)
                    props.loadFunc()
                })
                .catch(err => {
                    setIsAlert(true)
                    setAlert({
                        message: err.message,
                        color: "error"
                    })
                    setIsUploadLoading(false)

                })
        }


    }

    const handleDeleteMedia = id => {
        setMediaToDelete(id)
        setConfirmOpen(true)
        setIsDeleteMode(true)
        setConfirmMessage("Are you sure to delete the media permenantly?")
    }



    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setIsAlert(false);
    };

    return (
        <div>
            <Snackbar open={isAlert} anchorOrigin={{ vertical: "top", horizontal: "center" }} autoHideDuration={6000} onClose={handleAlertClose}>
                <Alert onClose={handleAlertClose} severity={alert.color}>
                    {alert.message}
                </Alert>
            </Snackbar>
            <Dialog
                fullWidth
                maxWidth="xs"
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                aria-labelledby="max-width-dialog-title"
            >
                <DialogContent>
                    <DialogContentText>
                        {confirmMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained" onClick={uploadOrDeleteConfirm}>
                        {isUploadLoading ? <CircularProgress size={24} color="#fff" /> : "Yes"}
                    </Button>
                    <Button onClick={() => setConfirmOpen(false)} color="secondary" variant="contained">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid container spacing={2}>
                {gallery.map((med, idx) => (
                    <Grid key={idx} item xs={4}>
                        <Card >
                            <CardActionArea>
                                {med.mediaType == "V" ?
                                    <CardMedia
                                        className={classes.media}
                                        src={med.mediaUrl}
                                        component="video"
                                        controls
                                    />
                                    :
                                    <CardMedia
                                        className={classes.media}
                                        image={med.mediaUrl}
                                        title={props.product.name}
                                    />
                                }

                            </CardActionArea>
                            <CardActions>
                                <Button
                                    size="small"
                                    color="secondary"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => {
                                        handleDeleteMedia(med.id)
                                    }}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}

                <Grid item xs={4}>
                    <Card >
                        <CardActionArea>
                            <CardMedia
                                className={classes.media}
                                image="https://cdn2.iconfinder.com/data/icons/bold-application/500/plus-512.png"
                                title="Add New Media"
                                component="label"
                            >
                                <input
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={newMediaUpload}
                                    accept=".jpg,.jpeg,.png,.mp4"
                                />
                            </CardMedia>
                        </CardActionArea>
                    </Card>
                </Grid>
            </Grid>
        </div>
    )
}

export default function ProductMedia() {
    const classes = useStyles();

    const [value, setValue] = useState(0);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = function () {
        setIsLoading(true)
        fetch('/api/w/product/', {
            headers: {
                "Authorization": `Token  ${localStorage.getItem("AdminToken")}`
            }
        })
            .then(res => res.json())
            .then(products => {
                setProducts(products)
                setIsLoading(false)
            })
    }

    return (
        <Admin>
            <Paper className={classes.paper}>
                <Title>Product Media</Title>
                {isLoading ?
                    <Skeleton count={20} /> 
                :
                <div className={classes.page}>
                    <Tabs
                        variant="scrollable"
                        scrollButtons="auto"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        className={classes.tabs}
                    >
                        {products.map((product, idx) => (
                            <Tab key={idx} label={product.name} {...a11yProps(idx)} />
                        ))}
                    </Tabs>
                    {products.map((product, idx) => (
                        <TabPanel key={idx} value={value} index={idx}>
                            <SingleProduct product={product} loadFunc={loadProducts} />
                        </TabPanel>
                    ))}
                </div>
           
                }

            </Paper>

        </Admin>
    );
}
