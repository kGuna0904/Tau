
import express from 'express';//defining the server(module)
import validate from '../middleware/validate.js';//validates the connection request made
import pool from '../db/pool.js'//pools the connection to the db
import { loginBody } from '../schemas/auth.js';//schema that validates the body of login

//calling the function(router) as a method from the express module
const router = express.Router();

router.post('/auth/login', validate(loginBody, 'body'), async(req, res) => {
    const {email, password} = req.valid.body;
    //backticks allows the queries in multiple lines
    const theQueryString = 
    //selects the acc_id and the display name from teh users table, where the email =$1 and password =$2
        `SELECT account_id, display_name
        FROM app_users
        WHERE email = $1 AND password_hash = crypt($2, password_hash)`;
    //instruction to the query above letting it know what the query has to do, query connects through the pool
    const result = await pool.query(theQueryString, [email, password]);
    const user = result.rows[0];


    //if(user.length === 0), this wouldnt work because the "undefined" cant .length, 
    // so when used it defines 500 instead of 401, so making it into if(!user), would work


    //if no rows exists, which is if no user data exists then return 401, else diplay the name and acc of the user
    if(!user) {
        return res.status(401).json({error: 'Invalid email or password'});
    } else{
        return res.json({account_id: user.account_id, display_name: user.display_name});
    }

});

export default router;
