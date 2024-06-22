




const mysql2 = require("mysql2");


const dbConnection = mysql2.createPool({
	user: process.env.USER,
	database: process.env.DATABASE,
	host: "localhost",
	password: process.env.PASSWORD,
	connectionLimit: 10,
});

// Error handling for database connection
dbConnection.getConnection((err, connection) => {
	if (err) {
		console.error("Error connecting to the database:", err);
		return;
	}
	if (connection) connection.release();
	console.log("Database connected successfully");
});



module.exports = dbConnection.promise();
