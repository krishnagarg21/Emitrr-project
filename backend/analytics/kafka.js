const fs = require('fs');
const path = require('path');

const logPath = path.resolve(__dirname, 'analytics.log');

const initKafka = async () => {
    console.log('Mock Analytics Initialized (Logging to file)');
    return Promise.resolve();
};

const sendEvent = async (type, data) => {
    const logEntry = JSON.stringify({ type, data, timestamp: new Date() }) + '\n';
    fs.appendFile(logPath, logEntry, (err) => {
        if (err) console.error('Error writing analytics', err);
    });
};

module.exports = { initKafka, sendEvent };
