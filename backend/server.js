const app = require('./app');
const dotenv = require('dotenv');

// Load env again in case not loaded in app
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
