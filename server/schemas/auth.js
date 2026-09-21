
//this file validates the authentication input from the user
import {z} from 'zod';

//zod validations for the email and password
export const loginBody = z.object({
    email: z.email('Enter a valid email id'),
    password: z.string().min(1,'Password is required')
});
