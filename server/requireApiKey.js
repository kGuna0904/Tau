

//middleware exports a function
export default function requireApiKey (req, res, next) {

    if(!process.env.API_SECRET){
        console.error("API SECRET KEY is not set");
        return res.status(500).json({error: `Internal server error`});
    }

    const reqApi = req.headers['x-api-key'];
    
    if (reqApi !== process.env.API_SECRET) {
        return res.status(401).json({error: 'Unauthorized Access'});
    } else{
        next();
    }

    
}
