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
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 3306,
    database: process.env.DB_DATABASE,
    dialect: 'mysql',
};

export { DB_ACCESS };
