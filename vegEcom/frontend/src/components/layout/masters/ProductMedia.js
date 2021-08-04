import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Box from '@material-ui/core/Box';
import DeleteIcon from '@material-ui/icons/Delete';
import CardActions from '@material-ui/core/CardActions';
import Title from '../dashboard/Title';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Admin from '../common/Admin';

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
        height: 140,
    },
}))

export default function ProductMedia() {
    const classes = useStyles();

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Admin>
            {/* <Box display="flex" p={1} bgcolor="background.paper">
                    <Box flexGrow={1}>
                        <Title>Product Media</Title>
                    </Box>
                    <Box>
                        <Button
                            color="primary"
                            variant="contained"
                            size="small"
                            startIcon={<AddIcon />}
                        >
                            Add Media
                        </Button>
                    </Box>
                </Box> */}
            <Paper className={classes.paper}>
                <Title>Product Media</Title>
                <div className={classes.page}>
                    <Tabs
                        variant="scrollable"
                        scrollButtons="auto"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        className={classes.tabs}
                    >
                        <Tab label="Item One" {...a11yProps(0)} />
                        <Tab label="Item Two" {...a11yProps(1)} />
                        <Tab label="Item Three" {...a11yProps(2)} />
                        <Tab label="Item Four" {...a11yProps(3)} />
                        <Tab label="Item Five" {...a11yProps(4)} />
                        <Tab label="Item Six" {...a11yProps(5)} />
                        <Tab label="Item Seven" {...a11yProps(6)} />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        <Title>Images</Title>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Card >
                                    <CardActionArea>
                                        <CardMedia
                                            className={classes.media}
                                            image="https://source.unsplash.com/47gzK__lX30/"
                                            title="Red Chillies"
                                        />
                                    </CardActionArea>
                                    <CardActions>
                                        <Button size="small" color="secondary" startIcon={<DeleteIcon />}>
                                            Delete
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        Item Two Three four five six seven eight nine ten
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        Item Three
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        Item Four
                    </TabPanel>
                    <TabPanel value={value} index={4}>
                        Item Five
                    </TabPanel>
                    <TabPanel value={value} index={5}>
                        Item Six
                    </TabPanel>
                    <TabPanel value={value} index={6}>
                        Item Seven
                    </TabPanel>
                </div>
            </Paper>

        </Admin>
    );
}
