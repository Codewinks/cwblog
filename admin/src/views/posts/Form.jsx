import React, {useEffect, useState} from 'react';
import {usePost} from '../../context/Post'
import {useTag} from '../../context/Tag'
import {useCategory} from '../../context/Category'
import Permalink from "./components/Permalink";
import SettingsTab from "./components/SettingsTab"
import {makeStyles} from '@material-ui/core/styles';
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
import ConfirmDialog from "../../components/ConfirmDialog";
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import WysiwygEditor from "../common/WysiwygEditor";
import GridOffIcon from "@material-ui/icons/GridOff";
import GridOnIcon from "@material-ui/icons/GridOn";
import Tooltip from "@material-ui/core/Tooltip";

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
        right: theme.spacing(3),
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
        width: '320px',
    },
    settings: {
        marginTop: theme.spacing(4),
    },
    tab: {
        minWidth: 0,
        width: 'auto'
    },
    editor: {
        position: 'relative',
        minHeight: '450px',
        background: '#fff',
        borderRadius: '8px',
        webkitBoxShadow: '0 24px 24px -18px rgba(69,104,129,.33), 0 9px 45px 0 rgba(114,119,160,.12)',
        boxShadow: '0 24px 24px -18px rgba(69,104,129,.33), 0 9px 45px 0 rgba(114,119,160,.12)',
        marginTop: theme.spacing(1),
        padding: theme.spacing(5),
        webkitBoxSizing: 'border-box',
        boxSizing: 'border-box',
        '&.toggle-outline  .MuiInput-input': {
            outline: '1px dashed rgba(170,170,170,0.7)',
        }
    },
    titleInput: {
        marginBottom: theme.spacing(3),
        marginTop: 0,
        '& .MuiInput-input':{
            fontSize: '1.8rem',
            padding: theme.spacing(1),
            outlineOffset: '-2px',
            '&:hover': {
                outline: '1px solid #3b97e3',
            },
            '&:focus':{
                outline: '3px solid #3b97e3 !important',
            },
        },
        '& .MuiInput-underline:before, & .MuiInput-underline:after': {
            display: 'none'
        }
    },
    toggleOutline: {
        position: 'absolute',
        top: theme.spacing(1),
        right: theme.spacing(1),
    }
}));

const PostForm = ({match}) => {
    const {post, loading, setLoading, newPost, savePost, getPost, deletePost, handleChange, handleUpdate} = usePost();
    const {listTags} = useTag();
    const {listCategories} = useCategory();
    const classes = useStyles();
    const anchorRef = React.useRef(null);

    const [toggleOutline, setToggleOutline] = React.useState(false);
    const [toggleDropdown, setToggleDropdown] = React.useState(false);
    const [toggleSettings, setToggleSettings] = React.useState(true);
    const [settingsDropdown, setSettingsDropdown] = React.useState(false);
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const [config, setConfig] = useState({
        tab: 0
    })
    const [allTags, setAllTags] = React.useState([]);
    const [allCategories, setAllCategories] = React.useState([]);
    const postId = match.params.postId;

    useEffect(() => {
        async function loadStuff() {
            setAllTags(await listTags())
            setAllCategories(await listCategories(true))
        }

        loadStuff();

        if (!postId) {
            newPost();
            setLoading(false);
            return
        }

        async function fetchPost() {
            await getPost(postId)
        }

        fetchPost();

        // eslint-disable-next-line
    }, [postId])

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
        // TODO: Implement versioning so that you can have "drafts" on a public post
        handleUpdate('status', 'draft');
        savePost();
        setToggleDropdown(false);
    }

    const clearDropdown = () => {
        setSettingsDropdown(false);
    }

    if (loading) {
        return (
            <>loading...</>
        )
    }

    return (
        <>
            <div className={classes.actionBtn}>
                {postId && (
                    <IconButton className={classes.settingsBtn} aria-label="Delete"
                                onClick={() => setConfirmDelete(postId)}>
                        <DeleteIcon/>
                    </IconButton>
                )}
                <IconButton className={classes.settingsBtn} aria-label="Settings" onClick={handleToggleSettings}>
                    <SettingsIcon/>
                </IconButton>
                <Button variant="contained" className={classes.button}
                        onClick={() => console.log(post)}>Preview</Button>
                <ButtonGroup variant="contained" color="primary" aria-label="Publish">
                    <Button onClick={savePost}>
                        {postId ? 'Update' : 'Publish Now'}
                    </Button>
                    <Button
                        ref={anchorRef}
                        color="primary"
                        variant="contained"
                        size="small"
                        aria-owns={toggleDropdown ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggleDropdown}
                    >
                        <ArrowDropDownIcon/>
                    </Button>
                </ButtonGroup>
                <Popper open={toggleDropdown} anchorEl={anchorRef.current} transition>
                    {({TransitionProps}) => (
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
            <Typography variant="h4" gutterBottom>
                {postId ? 'Edit' : 'Create'} Post
            </Typography>
            <Grid container spacing={3} className={classes.wrapper}>
                <Grid item className={classes.leftCol}>
                    <Permalink/>
                    <div className={`${classes.editor} ${toggleOutline ? 'toggle-outline' : null}`}>
                        <Tooltip title="View Components" placement="bottom">
                            <IconButton aria-label="Toggle View Components"
                                        className={classes.toggleOutline}
                                        size="small"
                                        onClick={() => setToggleOutline(!toggleOutline)}>
                                {toggleOutline ? <GridOffIcon fontSize="small"/> : <GridOnIcon fontSize="small"/>}
                            </IconButton>
                        </Tooltip>
                        <TextField
                            id="post-title"
                            placeholder="Add post title"
                            onChange={event => handleChange(event, 'title')}
                            margin="normal"
                            fullWidth
                            value={post.title ? post.title : ""}
                            className={classes.titleInput}
                            // error={true}
                            // helperText="Post title is required."
                        />

                        <WysiwygEditor
                            postId={post.id}
                            toggleOutline={toggleOutline}
                            value={post.content}
                            onChange={value => handleUpdate('content', value)}/>
                    </div>
                </Grid>

                {toggleSettings && (
                    <Grid item className={classes.rightCol}>
                        <Paper square className={classes.settings}>
                            <Tabs value={config.tab} indicatorColor="primary" textColor="primary"
                                  onChange={handleChangeTab}>
                                <Tab label="Settings" className={classes.tab}/>
                                <Tab label="Block" className={classes.tab}/>
                            </Tabs>
                            {config.tab === 0 &&
                            <SettingsTab post={post} allTags={allTags} allCategories={allCategories}
                                         dropdown={settingsDropdown} clearDropdown={clearDropdown}/>}
                            {config.tab === 1 && <div>Item Two</div>}
                            {config.tab === 2 && <div>Item Three</div>}
                        </Paper>
                    </Grid>
                )}
            </Grid>

            <ConfirmDialog open={confirmDelete} onClose={() => setConfirmDelete(false)}
                           title="Are you sure you want to delete this post?"
                           content="The post will no longer be published and marked for deletion."
                           action="Delete"
                           callback={() => deletePost(confirmDelete)}
            ></ConfirmDialog>
        </>
    )
};

export default PostForm;