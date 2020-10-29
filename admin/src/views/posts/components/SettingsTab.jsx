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

import CancelIcon from '@material-ui/icons/Cancel';

import InsertInvitationIcon from '@material-ui/icons/InsertInvitation';
import VisibiltyIcon from '@material-ui/icons/Visibility';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import {ClickAwayListener, Fade, Paper, Popper, Radio} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
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
    publishedAtContainer:{
        position: 'relative',
    },
    publishedAtPicker:{
        position: 'absolute',
        right: 0,
        visibility: 'hidden',
        opacity: 0,
        marginTop: '-5px'
    }
}));

const SettingsTab = props => {
    const { post, options, handleUpdate, handleChange} = usePost();
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

        if(!isMenuOpen(key)){
            newMenu.push(key);
        }else{
            newMenu = menu.filter(e => e !== key);
        }

        toggleMenu([...newMenu]);
    }

    const isMenuOpen = (key) => Boolean(menu.includes(key));

    const handlePublishedAtChange = (v) => {
        setPublishedAt(v);
        
        if(v){
            v = dateFns.format(v, 'MMM d, yyyy h:mma');
        }

        handleUpdate('published_at', v);
    }

    useEffect(() => {
        if (props.dropdown){
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
                <ListItemText primary="Status &amp; Visibility" />
                {isMenuOpen('settings') ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={isMenuOpen('settings')} timeout="auto" unmountOnExit>
                <List disablePadding dense>
                    <ListItem>
                        <ListItemIcon className={classes.listIcon}>
                            <FlashOnIcon />
                        </ListItemIcon>
                        <ListItemText primary="Status:" />
                        <Chip
                            size="small"
                            label={options.status.find(v => v.value === post.status).label}
                            className={classes.chipDropdown}
                            icon={<EditIcon className={classes.chipIcon} />}
                            aria-haspopup="true"
                            onClick={event => handleDropdown(event, 'status')}
                        />
                        <Popper open={isDropdown('status')} anchorEl={anchorEl} placement="bottom-end" transition className={classes.dropdown}>
                            {({ TransitionProps }) => (
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
                                                        <ListItem key={opt.value} button onClick={() => handleUpdate('status', opt.value, handleClose)}>
                                                            <ListItemIcon className={classes.listItem}>
                                                                <Radio color="primary" disableRipple className={classes.radio}
                                                                    checked={post.status === opt.value} />
                                                            </ListItemIcon>
                                                            <ListItemText primary={opt.label} secondary={opt.description} />
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
                            <VisibiltyIcon />
                        </ListItemIcon>
                        <ListItemText primary="Visibility:" />
                        <Chip
                            size="small"
                            label={options.visibility.find(v => v.value === post.visibility).label}
                            className={classes.chipDropdown}
                            icon={<EditIcon className={classes.chipIcon} />}
                            aria-haspopup="true"
                            onClick={event => handleDropdown(event, 'visibility')}
                        />
                        <Popper open={isDropdown('visibility')} anchorEl={anchorEl} placement="bottom-end" transition className={classes.dropdown}>
                            {({ TransitionProps }) => (
                                <Fade {...TransitionProps} timeout={350}>
                                    <Paper id="menu-list-grow">
                                        <ClickAwayListener onClickAway={handleClose} mouseEvent="onMouseUp">
                                            <List dense subheader={
                                                <ListSubheader component="div" id="nested-list-subheader">
                                                    Post Visibility
                                                </ListSubheader>
                                            }>
                                                {options.visibility.map((opt) =>{
                                                    return (
                                                        <ListItem key={opt.value} button onClick={() => handleUpdate('visibility', opt.value, handleClose)}>
                                                            <ListItemIcon className={classes.listItem}>
                                                                <Radio color="primary" disableRipple className={classes.radio}
                                                                    checked={post.visibility === opt.value} />
                                                            </ListItemIcon>
                                                            <ListItemText primary={opt.label} secondary={opt.description} />
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
                            <InsertInvitationIcon />
                        </ListItemIcon>
                        <ListItemText primary="Publish:" />
                        <div className={classes.publishedAtContainer}>
                            <Chip
                                size="small"
                                label={post.published_at ? String(post.published_at) : 'Immediately'}
                                className={classes.chipDropdown}
                                icon={<EditIcon className={classes.chipIcon} />}
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
                                    onAccept={(e) => {console.log(e)}}
                                />
                            </MuiPickersUtilsProvider>
                        </div>
                    </ListItem>
                </List>
                
            </Collapse>

            <ListItem button onClick={() => handleMenu('categories')}>
                <ListItemText primary="Categories" />
                {isMenuOpen('categories') ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <ListItem button onClick={() => handleMenu('tags')}>
                <ListItemText primary="Tags" />
                {isMenuOpen('tags') ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={isMenuOpen('tags')} timeout="auto" unmountOnExit>
                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-mutiple-chip-label">{ post.tags && post.tags.length ? 'Selected' : 'Choose' } Tags</InputLabel>
                    <Select
                        labelId="demo-mutiple-chip-label"
                        id="demo-mutiple-chip"
                        multiple
                        value={post.tags ? post.tags : []}
                        onChange={event => handleChange(event, 'tags')}
                        input={<Input id="select-multiple-chip" />}
                        renderValue={(selectedTags) => (
                            <div className={classes.chips}>
                                {selectedTags.map((tag) => (
                                    <Chip key={tag.id} label={tag.name} className={classes.chip}
                                          onDelete={() => handleUpdate('tags', post.tags.filter((t) => t.id !== tag.id))}
                                          deleteIcon={<CancelIcon onMouseDown={(event) => event.stopPropagation()} />} />
                                ))}
                            </div>
                        )}
                    >
                        {props.allTags && props.allTags.map((tag) => (
                            <MenuItem key={tag.id} value={tag}>
                                {tag.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Collapse>
        </List>
    )
};

export default SettingsTab;