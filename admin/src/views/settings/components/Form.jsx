import React, {useEffect} from "react";
import {useSetting} from '../../../context/Setting'
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
    button: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(2),
    },
    alignRight: {
        textAlign: 'right'
    }
}));

const SettingForm = ({match, history, withCancel, onSuccess}) => {
    const {setting, listSettings, getSetting, newSetting, saveSetting, handleChange} = useSetting();
    const classes = useStyles();
    const settingId = match?.params.settingId;

    useEffect(() => {
        if (settingId) {
            async function fetchData() {
                getSetting(settingId)
            }

            fetchData();
            return
        }

        newSetting();

        async function fetchData() {
            await listSettings()
        }

        fetchData();
        // eslint-disable-next-line
    }, [settingId]);

    const handleSave = async () => {
        await saveSetting(onSuccess)
    }

    return (
        <>
            <Typography variant="h6">
                {settingId ? 'Edit' : 'Add New'} Setting
            </Typography>
            <TextField id="setting-key"
                       label="Key"
                       onChange={event => handleChange(event, 'key')}
                       margin="normal"
                       fullWidth
                       variant="outlined"
                       value={setting.key ? setting.key : ""}
                // error={true}
                // helperText="Post key is required."
            />
            <TextField
                id="setting-value"
                label="Value"
                onChange={event => handleChange(event, 'value')}
                multiline
                rows="4"
                margin="normal"
                fullWidth
                variant="outlined"
                value={setting.value ? setting.value : ""}
            />
            <div className={classes.alignRight}>
                {settingId && (
                    <Button onClick={() => history.push(`/settings`)} variant="contained" aria-label="Cancel"
                            className={classes.button}>
                        Cancel
                    </Button>
                )}

                {withCancel && (
                    <Button onClick={withCancel} color="primary" className={classes.button}>
                        Cancel
                    </Button>
                )}

                <Button onClick={handleSave} variant="contained" color="primary"
                        aria-label={settingId ? 'Update' : 'Add New Setting'} className={classes.button}>
                    {settingId ? 'Update' : 'Add New Setting'}
                </Button>
            </div>
        </>
    );
};

export default SettingForm;