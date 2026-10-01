# Tau — Bank Statement Analytics

A finance web app. It reads a bank account's transactions from PostgreSQL and shows them in a way you can actually use: income against spending, this month against last month, where the money went by category and by shop, and a full bank statement with a running balance on every line.

I built it as a certification project. I didn't just want something that worked. I wanted to use one full stack from top to bottom, PostgreSQL to Express to Next.js, and keep every secret on the server.

**Live**

| | |
| --- | --- |
| Client | https://tau-fincorp.vercel.app |
| API | https://tau-api.vercel.app |

**Demo logins**

| Email | Password | Account |
| --- | --- | --- |
| `rajesh@tau.app` | `rajesh@app_login` | ACC1000 |
| `pruthvi@tau.app` | `pruthvi@app_login` | ACC1001 |
| `guna@tau.app` | `tau@app_login` | ACC1005 |

All the data is made up: 25 accounts and 9,072 transactions. No real bank account is involved.

---

## Stack

| Layer | Used for |
| --- | --- |
| HTML | Written as JSX |
| CSS — Tailwind v4 | My own `@theme` colours in `globals.css`. No UI kit |
| JavaScript — AJAX | `fetch` from every page to the Next.js routes |
| React 19 | Components, hooks, typed props |
| TypeScript | The whole client |
| Next.js 16 | App Router, route handlers, the `proxy.ts` login guard |
| Zod 4 | Params, query and body, on both sides |
| SQL — PostgreSQL | Totals, `FILTER`, `date_trunc`, a window function |
| Node — Express 5 | The REST API, middleware, error handling |
| Git / GitHub | 34 commits |
| Vercel | Two projects, each with its own settings |

---

## Architecture

reference architecture at the start: client → server → routes → controllers → services → models → database, with the answer coming back the same way and an error handler underneath.

Most of it I followed. Three parts I did differently, on purpose:

| Stage in the reference | What I did |
| --- | --- |
| Client (React) | Next.js App Router pages |
| API server | Express 5, `server/index.js` |
| Routes | `server/routes/` — nine routes in three files |
| Controllers | Done inside the routes |
| Services | Not used |
| Models | Plain SQL with placeholders, through a shared `pg` Pool |
| Database | **PostgreSQL on Supabase, not MongoDB** |
| Response | JSON with a status code |
| Error handling | 404 and 500 handlers at the end of `index.js` |

**Controllers are inside the routes** because I have nine routes and none of them share any handler code. A separate file for each would just pass the call along and do nothing else.

**There is no service layer** because the logic here is adding things up, and SQL does that across 9,072 rows in one go. A service layer would mean pulling the rows into JavaScript and adding them there.

**There are no models** because the reference uses Mongoose with MongoDB. In PostgreSQL the same job is done by an ORM, and my main queries use a window function and `FILTER`, which an ORM makes harder to write. `pool.js` is the one file that touches the database, which is the useful part of a model layer.

Two things are not in the reference at all. Both run before any route code: the API key check, and the Zod checking middleware.

### How a request travels

```
  Browser                Next.js server            Express API            PostgreSQL
 ─────────               ──────────────            ───────────            ──────────
 fetch('/api/me/…')  ──▶  check cookie        ──▶  check x-api-key   ──▶  SQL with
 cookie: tau_session      add x-api-key            check with Zod         placeholders
                          get accountId            run the query
                          from the signature
```

The browser is given nothing extra. It never sees the API key, the Express URL, or even its own account number. It sends one signed cookie and the server works out the rest.

- **`app/lib/backend.ts`** is the only file that talks to Express. It reads `API_BASE_URL` and `API_SECRET` from the server settings and adds the key as `x-api-key`. It only runs on the server, so neither value reaches the browser.
- **`app/api/me/[...path]/route.ts`** is the proxy. It checks the cookie, gets the account number *from the signature*, checks the path against a list of seven allowed names, and passes it on. There is no setting that lets the browser pick a different account.
- **`app/lib/session.ts`** signs the cookie as `accountId.expiry.HMAC-SHA256`. It is `httpOnly`, `sameSite: lax`, `secure` in production, and lasts five minutes.
- **`proxy.ts`** sends you to `/login` when the cookie is missing, for the six page routes in its matcher.

Nothing in the project starts with `NEXT_PUBLIC_`. That one rule is what keeps all of the above out of the browser.

---

## Pages

| Route | What it shows |
| --- | --- |
| `/` | Landing page |
| `/login` | Email and password |
| `/home` | Name and balance, three cards for the latest month with the change from last month, and the five newest transactions |
| `/dashboard` | Year totals and a 12-month bar chart |
| `/transactions` | All / Income / Expense tabs, search, 15 rows per page across 353 rows |
| `/statements` | Pick two dates and get a statement with an opening balance, a running balance on each row, and a closing balance |
| `/analytics` | A donut chart of spending by category, plus category and top-shop tables |

