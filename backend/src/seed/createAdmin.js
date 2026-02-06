import bcrypt from 'bcryptjs'
import dotenv from 'dotenv';
dotenv.config();
import connect from '../db/db.js'
import userModel from '../models/user.model.js'


const createAdmin = async () => {
    try {

        await connect();

        const email = 'admin@pharmacy.com'

        const existingAdmin = await userModel.findOne({ email })

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const password = 'admin@123'
        const hashedPassword = await bcrypt.hash(password, 10)

        await userModel.create({
            name: 'System Admin',
            email,
            password: hashedPassword,
            role: 'admin'
        })

        console.log('Admin created successfully')
        process.exit(0);
    } catch (error) {
        console.log('Failed to create Admin', error)
        process.exit(1);
    }
}
createAdmin()