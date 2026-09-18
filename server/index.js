
//index server file for setting up the backend and set of rules of what each has to do 
import express from 'express';//using express
import dotenv from 'dotenv';
import healthRouter from './routes/health.js'//

//reads the env file
dotenv.config();

const app = express();

app.use(express.json());//middleware for requesting and responding 

//api that will connect as-- api/health/
app.use('/api', healthRouter);

//404 error to show if the file not found or the connection not found
app.use((req, res, err) =>{
    console.error(err);//shows error before the status
    res.status(404).json({error: '404 file not found'} );
});

//500 defines that the error is on the server side, lets us debugg for later
app.use((err, req, res, next) => {
    console.error(err);//shows error before the status
    res.status(500).json({error: 'Something went wrong'});
});

//this server file runs on the port 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Express running on port 4000"));

//need to export the app not the healthRouter
export default app;