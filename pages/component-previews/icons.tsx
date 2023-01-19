import * as icons from 'src/components/icons';

const Icons = () => {
    return (
        <>
            <p>Notice how some accept a fill(teal) and some a text color(purple)</p>
            <div className="flex flex-wrap">
                {Object.entries(icons).map(([name, Icon], i) => {
                    return (
                        <div key={i} className="bg-slate-200 m-5">
                            <Icon className="w-20 h-20 m-2 bg-white p-2 text-primary-700 fill-cyan-500" />
                            <div>{name}</div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};
export default Icons;
