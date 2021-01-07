import React from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Alert } from '@material-ui/lab';
import Grid from "@material-ui/core/Grid";
import Accordion from "@material-ui/core/Accordion";
import MuiAccordionSummary  from "@material-ui/core/AccordionSummary";
import {ChatBubble, ExpandMore, LibraryBooks, Book} from "@material-ui/icons";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    alert: {
        marginBottom: theme.spacing(2),
        borderLeft: '4px solid #ff9800',
    },
    link:{
        display: 'inline-flex',
        alignItems: 'center',
        lineHeight: 1.5,
        '& .MuiSvgIcon-root':{
            marginRight: theme.spacing(0.5)
        }
    },
    item:{
        display: 'flex',
        alignItems: 'center',
    }
}));

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
        margin: 0,
    },
}))(MuiAccordionDetails);

const AccordionSummary = withStyles((theme) => ({
    root: {
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
}))(MuiAccordionSummary);

const Dashboard = () => {
    const classes = useStyles();

    return (
        <>
            <Alert severity="warning" className={classes.alert}>
                There is an update available! <Link to={"/"}>Please update now.</Link>
            </Alert>

            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Grid container spacing={4}>
                <Grid item md={6}>
                    <Accordion defaultExpanded={true}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6">Quick Stats</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid item md={6} className={classes.item}>
                                    <Link to={"/posts"} className={classes.link}><Book fontSize="small" /> 12 Posts</Link>
                                </Grid>
                                <Grid item md={6} className={classes.item}>
                                    <Link to={"/pages"} className={classes.link}><LibraryBooks fontSize="small" /> 5 Pages</Link>
                                </Grid>
                                <Grid item md={6} className={classes.item}>
                                    <Link to={"/"} className={classes.link}><ChatBubble fontSize="small" /> 0 Comments</Link>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </Grid>
        </>
    );
};

export default Dashboard;