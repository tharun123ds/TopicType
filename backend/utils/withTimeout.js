const withTimeout = (promise, ms) => {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('Email sending timed out')), ms)),
    ]);
};

module.exports = withTimeout;
