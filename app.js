import express from 'express';
import { connection } from './DB/dbConnection.js';

const app = express();
connection;

app.listen(3000, () =>{
    console.log('Server is running on port 3000');
})