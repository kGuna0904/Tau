//this file's purpose is to define that the requests use a valid defined api secret key 


//middleware exports a function
export default function requireApiKey (req, res, next) {
    //for debugging console.log(req.path);
    //if the api key is not existing or not available then it is set to an internal error
    if(!process.env.API_SECRET){
        console.error("API SECRET KEY is not set");
        return res.status(500).json({error: `Internal server error`});//returns the 500 err
    }

    //this is where the file reads the api and checks for the api
    const reqApi = req.headers['x-api-key'];

    //if the requested api is not same as the one in env, then it sends an unauthorized err
    if (reqApi !== process.env.API_SECRET) {
        return res.status(401).json({error: 'Unauthorized Access'});
    } else{
        next();
    }

    
}
