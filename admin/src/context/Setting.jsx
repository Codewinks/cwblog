import React, {useContext, useState} from 'react';
import {ALERT_ERROR, ALERT_SUCCESS, useApp} from './App'
import {useAuth0} from './Auth0';

export const SettingContext = React.createContext()
export const useSetting = () => useContext(SettingContext)
export const SettingProvider = ({history, children}) => {
    const {showAlert} = useApp()
    const {request} = useAuth0()
    const [loading, setLoading] = useState(true)
    const [settings, setSettings] = useState(null)

    const emptySetting = {
        id: null,
        key: null,
        value: null,
        label: null,
        description: null,
    }

    const [setting, setSetting] = useState(emptySetting)

    const handleUpdate = (key, value, callback) => {
        setSetting({
            ...setting,
            [key]: value
        })

        if (callback !== undefined) {
            callback()
        }
    }

    const handleChange = (event, key, callback) => {
        handleUpdate(key, event.target.value, callback)
    }

    const newSetting = () => {
        setSetting(emptySetting)
    }

    const listSettings = async (filters = []) => {
        setLoading(true)
        try {
            let data = await request('get', `/v1/settings/`);
            if (data.length && filters.length) {
                data = data.filter((s) => filters.includes(s.key))
            }

            setSettings(data);
            return data
        } catch (error) {
            showAlert(ALERT_ERROR, error.message)
        } finally {
            setLoading(false)
        }
    }

    const getSetting = async (settingId) => {
        setLoading(true)
        try {
            const data = await request('get', `/v1/settings/${settingId}`)
            setSetting(data)
        } catch (error) {
            showAlert(ALERT_ERROR, error.message)
        } finally {
            setLoading(false)
        }
    }

    const saveSetting = async (callback) => {
        setLoading(true)
        try {
            await request(setting.id ? 'put' : 'post', `/v1/settings/${setting.id ? setting.id : ''}`, {...setting})

            setSetting(emptySetting)

            if (history)
                history.push(`/settings`)

            await listSettings()

            showAlert(ALERT_SUCCESS, `Setting ${setting.id ? 'saved' : 'created'}.`, 5000)
            if (callback && typeof callback === "function") {
                callback()
            }
        } catch (error) {
            showAlert(ALERT_ERROR, error.message)
        } finally {
            setLoading(false)
        }
    }

    const deleteSetting = async (id) => {
        setLoading(true)
        try {
            await request('delete', `/v1/settings/${setting.id ? setting.id : id}`)

            setSetting(emptySetting)
            await listSettings()

            showAlert(ALERT_SUCCESS, `Setting deleted.`, 5000)
        } catch (error) {
            showAlert(ALERT_ERROR, error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <SettingContext.Provider value={{
            setting,
            settings,
            loading,
            handleUpdate,
            handleChange,
            setLoading,
            listSettings,
            newSetting,
            getSetting,
            saveSetting,
            setSetting,
            deleteSetting,
        }}>
            {children}
        </SettingContext.Provider>
    )
}