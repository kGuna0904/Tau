//defining zod schema for runtime validation
import {z} from 'zod';

//need to use zod and regex to avoid random string, SQLI, or long junk
export const accountIdParams = z.object ({
    //account id where, validating ACC(exactly 3 char and exactly 4 digits(0-9))
    //regex(), lets us know the format 
    accountId: z.string().regex(/^ACC\d{4}$/, 'Account id must look like ACC1***')
});


//schema for the month validation, with the exact length of the year and the month only 
export const summaryQuery = z.object ({
    //later in the route becomes as month=2025-06
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must look like 2025-06')
});