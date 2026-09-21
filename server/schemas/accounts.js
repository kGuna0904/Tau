//defining zod schema for runtime validation
import {z} from 'zod';

//need to use zod and regex to avoid random string, SQLI, or long junk
export const accountIdParams = z.object ({
    //account id where, validating ACC(exactly 3 char and exactly 4 digits(0-9))
    accountId: z.string().regex(/^ACC\d{4}$/, 'Account id must look like ACC1***')
});
