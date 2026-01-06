import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import app from './app.js';
import connect from './config/db.js';

connect();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
