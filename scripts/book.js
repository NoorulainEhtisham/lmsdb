import express from 'express';
import oracledb from 'oracledb';


const app = express();
const port = 3000;

const connectionString = {
    user: "hr",
    password: "hr",
    connectString: "localhost:1521/xepdb1"
  }


export async function selectAllEmployees(req, res) {
    try {
      connection = await oracledb.getConnection(connectionString);
  
      console.log('connected to database');
      // run query to get all employees
      result = await connection.execute(`SELECT * FROM employees`);
  
    } catch (err) {
      //send error message
      return res.send(err.message);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close();
          console.log('close connection success');
        } catch (err) {
          console.error(err.message);
        }
      }
      if (result.rows.length == 0) {
        //query return zero employees
        return res.send('query send no rows');
      } else {
        //send all employees
        return res.send(result.rows);
      }
  
    }
  }
  

export async function selectEmployeesById(req, res, id) {
    try {
      connection = await oracledb.getConnection(connectionString);
      // run query to get employee with employee_id
      result = await connection.execute(`SELECT * FROM employees where employee_id=:id`, [id]);
  
    } catch (err) {
      //send error message
      return res.send(err.message);
    } finally {
      if (connection) {
        try {
          // Always close connections
          await connection.close(); 
        } catch (err) {
          return console.error(err.message);
        }
      }
      if (result.rows.length == 0) {
        //query return zero employees
        return res.send('query send no rows');
      } else {
        //send all employees
        return res.send(result.rows);
      }
    }
  }