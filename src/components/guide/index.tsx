import Image from 'next/image';
import { Button } from '../button';

interface GuideProps {
    title: string;
    description: string;
    image?: string;
}

export const GuideComponent = (props: GuideProps) => {
    return (
        <div className="flex gap-6 rounded-xl shadow-lg">
            {props.image && (
                <div className="h-fit w-fit flex-grow">
                    <Image
                        src={`assets/imgs/icons/${props.image}`}
                        alt="Picture of the feature"
                        width={500}
                        height={500}
                    />
                </div>
            )}
            <div className="m-4 flex basis-1/2 flex-col items-start justify-between gap-4">
                <h1 className=" text-2xl ">{props.title}</h1>
                <p>{props.description}</p>
                <Button>Get Started </Button>
            </div>
        </div>
    );
};
