
import { backendGet } from "@/app/lib/backend";
import { getSession } from "@/app/lib/session";

//first request the parameters from the backend(express)
export async function GET(req: Request, {params}:{params: Promise<{path:string[]}>}){
    
    const {path} = await params;//params are the promises
    //gets the current session of the accountid 
    const accountId = await getSession();
    //if not account then return error
    if(!accountId){
        return Response.json({error: "Unauthorized access"}, {status: 401});
    }

    //this segment joins the path  
    const segment = path.join('/');
    //array containing the paths that are allowed to reach 
    const allowed = ['summary', 'transactions', 'statement', 'monthly', 'categories', 'merchants', 'profile'];
    if(!allowed.includes(segment)){
        return Response.json({error: "Page not found"}, {status: 404});
    }

    //creation of the target 
    //created a new route where the
    let target;
    if(segment === 'profile'){
        target = `/api/accounts/${accountId}`;
    } else {
        target = `/api/accounts/${accountId}/${segment}`;
    }

    //this searches for the rest of the url
    const qs = new URL (req.url).search;
    //responds with the backend get parameters that are requested
    const res = await backendGet(target + qs);//with target and the url
    const data = await res.json();

    //responds with the received data and the response status
    return Response.json(data, {status: res.status});
}