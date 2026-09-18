
//this files sole purpose is to verify that if the connection is live and in working state 
import express from 'express';
import pool from '../db/pool.js';//path verified

const router = express.Router();

router.get('/health', async(req, res) =>{
    const result = await pool.query('SELECT NOW()');//pool is the door to the postgres, there it runs the query and awaits for response 
    //confirming that the connectino is live and hence has no issues with the connectionString/pooling/URL/postgres
    res.json ({ok: true, dbTime: result.rows[0].now});//the query that shows the current time the connection occurred when fired
});

export default router;
// node --> express --> dotenv --> pooling --> postgres