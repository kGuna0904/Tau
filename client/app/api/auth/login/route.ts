//this file purpose is to request the details with backend file, where then the backendget talks to the express


import {z} from 'zod';//for the validation
import { setSessionCookie } from '@/app/lib/session';//session cookie at the time of login, correct path
import { backendPost } from '@/app/lib/backend';//get the connection with the express on the backend

//schema for the input in the frontend
const schema = z.object({
    email: z.email('Enter a valid email id'),
    password: z.string().min(1,'Password is required')
});


//post function that routes correctly to the login
export async function POST(req: Request){
    //body from the user input will be passed and will be compared with the backend validation
    const body = await req.json();
    const parsed = schema.safeParse(body);//parsing the input body 

    //if the parsed is not success return the res status 400 
    if(!parsed.success){
        return Response.json({error: "Invalid Input"} ,{status: 400}); 
    }

    //the route where the data will be parsed and post, plays role in helping compare the parsed data with the express
    const res = await backendPost('/api/auth/login', parsed.data);
    
    if(!res.ok){
        return Response.json({error: "Invalid email or password"}, {status: res.status});
    }

    //response from the backend after parse
    const data = await res.json();
    await setSessionCookie(data.account_id);//then provides with the session cookies for the users account
    return Response.json({ok: true});//response returned
}