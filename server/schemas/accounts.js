//defining zod schema for runtime validation
import {z} from 'zod';

//need to use zod and regex to avoid random string, SQLI, or long junk
export const accountIdParams = z.object ({
    //account id where, validating ACC(exactly 3 char and exactly 4 digits(0-9))
    //regex(), lets us know the format 
    accountId: z.string().regex(/^ACC\d{4}$/, 'Account id must look like, ACC1***')
});


//schema for the month validation, with the exact length of the year and the month only 
export const summaryQuery = z.object ({
    //later in the route becomes as month=2025-06
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must look like, 2025-06')
});


//schema for transactions route validation
export const transactionsQuery = z.object({
    type: z.enum(['all', 'income', 'expense']).default('all'),// enemurates all the data, income and expense
    search: z.string().max(50).optional(),//for search query
    from: z.iso.date().optional(),//date in iso standards
    to: z.iso.date().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(15)
});


//schema for date range route
export const dateRangeQuery = z.object({
    from: z.iso.date().optional(),
    to: z.iso.date().optional()
});


//schema for monthly income and expense query
export const yearQuery = z.object({
    year: z.coerce.number().int().min(2000).max(2100)
});


//schema for merchant limit 
export const merchantsQuery = dateRangeQuery.extend({
    limit: z.coerce.number().int().min(1).max(10).default(5)
});