'use client';

import { useState, useEffect } from "react";
import { moneyPrecise, dateFormat } from "@/app/lib/format";

const tabs = [
  { value: 'all', label: 'All' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

const cols = 'grid grid-cols-[100px_1fr_140px_100px_120px] gap-4';

export default function TransactionPage() {
    
    const [rows, setRows] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState('all');
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');//state of the search box
    const [search, setSearch] = useState('');//actual state the search holds

    useEffect(() => {
        //timer set once the search takes place
        const timer = setTimeout(() => {
            //page 1, setting the search to the search input
            setSearch(searchInput);
            setPage(1);
        }, 300);
        
        //returns clearing the search box/input once the set timeout is past 300
        return () => clearTimeout(timer);
    }, [searchInput]);

    //async to load the data from the fetch to the rows and total, hence the loading state being false
    useEffect(() => {
        async function load() {
            setLoading(true);
            const res = await fetch(`/api/me/transactions?type=${type}&page=${page}&limit=15&search=${search}`);
            const data = await res.json();
            setRows(data.rows);
            setTotal(data.total);
            setLoading(false);
        }
        //func needs to run atleast once 
        load();
    }, [type, page, search]);//depends on these


    //1-15:page 1, 16-30:page 2, .........
    //rounds up the total number of pages existing
    const totalPages = Math.ceil(total / 15);
    //first row number on this page
    const start = (page - 1) * 15 + 1;
    //page end, ex: page 2 * 15 , total number of the pages
    const end = Math.min(page * 15, total); 

    const active = 'bg-accent-primary/70 text-text-primary';
    const inactive = 'text-text-primary bg-surface';

    return (
        <div className="flex flex-col pb-4 outline-noneoutline-none">
            <h1 className="font-display text-3xl mb-2">Transactions</h1>
            <h3 className="font-display  mb-5">View and manage all your transactions.</h3>
            <div className=" flex gap-3">
                
                    {tabs.map(t => {
                        const isActive = type === t.value;
                        //on click this sets the type of button and sets the page to 1 initially
                        return (
                            <button key={t.value} onClick={() => {setType(t.value); setPage(1)}} className={`p-2 px-3 rounded-md text-sm  hover:bg-accent-primary/75  hover:text-text-primary outline-none ${isActive ? active : inactive}`}>
                                {t.label}
                            </button>
                        );
                    })}
                
                <input type="text" placeholder="⌕  search merchant or category" className=" ml-[700px] mr-10 flex-1 rounded-sm px-2 py-1 border border-1/10 bg-surface focus:border-border-active outline-none" value={searchInput} onChange={(e) => {setSearchInput(e.target.value)}}/>
            </div>
            
            <div className=" bg-[#141A21] my-7 rounded-md px-6 shadow-md shadow-accent-primary/20">
                <h3 className="font-display text-xl mt-8 mb-8">Transaction Activity</h3>
                <div className="grid grid-cols-[250px_280px_280px_270px_1fr] text-xs text-text-secondary border-b border-border-default pb-2">
                    <span>Date</span>
                    <span>Transaction Id</span>
                    <span>Merchant</span>
                    <span>Category</span>
                    <span className="text-right">Amount</span>
                </div>
                            
                {rows.map(t => (
                    <div key={t.trans_id} className="grid grid-cols-[250px_280px_280px_110px_1fr]  py-3 border-b border-border-default items-center">
                        <span className="text-text-secondary text-sm w-28">{dateFormat(t.txn_date)}</span>
                        <span>{t.trans_id}</span>
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

            <div className="flex justify-between items-center mt-4 mr-5">
                <span >Showing <span className="text-accent-primary">{start}–{end}</span> of {total}</span>
                <div className="flex gap-2">
                    <button disabled={page === 1} onClick={() => setPage(page-1)} className={`bg-surface px-4 py-2 mr-5 rounded-sm hover:bg-accent-primary/75 outline-none focus:bg-accent-primary`} title="Previous"> ← </button>
                    <button disabled={page >= totalPages} onClick={() => setPage(page+1)} className={`bg-surface py-2 px-4 mr-2 rounded-sm hover:bg-accent-primary/75 outline-none focus:bg-accent-primary`} title="Next"> → </button>
                </div>
            </div>

        </div>
    );
   
}