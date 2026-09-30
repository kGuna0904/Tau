//bar chart file...
//just a bunch of divs with certain height 
//value / maximum value * 100 = the bar height percentage


//types for the data in the month
type MonthData = {
  month: string;
  income: number;
  expense: number;
};

//props for the barchart
type BarChartProps = {
  months: MonthData[];
};

//flat map, makes the data to return just as values and removes any array content from them
export default function BarChart({ months }: BarChartProps) {

    //math.max selects the highest of the value from both the income and expenses
    const max = Math.max(...months.flatMap(m => [m.income, m.expense]));

    return (
        <div className="flex items-end gap-3 h-48">
            {months.map((m) => {
            const label = new Date(m.month).toLocaleDateString('en-IN', { month: 'short' });
            //the bars, <div /> can be a void tag
            return (
                <div key={m.month} className="flex flex-col flex-1 h-full items-center gap-2">
                    <div className="flex items-end gap-1 h-full w-full">
                        <div className="flex-1 bg-accent-primary/80 rounded-t-sm" style={{ height: `${(m.income / max) * 100}%` }} />
                        <div className="rounded-t-sm flex-1 bg-accent-negative/80 " style={{ height: `${(m.expense / max) * 100}%` }} />
                    </div>
                    <span className="text-xs text-text-secondary">{label}</span>
                </div>
            );
            })}
        </div>
    );
}