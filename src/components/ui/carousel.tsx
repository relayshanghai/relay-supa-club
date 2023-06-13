import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from '../icons';
import Image from 'next/image';

interface CarouselProps {
    slides: Array<{
        url: string;
        title: string;
        description: string;
    }>;
    autoSlide: boolean;
    autoSlideInterval?: number;
}

export default function Carousel({ slides, autoSlide = false, autoSlideInterval = 3000 }: CarouselProps) {
    const [curr, setCurr] = useState(0);

    const prev = () => setCurr((curr) => (curr === 0 ? slides?.length - 1 : curr - 1));
    const next = () => setCurr((curr) => (curr === slides?.length - 1 ? 0 : curr + 1));

    useEffect(() => {
        if (!autoSlide) return;
        const slideInterval = setInterval(next, autoSlideInterval);
        return () => clearInterval(slideInterval);
    });

    return (
        <div className="">
            {slides.map(
                (slide, i) =>
                    curr === i && (
                        <div
                            key={i}
                            className="flex max-w-sm flex-col items-center justify-center space-y-8 lg:max-w-full"
                        >
                            <h2 className="text-3xl font-semibold lg:text-5xl">{slide.title}</h2>
                            <div className="relative overflow-hidden ">
                                <div className="flex transition-transform duration-500 ease-out">
                                    <Image
                                        src={slide.url}
                                        width={500}
                                        height={500}
                                        alt={slide.title}
                                        className="rounded-3xl"
                                    />
                                </div>

                                <div className="absolute inset-0 flex items-center justify-between p-4">
                                    <button
                                        onClick={prev}
                                        className="rounded-full bg-white/50 p-1 text-gray-800 shadow hover:bg-white"
                                    >
                                        <ChevronLeft className="h-6 w-6 stroke-gray-400" />
                                    </button>
                                    <button
                                        onClick={next}
                                        className="rounded-full bg-white/50 p-1 text-gray-800 shadow hover:bg-white"
                                    >
                                        <ChevronRight className="h-6 w-6 stroke-gray-400" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-wrap text-md lg:text-xl">{slide.description}</p>
                            <div className="flex space-x-2">
                                <div className="flex items-center justify-center gap-2">
                                    {slides.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-2.5 w-2.5 rounded-full bg-white transition-all ${
                                                curr === i ? ' bg-primary-900 p-1.5' : 'bg-opacity-70'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ),
            )}
        </div>
    );
}
