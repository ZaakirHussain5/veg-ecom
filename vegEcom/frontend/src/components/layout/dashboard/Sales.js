import React,{useState,useEffect} from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

function preventDefault(event) {
    event.preventDefault();
}

const useStyles = makeStyles({
    depositContext: {
        flex: 1,
    },
});

export default function Sales() {
    const classes = useStyles();
    const [income,setIncome] = useState("0")

    function commify(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    useEffect(()=>{
        fetch('/api/w/getTodaysIncome',{
            method:'GET',
            headers:{
                "Authorization":`Token ${localStorage.getItem('AdminToken')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setIncome(commify(data.total.toFixed(2)))
        })
    },[])

    return (
        <React.Fragment>
            <Title>Total Sales</Title>
            <Typography component="p" variant="h4">
                ₹{income}
            </Typography>
            <Typography color="textSecondary" className={classes.depositContext}>
                on {new Date().toDateString()}
            </Typography>
        </React.Fragment>
    );
}