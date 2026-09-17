CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE accounts (
    account_id TEXT PRIMARY KEY,
    holder_name TEXT NOT NULL,
    phone TEXT,
    email TEXT NOT NULL UNIQUE,
    account_type TEXT NOT NULL,
    bank_name TEXT NOT NULL,
    opening_balance NUMERIC(14, 2) NOT NULL,
    current_balance NUMERIC(14, 2) NOT NULL
);

CREATE TABLE transactions (
    trans_id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL REFERENCES accounts(account_id),
    txn_date DATE NOT NULL,
    txn_time TIME NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('Paid', 'Received')),
    category TEXT NOT NULL,
    merchant_name TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    currency CHAR(3) NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Success', 'Pending', 'Failed')),
    reference_number TEXT UNIQUE,
    description TEXT
);

CREATE TABLE app_users (
    user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL,
    account_id TEXT NOT NULL REFERENCES accounts(account_id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_account_date ON transactions(account_id, txn_date);