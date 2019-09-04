import React, { useEffect } from "react";
import { useTag } from '../../context/Tag'
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
import Icon from '@material-ui/core/Icon';
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
}));

const TagList = ({history}) => {
    const { tag, tags, loading, listTags, saveTag, deleteTag, handleChange } = useTag();
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const classes = useStyles();

    useEffect(() => {
        async function fetchData() {
            await listTags()
        }

        fetchData();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Tags
            </Typography>
            <Grid container spacing={4} className={classes.wrapper}>
                <Grid item className={classes.leftCol}>
                    <Typography variant="h6">
                        Add New Tag
                    </Typography>
                    <TextField id="tag-name"
                            label="Name"
                            onChange={event => handleChange(event, 'name')}
                            margin="normal"
                            fullWidth
                            variant="outlined"
                            value={tag.name ? tag.name : ""}
                            // error={true}
                            // helperText="Post name is required."
                        />
                    <TextField id="tag-slug"
                            label="Slug"
                            onChange={event => handleChange(event, 'slug')}
                            margin="normal"
                            fullWidth
                            variant="outlined"
                            value={tag.slug ? tag.slug : ""}
                            // error={true}
                            // helperText="Post slug is required."
                        />
                    <TextField
                        id="tag-description"
                        label="Description"
                        onChange={event => handleChange(event, 'description')}
                        multiline
                        rows="4"
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        value={tag.description ? tag.description : ""}
                    />
                    <Button onClick={saveTag} variant="contained" color="primary" aria-label={tag.id ? 'Update' : 'Add New Tag'}>
                        {tag.id ? 'Update' : 'Add New Tag'}
                    </Button>
                </Grid>
                <Grid item className={classes.rightCol}>
                    <Paper className={classes.root}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Slug</TableCell>
                                    <TableCell align="right">Count</TableCell>
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
                                        {(!tags || !tags.length) && (
                                            <TableRow>
                                                <TableCell colSpan="100%" align="center">
                                                    No tags found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {tags && tags.length > 0 && tags.map(row => (
                                            <TableRow key={row.id}>
                                                <TableCell component="th" scope="row">
                                                    <Box mb={0.5} fontWeight="fontWeightBold">
                                                        <Link to={`/tags/${row.id}`}>{row.name}</Link>
                                                    </Box>
                                                    <Box className={`${classes.actions} text-grey`}>
                                                        <Link to={`/tags/${row.id}`}>Edit</Link>
                                                        <Box display="inline" px={0.65}>|</Box>
                                                        <Link to="#" onClick={() => setConfirmDelete(row.id)} className="pointer text-danger">Delete</Link>
                                                        <Box display="inline" px={0.65}>|</Box>
                                                        <Link to={`/tags/${row.id}`} target="_blank" rel="noopener noreferrer">View</Link>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{row.description}</TableCell>
                                                <TableCell>{row.slug}</TableCell>
                                                <TableCell align="right">0</TableCell>
                                                <TableCell align="right"><Icon onClick={() => setConfirmDelete(row.id)}>delete_forever</Icon></TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>          

            <ConfirmDialog open={confirmDelete} onClose={() => setConfirmDelete(false)}
                title="Are you sure you want to delete this tag?"
                content="The tag will be deleted and removed from all posts."
                action="Delete"
                callback={() => deleteTag(confirmDelete)}
            ></ConfirmDialog>  
        </>
    );
};

export default TagList;