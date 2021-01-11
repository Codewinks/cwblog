import React, {useEffect} from "react";
import {useSetting} from '../../context/Setting'
import {makeStyles} from '@material-ui/core/styles';
import {Link} from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ConfirmDialog from "../../components/ConfirmDialog";
import CircularProgress from '@material-ui/core/CircularProgress';
import SettingForm from "./components/Form";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
    },
    actionBtn: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    cursor: {
        cursor: 'pointer'
    },
    wrapper: {
        flexWrap: 'nowrap'
    },
    leftCol: {
        width: '480px'
    },
    rightCol: {
        flexGrow: 1
    },
}));

const SettingList = ({match, history}) => {
    const {settings, loading, listSettings, getSetting, newSetting, deleteSetting} = useSetting();
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const classes = useStyles();
    const settingId = match.params.settingId;

    useEffect(() => {
        if (settingId) {
            async function fetchData() {
                getSetting(settingId)
            }

            fetchData();
            return
        }

        newSetting();

        async function fetchData() {
            await listSettings()
        }

        fetchData();
        // eslint-disable-next-line
    }, [settingId]);

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Settings
            </Typography>
            <Grid container spacing={4} className={classes.wrapper}>
                <Grid item className={classes.leftCol}>
                    <SettingForm match={match} history={history}/>
                </Grid>
                <Grid item className={classes.rightCol}>
                    {!settingId && (
                        <Paper className={classes.root}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Key</TableCell>
                                        <TableCell>Value</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading && (
                                        <TableRow>
                                            <TableCell colSpan="100%" align="center">
                                                <CircularProgress size={24} className={classes.progress}/>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {!loading && (
                                        <>
                                            {(!settings || !settings.length) && (
                                                <TableRow>
                                                    <TableCell colSpan="100%" align="center">
                                                        No settings found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {settings && settings.length > 0 && settings.map(row => (
                                                <TableRow key={row.id}>
                                                    <TableCell component="th" scope="row">
                                                        <Box mb={0.5} fontWeight="fontWeightBold">
                                                            <Link to={`/settings/${row.id}`}>{row.key}</Link>
                                                        </Box>
                                                        <Box className={`${classes.actions} text-grey`}>
                                                            <Link to={`/settings/${row.id}`}>Edit</Link>
                                                            <Box display="inline" px={0.65}>|</Box>
                                                            <Link to="#" onClick={() => setConfirmDelete(row.id)}
                                                                  className="pointer text-danger">Delete</Link>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{row.value}</TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                    )}
                                </TableBody>
                            </Table>
                        </Paper>
                    )}
                </Grid>
            </Grid>

            <ConfirmDialog open={confirmDelete} onClose={() => setConfirmDelete(false)}
                           title="Are you sure you want to delete this setting?"
                           content="The setting will be deleted and removed from all posts."
                           action="Delete"
                           callback={() => deleteSetting(confirmDelete)}
            ></ConfirmDialog>
        </>
    );
};

export default SettingList;