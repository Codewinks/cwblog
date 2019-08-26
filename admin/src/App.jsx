import React from 'react';
import { useApp } from './context/App'
import { useAuth0 } from "./context/Auth0";
import { makeStyles } from '@material-ui/core/styles';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import CssBaseline from '@material-ui/core/CssBaseline';

import Navigation from "./components/Navigation";

import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import NoMatch from "./views/errors/NoMatch";
import Profile from "./views/Profile";
import PostsList from "./views/posts/List";
import PostsForm from "./views/posts/Form";
import PrivateRoute from "./components/PrivateRoute";
import Alert from "./components/Alert";

import { PostProvider } from './context/Post'


import './App.css';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function App() {
  const { alert, hideAlert } = useApp();
  const classes = useStyles();
  const { loading, user, isAuthenticated } = useAuth0();

  if (loading) {
    return "Loading...";
  }

  if (!isAuthenticated) {
    return (
      <Login />
    );
  }

  return (
    <div className={classes.root}>
      <Alert variant={alert.variant} message={alert.message} autoHideDuration={alert.autoHideDuration} onClose={hideAlert}/>
      <BrowserRouter>
        <CssBaseline />
        <Navigation avatar={user.picture}/>

        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <PrivateRoute exact path="/posts/create" render={p => (<PostProvider {...p}><PostsForm {...p}/></PostProvider>)} />
            <PrivateRoute exact path="/posts/:postId" render={p => (<PostProvider {...p}><PostsForm {...p}/></PostProvider>)} />
            <PrivateRoute exact path="/posts" render={p => (<PostProvider {...p}><PostsList {...p}/></PostProvider>)} />
            <PrivateRoute exact path="/profile" component={Profile} />
            <Route component={NoMatch} />
          </Switch>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
