import React, { useEffect } from "react";
import { usePost } from '../../context/Post'
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import Box from '@material-ui/core/Box';

import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@material-ui/core/Icon';

import ConfirmDialog from "../../components/ConfirmDialog";

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
    capitalize: {
        textTransform: 'capitalize'
    },
    cell: {
        verticalAlign: 'top'
    }
}));

const PostList = ({history}) => {
    const { posts, loading, listPosts, deletePost } = usePost();
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const classes = useStyles();

    useEffect(() => {
        async function fetchData() {
            await listPosts()
        }

        fetchData();
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Fab to="/posts/create" component={Link} color="primary" aria-label="Add New Post" className={classes.actionBtn}>
                <Icon>add</Icon>
            </Fab>
            <Typography variant="h4" gutterBottom>
                Posts
            </Typography>
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    // indeterminate={numSelected > 0 && numSelected < rowCount}
                                    // checked={numSelected === rowCount}
                                    // onChange={onSelectAllClick}
                                    inputProps={{ 'aria-label': 'Select all posts' }}
                                />
                            </TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell align="right">Categories</TableCell>
                            <TableCell align="right">Tags</TableCell>
                            <TableCell align="right">Comments</TableCell>
                            <TableCell style={{ width: "1%" }}>Date</TableCell>
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
                                {(!posts || !posts.length) && (
                                    <TableRow>
                                        <TableCell colSpan="100%" align="center">
                                            No posts found.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {posts && posts.length > 0 && posts.map(row => (
                                    <TableRow key={row.id} hover>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                // indeterminate={numSelected > 0 && numSelected < rowCount}
                                                // checked={numSelected === rowCount}
                                                // onChange={onSelectAllClick}
                                                inputProps={{ 'aria-labelledby': row.id }}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row" id={row.id}>
                                            <Box mb={0.5} fontWeight="fontWeightBold">
                                                <Link to={`/posts/${row.id}`}>{row.title}</Link>
                                                {row.status !== 'published' && (
                                                    <span className={`${classes.capitalize} text-muted`}> — {row.status}</span>
                                                )}
                                            </Box>
                                            <Box className={`${classes.actions} text-grey`}>
                                                <Link to={`/posts/${row.id}`}>Edit</Link>
                                                <Box display="inline" px={0.65}>|</Box>
                                                <Link to="#" onClick={() => setConfirmDelete(row.id)} className="pointer text-danger">Trash</Link>
                                                <Box display="inline" px={0.65}>|</Box>
                                                {row.status !== 'published' && (
                                                    <Link to={`/posts/${row.id}?preview=1`} target="_blank" rel="noopener noreferrer">Preview</Link>
                                                )}
                                                {row.status === 'published' && (
                                                    <Link to={`/posts/${row.id}`} target="_blank" rel="noopener noreferrer">View</Link>                                                    
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell className={classes.cell}>{row.user.first_name}</TableCell>
                                        <TableCell align="right" className={classes.cell}></TableCell>
                                        <TableCell align="right" className={classes.cell}>—</TableCell>
                                        <TableCell align="right" className={classes.cell}>—</TableCell>
                                        <TableCell className={`${classes.cell} nowrap`}>
                                            <div className={classes.capitalize}>{row.status === 'published' ? 'Published' : 'Last Modified' }</div>
                                            <div className="text-muted">{row.published_at ? row.published_at : row.updated_at}</div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </>
                        )}
                    </TableBody>
                </Table>
            </Paper>
            <ConfirmDialog open={confirmDelete} onClose={() => setConfirmDelete(false)}
                title="Are you sure you want to delete this post?"
                content="The post will no longer be published and marked for deletion."
                action="Delete"
                callback={() => deletePost(confirmDelete)}
            ></ConfirmDialog>
        </>
    );
};

export default PostList;