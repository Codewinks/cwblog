import React from "react";
import clsx from 'clsx';

import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import { useAuth0 } from '../../context/Auth0';
import { Link, useLocation } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import List from '@material-ui/core/List';
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
import Tooltip from '@material-ui/core/Tooltip';

import ArrowTooltip from '../../components/ArrowTooltip';
import UserAvatar from "../users/components/UserAvatar";


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
            alignItems: 'center'
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
    navIcon: {
        color: 'inherit',
        minWidth: '40px'
    },
    navActive: {
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    subNavActive:{
        backgroundColor: 'rgba(255,255,255,0.05)',
        '& .MuiTypography-root': {
            fontWeight: 'bold'
        }
    }
}));

const Navigation = () => {
    const { currentUser, isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const location = useLocation();

    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [menu, setMenu] = React.useState({ target: null, key: null });

    function toggleDrawer() {
        setOpen(toggle => !toggle);
    }

    function openMenu(event, key) {
        setMenu({ target: event.currentTarget, key: key });
    }

    function closeMenu(event) {
        setMenu({ target: null, key: null });
    }

    function isNavActiveCssClass(paths, cssClass){
        return paths.includes(location.pathname) ? cssClass : null;
    }

    return (
        <>
            <AppBar position="fixed" className={clsx(classes.appBar)}>
                <Toolbar>
                    <IconButton color="inherit" aria-label="Toggle Navigation" onClick={toggleDrawer} edge="start" className={clsx(classes.menuButton)}>
                        {!open ? <MenuIcon /> : theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
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
                            aria-controls="main-menu"
                            aria-haspopup="true"
                            onClick={event => openMenu(event, 'main')}
                            color="inherit"
                        >
                            <UserAvatar user={currentUser} />
                        </IconButton>
                    </div>
                    <div className={classes.sectionMobile}>
                        <IconButton
                            aria-label="Show menu"
                            aria-controls="mobile-menu"
                            aria-haspopup="true"
                            onClick={event => openMenu(event, 'mobile')}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>
            {/* Mobile Menu */}
            <Menu
                anchorEl={menu.target}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                id="mobile-menu"
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={menu.key === 'mobile'}
                onClose={closeMenu}
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
                        {currentUser.picture ? <Avatar alt={currentUser.name} src={currentUser.picture} /> : <Avatar><PersonIcon /></Avatar>}
                    </IconButton>
                    <p>Profile</p>
                </MenuItem>
            </Menu>

            {/* Desktop Menu */}
            <Menu
                anchorEl={menu.target}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                getContentAnchorEl={null}
                id="main-menu"
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={menu.key === 'main'}
                onClose={closeMenu}
            >
                {isAuthenticated ? [
                    <MenuItem onClick={closeMenu} component={Link} to={`/users/${currentUser.id}`} key="profile">Profile</MenuItem>,
                    <MenuItem onClick={() => logout()} key="logout">Logout</MenuItem>
                ] :
                    <MenuItem onClick={() => loginWithRedirect({})}>Login</MenuItem>
                }
            </Menu>

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
                    <Tooltip title="Dashboard" placement="right" arrow disableHoverListener={open}>
                        <ListItem button to="/" component={Link}>
                                <ListItemIcon className={classes.navIcon}><DashboardIcon /></ListItemIcon>
                                <ListItemText primary="Dashboard" />
                        </ListItem>
                    </Tooltip>

                    <ArrowTooltip placement="right-start" interactive disableHoverListener={open}
                        title={
                            <List disablePadding>
                                <ListItem button to="/posts" component={Link} className={isNavActiveCssClass(['/posts'], classes.subNavActive)}>
                                    <ListItemText primary="All Posts" /></ListItem>
                                <ListItem button to="/posts/create" component={Link} className={isNavActiveCssClass(['/posts/create'], classes.subNavActive)}>
                                    <ListItemText primary="Add New" /></ListItem>
                                <ListItem button to="/categories" component={Link} className={isNavActiveCssClass(['/categories'], classes.subNavActive)}>
                                    <ListItemText primary="Categories" /></ListItem>
                                <ListItem button to="/tags" component={Link} className={isNavActiveCssClass(['/tags'], classes.subNavActive)}>
                                    <ListItemText primary="Tags" /></ListItem>
                            </List>
                        }>
                        <ListItem button to="/posts" component={Link} className={isNavActiveCssClass(['/posts', '/posts/create', '/categories', '/tags'], classes.navActive)}>
                            <ListItemIcon className={classes.navIcon}><LibraryBooksIcon /></ListItemIcon>
                            <ListItemText primary="Posts" />
                        </ListItem>
                    </ArrowTooltip>

                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List disablePadding className={classes.navNested}>
                            <ListItem button to="/posts" component={Link} className={isNavActiveCssClass(['/posts'], classes.subNavActive)}>
                                <ListItemText primary="All Posts" />
                            </ListItem>
                            <ListItem button to="/posts/create" component={Link} className={isNavActiveCssClass(['/posts/create'], classes.subNavActive)}>
                                <ListItemText primary="Add New" />
                            </ListItem>
                            <ListItem button to="/categories" component={Link} className={isNavActiveCssClass(['/categories'], classes.subNavActive)}>
                                <ListItemText primary="Categories" />
                            </ListItem>
                            <ListItem button to="/tags" component={Link} className={isNavActiveCssClass(['/tags'], classes.subNavActive)}>
                                <ListItemText primary="Tags" />
                            </ListItem>
                        </List>
                    </Collapse>

                    <ArrowTooltip placement="right-start" interactive disableHoverListener={open}
                                  title={
                                      <List disablePadding>
                                          <ListItem button to="/users" component={Link} className={isNavActiveCssClass(['/users'], classes.subNavActive)}>
                                              <ListItemText primary="All Users" /></ListItem>
                                          <ListItem button to="/invites" component={Link} className={isNavActiveCssClass(['/invites'], classes.subNavActive)}>
                                              <ListItemText primary="Invite Users" /></ListItem>
                                          <ListItem button to="/roles" component={Link} className={isNavActiveCssClass(['/roles'], classes.subNavActive)}>
                                              <ListItemText primary="Roles" /></ListItem>
                                      </List>
                                  }>
                        <ListItem button to="/users" component={Link} className={isNavActiveCssClass(['/users', '/invites', '/roles'], classes.navActive)}>
                            <ListItemIcon className={classes.navIcon}><PeopleIcon /></ListItemIcon>
                            <ListItemText primary="Users" />
                        </ListItem>
                    </ArrowTooltip>

                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <List disablePadding className={classes.navNested}>
                            <ListItem button to="/users" component={Link} className={isNavActiveCssClass(['/users'], classes.subNavActive)}>
                                <ListItemText primary="All Users" />
                            </ListItem>
                            <ListItem button to="/invites" component={Link} className={isNavActiveCssClass(['/invites'], classes.subNavActive)}>
                                <ListItemText primary="Invite Users" />
                            </ListItem>
                            <ListItem button to="/roles" component={Link} className={isNavActiveCssClass(['/roles'], classes.subNavActive)}>
                                <ListItemText primary="Roles" />
                            </ListItem>
                        </List>
                    </Collapse>

                    <Tooltip title="Settings" placement="right" arrow disableHoverListener={open}>
                        <ListItem button to="/settings" component={Link}>
                            <ListItemIcon className={classes.navIcon}><SettingsIcon /></ListItemIcon>
                            <ListItemText primary="Settings" />
                        </ListItem>
                    </Tooltip>
                </List>
                <Divider />
                <div className={classes.drawerBg}></div>
            </Drawer>
        </>
    );
};

export default Navigation;