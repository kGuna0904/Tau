

import express from 'express';//express server module
import pool from '../db/pool.js';//for connection pooling 
import validate from '../middleware/validate.js';//validates the schema queries and parses it
import {accountIdParams} from '../schemas/accounts.js'//schema that validates the accounts id

const router = express.Router();

//gets the data from the DB 
//must match the schema name
router.get('/accounts/:accountId', validate(accountIdParams, 'params'), async(req, res) => {

    //destructs the already validated params from the middleware
    const {accountId} = req.valid.params;
    const sql =
    //from the accounts table 
    //where accountId = $1;
    `SELECT account_id, holder_name, email, account_type, bank_name, opening_balance, current_balance
    FROM accounts 
    WHERE account_id = $1 `;

    //the connection pool that connects to the accounts table in the DB
    //and instructions to the query above 
    const result = await pool.query(sql, [accountId]);
    //stores the results of the query
    const acc = result.rows[0];

    //if the acc not existing, respond with an error, else respond with the required details
    if(!acc){
        return res.status(404).json({error: "Account not found" });
    } else {
        return res.json({
            account_id: acc.account_id, 
            holder_name: acc.holder_name, 
            email: acc.email, 
            account_type: acc.account_type, 
            bank_name: acc.bank_name, 
            opening_balance: Number(acc.opening_balance), //without NUMBER() it responds as a string
            current_balance: Number(acc.current_balance)  //without NUMBER() it responds as a string
        });
    }

});

export default router;