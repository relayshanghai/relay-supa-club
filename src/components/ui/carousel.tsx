import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from '../icons';
import Image from 'next/image';
import { useRudderstackTrack } from 'src/hooks/use-rudderstack';
import { NavigateSignupCarousal } from 'src/utils/analytics/events/onboarding/navigate-signup-carousal';

interface CarouselProps {
    slides: Array<{
        url: string;
        title?: string;
        description?: string;
    }>;
    autoSlide: boolean;
    autoSlideInterval?: number;
}

export default function Carousel({ slides, autoSlide = false, autoSlideInterval = 5000 }: CarouselProps) {
    const [currIndex, setCurrIndex] = useState(0);
    const { track } = useRudderstackTrack();
    const prevSlide = useCallback(() => {
        const destinationSlide = currIndex === 0 ? slides?.length - 1 : currIndex - 1;
        setCurrIndex(destinationSlide);
        track(NavigateSignupCarousal, {
            current_slide: currIndex,
            destination_slide: destinationSlide,
        });
    }, [currIndex, slides?.length, track]);

    const nextSlide = useCallback(
        (shouldTrack = true) => {
            const destinationSlide = currIndex === slides?.length - 1 ? 0 : currIndex + 1;
            setCurrIndex(destinationSlide);
            if (shouldTrack) {
                track(NavigateSignupCarousal, {
                    current_slide: currIndex,
                    destination_slide: destinationSlide,
                });
            }
        },
        [currIndex, slides?.length, track],
    );

    useEffect(() => {
        if (!autoSlide) return;
        const slideInterval = setInterval(() => nextSlide(false), autoSlideInterval);
        return () => clearInterval(slideInterval);
    }, [autoSlide, autoSlideInterval, nextSlide]);

    return (
        <div className="flex h-full w-full max-w-sm flex-col items-center justify-center space-y-8 transition-transform duration-500 ease-in-out lg:max-w-lg xl:max-w-xl 2xl:max-w-3xl">
            {slides[currIndex].title?.includes('BoostBot') ? (
                <div className="flex space-x-2">
                    <h2 className="text-6xl font-light lg:text-5xl">{slides[currIndex].title?.split(' ')[0]}</h2>
                    <h2 className="text-6xl font-bold lg:text-5xl">{slides[currIndex].title?.split(' ')[1]}</h2>
                </div>
            ) : (
                <h2 className="text-3xl font-bold lg:text-5xl">{slides[currIndex].title}</h2>
            )}

            <div className="group relative overflow-hidden">
                <div>
                    <Image
                        src={slides[currIndex].url}
                        width={600}
                        height={400}
                        alt={slides[currIndex].title || ''}
                        className="rounded-2xl bg-cover bg-center"
                        quality={100}
                    />
                </div>

                <div className="absolute inset-0 flex items-center justify-between p-3">
                    <button
                        onClick={prevSlide}
                        className="hidden rounded-full bg-white/50 p-1 text-gray-800 shadow hover:bg-white group-hover:block"
                    >
                        <ChevronLeft className="h-6 w-6 stroke-gray-400" />
                    </button>
                    <button
                        onClick={() => nextSlide()}
                        className="hidden rounded-full bg-white/50 p-1 text-gray-800 shadow hover:bg-white group-hover:block"
                    >
                        <ChevronRight className="h-6 w-6 stroke-gray-400" />
                    </button>
                </div>
            </div>
            <p className="text-wrap text-md font-regular  w-5/6 text-center lg:text-xl">
                {slides[currIndex].description}
            </p>

            <div className="flex space-x-2">
                <div className="flex items-center justify-center gap-2">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                setCurrIndex(i);
                                track(NavigateSignupCarousal, {
                                    current_slide: currIndex,
                                    destination_slide: i,
                                });
                            }}
                            className={`h-2 w-2 rounded-full bg-white transition-all duration-500 ease-in-out hover:cursor-pointer ${
                                currIndex === i ? 'bg-primary-900 p-1' : 'bg-opacity-80'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
