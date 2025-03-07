import express from 'express';
import { connection } from './DB/dbConnection.js';
import { proudctRoute } from './Modules/Product/productRouter.js';

const app = express();
app.use(express.json())
connection;
app.use(proudctRoute)

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})