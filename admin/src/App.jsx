import React from 'react';
import { useApp } from './context/App'
import { useAuth0 } from "./context/Auth0";
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import CssBaseline from '@material-ui/core/CssBaseline';

import Navigation from "./components/Navigation";

import Login from "./views/auth/Login";
import Dashboard from "./views/Dashboard";
import NoMatch from "./views/errors/NoMatch";
import Profile from "./views/Profile";
import TagList from "./views/tags/List";
import CategoryList from "./views/categories/List";
import PostList from "./views/posts/List";
import PostForm from "./views/posts/Form";
import PrivateRoute from "./components/PrivateRoute";
import Alert from "./components/Alert";

import { PostProvider } from './context/Post'
import { TagProvider } from './context/Tag'
import { CategoryProvider } from './context/Category'


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
  const { loading, isAuthenticated } = useAuth0();

  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#004f67',
      },
      secondary: {
        main: '#0aa2d0',
        contrastText: '#ffffff'
      },
    },
  });

  if (loading) {
    return "Loading...";
  }

  if (!isAuthenticated) {
    return (
      <Login />
    );
  }

  return (
      <ThemeProvider theme={theme}>
      <div className={classes.root}>
      <Alert variant={alert.variant} message={alert.message} autoHideDuration={alert.autoHideDuration} onClose={hideAlert}/>
      <BrowserRouter>
        <CssBaseline />
        <Navigation />

        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route path="/" exact component={Dashboard} />
            <PrivateRoute exact path="/posts/create" render={p => (<CategoryProvider><TagProvider><PostProvider {...p}><PostForm {...p}/></PostProvider></TagProvider></CategoryProvider>)} />
            <PrivateRoute exact path="/posts/:postId" render={p => (<CategoryProvider><TagProvider><PostProvider {...p}><PostForm {...p}/></PostProvider></TagProvider></CategoryProvider>)} />
            <PrivateRoute exact path="/posts" render={p => (<CategoryProvider><TagProvider><PostProvider {...p}><PostList {...p}/></PostProvider></TagProvider></CategoryProvider>)} />
            <PrivateRoute exact path="/tags/:tagId" render={p => (<TagProvider {...p}><TagList {...p}/></TagProvider>)} />
            <PrivateRoute exact path="/tags" render={p => (<TagProvider {...p}><TagList {...p}/></TagProvider>)} />
            <PrivateRoute exact path="/categories/:categoryId" render={p => (<CategoryProvider {...p}><CategoryList {...p}/></CategoryProvider>)} />
            <PrivateRoute exact path="/categories" render={p => (<CategoryProvider {...p}><CategoryList {...p}/></CategoryProvider>)} />
            <PrivateRoute exact path="/profile" component={Profile} />
            <Route component={NoMatch} />
          </Switch>
        </main>
      </BrowserRouter>
    </div>
      </ThemeProvider>
  );
}

export default App;
