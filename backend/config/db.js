// const mysql = require('mysql2');

// // Create connection pool


// const pool = mysql.createPool({
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || 'root',
//     database: process.env.DB_NAME ,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
// });


// // const pool =mysql.createPool({
// //     host:"localhost",
// //     database:"evangadi_networks",
// //     user:"root",
// //     password:"root",
// // })



// // Promisify for async/await
// const promisePool = pool.promise();

// // Test database connection
// const testConnection = async () => {
//     try {
//         const connection = await promisePool.getConnection();
//         console.log('✅ Database connected successfully');
//         connection.release();
//         return true;
//     } catch (error) {
//         console.error('❌ Database connection failed:', error.message);
//         return false;
//     }
// };

// module.exports = {
//     pool: promisePool,
//     testConnection
// };





const mysql = require('mysql2');

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'evangadi_networks',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_HOST && process.env.DB_HOST !== 'localhost'
        ? { minVersion: 'TLSv1.2', rejectUnauthorized: true }
        : undefined,
});

// Promisify for async/await
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

module.exports = {
    pool: promisePool,
    testConnection
};