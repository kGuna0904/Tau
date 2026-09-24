//this is the only file that can talk to the express, where it can both get and post the req & res


//this is a function that reads the api without writing the same again in the other functions
//optimized
function readApi(){
    //reads the apis from the .env file
    const base = process.env.API_BASE_URL;
    const api = process.env.API_SECRET;

    //thros an error if either of them is missing
    if(!base || !api){
        throw new Error("Missing URL or Api key is not set");
    }

    return {base, api};
}



//this function gets the res from the express and talks to it directly
export async function backendGet(path:string) {

    //destructuring this with respect to the function above, where the readApi(), takes these parameters
    const {base, api} = readApi();

    //the response, fetching with the url and the api
    const resGet = await fetch(base + path, {
        headers: {'x-api-key': api},
        cache: 'no-store'//doesnt store the data, else shows the same data as before
    });
    return resGet;
}


//this is to req the body and talks to the express directly 
export async function backendPost(path:string, body:unknown) {

    //destructuring this with respect to the function above, where the readApi(), takes these parameters
    const {base, api} = readApi();

    //reqs the body using the same fetch
    const resPost = await fetch(base + path, {
        method: 'POST',
        headers: {
            'x-api-key': api,
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(body)//body is a json so, need to convert to string before requesting
    });
    return resPost;
}