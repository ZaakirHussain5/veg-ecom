import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';
import Title from './Title';

// Generate Order Data
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: "#fff",
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  messageTextField: {
    width: "350px"
  },
}));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

export default function Users() {

  function createData(id, date, name, location, phoneNo) {
    return { id, date, name, location, phoneNo };
  }

  const rows = [
    createData(0, '16 Mar, 2019', 'Elvis Presley', 'Tupelo, MS', '9845714254'),
    createData(1, '16 Mar, 2019', 'Paul McCartney', 'London, UK', '9568589898'),
    createData(2, '16 Mar, 2019', 'Tom Scholz', 'Boston, MA', '7584787475'),
    createData(3, '16 Mar, 2019', 'Michael Jackson', 'Gary, IN', '7373256525'),
    createData(4, '15 Mar, 2019', 'Bruce Springsteen', 'Long Branch, NJ', '9568747145'),
  ];

  const cols = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'phoneNo', headerName: 'Phone No.', width: 140 },
    { field: 'date', headerName: 'Reg Date', width: 130 },
    { field: 'location', headerName: 'Location', width: 160 },
  ]

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Title>Users</Title>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={rows} columns={cols} pageSize={5} checkboxSelection />
      </div>
      <div className={classes.seeMore}>
        <Button color="primary" variant="contained" onClick={handleClickOpen}>
          SEND MESSAGE
        </Button>
      </div>
      <Dialog maxWidth="md" onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Send Message
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            id="messageForUsers"
            label="Enter Message Text"
            multiline
            rows={6}
            variant="outlined"
            className={classes.messageTextField}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button fullWidth onClick={handleClose} color="primary" variant="contained">
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}