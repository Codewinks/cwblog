import React, {useEffect, useState} from "react";
import {usePost} from '../../../context/Post'
import {makeStyles} from '@material-ui/core/styles';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import Typography from '@material-ui/core/Typography';
import {Checkbox, FormControlLabel, Link} from '@material-ui/core';


const useStyles = makeStyles(theme => {
    let height = 32;
    let smallHeight = 24;
    let backgroundColor = theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700];

    return {
        root: {
            position: 'relative',
            zIndex: 1,
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.pxToRem(13),
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: height,
            color: theme.palette.getContrastText(backgroundColor),
            backgroundColor: backgroundColor,
            borderRadius: height / 2,
            whiteSpace: 'nowrap',
            transition: theme.transitions.create(['background-color', 'box-shadow']),
            cursor: 'default',
            outline: 'none',
            textDecoration: 'none',
            border: 'none',
            padding: 0,
            verticalAlign: 'middle',
            boxSizing: 'border-box'
        },
        sizeSmall: {
            height: smallHeight
        },
        label: {
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 12,
            paddingRight: 12,
            userSelect: 'none',
            whiteSpace: 'nowrap',
            cursor: 'inherit'
        },
        labelSmall: {
            paddingLeft: 8,
            paddingRight: 8
        },
        slugRoot: {
            marginLeft: theme.spacing(1),
        },
        slugCheckbox: {
            padding: theme.spacing(0.5)
        },
        slugLabel: {
            fontSize: '0.8rem'
        },
        svgIcon: {
            fill: 'currentColor',
            width: '1em',
            height: '1em',
            display: 'inline-block',
            fontSize: '1.5rem',
            transition: 'fill 200ms cubic- bezier(0.4, 0, 0.2, 1) 0ms',
            flexShrink: '0',
            userSelect: 'none'
        },
        inlineLabel: {
            marginRight: theme.spacing(1),
        },
        input: {
            backgroundColor: 'transparent',
            border: 0,
            outline: 0,
            padding: 0,
            color: 'inherit',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            lineHeight: 'inherit'
        },
        chipIcon: {
            cursor: 'pointer',
            color: '#616161',
            order: 1,
            margin: '0 5px 0 -3px'
        },
        chipIconSmall: {
            height: 16,
            margin: '0 1px 0 -9px'
        },
    }
});

const baseUrl = window.location.origin + '/';

const Permalink = ({slug, setSlug}) => {
    const {post, handleUpdate} = usePost();
    const classes = useStyles();
    const [toggleEdit, setToggleEdit] = React.useState(false);
    const [didMount, setDidMount] = useState(false);

    useEffect(() => {
        if (!didMount) {
            setSlug(post.slug);
            return setDidMount(true);
        }

        if (!toggleEdit && !Boolean(post.options?.disableAutoSlug)) {
            setSlug(slugify(post.title))
            handleUpdate('slug', slug)
        }

        // eslint-disable-next-line
    }, [post.title]);

    const handleToggleEdit = () => {
        setToggleEdit(toggle => !toggle);
    }

    const handleChange = (event) => {
        let updatedSlug = slugify(event.target.value)
        setSlug(updatedSlug)
        handleUpdate('slug', updatedSlug)
    }

    return (
        <>
            <Typography variant="button" display="inline" gutterBottom className={classes.inlineLabel}>
                Permalink:
            </Typography>
            <div role="button" tabIndex="0" className={[classes.root, classes.sizeSmall].join(' ')}>
                {!toggleEdit && (
                    <EditIcon className={[classes.svgIcon, classes.chipIcon, classes.chipIconSmall].join(' ')}
                              onClick={handleToggleEdit}/>
                )}
                {toggleEdit && (
                    <DoneIcon className={[classes.svgIcon, classes.chipIcon, classes.chipIconSmall].join(' ')}
                              onClick={handleToggleEdit}/>
                )}
                <span className={[classes.label, classes.labelSmall].join(' ')}>
                    {!toggleEdit && (
                        <Link href={baseUrl + slug} color="inherit" target="_blank" rel="noopener noreferrer">
                            {baseUrl + slug}
                        </Link>
                    )}
                    {toggleEdit && (
                        <>
                            <span>{baseUrl}</span>
                            <input type="text" value={slug} className={classes.input} onChange={handleChange}
                                   onBlur={handleToggleEdit} autoFocus/>
                        </>
                    )}
                </span>
            </div>
            <FormControlLabel
                className={classes.slugRoot}
                classes={{label: classes.slugLabel}}
                control={
                    <Checkbox
                        className={classes.slugCheckbox}
                        size="small"
                        checked={Boolean(post.options?.disableAutoSlug)}
                        onChange={() => handleUpdate('options', {disableAutoSlug: !Boolean(post.options?.disableAutoSlug)})}
                    />
                }
                label="Don't auto-generate slug"
            />
        </>
    )
};

export const slugify = (v) => {
    if (!v) {
        return ''
    }

    v = v.replace(/^\s+|\s+$/g, ''); // trim
    v = v.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    const to = "aaaaaeeeeeiiiiooooouuuunc------";
    for (let i = 0, l = from.length + 1; i < l; i++) {
        v = v.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    v = v.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return v;
}

export default Permalink;