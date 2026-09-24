//this file clears the login session, hence the function for the logout

import { clearSession } from "@/app/lib/session";

//this clears the existing session and stores no cache..
export async function POST(){
    await clearSession();
    return Response.json({ok: true});
}