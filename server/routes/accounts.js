
import express from 'express';//express server module
import pool from '../db/pool.js';//for connection pooling 
import validate from '../middleware/validate.js';//validates the schema queries and parses it
import {accountIdParams, summaryQuery} from '../schemas/accounts.js';//schema that validates the accounts id and month

const router = express.Router();

//gets the data from the DB 
//must match the schema name
router.get('/accounts/:accountId', validate(accountIdParams, 'params'), async(req, res) => {

    //for specific account router
    //destructs the already validated params from the middleware
    const {accountId} = req.valid.params;
    const accSql =
    //from the accounts table 
    //where accountId = $1;
    `SELECT account_id, holder_name, email, account_type, bank_name, opening_balance, current_balance
    FROM accounts 
    WHERE account_id = $1 `;

    //the connection pool that connects to the accounts table in the DB
    //and instructions to the query above 
    const result = await pool.query(accSql, [accountId]);
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
            opening_balance: Number(acc.opening_balance), //without Number() it responds as a string
            current_balance: Number(acc.current_balance)  //without Number() it responds as a string
        });
    }
});


//for specific month summary router
router.get('/accounts/:accountId/summary', validate(accountIdParams, 'params'), validate(summaryQuery, 'query'), async(req, res) => {
    
    //need to define both accID and month as both are existing
    const {accountId} = req.valid.params;
    const {month} = req.valid.query;
    //takes month => 2025-06-01, we are explicitly mentioning it to store the date in this format
    const monthStart = `${month}-01`;
    //query that selects the details of the current month and prev 
    const monthSql = 
    `SELECT  
    COALESCE(SUM(amount) FILTER (WHERE direction = 'Received'  AND txn_date >= $2), 0) AS income, 
    COALESCE(SUM(amount) FILTER (WHERE direction = 'Paid' AND txn_date >= $2), 0)  AS expense,
    COALESCE(SUM(amount) FILTER (WHERE direction = 'Received'  AND txn_date < $2), 0) AS prev_income,
    COALESCE(SUM(amount) FILTER (WHERE direction = 'Paid' AND txn_date < $2), 0)  AS prev_expense
    FROM transactions
    WHERE account_id = $1 AND txn_date >= $2::date - INTERVAL '1 month' AND txn_date < $2::date + INTERVAL '1 month' AND status = 'Success'`;

    //pools the query to the DB
    const result = await pool.query(monthSql, [accountId, monthStart]);
    //holds the returned data of the query
    const monthRows = result.rows[0];

    //mapping each to individuals and calculating the savings 
    const income = Number(monthRows.income);//without Number() it responds as a strin
    const expense = Number(monthRows.expense);
    const savings = Math.round((income - expense) * 100)/100;
    const prev_income = Number(monthRows.prev_income);
    const prev_expense = Number(monthRows.prev_expense);
    const prev_savings = Math.round((prev_income - prev_expense) * 100)/100 ;
    

    //respond with the details as above defined
        return res.json({
            month:month,
            income: income,
            expense:expense,
            savings: savings,
            prev_income: prev_income,
            prev_expense: prev_expense,
            prev_savings: prev_savings
        });
});

export default router;