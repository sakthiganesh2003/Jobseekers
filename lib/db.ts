import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Replace with your MySQL Workbench user
  password: 'sakthiganesh358', // Replace with your MySQL Workbench password
  database: 'jobseeker_db',
});

export async function query(sql: string, params: any[] = []) {
  const [results] = await pool.execute(sql, params);
  return results;
}