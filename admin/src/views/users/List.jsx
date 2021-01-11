import React, {useEffect} from "react";
import {useUser} from '../../context/User'
import {useRole} from '../../context/Role'
import {makeStyles} from '@material-ui/core/styles';
import {Link} from "react-router-dom";
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
import UserAvatar from "./components/UserAvatar";
import Chip from "@material-ui/core/Chip";
import {useAuth0} from "../../context/Auth0";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

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
        top: theme.spacing(12),
        right: theme.spacing(3),
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
    button: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(2),
    },
    actions: {
        marginLeft: theme.spacing(1),
    },
}));

const UserList = ({match, history}) => {
    const {currentUser} = useAuth0();
    const {user, users, loading, listUsers, getUser, newUser, saveUser, deleteUser, handleChange} = useUser();
    const {roles, listRoles} = useRole();
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const classes = useStyles();
    const isProfile = match.path === '/profile';
    const userId = isProfile ? currentUser.id : match.params.userId;

    useEffect(() => {
        if (userId) {
            async function fetchData() {
                getUser(userId)
                await listRoles()
            }

            fetchData();
            return
        }

        newUser();

        async function fetchData() {
            await listUsers()
        }

        fetchData();
        // eslint-disable-next-line
    }, [userId]);

    return (
        <>
            <div className={classes.actionBtn}>
                <Button variant="contained" color="primary" to="/users/invite" component={Link}>Invite New User</Button>
            </div>
            <Typography variant="h4" gutterBottom>
                {isProfile ? 'My Profile' : 'Users'}
            </Typography>
            <Grid container spacing={4} className={classes.wrapper}>
                {userId && (
                    <Grid item className={classes.leftCol}>
                        <Typography variant="h6">
                            {isProfile ? 'Edit Profile' : 'Edit User'}
                        </Typography>
                        <Chip size="small" label={`UID: ${user.uid}`}/>
                        <TextField id="user-first-name"
                                   label="First Name"
                                   onChange={event => handleChange(event, 'first_name')}
                                   margin="normal"
                                   fullWidth
                                   variant="outlined"
                                   value={user.first_name ? user.first_name : ""}
                            // error={true}
                            // helperText="Post name is required."
                        />
                        <TextField id="user-last-name"
                                   label="Last Name"
                                   onChange={event => handleChange(event, 'last_name')}
                                   margin="normal"
                                   fullWidth
                                   variant="outlined"
                                   value={user.last_name ? user.last_name : ""}
                            // error={true}
                            // helperText="Post name is required."
                        />
                        <TextField id="user-nickname"
                                   label="Nickname"
                                   onChange={event => handleChange(event, 'nickname')}
                                   margin="normal"
                                   fullWidth
                                   variant="outlined"
                                   value={user.nickname ? user.nickname : ""}
                            // error={true}
                            // helperText="Post slug is required."
                        />
                        <TextField id="user-email"
                                   label="Email"
                                   onChange={event => handleChange(event, 'email')}
                                   margin="normal"
                                   fullWidth
                                   variant="outlined"
                                   value={user.email ? user.email : ""}
                            // error={true}
                            // helperText="Post slug is required."
                        />
                        <TextField id="user-avatar"
                                   label="Avatar"
                                   onChange={event => handleChange(event, 'avatar')}
                                   margin="normal"
                                   fullWidth
                                   variant="outlined"
                                   value={user.avatar ? user.avatar : ""}
                            // error={true}
                            // helperText="Post slug is required."
                        />
                        <FormControl variant="outlined"
                                     margin="normal"
                                     fullWidth className={classes.formControl}>
                            <InputLabel id="user-role-label">Role</InputLabel>
                            <Select id="user-role"
                                    labelId="user-role-label"
                                    label="Role"
                                    onChange={event => handleChange(event, 'role_id')}
                                    value={user.role_id ? user.role_id : ""}
                            >
                                <MenuItem aria-label="None" value=""/>
                                {roles && roles.map(row => (
                                    <MenuItem key={row.id} value={row.id}>{row.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {userId && (
                            <Button onClick={() => history.push(`/users`)} variant="contained" aria-label="Cancel"
                                    className={classes.button}>
                                Cancel
                            </Button>
                        )}
                        <Button onClick={saveUser} variant="contained" color="primary"
                                aria-label={userId ? 'Update' : 'Add New User'} className={classes.button}>
                            {userId ? 'Update' : 'Add New User'}
                        </Button>
                    </Grid>
                )}
                <Grid item className={classes.rightCol}>
                    {!userId && (
                        <Paper className={classes.root}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell align="center">Posts</TableCell>
                                        <TableCell>Latest Login</TableCell>
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
                                            {(!users || !users.length) && (
                                                <TableRow>
                                                    <TableCell colSpan="100%" align="center">
                                                        No users found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {users && users.length > 0 && users.map(row => (
                                                <TableRow key={row.id}>
                                                    <TableCell component="th" scope="row">
                                                        <Box display="flex" alignContent="center">
                                                            <UserAvatar user={row}/>
                                                            <Box className={`${classes.actions} text-grey`}>
                                                                <Box>
                                                                    <Link to={`/users/${row.id}`}>
                                                                        <strong>{row.first_name} {row.last_name}</strong>
                                                                    </Link>
                                                                </Box>
                                                                <Link to={`/users/${row.id}`}>Edit</Link>
                                                                {currentUser.id !== row.id ? (
                                                                    <>
                                                                        <Box display="inline" px={0.65}>|</Box>
                                                                        <Link to="#"
                                                                              onClick={() => setConfirmDelete(row.id)}
                                                                              className="pointer text-danger">Delete</Link>
                                                                    </>
                                                                ) : null}
                                                            </Box>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>{row.email}</TableCell>
                                                    <TableCell>
                                                        {row.role ? (
                                                            // TODO: Add color coding to different role chips
                                                            <Chip size="small" label={row.role.name}/>
                                                        ) : '—'}
                                                    </TableCell>
                                                    <TableCell align="center">0</TableCell>
                                                    <TableCell>
                                                        {/* TODO: Currently auth0 /userinfo doesn't return latest login. Need to track manually or figure out api call to get it */}
                                                        —
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
                           title="Are you sure you want to delete this user?"
                           content="The user will be deleted and removed from all posts."
                           action="Delete"
                           callback={() => deleteUser(confirmDelete)}
            ></ConfirmDialog>
        </>
    );
};

export default UserList;