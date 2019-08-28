import React from "react";
import clsx from 'clsx';

import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import { useAuth0 } from "../context/Auth0";
import { Link } from "react-router-dom";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import DashboardIcon from '@material-ui/icons/Dashboard';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';

import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import SearchIcon from '@material-ui/icons/Search';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Collapse from '@material-ui/core/Collapse';


const drawerWidth = 180;

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    avatar: {
        padding: 0,
        margin: 10,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerPaper: {
        color: '#fff',
        backgroundColor: '#111',
    },
    drawerBg: {
        backgroundImage: 'url(/img/bg-sidebar.jpg)',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        opacity: 0.1,
        position: 'absolute',
        transition: 'all 200ms linear',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.down('sm')]: {
            width: 0,
            display: 'none',
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    }, 
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    navNested: {
        backgroundColor: 'rgba(162,162,162,0.1)'
    },
    navIcon:{
        color: 'inherit',
        minWidth: '40px'
    }
}));

const Navigation = (props) => {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    function toggleDrawer() {        
        setOpen(toggle => !toggle);
    }

    const [menu, setMenu] = React.useState({target: null, key: null});
    function openMenu(event, key) {
        console.log('open menu ' + key )
        setMenu({target: event.currentTarget, key: key});
    }
    function closeMenu(){
        console.log('close menu')
        setMenu({target: null, key: null});
    }
    
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    function handleProfileMenuOpen(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleMobileMenuClose() {
        setMobileMoreAnchorEl(null);
    }

    function handleMenuClose() {
        setAnchorEl(null);
        handleMobileMenuClose();
    }

    function handleMobileMenuOpen(event) {
        setMobileMoreAnchorEl(event.currentTarget);
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={menu.target}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={menu.key === 'main'}
            onClose={closeMenu}
        >
            {isAuthenticated ? [
                <MenuItem onClick={handleMenuClose} component={Link} to="/profile" key="profile">Profile</MenuItem>,
                <MenuItem onClick={() => logout()} key="logout">Logout</MenuItem>
            ] :  
                <MenuItem onClick={() => loginWithRedirect({})}>Login</MenuItem>
            }
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem>
                <IconButton aria-label="Show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="secondary">
                        <MailIcon />
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem>
            <MenuItem>
                <IconButton aria-label="Show 11 new notifications" color="inherit">
                    <Badge badgeContent={11} color="secondary">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={event => openMenu(event, 'main')}>
                <IconButton
                    aria-label="Account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    {props.avatar ? <Avatar alt="Remy Sharp" src={props.avatar} /> : <Avatar><PersonIcon /></Avatar>}
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        <>
            <AppBar position="fixed" className={clsx(classes.appBar)}>
                <Toolbar>
                    <IconButton color="inherit" aria-label="Toggle Navigation" onClick={toggleDrawer} edge="start" className={clsx(classes.menuButton)}>
                        { !open ? <MenuIcon /> : theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon /> }
                    </IconButton>
                    <Typography variant="h6" noWrap className={classes.title}>CWBlog</Typography>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'Search' }}
                        />
                    </div>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <IconButton aria-label="Show 4 new mails" color="inherit">
                            <Badge badgeContent={4} color="secondary">
                                <MailIcon />
                            </Badge>
                        </IconButton>
                        <IconButton aria-label="Show 17 new notifications" color="inherit">
                            <Badge badgeContent={17} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            className={classes.avatar}
                            edge="end"
                            aria-label="Account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            {props.avatar ? <Avatar alt="Remy Sharp" src={props.avatar} /> : <Avatar ><PersonIcon /></Avatar>}
                        </IconButton>
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="Show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
            <Drawer variant="permanent" PaperProps={{ elevation: 8 }}
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx(classes.drawerPaper, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
                open={open}
            >
                <div className={classes.toolbar}></div>
                <List>
                    <ListItem button to="/" component={Link}>
                        <ListItemIcon className={classes.navIcon}><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="Dashboard"/>
                    </ListItem>

                    <ListItem button to="/posts" component={Link}  onMouseEnter={!open ? event => openMenu(event, 'posts') : null}>
                        <ListItemIcon className={classes.navIcon}><LibraryBooksIcon /></ListItemIcon>
                        <ListItemText primary="Posts" />
                    </ListItem>
                    <Menu
                    anchorEl={menu.target}
                    getContentAnchorEl={null}
                    open={!open && menu.key === 'posts'}
                    onClose={closeMenu}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    >
                        <div onMouseLeave={closeMenu}>
                            <MenuItem onClick={closeMenu}>All Posts</MenuItem>
                            <MenuItem onClick={closeMenu}>Add New</MenuItem>
                            <MenuItem onClick={closeMenu}>Categories</MenuItem>
                            <MenuItem onClick={closeMenu}>Tags</MenuItem>
                        </div>
                    </Menu>

                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List disablePadding className={classes.navNested}>
                            <ListItem button to="/posts" component={Link}>
                                <ListItemText primary="All Posts" />
                            </ListItem>
                            <ListItem button to="/posts/create" component={Link}>
                                <ListItemText primary="Add New" />
                            </ListItem>
                            <ListItem button to="/categories" component={Link}>
                                <ListItemText primary="Categories" />
                            </ListItem>
                            <ListItem button to="/tags" component={Link}>
                                <ListItemText primary="Tags" />
                            </ListItem>
                        </List>
                    </Collapse>
                    <ListItem button to="/users" component={Link}>
                        <ListItemIcon className={classes.navIcon}><PeopleIcon /></ListItemIcon>
                        <ListItemText primary="Users" />
                    </ListItem>
                     <ListItem button to="/settings" component={Link}>
                        <ListItemIcon className={classes.navIcon}><SettingsIcon /></ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItem>
                </List>
                <Divider />
                <div className={classes.drawerBg}></div>
            </Drawer>
        </>
    );
};

export default Navigation;