I built both charts by hand. The bars are `div` boxes with their height set to `value / max * 100%`, and the donut is a `conic-gradient` that adds up the percentages with a circle on top for the hole. I could have used a chart library, but then the interesting part would have been someone else's work.

---

## API

Every route needs the `x-api-key` header except `/api/health`, and every route checks its input with Zod before any SQL runs.

| Method | Route | Query | Returns |
| --- | --- | --- | --- |
| GET | `/api/health` | — | `{ok, dbTime}` |
| POST | `/api/auth/login` | body: `email`, `password` | `{account_id, display_name}` |
| GET | `/api/accounts/:id` | — | Account details and balances |
| GET | `/api/accounts/:id/summary` | `month=YYYY-MM` | Income, spending and savings, plus the same three for last month |
| GET | `/api/accounts/:id/transactions` | `type`, `search`, `from`, `to`, `page`, `limit` | `{rows, total, page, limit}` |
| GET | `/api/accounts/:id/statement` | `from`, `to` | `{opening_balance, closing_balance, rows}` |
| GET | `/api/accounts/:id/monthly` | `year` | Twelve rows of income and spending |
| GET | `/api/accounts/:id/categories` | `from`, `to` | Category, count, total, percent |
| GET | `/api/accounts/:id/merchants` | `from`, `to`, `limit` | Top shops by spending |

The browser only knows about three routes: `POST /api/auth/login`, `POST /api/auth/logout`, and `GET /api/me/<name>`.

**A few notes on the SQL.** The database checks the password itself, using `pgcrypto` and `crypt(password, password_hash)`, where the saved bcrypt hash already holds its own salt. Nothing is compared in JavaScript. `NUMERIC` columns come back from `pg` as text so they do not lose accuracy, so every money value goes through `Number()` before it leaves a route. `txn_date` is turned into text with `::text` so a date cannot move by a time zone. Optional filters use an on/off trick, `($2::text IS NULL OR direction = $2)`, so one query handles every combination. The running balance uses a window function:

```sql
SUM(CASE WHEN direction = 'Received' THEN amount ELSE -amount END)
  OVER (ORDER BY txn_date, txn_time, trans_id) AS running
```

---

## Database

Three tables, in `server/db/schema.sql`.

**accounts** — `account_id` (primary key), `holder_name`, `phone`, `email` (unique), `account_type`, `bank_name`, `opening_balance`, `current_balance`

**transactions** — `trans_id` (primary key), `account_id` (foreign key), `txn_date`, `txn_time`, `direction` (`Paid` or `Received`), `category`, `merchant_name`, `amount` (above 0), `currency`, `payment_method`, `status` (`Success`, `Pending` or `Failed`), `reference_number` (unique), `description`

**app_users** — `user_id` (primary key), `email` (unique), `password_hash`, `display_name`, `account_id` (foreign key), `created_at`

There is an index on `(account_id, txn_date)`, which matches every query in the app.

The data came as CSV, so I loaded it into two `staging_*` tables as plain text and moved it across with `server/db/transform.sql`, turning text into `numeric`, `date` and `time` on the way. The script drops the staging tables at the end, so running it twice cannot quietly double the data.

The rule I checked before trusting anything on screen, which is true for all 25 accounts:

```
opening_balance + Σ(received − paid, where status = 'Success') = current_balance
```

---

## Running it locally

```bash
git clone https://github.com/kGuna0904/Tau.git
cd Tau
```

**API** — `cd server && npm install && npm run dev` → port 4000

**Client** — `cd client && npm install && npm run dev` → port 3000

### Environment

`server/.env`

```
POSTGRES_URL=postgresql://user:password@host:5432/postgres
API_SECRET=<a secret you make up>
```

`client/.env.local`

```
API_BASE_URL=http://localhost:4000
API_SECRET=<the same value as above>
SESSION_SECRET=<a second secret, for signing the cookie>
```

Two things that cost me time the first run:

- An `@` in the database password has to be written as `%40`, or the URL is read wrongly and the error points nowhere near the real problem.
- `API_BASE_URL` is `http` on your own machine and `https` on Vercel. Leave `https` pointing at `localhost:4000` and you get `ERR_SSL_WRONG_VERSION_NUMBER`.

On Vercel the same values go in the project settings. `tau-api` gets the first two, `tau-fincorp` gets the other three.

---

## Structure

