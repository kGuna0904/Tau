
//index server file for setting up the backend and set of rules of what each has to do 
import express from 'express';//using express
import dotenv from 'dotenv';
import healthRouter from './routes/health.js';//to determine the connection between the server and the database
import authRouter from './routes/auth.js';
import requireApiKey from './middleware/requireApiKey.js';
import accountRouter from './routes/accounts.js'

//reads the env file
dotenv.config();

const app = express();

app.use(express.json());//middleware for requesting and responding 


//this has to be in order accordingly

//1
//api that will connect as-- api/health/
app.use('/api', healthRouter);

//2
//defining this to use an api key that is set by use and can be used by the code alone, where no other can access without a valid api
//i.e., acts as a lock
app.use('/api', requireApiKey);

//3
//api connects as-- api/login
app.use('/api', authRouter);

//4
//api for accounts, api/accounts/:ACC***
app.use('/api', accountRouter);

//404 error to show if the file not found or the connection not found
app.use((req, res) =>{
    res.status(404).json({error: '404 file not found'} );
});

//500 defines that the error is on the server side, lets us debugg for later
app.use((err, req, res, next) => {
    console.error(err);//shows error before the status
    res.status(500).json({error: 'Something went wrong'});
});

//this server file runs on the port 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Express running on port ${PORT}`));

//need to export the app not the healthRouter
export default app;