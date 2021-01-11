import React from "react";
import {makeStyles} from '@material-ui/core/styles';
import {useAuth0} from "../../context/Auth0";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Copyright from "../common/Copyright";

const useStyles = makeStyles(theme => ({
    wrapper: {
        backgroundColor: '#111111'
    },
    root: {
        height: '100vh',
        background: 'rgba(255,255,255,0.2)',
    },
    image: {
        backgroundImage: 'url(/img/bg-sidebar.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f1f1f1',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.3,
    },
    imageBlur: {
        position: 'absolute',
        zIndex: '-1',
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/img/bg-sidebar.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#f1f1f1',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.3,
        filter: 'blur(8px)',
        webkitFilter: 'blur(8px)',
        mozTransform: 'scaleX(-1)',
        oTransform: 'scaleX(-1)',
        webkitTransform: 'scaleX(-1)',
        transform: 'scaleX(-1)',
    },
    paper: {
        margin: '20px 15%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '5%',
    },
    mb: {
        marginBottom: '1rem',
    },
    login: {
        position: 'relative',
        zIndex: '0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    avatar: {
        margin: '8px',
    },
    form: {
        width: '100%',
        marginTop: '100px',
    },
    submit: {
        maxWidth: '300px',
        margin: '30px',
    }
}));

const Login = () => {
    const classes = useStyles();
    const {loading, isAuthenticated, loginWithRedirect, logout} = useAuth0();

    return (
        <div className={classes.wrapper}>
            <Grid container component="main" className={classes.root}>
                <CssBaseline/>
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square className={classes.login}>
                    <div className={classes.imageBlur}/>
                    <Paper className={classes.paper} elevation={3}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon/>
                        </Avatar>
                        {loading ? (
                            <Typography component="h1" variant="h5" className={classes.mb}>
                                {!isAuthenticated ? (
                                    <>Loading...</>
                                ) : (
                                    <>Logging you in...</>
                                )}
                            </Typography>
                        ) : (
                            <>
                                <Typography component="h1" variant="h5" className={classes.mb}>
                                    Sign in with Auth0
                                </Typography>

                                {!isAuthenticated && (
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                        onClick={() => loginWithRedirect({prompt: 'login'})}>
                                        Sign In
                                    </Button>
                                )}
                                {isAuthenticated && <button onClick={() => logout()}>Log out</button>}

                                <Box mt={5}>
                                    <Copyright/>
                                </Box>
                            </>
                        )}
                    </Paper>
                </Grid>
                <Grid item xs={false} sm={4} md={7} className={classes.image}/>
            </Grid>
        </div>
    );
};

export default Login;