import React, { Component, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { HashRouter as Router, Switch, Route, Link ,Redirect } from "react-router-dom"
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Customers from './pages/Customers'
import Invoices from './pages/Invoices'
import InvoiceForm from  './layout/invoices/InvoiceForm'
import Inventory from './pages/Inventory'
import ProductMedia from './pages/masters/ProductMedia'

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

    useEffect(() => {
        const adminToken = localStorage.getItem('AdminToken')
        fetch('/api/GetUser', {
            "method": "GET",
            headers: {
                "Authorization": `Token ${adminToken}`
            }
        }).then(response=>{
            setIsTokenValid(response.ok)
        }).catch(err=>{
            setIsTokenValid(false)
        })
    },[])

    return (
        <Router>
            <ThemeProvider theme={theme}>
                <Switch>
                    <Route path="/Login">
                        <Login />
                    </Route>
                    <Route path="/Orders">
                        <Orders />
                    </Route>
                    <Route path="/Customers">
                        <Customers />
                    </Route>
                    <Route path="/Invoices">
                        <Invoices />
                    </Route>
                    <Route path="/NewInvoice/:order">
                        <InvoiceForm />
                    </Route>
                    <Route path="/EditInvoice/:id">
                        <InvoiceForm />
                    </Route>
                    <Route path="/Inventory">
                        <Inventory />
                    </Route>
                    <Route path="/ProductMedia">
                        <ProductMedia />
                    </Route>
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
        </Router>
    )
}

ReactDOM.render(<App />, document.querySelector('#app'))