```
Tau/
├── server/
│   ├── index.js                 Express app, middleware order, error handlers
│   ├── db/
│   │   ├── pool.js              One shared pg Pool
│   │   ├── schema.sql           The three tables
│   │   └── transform.sql        Staging → final, then drop staging
│   ├── middleware/
│   │   ├── requireApiKey.js     x-api-key check
│   │   └── validate.js          Makes the Zod middleware
│   ├── routes/
│   │   ├── accounts.js          The seven data routes
│   │   ├── auth.js              Login, checked with pgcrypto
│   │   └── health.js            Is the database up
│   └── schemas/                 Zod schemas for params, query and body
└── client/
    ├── proxy.ts                 Login guard (Next.js 16 middleware)
    ├── app/
    │   ├── layout.tsx           Inter + Clash Display
    │   ├── globals.css          Tailwind v4 @theme colours
    │   ├── login/
    │   ├── (main)/              The five pages you need to log in for
    │   ├── api/
    │   │   ├── auth/            login, logout
    │   │   └── me/[...path]/    The proxy and its allowed names
    │   └── lib/
    │       ├── backend.ts       The only file that calls Express
    │       ├── session.ts       Signing and checking the cookie
    │       └── format.ts        Money, date and percentage formatting
    └── components/              Sidebar, TopBar, StatCard, BarChart, DonutChart
```

2,002 lines of code in 33 files — 576 server, 1,426 client.

---

## Testing

129 test cases, run from the bottom up in five layers, so a failure low down explains the ones above it.

| Layer | Cases |
| --- | --- |
| Database | 9 |
| Express API | 49 |
| Proxy and session | 16 |
| User interface | 46 |
| Security | 9 |

None of the expected numbers are guesses. I checked each one in the database first, so every test comes from a number I had already seen.

---

## Known issues

I found all of these by reading the code, not by spotting them in the browser. None of them leak data.

**Fixed** — Analytics showing blank shop names; category and shop totals not formatted.

**Carried into future scope** — a failed statement request shows nothing, because the error is saved but never displayed; a page goes blank if the session runs out while it is open; an empty search shows an empty table with no message; loading screens are not the same across pages; the landing page button goes to the live site instead of routing internally; categories and shops leave out the end date while statements include it; `proxy.ts` checks the cookie is there rather than that it is real; table headings do not line up on three pages; two spelling mistakes and a React key warning on Analytics.

The cookie one sounds worse than it is. The middleware is only there to redirect you, not to keep you out. That is `app/api/me/[...path]/route.ts`, which checks the signature and the expiry on every request and returns 401 no matter what the cookie says. A fake cookie gets you an empty page, never data.

---

## Future scope

Two changes would make a real difference. Everything else on my list is tidying up next to them.

**Letting the app write, not just read.** Right now Tau can only look at data — nothing in it ever changes a row. The way in is the Accounts page. Its API route already exists and returns the account details, so half the work is done; what is missing is the page and the saving behind it: an update route, a Zod schema for the body, an `UPDATE` with placeholders, and the form. I want this one most because it uses the half of the stack this project does not touch at all. Reading data is one skill. Taking something a user typed, checking it and safely saving it is a different one, and it brings its own problems: what happens when two people edit at once, what to do when a save half fails, and how to tell the user which field they got wrong.

**Making it hold up when something goes wrong.** Every page assumes its request worked and reads the reply without checking. When a request fails, that value is `undefined`, the page throws, and you get a blank white screen. This is not rare — the session lasts five minutes, so anyone who leaves a page open while reading and then clicks will hit it. The fix is one `apiGet` helper that throws when a request fails, with each page catching it: log the error, send the user to `/login` on a 401, and show a message instead of nothing. Written once, all five pages get it. The session needs the other half: a warning at about four minutes, and a renewal so using the app re-signs the cookie. Together these are the difference between an app that breaks in front of you and one that tells you what happened.

---

## Limitations

Each of these was done deliberately, with a reason behind it. None of them are things I missed:

- **The login is a demo.** Three fixed logins, no sign up, no password reset, no account locking, no attempt limits.
- **Sessions are short and simple** — a five-minute signed cookie, no renewal, nothing stored on the server.
- **The database connection does not check the certificate.** `pool.js` sets `rejectUnauthorized: false` because the Supabase pooler uses a certificate Node does not recognise. Still encrypted, just not verified.
- **The app only reads.** The only `POST` is login.
- **Everything is set to 2025**, the year the sample data covers.
- **No caching.** Every page loads fresh.
- **Desktop only.** No mobile layout.
- **The Accounts page is not built** and sits greyed out in the sidebar.

---

## Author

**K Guna Srinivas** — [github.com/kGuna0904](https://github.com/kGuna0904)
