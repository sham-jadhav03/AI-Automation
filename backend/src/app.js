import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import medicineRoutes from './routes/medicine.routes.js';
import inventoryRoutes from './routes/inventory.routes.js';
import orderRoutes from './routes/order.routes.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/users', userRoutes);
app.use('/medicines', medicineRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Hello from mediloon!');
});

export default app;
