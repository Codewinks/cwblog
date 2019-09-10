import React, { useEffect } from "react";
import { useCategory } from '../../context/Category'
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

const CategoryList = ({match, history}) => {
    const { category, categories, loading, listCategories, getCategory, newCategory, saveCategory, deleteCategory, handleChange } = useCategory();
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const classes = useStyles();
    const categoryId = match.params.categoryId;

    useEffect(() => {
        if (categoryId) {
            async function fetchData() {
                getCategory(categoryId)
            }

            fetchData();            
            return
        }
        
        newCategory();
        async function fetchData() {
            await listCategories()
        }

        fetchData();
        // eslint-disable-next-line
    }, [categoryId]);

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Categories
            </Typography>
            <Grid container spacing={4} className={classes.wrapper}>
                <Grid item className={classes.leftCol}>
                    <Typography variant="h6">
                        {categoryId ? 'Edit' : 'Add New' } Category
                    </Typography>
                    <TextField id="category-name"
                            label="Name"
                            onChange={event => handleChange(event, 'name')}
                            margin="normal"
                            fullWidth
                            variant="outlined"
                            value={category.name ? category.name : ""}
                            // error={true}
                            // helperText="Post name is required."
                        />
                    <TextField id="category-slug"
                            label="Slug"
                            onChange={event => handleChange(event, 'slug')}
                            margin="normal"
                            fullWidth
                            variant="outlined"
                            value={category.slug ? category.slug : ""}
                            // error={true}
                            // helperText="Post slug is required."
                        />
                    <TextField
                        id="category-description"
                        label="Description"
                        onChange={event => handleChange(event, 'description')}
                        multiline
                        rows="4"
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        value={category.description ? category.description : ""}
                    />
                    { categoryId && (
                    <Button onClick={() => history.push(`/categories`)} variant="contained" aria-label="Cancel" className={classes.button}>
                        Cancel
                    </Button>
                    )}
                    <Button onClick={saveCategory} variant="contained" color="primary" aria-label={categoryId ? 'Update' : 'Add New Category'} className={classes.button}>
                        {categoryId ? 'Update' : 'Add New Category'}
                    </Button>
                </Grid>
                <Grid item className={classes.rightCol}>
                    { !categoryId && (
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
                                        {(!categories || !categories.length) && (
                                            <TableRow>
                                                <TableCell colSpan="100%" align="center">
                                                    No categories found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        {categories && categories.length > 0 && categories.map(row => (
                                            <TableRow key={row.id}>
                                                <TableCell component="th" scope="row">
                                                    <Box mb={0.5} fontWeight="fontWeightBold">
                                                        <Link to={`/categories/${row.id}`}>{row.name}</Link>
                                                    </Box>
                                                    <Box className={`${classes.actions} text-grey`}>
                                                        <Link to={`/categories/${row.id}`}>Edit</Link>
                                                        <Box display="inline" px={0.65}>|</Box>
                                                        <Link to="#" onClick={() => setConfirmDelete(row.id)} className="pointer text-danger">Delete</Link>
                                                        <Box display="inline" px={0.65}>|</Box>
                                                        <Link to={`/categories/${row.id}`} target="_blank" rel="noopener noreferrer">View</Link>
                                                    </Box>
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
                    )}
                </Grid>
            </Grid>           

            <ConfirmDialog open={confirmDelete} onClose={() => setConfirmDelete(false)}
                title="Are you sure you want to delete this category?"
                content="The category will be deleted and removed from all posts."
                action="Delete"
                callback={() => deleteCategory(confirmDelete)}
            ></ConfirmDialog>             
        </>
    );
};

export default CategoryList;