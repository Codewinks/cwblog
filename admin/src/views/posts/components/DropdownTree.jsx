import React, {useEffect} from "react";
import {makeStyles} from '@material-ui/core/styles';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from "@material-ui/core/TextField";
import IconButton from '@material-ui/core/IconButton';
import {
    AddBox,
    CheckBox,
    CheckBoxOutlineBlank,
    CheckBoxOutlined,
    Close,
    Folder,
    FolderOpen,
    IndeterminateCheckBox,
    InsertDriveFile,
    KeyboardArrowDown,
    KeyboardArrowRight,
} from '@material-ui/icons';
//https://github.com/jakezatecky/react-checkbox-tree
//https://jakezatecky.github.io/react-checkbox-tree/

const useStyles = makeStyles(theme => ({
    root: {
        '& .react-checkbox-tree': {
            fontSize: '0.875rem',
            flexDirection: 'column',
            '& ol ol': {
                paddingLeft: '19px'
            },
            '& > ol': {
                maxHeight: '260px',
                overflow: 'auto',
            },
            '& .rct-options': {
                order: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: theme.spacing(1),
                '& button': {
                    display: 'flex',
                }
            }
        },
        '& .rct-title': {
            padding: '0 2px'
        },
        '& .rct-text': {
            display: 'flex',
            alignItems: 'center',
            '& > label': {
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                paddingRight: '5px'
            }
        },
        '& .rct-collapse': {
            width: '15px',
            padding: 0,
        },
        '& .rct-checkbox': {
            padding: theme.spacing(0.5),
            display: 'inline-flex'
        },
        '& label:active, & label:hover': {
            background: 'none'
        },
        '& .rct-text:hover': {
            backgroundColor: theme.palette.action.hover
        }
    },
    filterInput: {
        marginBottom: theme.spacing(2)
    }
}));

const DropdownTree = (props) => {
    const classes = useStyles();

    useEffect(() => {
        if (props.data) {
            setNodesFiltered(props.data);
        }

        setExpanded(props.expanded());
        // eslint-disable-next-line
    }, [props.data, props.expanded])

    const [nodesFiltered, setNodesFiltered] = React.useState(props.data);
    const [checked, setChecked] = React.useState(props.checked);
    const [expanded, setExpanded] = React.useState([]);
    const [filterText, setFilterText] = React.useState('');

    function onCheck(checked) {
        setChecked(checked);
        props.onChange(checked);
    }

    function onExpand(expanded) {
        setExpanded(expanded);
    }

    function clearFilter() {
        filterTree('');
    }

    function onFilterChange(e) {
        filterTree(e.target.value);
    }

    function filterTree(q) {
        setFilterText(q);
        if (!q) {
            setNodesFiltered(props.data)

            return;
        }

        setNodesFiltered(props.data.reduce(filterNodes, []))
    }

    function filterNodes(filtered, node) {
        const children = (node.children || []).reduce(filterNodes, []);

        if (
            // Node's label matches the search string
            node.label.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1 ||
            // Or a children has a matching node
            children.length
        ) {
            filtered.push({...node, ...children.length && {children}})
        }

        return filtered;
    }

    return (
        <div className={classes.root}>
            <TextField
                className={classes.filterInput}
                value={filterText}
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search..."
                onChange={onFilterChange}
                InputProps={{
                    endAdornment: (
                        <InputAdornment>
                            <IconButton aria-label="Clear" onClick={clearFilter} size="small">
                                <Close/>
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <CheckboxTree
                nodes={nodesFiltered}
                checked={checked}
                expanded={expanded}
                onCheck={onCheck}
                onExpand={onExpand}
                noCascade={true}
                expandOnClick={true}
                optimisticToggle={false}
                showExpandAll={true}
                showNodeIcon={false}
                icons={{
                    check: <CheckBox fontSize="small" color="primary"/>,
                    uncheck: <CheckBoxOutlineBlank fontSize="small" color="action"/>,
                    halfCheck: <CheckBoxOutlined fontSize="small" color="disabled"/>,
                    expandClose: <KeyboardArrowRight fontSize="small" color="action"/>,
                    expandOpen: <KeyboardArrowDown fontSize="small" color="action"/>,
                    expandAll: <AddBox fontSize="small" color="action"/>,
                    collapseAll: <IndeterminateCheckBox fontSize="small" color="action"/>,
                    parentClose: <Folder fontSize="small" color="action"/>,
                    parentOpen: <FolderOpen fontSize="small" color="action"/>,
                    leaf: <InsertDriveFile fontSize="small" color="action"/>,
                }}
            />
        </div>
    )
}

export default DropdownTree;