
import express from 'express';//express server module
import pool from '../db/pool.js';//for connection pooling 
import validate from '../middleware/validate.js';//validates the schema queries and parses it
import {accountIdParams, summaryQuery, transactionsQuery, dateRangeQuery} from '../schemas/accounts.js';//schema that validates the accounts id and month, transactions, statements

const router = express.Router();

//------------route1
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


//------------route2
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


//----------route3
//for transactions routing 
router.get('/accounts/:accountId/transactions', validate(accountIdParams, 'params'), validate(transactionsQuery, 'query'), async(req, res) => {

    const {accountId} = req.valid.params;
    const {type, search, from, to, page, limit} = req.valid.query;

    //for $2 translation
    let direction;
    if(type === 'income'){
        direction = 'Received';
    } else if(type === 'expense'){
        direction = 'Paid';
    } else {
        direction = null;
    }

    //for $3, if the search occurred then the search will be %search%, if not searched for anything then null
    const find = search ? `%${search}%` : null;
    //$4 & $5 are user inputs
    //for $7 offset
    const offset = (page - 1) * limit;

    //query for WHERE then interpolated, to avoid confusion
    const where = `
    WHERE account_id = $1 
    AND ($2:: text IS NULL OR direction = $2) 
    AND ($3:: text IS NULL OR merchant_name ILIKE $3 OR category ILIKE $3) 
    AND ($4::date IS NULL OR txn_date >= $4) 
    AND ($5::date IS NULL OR txn_date <= $5)`;

    //transaction details query
    const listSql =    
    `SELECT trans_id, txn_date::text AS txn_date , merchant_name, category, direction, amount, status
    FROM transactions
    ${where}
    ORDER BY txn_date DESC, txn_time DESC
    LIMIT $6 OFFSET $7`;
     
    //total number of transactions
    const countSql = 
    `SELECT count(*) FROM transactions ${where}`;

    //takes the input of the queries
    const values = [accountId, direction, find, from ?? null, to ?? null];

    //connects the query to the DB 
    //without the ...(dots), it will call the whole array in the array its being called
    const listResult = await pool.query(listSql, [...values, limit, offset]);
    const countResult = await pool.query(countSql, values);

    //without mentioning the Number, the amount returns as a string
    const transRows = listResult.rows.map( r => ({...r, amount: Number(r.amount)}));
    const total = Number(countResult.rows[0].count);

    return res.json({
        rows: transRows,
        total:total,
        page: page,
        limit: limit
    });
});


//------------router4
//for statements router
router.get('/accounts/:accountId/statement', validate(accountIdParams, 'params'), validate(dateRangeQuery, 'query'), async(req, res) => {

    const {accountId} = req.valid.params;
    const {from, to} = req.valid.query;

    //takes 3 queries

    //
    const  qA= 
    `SELECT opening_balance 
    FROM accounts 
    WHERE account_id = $1`;

    //
    const qB =
    `SELECT COALESCE(SUM(CASE WHEN direction = 'Received' THEN amount ELSE -amount END), 0) AS moved
    FROM transactions
    WHERE account_id = $1
    AND status = 'Success'
    AND txn_date < $2`;

    //
    const qC = 
    `SELECT txn_date::text AS txn_date, merchant_name, direction, amount,
    SUM(CASE WHEN direction = 'Received' THEN amount ELSE -amount END)
    OVER (ORDER BY txn_date, txn_time, trans_id) AS running
    FROM transactions
    WHERE account_id = $1
    AND status = 'Success'
    AND txn_date >= $2
    AND txn_date <= $3
    ORDER BY txn_date, txn_time, trans_id`;

    const qAresults= await pool.query(qA, [accountId]);
    const qBresults = await pool.query(qB, [accountId, from]);
    const qCresults = await pool.query(qC, [accountId, from, to]);

    //account
    const Arows = qAresults.rows[0];
    if(!Arows){
        return res.status(404).json({error: "Balance not found"});
    }

    //moved
    const Brows = qBresults.rows[0].moved;
    //rows
    const Crows = qCresults.rows;

    const opening = Math.round((Number(Arows.opening_balance) + Number(Brows)) * 100) /100;
    
    const stateRows = Crows.map( r => ({...r, amount: Number(r.amount), balance: Math.round((opening + Number(r.running)) * 100) / 100}));
    //need to deeply understand this line
    const closing = stateRows.length ? stateRows[stateRows.length - 1].balance : opening;
    
    return res.json({
        opening_balance: opening,
        closing_balance: closing,
        rows: stateRows
    });

});

export default router;