const mysql2 = require("mysql2");

const dbConnection = mysql2.createPool({
  user: process.env.DB_USER,
  database: process.env.DATABASE,
  host: "localhost",
  password: process.env.PASSWORD,
  connectionLimit: 10,
});

// dbConnection.execute("select 'test' ", (err, results) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(results);
//     console.log(results[0].test);
//   }
// });

module.exports = dbConnection.promise();
