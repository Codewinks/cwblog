import React, { useState, useEffect } from "react";
import { usePost } from '../../../context/Post'

import DateFnsUtils from "@date-io/date-fns";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import { makeStyles } from '@material-ui/core/styles';
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

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';
import Popper from '@material-ui/core/Popper';
import Radio from '@material-ui/core/Radio';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    listIcon: {
        minWidth: '35px'
    },
    chip: {
        marginLeft: theme.spacing(1),
        // marginRight: theme.spacing(1),
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
    const [open, setOpen] = React.useState(true);
    const [dropdown, setDropdown] = React.useState(false);
    const [publishedAt, setPublishedAt] = useState(new Date())

    const handleDropdown = (event, menu) => {
        setAnchorEl(event.currentTarget);
        setDropdown(menu);
    }

    const isDropdown = (menu) => {
        return Boolean(dropdown === menu);
    }

    const handleClose = () => {
        setDropdown(false);
        props.clearDropdown();
    }

    const handleClick = () => {
        setOpen(!open);
    }

    const handlePublishedAtChange = (v) => {
        setPublishedAt(v);
        
        if(v){
            v = dateFns.format(v, 'MMM d, yyyy h:mma');
        }
        
        handleChange({ target: { value: v } }, 'published_at');
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
            <ListItem button onClick={handleClick}>
                <ListItemText primary="Status &amp; Visibility" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List disablePadding dense>
                    <ListItem>
                        <ListItemIcon className={classes.listIcon}>
                            <FlashOnIcon />
                        </ListItemIcon>
                        <ListItemText primary="Status:" />
                        <Chip
                            size="small"
                            label={options.status.find(v => v.value === post.status).label}
                            className={classes.chip}
                            icon={<EditIcon className={classes.chipIcon} />}
                            aria-haspopup="true"
                            onClick={event => handleDropdown(event, 'status')}
                        />
                        <Popper open={isDropdown('status')} anchorEl={anchorEl} placement="bottom-end" transition className={classes.dropdown}>
                            {({ TransitionProps }) => (
                                <Fade {...TransitionProps} timeout={350}>
                                    <Paper id="menu-list-grow">
                                        <ClickAwayListener onClickAway={handleClose}>
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
                            className={classes.chip}
                            icon={<EditIcon className={classes.chipIcon} />}
                            aria-haspopup="true"
                            onClick={event => handleDropdown(event, 'visibility')}
                        />
                        <Popper open={isDropdown('visibility')} anchorEl={anchorEl} placement="bottom-end" transition className={classes.dropdown}>
                            {({ TransitionProps }) => (
                                <Fade {...TransitionProps} timeout={350}>
                                    <Paper id="menu-list-grow">
                                        <ClickAwayListener onClickAway={handleClose}>
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
                                className={classes.chip}
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

            <ListItem button onClick={handleClick}>
                <ListItemText primary="Categories" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>

            <ListItem button onClick={handleClick}>
                <ListItemText primary="Tags" />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
        </List>
    )
};

export default SettingsTab;