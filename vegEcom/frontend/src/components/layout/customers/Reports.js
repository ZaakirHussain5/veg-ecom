import React,{useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Title from '../dashboard/Title'
import Orders from '../reports/Orders';
import CustomerDues from '../reports/CustomerDues';
import CustomerPayments from '../reports/CustomerPayments';
import Invoices from '../reports/Invoices';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
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
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}))

export default function Reports(props) {
    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                    <Paper className={classes.paper}>
                        <Title>Reports</Title>
                        <AppBar position="static">
                            <Tabs value={value} variant="fullWidth" onChange={handleChange} aria-label="simple tabs example">
                                <Tab label="Orders" {...a11yProps(0)} />
                                <Tab label="Invoices" {...a11yProps(1)} />
                                <Tab label="Payments" {...a11yProps(2)} />
                                <Tab label="Dues" {...a11yProps(3)} />
                            </Tabs>
                        </AppBar>
                        <TabPanel value={value} index={0}>
                           <Orders id={props.id} />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <Invoices id={props.id} />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <CustomerPayments id={props.id} />
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            <CustomerDues id={props.id} />
                        </TabPanel>
                    </Paper>
                </Grid>
            </Grid>
    );
}
