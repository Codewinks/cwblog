import React, { useEffect } from "react";
import { useTag } from '../../../context/Tag'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
    button:{
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(2),
    },
    alignRight:{
        textAlign: 'right'
    }
}));

const TagForm = ({match, history, withCancel, onSuccess}) => {
    const { tag, listTags, getTag, newTag, saveTag, handleChange } = useTag();
    const classes = useStyles();
    const tagId = match?.params.tagId;

    useEffect(() => {
        if (tagId) {
            async function fetchData() {
                getTag(tagId)
            }

            fetchData();            
            return
        }
        
        newTag();
        async function fetchData() {
            await listTags()
        }

        fetchData();
        // eslint-disable-next-line
    }, [tagId]);

    const handleSave = async () => {
        await saveTag(onSuccess)
    }

    return (
        <>
            <Typography variant="h6">
                {tagId ? 'Edit' : 'Add New' } Tag
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
            <div className={classes.alignRight}>
                { tagId && (
                <Button onClick={() => history.push(`/admin/tags`)} variant="contained" aria-label="Cancel" className={classes.button}>
                    Cancel
                </Button>
                )}

                { withCancel && (
                    <Button onClick={withCancel} color="primary" className={classes.button}>
                        Cancel
                    </Button>
                )}

                <Button onClick={handleSave} variant="contained" color="primary" aria-label={tagId ? 'Update' : 'Add New Tag'} className={classes.button}>
                    {tagId ? 'Update' : 'Add New Tag'}
                </Button>
            </div>
        </>
    );
};

export default TagForm;