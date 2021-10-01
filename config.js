import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV;

const dev = {
    app: {
        port: parseInt(process.env.DEV_APP_PORT, 10) || 3000,
    },

    storage: {
        host: 'localhost',
        port: 3306,
    },
};

const config = {
    dev,
};

const envConfig = config[env];
export { envConfig };

const DB_ACCESS = {
    host: 'localhost',
    user: 'root',
    password: '12042001',
    port: 3306,
    database: 'eiazis1',
    dialect: 'mysql',
};

export { DB_ACCESS };
