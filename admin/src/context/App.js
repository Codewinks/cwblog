import React, { useState, useContext } from 'react';

export const AppContext = React.createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const alertState = {
        variant: null,
        message: null,
        autoHideDuration: null,
    }

    const [alert, setAlert] = useState(alertState);

    const showAlert = (variant, message, autoHideDuration) => {
        setAlert({
            variant: variant,
            message: message,
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