import React, {useEffect, useState} from "react";
import {usePost} from '../../../context/Post'
import {useTag} from "../../../context/Tag";

import {makeStyles} from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import {default as highlightParse} from 'autosuggest-highlight/parse';
import {default as highlightMatch} from 'autosuggest-highlight/match';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import TagForm from "../../tags/components/Form";
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import AddIcon from "@material-ui/icons/Add";

const filter = createFilterOptions();

const useStyles = makeStyles(theme => ({
    checkbox: {
        padding: theme.spacing(0.25)
    },
    checkboxLabel: {
        fontSize: '0.875rem',
    },
}));

const TagSelector = () => {
    const {post, handleUpdate} = usePost();
    const {tags, listTags} = useTag();
    const [open, toggleOpen] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        async function loadStuff() {
            await listTags()
        }

        loadStuff();
    }, [])


    const handleClose = () => {
        toggleOpen(false);
    };

    return (
        <>
            <Autocomplete
                multiple
                size="small"
                disableCloseOnSelect
                options={tags ? tags : []}
                getOptionLabel={(tag) => tag.name}
                getOptionSelected={(tag) => post.tags.find(t => t.id === tag.id)}
                value={post.tags ? post.tags : []}
                renderOption={(tag, {inputValue, selected}) => {
                    const matches = highlightMatch(tag.name, inputValue);
                    const parts = highlightParse(tag.name, matches);

                    return (
                        <>
                            <Checkbox
                                icon={<CheckBoxOutlineBlankIcon fontSize="small"/>}
                                checkedIcon={<CheckBoxIcon fontSize="small"/>}
                                checked={selected}
                                color="primary"
                                size="small"
                                className={classes.checkbox}
                            />
                            {parts.map((part, index) => (<span key={index} className={classes.checkboxLabel}
                                                               style={{fontWeight: part.highlight ? 700 : 400}}>{part.text}</span>))}
                        </>
                    )
                }}
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Add Tags" placeholder="Choose tags..."/>
                )}
                onChange={(event, selected) => handleUpdate('tags', selected)}
                noOptionsText="No tags found."
            />
            <Button
                size="small"
                className={classes.button}
                startIcon={<AddIcon />}
                onClick={() => toggleOpen(true)}
            >
                Add new tag
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogContent>
                    <TagForm withCancel={handleClose} onSuccess={handleClose}/>
                </DialogContent>
                <DialogActions>
                </DialogActions>
            </Dialog>
        </>
    )
};

export default TagSelector;