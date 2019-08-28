import React, { useEffect } from "react";
import { useTag } from '../../context/Tag'
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
    cursor: {
        cursor: 'pointer'
    }
}));

const TagList = ({history}) => {
    const { tags, loading, listTags } = useTag();
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
            <Fab to="/tags/create" component={Link} color="primary" aria-label="Add New Tag" className={classes.actionBtn}>
                <Icon>add</Icon>
            </Fab>
            <Typography variant="h3" gutterBottom>
                Tags
            </Typography>
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
                                    <TableRow key={row.id} hover>
                                        <TableCell component="th" scope="row">
                                            <Link to={`/tags/${row.id}`}>{row.name}</Link>
                                        </TableCell>
                                        <TableCell>{row.description}</TableCell>
                                        <TableCell>{row.slug}</TableCell>
                                        <TableCell align="right">0</TableCell>
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

export default TagList;