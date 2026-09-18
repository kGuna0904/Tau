
//this file is responsible to validate the data w.r.t the schema

//takes two parameters
export default function validate(schema, source = 'query') {
    return (req, res, next) => {
        //result stores the requested query and the parsed schema
        const result = schema.safeParse(req[source]);
        if (!result.success){//if not result but success then the respond err
        return res.status(400).json({error: 'Invalid request',details: result.error.issues});
        } else {
            req.valid = req.valid || {};
            req.valid[source] = result.data; // source holds query, body and params
            next();
        }
    }
}