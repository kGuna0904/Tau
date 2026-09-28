//determines the format of the currency, dates, and the percentage
//takes three functions respectively
//almost every page uses this format


//currency format , type of currency and min and max decimals
export function moneyPrecise(amount:number):string{
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits:2,
        maximumFractionDigits:2
    }).format(amount);
}

//date format, from the backend we got '2025-06-23' --> this format set it as '23 Jun 2025'
export function dateFormat(date:string){
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
        day:'numeric',
        month: 'short',
        year: 'numeric'
    });
}

//this function formats the percentage value
export function percent(current:number, previous:number){
    //checks and returns the same, before even reaching the percentage format
    if(previous === 0){
        return 0;
    }
    const per = (current - previous) / previous * 100;
    const rounded = Math.round(per * 10) /10;
    
    return rounded;
}