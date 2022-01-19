import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons//Assignment';
import RoomIcon from '@material-ui/icons/Room';
import { Link as RouterLink } from 'react-router-dom'
import PropTypes from 'prop-types';

function ListItemLink(props) {
  const { icon, primary, to } = props;

  const renderLink = React.useMemo(
    () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
    [to],
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

ListItemLink.propTypes = {
  icon: PropTypes.element,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export const mainListItems = (
  <div>
    <ListItemLink to="/" primary="Dashboard" icon={<BarChartIcon />} />
    <ListItemLink to="/Orders" primary="Orders" icon={<ShoppingCartIcon />} />
    <ListItemLink to="/Customers" primary="Customers" icon={<PeopleIcon />} />
    <ListItemLink to="/Invoices" primary="Invoices" icon={<AssignmentIcon />} />
    <ListItemLink to="/Inventory" primary="Inventory" icon={<DashboardIcon />} />
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Adminstration</ListSubheader>
    <ListItemLink to="/ProductMedia" primary="Product Media" icon={<LayersIcon />} />
    <ListItemLink to="/Users" primary="Users" icon={<PeopleIcon />} />
    <ListItemLink to="/Pincodes" primary="Pincodes" icon={<RoomIcon />} />
  </div>
);