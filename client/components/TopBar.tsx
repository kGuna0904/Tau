//topbar nav
'use client'

import {useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function TopBar(){
    
    const [name, setName] = useState('');
    const router = useRouter();
    
    useEffect(() =>{
        fetch('/api/me/profile')
        .then(r => r.json())
        .then(d => setName(d.holder_name))
    }, []);
    
    async function handleLogout(){
        await fetch('/api/auth/logout', {method: 'POST'});
        router.push('/login');
    }

    return (
        <>
        <header className='h-12 flex justify-end px-8 items-center gap-3 border-b border-border-default bg-base font-display font-semibold'>
            <button disabled className='px-6 invert cursor-not-allowed my-auto justify-start'><Image src = '/assets/icons/icon_svg/07-bell.svg' width={35} height={25} alt='Notifications' title='in development'/></button>
            <h1 className='text-accent-primary pr-3'>{name}</h1>
            <button className='mx-2 p-1 invert hover:bg-accent-primary/40 hover:rounded-sm' onClick={handleLogout}><Image src = '/assets/icons/icon_svg/logout.svg' width={20} height={20} alt='Logout' /></button>
        </header>
        </>
    );
}