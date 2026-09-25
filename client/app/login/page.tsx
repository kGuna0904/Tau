'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    //as it is typescript, need to mention  the event type
    async function handleSubmit(e: React.FormEvent){
        //stops page from refreshing or reloading
        e.preventDefault();
        setError(null);
        setLoading(true);
    
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });
        
        const data = await res.json().catch(() => ({}));

        if(!res.ok){
            setError(data.error ?? "Something went wrong, please try again later.");
            setLoading(false);
            return;
        }

        
        //redirects the routing to the home page once the login is complete
        router.push('/home');
    }

    return (
        <>
        <div className="mt-25 mx-auto flex flex-col items-center justify-center bg-base">
            <Image className="mb-1" src="/assets/images/wordmarked.png" alt="Tau Wordmark" width={300} height={150}/>
            <h2 className="mb-12 font-display">Manage your transactions with <span className="text-accent-primary">Tau</span></h2>
            <form onSubmit={handleSubmit} className="w-lg flex flex-col bg-surface border border-border-default p-8 rounded-md gap-4 ">
                <input type="email" className="rounded-sm py-3 border border-border-default focus:border-border-active outline-none text-center  text-text-primary placeholder:text-text-disabled" value={email} placeholder="example@tau.app" onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" className="rounded-sm py-3 border border-border-default focus:border-border-active outline-none text-center text-text-primary placeholder:text-text-disabled" value={password} placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
                <button type="submit" disabled={loading} className="rounded-xl font-body font-bold bg-[#00e08a96] text-text-primary py-4 hover:bg-[#00e08ac5] border border-white/15 backdrop-blur-xl shadow-[0 8px 32px rgba(0, 224, 138, 0.08)];">{loading ? 'Signing in…' : 'Log in →'}</button>
                {error && <p className='text-accent-negative'>{error}</p>}
            </form>
        </div>
        </>
    );
}    