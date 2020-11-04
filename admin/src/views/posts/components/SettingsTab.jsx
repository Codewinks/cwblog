import React, {useEffect, useState} from "react";
import {usePost} from '../../../context/Post'

import DateFnsUtils from "@date-io/date-fns";
import {DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";

import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Chip from '@material-ui/core/Chip';

import InsertInvitationIcon from '@material-ui/icons/InsertInvitation';
import VisibiltyIcon from '@material-ui/icons/Visibility';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import {ClickAwayListener, Fade, Paper, Popper, Radio} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import {default as highlightParse} from 'autosuggest-highlight/parse';
import {default as highlightMatch} from 'autosuggest-highlight/match';
import DropdownTree from './DropdownTree';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    checkbox: {
      padding: theme.spacing(0.25)
    },
    checkboxLabel: {
        fontSize: '0.875rem',
        padding: '0 2px'
    },
    listIcon: {
        minWidth: '35px'
    },
    chipDropdown: {
        marginLeft: theme.spacing(1),
        // marginRight: theme.spacing(1),
    },
    chip: {
        margin: 2,
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chipIcon: {
        order: 1,
        margin: '0 5px 0 -3px'
    },
    radio: {
        padding: 0,
    },
    listItem: {
        minWidth: '35px'
    },
    dropdown: {
        maxWidth: '300px'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    publishedAtContainer: {
        position: 'relative',
    },
    publishedAtPicker: {
        position: 'absolute',
        right: 0,
        visibility: 'hidden',
        opacity: 0,
        marginTop: '-5px'
    },
    inputPadding: {
        padding: theme.spacing(2),
        position: 'relative',
        zIndex: 0
    },
    borderTop: {
        borderTop: '1px solid #ccc'
    }
}));

