//stat card that shows income, expense and savings

import { moneyPrecise, percent } from "@/app/lib/format";
import Image from 'next/image';

type statCardProps = {
    label: string;
    value: number;
    previous: number;
    upIsGood: boolean;
    icon: string;
};

export default function StatCard({label, value, previous, upIsGood, icon}: statCardProps) {
    const change = percent(value, previous);
    const isUp = change >= 0;
    const isGood = isUp === upIsGood;
    const styleClass = isGood ? 'text-accent-primary' : 'text-accent-negative';
    return(
        <div className="flex items-start bg-[#141A21] rounded-md shadow-md shadow-accent-primary/20 px-15 py-5 gap-4  ">
            <Image src={icon} alt="" width={25} height={25} className="invert" />
            <div className="flex-col flex-1">
            <p>{label}</p>
            <p>{moneyPrecise(value)}</p>
            <p className={styleClass}>
                {isUp ? '↑' : '↓'} {Math.abs(change)}% vs Last Month
            </p>    
            </div>
        </div>
    );
}