
'use client';

import { useState, useEffect } from "react";
import { moneyPrecise} from "@/app/lib/format";
import DonutChart from "@/components/DonutChart";

export default function AnalyticsPage(){
    const [merchants, setMerchants] = useState<any[]>([]);
    const [categories, setCategories]  = useState<any[]>([]);
    const [ loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function LoadPage(){
            
            const [c, m] = await Promise.all([
                fetch('/api/me/categories?from=2025-01-01&to=2025-12-31').then(r => r.json()),
                fetch('/api/me/merchants?from=2025-01-01&to=2025-12-31&limit=5').then(r => r.json())
            ]);
            setLoading(false);
            setCategories(c.categories);
            setMerchants(m.merchants);

        }
        LoadPage();
    },[]);

    if(loading){
        return <p className="animate-pulse text-2xl mx-auto my-auto text-accent-primary">Loading…</p>;
    }

    const txnCount = categories.reduce((sum, c) => sum + c.count, 0);
    const total = categories.reduce((sum, c) => sum + c.total, 0);


    return(
     <div className="flex flex-col pb-4">
        <h1 className="font-display text-3xl mb-3">Analytics</h1>
    
        <div className="glassEffect p-5 rounded-xl my-6 flex justify-between">
            <div>
                <h2 className="font-display text-xl mt-2"><span className="text-accent-primary text-2xl font-semibold">Cumilative Analysis</span></h2>  
                <p className="text-xs text-text-secondary mt-2 ">Analyse every transaction that you make</p>
                <p className="mt-6">Transactions made accross <span className="text-accent-primary font-semibold text-xl">{categories.length}</span> Categories and <span className="text-accent-primary font-semibold text-xl">{txnCount}</span> transactions</p>
            </div>

            <div className="text-right">
                <button disabled className="border border-b-2 rounded-lg p-1 opacity-75 text-sm">Jan-Dec 2025</button>
                <p className="text-xl text-accent-primary mt-10">Total Spent in 2025</p>
                <h1 className="font-display text-4xl">{moneyPrecise(total)}</h1>
            </div>
        </div>

        <DonutChart  categories={categories} />

        <div className=" bg-[#141A21] my-7 rounded-md px-6 shadow-md shadow-accent-primary/20">
                <h3 className="font-display text-2xl mt-8 mb-8">Category Analysis</h3>
                <div className="grid grid-cols-[600px_280px_1fr] text-xs text-text-secondary border-b border-border-default pb-2">
                    <span>Categories</span>
                    <span>Transactions</span>
                    <span className="text-right">Total</span>
                </div>
                            
                {categories.map(c => (
                    <div key={c.category} className="grid grid-cols-[600px_280px_1fr]  py-3 border-b border-border-default items-center">
                        <span>{c.category}</span>
                        <span>{c.count}</span>
                        <span className="text-right">{moneyPrecise(c.total)}</span>
                    </div>
                ))}
        </div>

        <div className=" bg-[#141A21] my-7 rounded-md px-6 shadow-md shadow-accent-primary/20">
                <h3 className="font-display text-2xl mt-8 mb-8">Merchant Analysis</h3>
                <div className="grid grid-cols-[250px_1fr] text-xs text-text-secondary border-b border-border-default pb-2">
                    <span>Merchants</span>
                    <span className="text-right">Total</span>
                </div>
                            
                {merchants.map(m => (
                    <div key={m.merchant} className="grid grid-cols-[250px_1fr]  py-3 border-b border-border-default items-center">
                        <span>{m.merchant}</span>
                        <span className="text-right">{moneyPrecise(m.total)}</span>
                    </div>
                ))}
        </div>                  


    </div>
    );
}