const SettingsTab = props => {
    const {post, options, handleUpdate} = usePost();
    const classes = useStyles();
    const dateFns = new DateFnsUtils();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [menu, toggleMenu] = React.useState(['settings', 'categories', 'tags']);
    const [dropdown, setDropdown] = React.useState(null);
    const [publishedAt, setPublishedAt] = useState(new Date())

    const handleDropdown = (event, menu) => {
        setAnchorEl(event.currentTarget);
        setDropdown(menu);
    }

    const isDropdown = (key) => {
        return Boolean(dropdown === key);
    }

    const handleClose = () => {
        setDropdown(null);
        props.clearDropdown();
    }

    const handleMenu = (key) => {
        let newMenu = menu;

        if (!isMenuOpen(key)) {
            newMenu.push(key);
        } else {
            newMenu = menu.filter(e => e !== key);
        }

        toggleMenu([...newMenu]);
    }

    const isMenuOpen = (key) => Boolean(menu.includes(key));

    const handlePublishedAtChange = (v) => {
        setPublishedAt(v);

        if (v) {
            v = dateFns.format(v, 'MMM d, yyyy h:mma');
        }

        handleUpdate('published_at', v);
    }

    const mapCategoriesToTree = (categories, categoryList=[]) => {
        if (!categories || !categories.length){
            return categoryList;
        }

        categories.forEach(category => {
            let children = {}

            if(category.sub_categories && category.sub_categories.length){
                children.children = mapCategoriesToTree(category.sub_categories)
            }

            categoryList.push({
                value: category.id,
                label: category.name,
                ...children
            });
        })

        return categoryList;
    }

    useEffect(() => {
        if (props.dropdown) {
            setDropdown(props.dropdown);
        }
    }, [props.dropdown])

    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.root} disablePadding
        >
            <ListItem button onClick={() => handleMenu('settings')}>
                <ListItemText primary="Status &amp; Visibility"/>
                {isMenuOpen('settings') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={isMenuOpen('settings')} timeout="auto" unmountOnExit>
                <List dense>
                    <ListItem>
                        <ListItemIcon className={classes.listIcon}>
                            <FlashOnIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Status:"/>
                        <Chip
                            size="small"
                            label={options.status.find(v => v.value === post.status).label}
                            className={classes.chipDropdown}
                            icon={<EditIcon className={classes.chipIcon}/>}
                            aria-haspopup="true"
                            onClick={event => handleDropdown(event, 'status')}
                        />
                        <Popper open={isDropdown('status')} anchorEl={anchorEl} placement="bottom-end" transition
                                className={classes.dropdown}>
                            {({TransitionProps}) => (
                                <Fade {...TransitionProps} timeout={350}>
                                    <Paper id="menu-list-grow">
                                        <ClickAwayListener onClickAway={handleClose} mouseEvent="onMouseUp">
                                            <List dense subheader={
                                                <ListSubheader component="div" id="nested-list-subheader">
                                                    Post Status
                                                </ListSubheader>
                                            }>
                                                {options.status.map((opt) => {
                                                    return (
                                                        <ListItem key={opt.value} button
                                                                  onClick={() => handleUpdate('status', opt.value, handleClose)}>
                                                            <ListItemIcon className={classes.listItem}>
                                                                <Radio color="primary" disableRipple
                                                                       className={classes.radio}
                                                                       checked={post.status === opt.value}/>
                                                            </ListItemIcon>
                                                            <ListItemText primary={opt.label}
                                                                          secondary={opt.description}/>
                                                        </ListItem>
                                                    )
                                                })}
                                            </List>
                                        </ClickAwayListener>
                                    </Paper>
                                </Fade>
                            )}
                        </Popper>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon className={classes.listIcon}>
                            <VisibiltyIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Visibility:"/>
                        <Chip
                            size="small"
                            label={options.visibility.find(v => v.value === post.visibility).label}
                            className={classes.chipDropdown}
                            icon={<EditIcon className={classes.chipIcon}/>}
                            aria-haspopup="true"
                            onClick={event => handleDropdown(event, 'visibility')}
                        />
                        <Popper open={isDropdown('visibility')} anchorEl={anchorEl} placement="bottom-end" transition
                                className={classes.dropdown}>
                            {({TransitionProps}) => (
                                <Fade {...TransitionProps} timeout={350}>
                                    <Paper id="menu-list-grow">
                                        <ClickAwayListener onClickAway={handleClose} mouseEvent="onMouseUp">
                                            <List dense subheader={
                                                <ListSubheader component="div" id="nested-list-subheader">
                                                    Post Visibility
                                                </ListSubheader>
                                            }>
                                                {options.visibility.map((opt) => {
                                                    return (
                                                        <ListItem key={opt.value} button
                                                                  onClick={() => handleUpdate('visibility', opt.value, handleClose)}>
                                                            <ListItemIcon className={classes.listItem}>
                                                                <Radio color="primary" disableRipple
                                                                       className={classes.radio}
                                                                       checked={post.visibility === opt.value}/>
                                                            </ListItemIcon>
                                                            <ListItemText primary={opt.label}
                                                                          secondary={opt.description}/>
                                                        </ListItem>
                                                    )
                                                })}
                                            </List>
                                        </ClickAwayListener>
                                    </Paper>
                                </Fade>
                            )}
                        </Popper>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon className={classes.listIcon}>
                            <InsertInvitationIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Publish:"/>
                        <div className={classes.publishedAtContainer}>
                            <Chip
                                size="small"
                                label={post.published_at ? String(post.published_at) : 'Immediately'}
                                className={classes.chipDropdown}
                                icon={<EditIcon className={classes.chipIcon}/>}
                                onClick={event => handleDropdown(event, 'published_at')}
                            />
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <DateTimePicker
                                    open={isDropdown('published_at') || isDropdown('publish_on')}
                                    onOpen={() => setDropdown('published_at')}
                                    onClose={handleClose}
                                    value={publishedAt}
                                    onChange={handlePublishedAtChange}
                                    clearable={true}
                                    className={classes.publishedAtPicker}
                                    okLabel={isDropdown('publish_on') ? 'Publish' : 'Ok'}
                                    onAccept={(e) => {
                                        console.log(e)
                                    }}
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                    </ListItem>
                </List>

            </Collapse>

            <ListItem button onClick={() => handleMenu('categories')} className={classes.borderTop}>
                <ListItemText primary="Categories"/>
                {isMenuOpen('categories') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>

            <Collapse in={isMenuOpen('categories')} timeout="auto" unmountOnExit>
                <div className={classes.inputPadding}>
                    <DropdownTree data={mapCategoriesToTree(props.allCategories.filter(c => !c.depth))}
                                  checked={post.categories ? post.categories.map(c => c.id) : []}
                                  expanded={() => {
                                      //TODO: Clean this up.... or figure out a new way to expand selected child categories (ideally force parents to be checked)
                                      // This only does 1 level so it doesn't work.
                                      const checked = post.categories ? post.categories.map(c => c.id) : [];
                                      let expanded = [];
                                      props.allCategories.forEach(cat => {
                                          if (checked.includes(cat.id)) {
                                              expanded.push(cat.id);
                                              if(cat.parent_id){
                                                  expanded.push(cat.parent_id);
                                              }
                                          }
                                      })

                                      return expanded;
                                  }}
                                  onChange={(categories) => handleUpdate('categories', props.allCategories.filter(c => categories.includes(c.id)))}
                                  filterBarPlaceholder="Search categories..." placeholder="Choose categories..."
                                  noRecords="No categories found" />
                </div>
            </Collapse>

            <ListItem button onClick={() => handleMenu('tags')} className={classes.borderTop}>
                <ListItemText primary="Tags"/>
                {isMenuOpen('tags') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={isMenuOpen('tags')} timeout="auto" unmountOnExit>
                <div className={classes.inputPadding}>
                    <Autocomplete
                        multiple
                        size="small"
                        disableCloseOnSelect
                        options={props.allTags ? props.allTags : []}
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
                                    {parts.map((part, index) => (
                                        <span key={index} className={classes.checkboxLabel} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                                            {part.text}
                                        </span>
                                    ))}
                                </>
                            )
                        }}
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" label="Add Tags" placeholder="Choose tags..."/>
                        )}
                        onChange={(event, selected) => handleUpdate('tags', selected)}
                        noOptionsText="No tags found."
                    />
                </div>
            </Collapse>
        </List>
    )
};

export default SettingsTab;