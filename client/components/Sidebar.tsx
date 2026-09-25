//sidebar navigation
'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import Image from 'next/image';

const links = [
    {label: 'Home', href: '/home', icon: '/assets/icons/icon_svg/home.svg'},
    {label: 'Dashboard', href: '/dashboard', icon: '/assets/icons/icon_svg/03-bar-chart.svg'},
    {label: 'Analytics', href: '/analytics', icon: '/assets/icons/icon_svg/04-pie-chart.svg'},
    {label: 'Transactions', href: '/transactions', icon: '/assets/icons/icon_svg/12-receipt.svg'},
    {label: 'Bank-Statements', href: '/statements', icon: '/assets/icons/icon_svg/13-bank.svg'},
    {label: 'Accounts', href: '/accounts', icon: '/assets/icons/icon_svg/02-credit-card.svg'},
];

const disLinks = [
    {label: 'Settings', href: '#', icon: '/assets/icons/icon_svg/09-settings.svg'},
    {label: 'Help', href: '#2', icon: '/assets/icons/icon_svg/09-settings.svg'},
]

export default function Sidebar() {

    const pathname = usePathname();

    const base = 'flex items-center text-sm gap-3 pb-2 pt-1 px-3 hover:bg-accent-primary/10 hover:rounded-sm hover:text-accent-primary hover:shadow-md hover:shadow-accent-primary/15';
    const active = 'text-text-primary bg-accent-primary/40 shadow-accent-primary/85 rounded-sm shadow-sm shadow-accent-primary/10';
    const inactive = 'text-text-secondary';

    return(
    <div className="w-55 h-screen bg-surface shrink-0 flex flex-col border-r border-border-default px-2 shadow-lg shadow-accent-primary/35">
        <nav>
            <Link href='/home'> 
                <Image src="/assets/images/wordmarked.png" className='mb-4 mt-3 mx-4' alt="Tau Logo" width={100} height={60}/>
            </Link>

            {links.map((link) => {
                const isActive = pathname === link.href;
                
                return (
                    <Link 
                        key={link.href}
                        href={link.href}
                        className={`${base} ${isActive ? active : inactive}`}>
                            <Image className="invert" src={link.icon} alt='' width={30} height={30} />
                            {link.label}
                    </Link>                        
                );
            })}

        </nav>
        <div>
            {disLinks.map((dislink) => {
                return (
                    <div key={dislink.href}
                        className={`${base} cursor-not-allowed text-text-disabled hover:text-text-disabled mt-auto`}
                        title='ask the developer'>
                            <Image className={`invert ${inactive}`} src={dislink.icon} alt='' width={30} height={30} />
                            {dislink.label}
                    </div>
                );
            })}
        </div>

        <div className='glassEffect mt-auto mb-12'>
            <div className='text-sm flex flex-col'>
            <h2>Upgrade to <span className="text-amber-300 font-display font-semibold ">Elite</span></h2>
            <p className='text-xs text-text-secondary pt-2'><span className='text-accent-primary'>Upgrade</span> to get better insights and suggestions</p>
            </div>
            <button disabled className='bg-emerald-600 rounded-sm mt-3 p-1 px-15 text-center cursor-not-allowed hover:bg-accent-primary/50' title='in development'>→</button>
        </div>
    </div>
            
    );
}

