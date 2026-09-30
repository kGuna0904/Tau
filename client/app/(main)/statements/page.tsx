
'use client';

import Image from 'next/image';
import {useState} from 'react';
import { moneyPrecise, dateFormat } from '@/app/lib/format';


export default function StatementPage(){
    
    const [from, setFrom] = useState('');//from date
    const [to, setTo] = useState('');//to date
    const [data, setData] = useState<any>(null);//data the will be captured from the response
    const [loading, setLoading] = useState(false);//the current loading state of the program
    const [error, setError] = useState<string | null>(null);//to show the errpr causeing in the program
    const [progress, setProgress] = useState(0);//for this progress bar

    //the function that is set for the button, where the data is fetched only when the button is clicked else no data will be generated
    async function Generate(){
        setProgress(0);//initially 0
        setError(null);
        setLoading(true);

        //setting the time interval until the math completes 
        const bar = setInterval(() => {
            setProgress((p) => Math.min(p + 8, 95));//counts as 8+8+8// until 95 and stop until the data is fetched and displayed
        }, 100);
        

        //promises for both the fetch that includes the timeout 
        const [res] = await Promise.all([
            fetch(`/api/me/statement?from=${from}&to=${to}`),
            new Promise(r => setTimeout(r, 2500)),//delibrately delaying the fetch to ensure the loading screen does the loading work, 1.9sec
        ]);

        clearInterval(bar);//95 interval must be cleared before setting to 100 when fetching done
        setProgress(100);

        //awaits for response
        const d= await res.json();
        if(!res.ok){
            //for debuggin purpose
            console.log(d.error);
            setError(d.error);//set error
            setLoading(false);//stop loading
            return;//generally the error returns
        }
        setData(d);
        setLoading(false);
    }

    //the condition while loading, that returns the jsx, with the progress bar function
    //loading screen
    if (loading){
        return (
            <>
            <div className='items-center flex flex-col min-h-[60vh] justify-items-center mt-19'>
                <Image className="animate-pulse" width={290} height={290} alt="Bank" loading="eager" src="/assets/images/bank_fetch.png" />
                <p className=' text-text-secondary text-sm mt-2'>fetching statement from the <span className='text-accent-primary'>servers</span>..</p>
                
                <div className='animate-pulse mt-3 rounded-full w-95 h-2 bg-surface-raised overflow-hidden'>
                    <div className='h-full bg-accent-primary transition-all duration-100' style={{width: `${progress}%`}}>                
                    </div>
                </div>
            </div>
            </>
        );
    }

    return(
        <>
            <div>
                <h1 className="font-display text-3xl mb-5">Bank Statement</h1>
                <h3 className=" text-sm mb-9">Choose a timeline and generate the statement</h3>

                <div className='flex gap-5'>
                    <label>From: <input type="date" placeholder="▦ to date" className=" invert ml-2 bg-surface rounded-sm px-2 py-1 border border-1/10 bg-surface focus:border-border-active outline-none" value={from} onChange={(e) => {setFrom(e.target.value)}}/></label>
                    <label>To:<input type="date" placeholder="▦ to date" className="invert ml-2 bg-surface rounded-sm px-2 py-1 border border-1/10 bg-surface focus:border-border-active outline-none" value={to} onChange={(e) => {setTo(e.target.value)}}/></label>
                    <button className='ml-4 rounded-sm px-4 py-1 bg-accent-primary/80 hover:bg-accent-primary/65 text-text-primary ' title="Generate Statement" onClick={Generate}>Generate</button>
                </div>
                

                {data && (
                <div className="bg-[#141A21] my-7 rounded-md px-6 pt-4  shadow-md shadow-accent-primary/20">                    
                    <div className='mb-4 flex justify-between'>
                        <div className='flex-col flex'>
                            <h3 className="font-display text-3xl mt-4 mb-3">Transaction Details</h3>
                            <span>Account Id: <span className='text-xl text-accent-primary'>{data.account_id}</span></span>
                        </div>
                        <div className="text-right flex flex-col justify-between py-3 gap-2 mt-4">
                            <span className="text-text-secondary">Opening balance:  <span className='text-accent-secondary'>{moneyPrecise(data.opening_balance)}</span> </span>
                            <span className="text-text-secondary mb-5">Closing balance:  <span className='text-accent-warning'>{moneyPrecise(data.closing_balance)}</span> </span>
                        </div>
                    </div>
                            
                    <div className="grid grid-cols-[150px_240px_240px_240px_220px_1fr] text-xs text-text-secondary border-y border-border-default pt-2 pb-2 mb-2">
                        <span>Date</span>
                        <span>Transaction Id</span>
                        <span>Merchant</span>
                        <span>Category</span>
                        <span >Amount</span>
                        <span className="text-right">Closing Balance</span>
                    </div>
                                            
                    {data.rows.map(t => (
                        <div key={t.trans_id} className="grid grid-cols-[150px_240px_240px_110px_220px_1fr]  py-3 border-b border-border-default items-center">
                            <span className="text-text-secondary text-sm w-28">{dateFormat(t.txn_date)}</span>
                            <span>{t.trans_id}</span>
                            <span>{t.merchant_name}</span>
                            <span className="text-xs p-1 rounded-md bg-surface-raised text-text-secondary">
                                {t.category}
                            </span>
                                                
                            <span className={`text-right ${t.direction === 'Received' ? 'text-accent-primary' : 'text-accent-negative'}`}>
                                {t.direction === 'Received' ? '+' : '−'} {moneyPrecise(t.amount)}
                            </span>
                            <span className='text-right'>{moneyPrecise(t.balance)}</span>                                                
                        </div>
                    ))}
                </div>
                )}
            </div>
        </>
    );
}