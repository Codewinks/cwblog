import React, {useEffect, useState} from "react";
import {usePost} from '../../../context/Post'

import DateFnsUtils from "@date-io/date-fns";
import { parseISO } from 'date-fns';
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

import {ClickAwayListener, Fade, Paper, Popper, Radio} from '@material-ui/core';
import CategorySelector from "./CategorySelector";
import TagSelector from "./TagSelector";

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
        handleUpdate('published_at', v);

        if(dropdown === 'publish_on'){
            props.savePost({status: 'published', published_at: v})
        }
    }

    const formatDate = (date) => {
        let v = date;
        if(date instanceof Date){
            v = dateFns.format(date, 'MMM d, yyyy h:mma')
        }else if(typeof date === 'string'){
            v= dateFns.format(parseISO(post.published_at), 'MMM d, yyyy h:mma')
        }

        return v
    }

    useEffect(() => {
        setPublishedAt(post.published_at);
    }, [post.published_at])

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
                                // label={post.published_at ? post.published_at : 'Immediately'}
                                label={post.published_at ? formatDate(post.published_at) : 'Immediately'}
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
                    <CategorySelector/>
                </div>
            </Collapse>

            <ListItem button onClick={() => handleMenu('tags')} className={classes.borderTop}>
                <ListItemText primary="Tags"/>
                {isMenuOpen('tags') ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={isMenuOpen('tags')} timeout="auto" unmountOnExit>
                <div className={classes.inputPadding}>
                    <TagSelector/>
                </div>
            </Collapse>
        </List>
    )
};

export default SettingsTab;