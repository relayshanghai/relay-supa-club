// Description: A temporary sales bar chart component for the demo to match the design.We could replace this with a better chart library in the future.
//for now using a static height, in next iteration will be replaced with a dynamic height based on the data and also create a function to show latest 6 months data.
const calcHeight = (amt: number) => {
    const max = 16000;
    const min = 2560;
    const height = ((amt - min) / (max - min)) * 100;
    return Math.floor(height);
};

const chartData = [
    {
        name: 'NOV',
        color: 'bg-purple-200',
        amt: calcHeight(10000),
    },
    {
        name: 'DEC',
        color: 'bg-primary-400',
        amt: calcHeight(16000),
    },
    {
        name: 'JAN',
        color: 'bg-primary-600',
        amt: calcHeight(5230),
    },
    {
        name: 'FEB',
        color: 'bg-primary-400',
        amt: calcHeight(4560),
    },
    {
        name: 'MAR',
        color: 'bg-pink-500',
        amt: calcHeight(9500),
    },
    {
        name: 'APR',
        color: 'bg-primary-300',
        amt: calcHeight(12500),
    },
];

export default function SalesBarChart() {
    return (
        <div className="flex h-full space-x-4">
            {chartData.map((data, index) => (
                <div className="flex h-full flex-col justify-end" key={index}>
                    <div
                        className={`${data.color} mb-1 h-12 w-4 rounded-t-md opacity-70 transition duration-300 hover:opacity-100`}
                        style={{ height: `${data.amt}%` }}
                    />
                    <div className=" text-xs uppercase text-gray-400">{data.name}</div>
                </div>
            ))}
        </div>
    );
}
