/**
 * Created by Home Laptop on 06-Nov-17.
 */
const config = require('./config.json');

if (process.env[ 'NODE_ENV' ] !== "production") {
    config.debugMode = false;
    config.dbConfig.url = process.env.MONGODB_URI || config.dbConfig.url;
    config.port = process.env.PORT || config.port;
}
else config.debugMode = true;

require('./dbConnect')(config.dbConfig.url);

global.config = config;
module.exports = config;