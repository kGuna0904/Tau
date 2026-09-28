
'use client';

import StatCard from "@/components/StatCard";
import {useState, useEffect} from 'react';
import { moneyPrecise, dateFormat } from "@/app/lib/format";


export default function HomePage() {
    
    const [profile, setProfile] = useState<any>(null);
    const [summary, setSummary] = useState<any>(null);
    const [recent, setRecent] = useState([]);
    const [month, setMonth] = useState('');
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        async function LoadPage() {
        const t = await fetch('/api/me/transactions?limit=5')
        .then(r => r.json());

        if(t.rows.length === 0){
            setLoading(false);
            return;
        }

        const month = t.rows[0].txn_date.slice(0, 7);

        const [p, s] = await Promise.all([
            fetch('/api/me/profile').then(r => r.json()),
            fetch(`/api/me/summary?month=${month}`).then(r => r.json())
        ]);

        setRecent(t.rows);
        setProfile(p);
        setSummary(s);
        setMonth(month);
        setLoading(false);
    }
    LoadPage();
    },[]);


    if (loading) {
        return <p className="text-text-secondary animate-pulse text-2xl mx-auto my-auto">Loading…</p>;
    }

    return (
    <div className="flex flex-col pb-4">
        <h1 className="font-display text-3xl mb-5">Home</h1>
    
        <div className="glassEffect p-5 rounded-xl mt-6 flex justify-between">
            <div>
                <h2 className="font-display text-xl mt-2">Good day, <span className="text-accent-primary pl-2 text-2xl font-semibold">{profile.holder_name}</span></h2>
                <p className="text-xs text-text-secondary mt-2 ">Small steps today, greater freedom tomorrow!</p>
                <p className="text-sm text-text-secondary mt-8">
                    {profile.account_type} · {profile.bank_name}
                </p> 
            </div>

            <div className="text-right">
                <button disabled className="border border-b-2 rounded-lg p-1 opacity-75 text-sm">Updated today</button>
                <p className="text-xl text-accent-primary mt-3">Current Balance</p>
                <h1 className="font-display text-4xl">{moneyPrecise(profile.current_balance)}</h1>
            </div>

        
        </div>
        <div className="flex gap-28 mt-6">
            <StatCard icon="/assets/icons/icon_svg/05-trend-up.svg" label="Income" value={summary.income} previous={summary.prev_income} upIsGood={true}/>
            <StatCard icon="/assets/icons/icon_svg/06-trend-down.svg" label="Expense" value={summary.expense} previous={summary.prev_expense} upIsGood={false}/>
            <StatCard icon="/assets/icons/icon_svg/01-wallet.svg" label="Savings" value={summary.savings} previous={summary.prev_savings} upIsGood={true}/>
        </div>

        <div className=" bg-[#141A21] my-7 rounded-md px-6 shadow-md shadow-accent-primary/20">
              <h3 className="font-display text-xl mt-8 mb-8">Recent Activity</h3>

                <div className="grid grid-cols-[330px_390px_190px_1fr] text-xs text-text-secondary border-b border-border-default pb-2">
                    <span>Date</span>
                    <span>Merchant</span>
                    <span>Category</span>
                    <span className="text-right">Amount</span>
                </div>
                
                {recent.map(t => (
                <div key={t.trans_id} className="grid grid-cols-[330px_390px_110px_1fr]  py-3 border-b border-border-default items-center">
                    <span className="text-text-secondary text-sm w-28">{dateFormat(t.txn_date)}</span>
                    <span>{t.merchant_name}</span>
                    <span className="text-xs px-1 py-1 rounded-md bg-surface-raised text-text-secondary">
                        {t.category}
                    </span>
                    
                        <span className={`text-right ${t.direction === 'Received' ? 'text-accent-primary' : 'text-accent-negative'}`}>
                            {t.direction === 'Received' ? '+' : '−'} {moneyPrecise(t.amount)}
                        </span>
                    
                </div>
                ))}
        </div> 
    </div>
  );
}