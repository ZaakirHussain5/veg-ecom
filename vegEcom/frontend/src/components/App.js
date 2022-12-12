import React, { useEffect, useState , useRef  } from 'react'
import ReactDOM from 'react-dom'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { HashRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom"
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Customers from './pages/Customers'
import Invoices from './pages/Invoices'
import InvoiceForm from './layout/invoices/InvoiceForm'
import Inventory from './pages/Inventory'
import ProductMedia from './layout/masters/ProductMedia'
import Users from './layout/masters/Users';
import Pincodes from './layout/masters/Pincodes';
import Quotations from './pages/Quotations';
import LoadingBar from 'react-top-loading-bar'
import { useLocation } from 'react-router-dom'


const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#199347",
        },
        secondary: {
            main: '#E21717',
        },
    },
});

const App = function () {
    var [isTokenValid, setIsTokenValid] = useState(true)

    let location = useLocation();

    useEffect(() => {
        ref.current.continuousStart()
        const adminToken = localStorage.getItem('AdminToken')
        fetch('/api/GetUser', {
            "method": "GET",
            headers: {
                "Authorization": `Token ${adminToken}`
            }
        }).then(response => {
            setIsTokenValid(response.ok)
            ref.current.complete()
        }).catch(err => {
            ref.current.complete()
        })
    }, [location])

    const updateTokenValidity = (status) => {
        setIsTokenValid(status)
    }

    return (
        <div>
            <ThemeProvider theme={theme}>
            <LoadingBar color='#E21717' ref={ref} />
                <Switch>
                    <Route path="/Login">
                        <Login tokenValidityFunc={updateTokenValidity} />
                    </Route>
                    <Route path="/Orders"
                        render={({ location }) =>
                            isTokenValid ? (
                                <Orders />
                            ) : (
                                <Redirect
                                    to={{
                                        pathname: "/Login",
                                        state: { from: location }
                                    }}
                                />
                            )
                        }
                    />
                    <Route path="/Customers"
                        render={({ location }) =>
                            isTokenValid ? (
                                <Customers />
                            ) : (
                                <Redirect
                                    to={{
                                        pathname: "/Login",
                                        state: { from: location }
                                    }}
                                />
                            )
                        }
                    />
                    <Route path="/Invoices"
                        render={({ location }) =>
                            isTokenValid ? (
                                <Invoices />
                            ) : (
                                <Redirect
                                    to={{
                                        pathname: "/Login",
                                        state: { from: location }
                                    }}
                                />
                            )
                        }
                    />
                    <Route path="/NewInvoice/:order"
                        render={({ location }) =>
                            isTokenValid ? (
                                <InvoiceForm />
                            ) : (
                                <Redirect
                                    to={{
                                        pathname: "/Login",
                                        state: { from: location }
                                    }}
                                />
                            )
                        }
                    />
                    <Route path="/EditInvoice/:id"
                        render={({ location }) =>
                            isTokenValid ? (
                                <InvoiceForm />
                            ) : (
                                <Redirect
                                    to={{
                                        pathname: "/Login",
                                        state: { from: location }
                                    }}
                                />
                            )
                        }
                    />
                    <Route path="/Inventory"
                        render={({ location }) =>
                            isTokenValid ? (
                                <Inventory />
                            ) : (
                                <Redirect
                                    to={{
                                        pathname: "/Login",
                                        state: { from: location }
                                    }}
                                />
                            )
                        }
                    />

                    <Route path="/ProductMedia"
                        render={({ location }) =>
                            isTokenValid ? (
                                <ProductMedia />
                            ) : (
                                <Redirect
                                    to={{
                                        pathname: "/Login",
                                        state: { from: location }
                                    }}
                                />
                            )
                        }
                    />

                    <Route path="/Users"
                        render={({ location }) =>
                            isTokenValid ? (
                                <Users />
                            ) : (
                                <Redirect
                                    to={{
                                        pathname: "/Login",
                                        state: { from: location }
                                    }}
                                />
                            )
                        }
                    />
                    <Route path="/Pincodes"
                        render={({ location }) =>
                            isTokenValid ? (
                                <Pincodes />
                            ) : (
                                <Redirect
                                    to={{
                                        pathname: "/Login",
                                        state: { from: location }
                                    }}
                                />
                            )
                        }
                    />
                    <Route path="/Quotations"
                        render={({ location }) =>
                            isTokenValid ? (
                                <Quotations />
                            ) : (
                                <Redirect
                                    to={{
                                        pathname: "/Login",
                                        state: { from: location }
                                    }}
                                />
                            )
                        }
                    />
                    <Route exact path="/"
                        render={({ location }) =>
                            isTokenValid ? (
                                <Dashboard />
                            ) : (
                                <Redirect
                                    to={{
                                        pathname: "/Login",
                                        state: { from: location }
                                    }}
                                />
                            )
                        }
                    />

                </Switch>
            </ThemeProvider>
        </div>

    )
}

ReactDOM.render(
    <Router>
        <App />
    </Router>
    , document.querySelector('#app'))
