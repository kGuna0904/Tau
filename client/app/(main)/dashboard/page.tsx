
'use client';

import {useState, useEffect} from 'react';
import { moneyPrecise, dateFormat } from "@/app/lib/format";
import BarChart from "@/components/BarChart";
import Image from 'next/image';


export default function DashboardPage() {
    
    const [profile, setProfile] = useState<any>(null);
    const [months, setMonths] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        async function LoadPage() {

        const [p, m] = await Promise.all([
            fetch('/api/me/profile').then(r => r.json()),
            fetch(`/api/me/monthly?year=2025`).then(r => r.json())
        ]);

        if(m.months.length === 0){
            setLoading(false);
            return;
        }
   
        setProfile(p);
        setMonths(m.months);
        setLoading(false);
    }
    LoadPage();
    },[]);


    if (loading) {
        return <p className="text-text-secondary animate-pulse text-2xl mx-auto my-auto">Loading…</p>;
    }

    const yearIncome = months.reduce((sum, m) => sum + m.income, 0);
    const yearExpense = months.reduce((sum, m) => sum + m.expense, 0);
    const yearSaving =  yearIncome - yearExpense;

    return (
    <div className="flex flex-col pb-4">
        <h1 className="font-display text-3xl mb-5">Dashboard</h1>
    
        <div className="glassEffect p-5 rounded-xl mt-6 flex justify-between">
            <div>
                <h2 className="font-display text-xl mt-2"><span className="text-accent-primary text-2xl font-semibold">Total year data</span></h2>
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
        <div className="flex gap-4 mt-6">
            {/* card 1 for the yearly income*/}
            <div className="flex-1 bg-surface border border-border-default rounded-md p-5 gap-2 flex justify-between items-start">
                <div>
                    <p >Earning for 2025</p>
                    <p className="mt-8 text-accent-primary text-xl">{moneyPrecise(yearIncome)}</p>
                </div>

                <Image src="/assets/icons/icon_svg/05-trend-up.svg" className='invert' width={55} height={55} alt='income' />
               
            </div>

            {/* card 2 for the yearly expense*/}
            <div className="flex-1 bg-surface border border-border-default rounded-md p-5 px-14 gap-2 flex justify-between items-start">
                <div>
                    <p>Expenditure for 2025</p>
                    <p className="mt-8 text-accent-negative text-xl">{moneyPrecise(yearExpense)}</p>
                </div>

                <Image src="/assets/icons/icon_svg/06-trend-down.svg" className='invert' width={55} height={55} alt='expense' />
                
            </div>

            {/* card 3 for the yearly savings*/}
            <div className="flex-1 bg-surface border border-border-default rounded-md p-5 gap-2 flex justify-between items-start">
                <div>
                    <p>Savings for 2025</p>
                    <p className="mt-8 text-accent-primary text-xl">{moneyPrecise(yearSaving)}</p>
                </div>
                
                <Image src="/assets/icons/icon_svg/01-wallet.svg" className='invert' width={55} height={55} alt='saving' />
                
            </div>

        </div>

        <div className=" bg-[#141A21] my-7 rounded-md px-6 shadow-md shadow-accent-primary/20">
              <h3 className="font-display text-xl mt-8 mb-8">Bar Stat</h3>
              <BarChart months={months}/>
        </div> 
    </div>
  );
}