import * as icons from 'src/components/icons';

const Icons = () => {
    return (
        <>
            <p>Notice how some accept a fill(teal) and a stroke(gray) some a text color(purple)</p>
            <div className="flex flex-wrap">
                {Object.entries(icons).map(([name, Icon], i) => {
                    return (
                        <div key={i} className="m-5 bg-slate-200">
                            <Icon className="m-2 h-20 w-20 bg-white fill-cyan-500 stroke-gray-800 p-2 text-primary-700" />
                            <div>{name}</div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};
export default Icons;
