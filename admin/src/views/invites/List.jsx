import React, { useEffect } from "react";
import { useInvite } from '../../context/Invite'
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import ConfirmDialog from "../../components/ConfirmDialog";

import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {useRole} from "../../context/Role";
import Chip from "@material-ui/core/Chip";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { utcToZonedTime } from 'date-fns-tz';
import { parseFromTimeZone } from 'date-fns-timezone';

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
    button:{
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(2),
    }
}));

const InviteList = ({match, history}) => {
    const { invite, invites, loading, listInvites, getInvite, newInvite, saveInvite, deleteInvite, handleUpdate, handleChange } = useInvite();
    const {roles, listRoles} = useRole();
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [expiresAt, setExpiresAt] = React.useState(null);
    const classes = useStyles();
    const inviteId = match.params.inviteId;
    const dateFns = new DateFnsUtils();

    useEffect(() => {
        if (inviteId) {
            async function fetchData() {
                let current = await getInvite(inviteId)
                await listRoles()
                setExpiresAt(parseFromTimeZone(current.expires_at, {timeZone: 'UTC'}))
            }

            fetchData();
            return
        }

        newInvite();
        setExpiresAt(null);
        async function fetchData() {
            await listInvites()
            await listRoles()
        }

        fetchData();
        // eslint-disable-next-line
    }, [inviteId]);

    const handleExpiresAtChange = (v) => {
        setExpiresAt(v);

        if (v) {
            v = dateFns.format(utcToZonedTime(v, 'UTC'), 'yyyy-MM-dd HH:mm');
        }

        handleUpdate('expires_at', v);
    }

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Invites
            </Typography>
            <Grid container spacing={4} className={classes.wrapper}>
                <Grid item className={classes.leftCol}>
                    <Typography variant="h6">
                        {inviteId ? 'Edit' : 'Add New' } Invite
                    </Typography>
                    <TextField id="invite-email"
                               label="Email"
                               type="email"
                               onChange={event => handleChange(event, 'email')}
                               margin="normal"
                               fullWidth
                               variant="outlined"
                               value={invite.email ? invite.email : ""}
                        // error={true}
                        // helperText="Post name is required."
                    />
                    <FormControl variant="outlined"
                                 margin="normal"
                                 fullWidth className={classes.formControl}>
                        <InputLabel id="invite-role-label">Role</InputLabel>
                        <Select id="invite-role"
                                labelId="invite-role-label"
                                label="Role"
                                onChange={event => handleChange(event, 'role_id')}
                                value={invite.role_id ? invite.role_id : ""}
                        >
                            <MenuItem aria-label="None" value=""/>
                            {roles && roles.map(row => (
                                <MenuItem key={row.id} value={row.id}>{row.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined"
                                 margin="normal"
                                 fullWidth className={classes.formControl}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DateTimePicker
                                label="Expires At"
                                inputVariant="outlined"
                                open={open}
                                onOpen={() => setOpen(true)}
                                onClose={() => setOpen(false)}
                                value={expiresAt}
                                onChange={handleExpiresAtChange}
                                clearable={true}
                                className={classes.publishedAtPicker}
                                okLabel="Ok"
                                disablePast
                                format="MMM d, yyyy h:mma"
                                onAccept={(e) => {
                                    console.log(e)
                                }}
                            />
                        </MuiPickersUtilsProvider>
                    </FormControl>

                    { inviteId && (
                        <Button onClick={() => history.push(`/invites`)} variant="contained" aria-label="Cancel" className={classes.button}>
                            Cancel
                        </Button>
                    )}
                    <Button onClick={saveInvite} variant="contained" color="primary" aria-label={inviteId ? 'Update' : 'Add New Invite'} className={classes.button}>
                        {inviteId ? 'Update' : 'Add New Invite'}
                    </Button>
                </Grid>
                <Grid item className={classes.rightCol}>
                    { !inviteId && (
                        <Paper className={classes.root}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell align="right">Expires At</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading && (
                                        <TableRow>
                                            <TableCell colSpan="100%" align="center">
                                                <CircularProgress size={24} className={classes.progress} />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {!loading && (
                                        <>
                                            {(!invites || !invites.length) && (
                                                <TableRow>
                                                    <TableCell colSpan="100%" align="center">
                                                        No invites found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {invites && invites.length > 0 && invites.map(row => (
                                                <TableRow key={row.id}>
                                                    <TableCell component="th" scope="row">
                                                        <Box mb={0.5} fontWeight="fontWeightBold">
                                                            <Link to={`/invites/${row.id}`}>{row.email}</Link>
                                                        </Box>
                                                        <Box className={`${classes.actions} text-grey`}>
                                                            <Link to={`/invites/${row.id}`}>Edit</Link>
                                                            <Box display="inline" px={0.65}>|</Box>
                                                            <Link to="#" onClick={() => setConfirmDelete(row.id)} className="pointer text-danger">Delete</Link>
                                                            <Box display="inline" px={0.65}>|</Box>
                                                            <Link to={`/invites/${row.id}`} target="_blank" rel="noopener noreferrer">View</Link>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        { /* TODO: Add color coding to different role chips */ }
                                                        <Chip size="small" label={row.role.name}/>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {/*{ row.expires_at ? row.expires_at : '—' }*/}
                                                        { row.expires_at ? dateFns.format(parseFromTimeZone(row.expires_at, {timeZone: 'UTC'}), 'MMM d, yyyy h:mma') : '—' }
                                                    </TableCell>
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
                           title="Are you sure you want to delete this invite?"
                           content="The invite will be deleted and the user will no longer be allowed to sign up."
                           action="Delete"
                           callback={() => deleteInvite(confirmDelete)}
            ></ConfirmDialog>
        </>
    );
};

export default InviteList;