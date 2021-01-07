import React from "react";
import Typography from '@material-ui/core/Typography';

const NoMatch = ({message}) => {
    const msg = message ? message : '404 Page Not Found';

    return (
        <>
            <Typography variant="h3" gutterBottom>
                {msg}
            </Typography>
        </>
    );
};

export default NoMatch;