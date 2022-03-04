//Define passwords and codes to be gitignored later
function config(){
    switch(process.env.NODE_ENV){
        case 'develop':
            return {
                'dbURI': 'mongodb://localhost/myslim', //mongo db location
                'port': 3010,
                SECRET: "", // secret for signing jwt token
                smtpLogin: "", // login for smtp server we are using gmail
                smtpPass: "", // password for smtp server
                // for gmail you should allow Less secure app access
                // https://accounts.google.com/DisplayUnlockCaptcha
                // further update https://support.google.com/accounts/answer/6010255?hl=en
            };

        default:
            return {
                'dbURI': 'mongodb://localhost/myslim', //mongo db location
                'port': 3010,
                SECRET: "", // secret for signing jwt token
                smtpLogin: "", // login for smtp server we are using gmail
                smtpPass: "", // password for smtp server
            };
    }
};

module.exports = config();
