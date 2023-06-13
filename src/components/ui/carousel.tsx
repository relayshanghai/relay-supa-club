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
        <>
            {slides.map(
                (slide, i) =>
                    curr === i && (
                        <div
                            key={i}
                            className="flex max-w-2xl flex-col items-center justify-center  transition-transform duration-500 ease-out"
                        >
                            <h2 className="mb-12 text-4xl font-semibold">{slide.title}</h2>
                            <div className="relative mb-8 overflow-hidden">
                                <div className="flex">
                                    <Image
                                        src={slide.url}
                                        width={500}
                                        height={500}
                                        alt={slide.title}
                                        className="rounded-3xl"
                                        // style={{ transform: `translateX(-${curr * 100}%)` }}
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
                                <div className="absolute bottom-4 left-0 right-0">
                                    <div className="flex items-center justify-center gap-2">
                                        {slides.map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-3 w-3 rounded-full bg-white transition-all ${
                                                    curr === i ? 'p-2' : 'bg-opacity-50'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-lg">{slide.description}</p>
                        </div>
                    ),
            )}
        </>
    );
}
