import * as library from 'src/components/library';

const Badges = () => (
    <div className="m-5">
        <h2 className="text-lg font-bold"> Badges</h2>
        <p>Primary, Solid, Rounded, 3 sizes</p>
        <div className="m-5 flex flex-wrap space-x-3 bg-slate-200 p-5">
            <library.Badge size="small">Small</library.Badge>

            <library.Badge size="medium">Medium</library.Badge>

            <library.Badge size="large">Large</library.Badge>
        </div>
    </div>
);

const Library = () => (
    <>
        <Badges />
    </>
);

export default Library;
