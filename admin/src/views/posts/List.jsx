import React, { useState, useEffect } from "react";
import { useAuth0 } from "../../react-auth0-wrapper";
import { makeStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';

import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@material-ui/core/Icon';

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
}));

const PostsList = () => {
    const { getTokenSilently } = useAuth0();
    const [posts, setPosts] = useState(null);
    const [loading, setLoading] = useState(true);
    const classes = useStyles();

    useEffect(() => {
        const getPosts = async () => {
            try {
                const token = await getTokenSilently();
                const response = await fetch("http://api.winks.localhost:8080/v1/posts", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setPosts(await response.json());
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        getPosts();
    }, [getTokenSilently]);

    return (
        <>
            <Fab to="/posts/create" component={Link} color="primary" aria-label="Add New Post" className={classes.actionBtn}>
                <Icon>add</Icon>
            </Fab>
            <Typography variant="h3" gutterBottom>
                Posts
            </Typography>
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell align="right">Categories</TableCell>
                            <TableCell align="right">Tags</TableCell>
                            <TableCell align="right">Comments</TableCell>
                            <TableCell align="right">Date</TableCell>
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
                                    <TableRow key={row.id}>
                                        <TableCell component="th" scope="row">
                                            {row.title}
                                        </TableCell>
                                        <TableCell>{row.user.first_name}</TableCell>
                                        <TableCell align="right"></TableCell>
                                        <TableCell align="right"></TableCell>
                                        <TableCell align="right"></TableCell>
                                        <TableCell align="right"></TableCell>
                                    </TableRow>
                                ))}
                            </>
                        )}
                    </TableBody>
                </Table>
            </Paper>
        </>
    );
};

export default PostsList;