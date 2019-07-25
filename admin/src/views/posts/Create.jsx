import React, { useState } from 'react';
import { useApp } from '../../context/App'
import { usePost } from '../../context/Post'
import { useAuth0 } from "../../react-auth0-wrapper";

import Permalink from "./components/Permalink";
import SettingsTab from "./components/SettingsTab"

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import TextField from '@material-ui/core/TextField';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';

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
        top: theme.spacing(12),
        right: theme.spacing(2),
    },
    button: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(2)
    },
    wrapper: {
        flexWrap: 'nowrap'
    },
    leftCol: {
        flexGrow: 1,
    },
    rightCol: {
        width: '320px'
    },
    tab: {
        minWidth: 0,
        width: 'auto'
    }
}));


const PostsCreate = () => {
    const { user, getTokenSilently } = useAuth0();
    const { showAlert } = useApp();
    const { post, handleChange, handleUpdate }  = usePost();
    const classes = useStyles();
    const anchorRef = React.useRef(null);

    const [toggleDropdown, setToggleDropdown] = React.useState(false);
    const [toggleSettings, setToggleSettings] = React.useState(true);
    const [settingsDropdown, setSettingsDropdown] = React.useState(false);
    const [config, setConfig] = useState({
        tab: 0
    })

    const handleToggleDropdown = () => {
        setToggleDropdown(toggle => !toggle);
    }

    const handleToggleSettings = () => {
        setToggleSettings(toggle => !toggle);
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setToggleDropdown(false);
    }

    const handleChangeTab = (event, tab) => {
        setConfig({
            ...config,
            tab: tab
        });
    }

    const handleSaveDraft = () => {
        handleUpdate('status', 'draft');
        createPost();
        setToggleDropdown(false);
    }

    const clearDropdown = () =>{
        setSettingsDropdown(false);
    }

    const createPost = async () => {        
        try{
            const token = await getTokenSilently();
            const response = await fetch("http://api.winks.localhost:8080/v1/posts", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({...post, user_id: user.sub})
            });

            const data = await response.json();

            if (!response.ok)
                throw new Error(data.error);
            
            showAlert('success', 'Post created.', 5000)
            
        } catch (error) {
            console.error(error);
            showAlert('error', error.message)
        }
    }

    return (
        <>
            <div className={classes.actionBtn}>
                <IconButton className={classes.settingsBtn} aria-label="Delete" onClick={handleToggleSettings}>
                    <SettingsIcon />
                </IconButton>
                <Button variant="contained" className={classes.button}>Preview</Button>
                <ButtonGroup variant="contained" color="primary" aria-label="Publish">
                    <Button onClick={createPost}>Publish Now</Button>
                    <Button
                        ref={anchorRef}
                        color="primary"
                        variant="contained"
                        size="small"
                        aria-owns={toggleDropdown ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggleDropdown}
                    >
                        <ArrowDropDownIcon />
                    </Button>
                </ButtonGroup>
                <Popper open={toggleDropdown} anchorEl={anchorRef.current} transition>
                    {({ TransitionProps }) => (
                        <Fade {...TransitionProps} timeout={350}>
                            <Paper id="menu-list-grow">
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList>
                                        <MenuItem onClick={handleSaveDraft}>
                                            Save Draft
                                        </MenuItem>
                                        <MenuItem onClick={() => setSettingsDropdown('publish_on')}>
                                            Publish on...
                                        </MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Fade>
                    )}
                </Popper>
            </div>
            <Typography variant="h3" gutterBottom>
                New Post
            </Typography>
            <Permalink/>
            <Grid container spacing={3} className={classes.wrapper}>
                <Grid item className={classes.leftCol}>
                    <TextField
                        id="post-title"
                        label="Add post title"
                        onChange={event => handleChange(event, 'title')}
                        margin="normal"
                        fullWidth
                        variant="outlined"
                        error={true}
                        helperText="Post title is required."
                    />
                    <TextField
                        id="post-content"
                        label="Start writing your post content here"
                        onChange={event => handleChange(event, 'content')}
                        multiline
                        rows="4"
                        margin="normal"
                        fullWidth
                        variant="outlined"
                    />
                </Grid>

                {toggleSettings && (
                    <Grid item className={classes.rightCol}>
                        <Paper square>
                            <Tabs value={config.tab} indicatorColor="primary" textColor="primary" onChange={handleChangeTab}>
                                <Tab label="Settings" className={classes.tab} />
                                <Tab label="Block" className={classes.tab} />
                            </Tabs>
                            {config.tab === 0 && <SettingsTab post={post} dropdown={settingsDropdown} clearDropdown={clearDropdown}/>}
                            {config.tab === 1 && <div>Item Two</div>}
                            {config.tab === 2 && <div>Item Three</div>}
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </>
    )
};

export default PostsCreate;