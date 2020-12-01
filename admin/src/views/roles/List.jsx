import React, { useEffect } from "react";
import { useRole } from '../../context/Role'
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

const RoleList = ({match, history}) => {
    const { role, roles, loading, listRoles, getRole, newRole, saveRole, deleteRole, handleChange } = useRole();
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const classes = useStyles();
    const roleId = match.params.roleId;

    useEffect(() => {
        if (roleId) {
            async function fetchData() {
                getRole(roleId)
            }

            fetchData();
            return
        }

        newRole();
        async function fetchData() {
            await listRoles()
        }

        fetchData();
        // eslint-disable-next-line
    }, [roleId]);

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Roles
            </Typography>
            <Grid container spacing={4} className={classes.wrapper}>
                <Grid item className={classes.leftCol}>
                    <Typography variant="h6">
                        {roleId ? 'Edit' : 'Add New' } Role
                    </Typography>
                    <TextField id="role-name"
                               label="Name"
                               onChange={event => handleChange(event, 'name')}
                               margin="normal"
                               fullWidth
                               variant="outlined"
                               value={role.name ? role.name : ""}
                        // error={true}
                        // helperText="Post name is required."
                    />
                    <TextField
                        id="role-meta"
                        label="Meta"
                        onChange={event => handleChange(event, 'meta')}
                        multiline
                        rows="4"
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        value={role.meta ? JSON.stringify(role.meta) : ""}
                    />
                    <TextField
                        id="role-permissions"
                        label="Permissions"
                        onChange={event => handleChange(event, 'permissions')}
                        multiline
                        rows="4"
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        value={role.permissions ? JSON.stringify(role.permissions) : ""}
                    />
                    { roleId && (
                        <Button onClick={() => history.push(`/admin/roles`)} variant="contained" aria-label="Cancel" className={classes.button}>
                            Cancel
                        </Button>
                    )}
                    <Button onClick={saveRole} variant="contained" color="primary" aria-label={roleId ? 'Update' : 'Add New Role'} className={classes.button}>
                        {roleId ? 'Update' : 'Add New Role'}
                    </Button>
                </Grid>
                <Grid item className={classes.rightCol}>
                    { !roleId && (
                        <Paper className={classes.root}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell align="right">Users</TableCell>
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
                                            {(!roles || !roles.length) && (
                                                <TableRow>
                                                    <TableCell colSpan="100%" align="center">
                                                        No roles found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                            {roles && roles.length > 0 && roles.map(row => (
                                                <TableRow key={row.id}>
                                                    <TableCell component="th" scope="row">
                                                        <Box mb={0.5} fontWeight="fontWeightBold">
                                                            <Link to={`/roles/${row.id}`}>{row.name}</Link>
                                                        </Box>
                                                        <Box className={`${classes.actions} text-grey`}>
                                                            <Link to={`/roles/${row.id}`}>Edit</Link>
                                                            <Box display="inline" px={0.65}>|</Box>
                                                            <Link to="#" onClick={() => setConfirmDelete(row.id)} className="pointer text-danger">Delete</Link>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">0</TableCell>
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
                           title="Are you sure you want to delete this role?"
                           content="The role will be deleted and removed from all users."
                           action="Delete"
                           callback={() => deleteRole(confirmDelete)}
            ></ConfirmDialog>
        </>
    );
};

export default RoleList;