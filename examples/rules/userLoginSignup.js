async function userLoginSignup(user, context, callback) {
    const CLIENTS_ENABLED = ['JayDFYs0IiVje3igkIXZkvchWiPjcRnV'];
    if (CLIENTS_ENABLED.indexOf(context.clientID) === -1) {
        return callback(null, user, context);
    }

    user.app_metadata = user.app_metadata || {};

    let errMsg = null;
    if (context.stats.loginsCount === 1 || user.app_metadata.disable_signup) {
        const crypto = require('crypto');
        const axios = require('axios@0.19.2');
        const query = context.request.query;
        const hash = crypto.createHmac('sha256', configuration.APP_KEY)
            .update(configuration.AUTH0_CLIENT_SECRET)
            .digest('hex');

        const options = {
            method: 'POST',
            url: context.clientMetadata.AUTH_CHECK_URL,
            headers: {'content-type': 'application/json'},
            data: `{"audience":"${query.audience}","clientId":"${query.client_id}","clientSecret":"${hash}","email":"${user.email}"}`
        };

        user.app_metadata.disable_signup = true;

        await axios(options)
            .then( res => {
                console.log('SUCCESS! Signup allowed.');
                user.app_metadata.disable_signup = false;
            })
            .catch( err => {
                if (err.response) {
                    console.error('ERROR:', err.response.data);
                    console.log(err.response.data.error);
                    errMsg = err.response.data.error;
                }else {
                    console.error(err);
                }
            });

        await auth0.users.updateAppMetadata(user.user_id, user.app_metadata)
            .then(function(){
                //     return callback(new Error('Signup disabled'));
            })
            .catch(function(err){
                callback(err);
            });
    }

    if (user.app_metadata.disable_signup) {
        return callback(new Error(errMsg ? errMsg : 'Sorry, signup is disabled.'));
    }

    callback(null, user, context);
}