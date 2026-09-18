
//pool file to establish connections to the DB
import dotenv from 'dotenv';//reads the env file
import pg from 'pg';//pool import for the pooling connections

dotenv.config();

const {Pool} = pg;

//pooling the connection to the postgres in the supabase, set of open doors to reduce the connection requests to the database each time
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,//it is authorizing the database connection with the postgres url, containing user, password, etc
    ssl: {rejectUnauthorized: false}//this helps us skip the verification of the certificates, so the connection can pass through
});

//on error with pooling, log the error with connection failed for debugging
pool.on('error', (err) => console.log('connection request failed', err));

export default pool;
