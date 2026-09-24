//session cookies signature
import crypto from 'node:crypto';
import {cookies} from 'next/headers';

//cookie name assigned
const COOKIE = 'tau_session';

//cookie life in ms, 8hrs
const CookieLife = (8 * 60 * 60 * 1000);

//function that signs the value of the cookie and generates signature
//since it is type script mention the type of the params
//this is a signature for the session, so export is not required
function sign(value:string) {

    //first check if the session secret exists only then move forward with the signature , hence throw first then the signature
        if(!process.env.SESSION_SECRET){
            throw new Error("SESSION SECRET not set...");
        }

    //creates a hmac cryptic signature and hashes it
    const cookieSignature = crypto
    .createHmac('sha256', process.env.SESSION_SECRET)
    .update(value)
    .digest('hex');

    return cookieSignature;
}


//this signs the session account
export function signSession(accountId:string){

    //expiry from the time and date now with the cookie life(8hrs)
    const expiry = Date.now() + CookieLife;
    //ACC***+expiry
    const payload = `${accountId}.${expiry}`;

    //payload + signature ==> ACC****.exp.sign
    return `${payload}.${sign(payload)}`;
}


//verify the signature from the signed value
export function verifySession(value:string){
    
    //split the signed value first then compare the exact length of the array, if not equl then return null
    const signSplit = value.split(".");
    if(signSplit.length !== 3){
        return null;
    }

    //desturct the array
    const [accountId, expiry, cookieSignature] = signSplit;

    const payload = `${accountId}.${expiry}`;

    //reusing the sign function instead of rewriting the hash function, as typescript gurards the structure
    const expected = sign(payload);

    //compare the expected signature with the actual signature and return null if not same
    if(cookieSignature !== expected){
        return null;
    }

    //compare the expiry of the session with the current date and if lesser then return null
    if(Number(expiry) < Date.now()){
        return null;
    }
    
    return accountId;
}


//setting the session cookies, in async
export async function setSessionCookie(accountId:string){
    
    //store the cookies
    const store = await cookies();
    //cookie name, signed session and setting the cookie
    store.set(COOKIE, signSession(accountId), {
        httpOnly: true,//tells the js not to read or touch this session
        sameSite: 'lax',//it enables the cross site request forgery, hence not allowing any third party to read or use the cookie
        secure: process.env.NODE_ENV === 'production',//this purely for production purpose where next js provides the security for the https, instead of using the http
        path: '/',//ensures the path of the pages 
        maxAge: 8 * 60 * 60//age in seconds
    });

}


//getting the cookie session
export async function getSession() {
    const store = await cookies();

    //get the cookie name 
    const cookie = store.get(COOKIE);

    if(!cookie){
        return null;
    }

    //returns the verified session of the cookie and returns the cookie name and the value
    //name+payload
    return verifySession(cookie.value);
}


//clearing the cookie session, once completed
export async function clearSession(){
    
    //awaits on the cookies and then deletes/clears the existing cookie
    (await cookies()).delete(COOKIE);

   
}