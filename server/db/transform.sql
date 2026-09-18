--from the staging_accounts table we shift only the required info to our actual table 
INSERT INTO accounts (account_id, holder_name, phone, email, account_type, bank_name, opening_balance, current_balance)
SELECT account_id, account_holder_name, phone_number, email, account_type, bank_name, opening_balance::numeric, current_balance::numeric
FROM staging_accounts; 

--same with the transactions table, shifting only the required data
INSERT INTO transactions (trans_id, account_id, txn_date, txn_time, direction, category, merchant_name, amount, currency, payment_method, status, reference_number, description)
SELECT trans_id, account_id, "date"::date, "time"::time, transaction_type, category, merchant_name, amount::numeric, currency, payment_method, status, reference_number, description
FROM staging_transactions;


--once the data of the tables are shifted/transformed then the demo table data will be deleted/dropped, hence doesnt contain duplicates
DROP TABLE staging_accounts;
DROP TABLE staging_transactions;