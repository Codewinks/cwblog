import React, { useState, useContext } from 'react';

export const AppContext = React.createContext();
export const useApp = () => useContext(AppContext);
export const ALERT_SUCCESS = 'success';
export const ALERT_WARNING= 'warning';
export const ALERT_ERROR = 'error';

export const AppProvider = ({ children }) => {
    const alertState = {
        variant: null,
        message: null,
        autoHideDuration: null,
    }

    const [alert, setAlert] = useState(alertState);

    const showAlert = (variant, message, autoHideDuration) => {
        let prefix;

        switch(variant) {
            case ALERT_SUCCESS:
                prefix = 'Success'
                break;
            case ALERT_WARNING:
                prefix = 'Warning'
                break;
            case ALERT_ERROR:
                prefix = 'Error'
                break;
            default:
                break;
        }

        setAlert({
            variant: variant,
            message: prefix ? `<b>${prefix}</b>: ${message}` : message,
            autoHideDuration: autoHideDuration,
        })
    }
    const hideAlert = () => {
        setAlert(alertState)
    }

    return (
        <AppContext.Provider value={{
            alert,
            showAlert,
            hideAlert,
        }}>
            {children}
        </AppContext.Provider>
    );
}