import { Rocket, Gift, Atoms, User, Megaphone } from 'app/components/icons';

const DropdownIcon = (icon: JSX.Element) => {
    return <div className="mr-2 h-6 w-6">{icon}</div>;
};

export const variableCategories = [
    { name: 'Brand', icon: DropdownIcon(<Megaphone />) },
    { name: 'Product', icon: DropdownIcon(<Rocket />) },
    { name: 'Collab', icon: DropdownIcon(<Gift />) },
    { name: 'Influencers', icon: DropdownIcon(<User />) },
    { name: 'Wildcards', icon: DropdownIcon(<Atoms />) },
];
