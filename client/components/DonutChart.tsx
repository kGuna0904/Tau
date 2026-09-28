//donut chart for each of the catagories
//this passes only props 
import { moneyPrecise } from "@/app/lib/format";

type donutProp = {
    categories:{
        category:string;
        total:number;
        percent:number
    }[];
}

//only 5 colors, green, blue, red, yellow, purple, respectively, because only considering the top 5 categories
const ColorChart = ['#00E08A', '#4C7DF0', '#FF5C5C', '#E8B44A', '#8B7BF0'];


export default function DonutChart({categories}:donutProp) {
    //slicing the top 5 categories from the database
    const topFive = categories.slice(0, 5);
    //thge sum of every category, not just top 5 categories but reducing all the categories
    const total = categories.reduce((sum, c) => sum + c.total, 0);

    //it means that the categories start from the 0th % and then later end at 100th %, for now we initialize with 0
    let running = 0;
    //the empty array that takes the categories after the loop pushes to it 
    const stops:string[] = [];

    //the loop that runs for the sliced categories one by one, until the 5 categories are looped
    //for each category
    for(let i=0; i<topFive.length; i++){
        const start = running;
        running += topFive[i].percent;
        const end = running;
        stops.push(`${ColorChart[i]} ${start}% ${end}%`);
    }

    //if the % of running is less than 100% then push the rest of the category of a gray color
    if(running < 100){
        stops.push(`#1F2831 ${running}%`);
    }

    const gradient = `conic-gradient(${stops.join(", ")})`;

    return(
        <>
            {/*the wrapper, containing both the donut and the legends */}
            <div className="flex items-center gap-8">
                
                {/* the donut shape and its hole, making it relative to the wrapper, hence stays contained*/}
                <div className="relative w-48 h-48 rounded-full" style={{background: gradient}}>
                    {/* making this absolute to the donut circle, and matching the same color as the wrapper bg*/}
                    <div className=" absolute inset-8 rounded-full bg-surface flex flex-col items-center justify-center text-sm">
                        <p>{moneyPrecise(total)}</p>
                    </div>
                </div>

                {/* the legends will go here */}
                <div className="flex flex-col gap-2">
                    {topFive.map((ct, i) => {
                        //mapping the colors with respect to its categories  
                        return (
                            <>
                                <div className="flex items-center gap-2 py-1 px-2 rounded-md transition-colors hover:bg-surface-raised" key = {ct.category}>
                                    <div className="rounded-full w-3 h-3" style={{background: ColorChart[i]}} />
                                    <span>{ct.category}</span>
                                    <span>{ct.percent}%</span>
                                </div>
                            </>
                        );
                    })}

                </div>

            </div>
        </>
    );
}

// backend(SQL) --> API calls --> DonutProps --> the loop adds it up --> the gradient draws it on the frontend