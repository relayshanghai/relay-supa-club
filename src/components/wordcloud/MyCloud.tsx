import { useCallback } from 'react';
import type { CreatorSearchTag } from 'types';
import type { WordCloudData } from './index';

interface MyCloudProps {
    words: WordCloudData[];
    setWords: (words: WordCloudData[]) => void;
    setSelectedTag: (tag: CreatorSearchTag) => void;
    tags: CreatorSearchTag[];
}

export const MyCloud = ({ words, setWords, setSelectedTag, tags }: MyCloudProps) => {
    const getWordColor = useCallback(
        (word: WordCloudData) => {
            // if (!words) return;
            if (tags.some((tag) => tag.tag === word.text)) {
                return {
                    color: '#EC4899',
                };
            }
            const maxDistance = Math.max(...words.map((w) => w.distance));
            const minDistance = Math.min(...words.map((w) => w.distance));
            const distanceRange = maxDistance - minDistance;

            // Normalize the distance between 1 to 100
            const normalizedDistance = ((word.distance - minDistance) / distanceRange) * 99 + 1;

            return {
                color: `rgb(139, 92, 246)`,
                opacity: `${normalizedDistance / 100}`,
            };
        },
        [tags, words],
    );

    const getWordSize = (word: WordCloudData) => {
        const maxVal = Math.max(...words.map((w) => w.value));
        const minVal = Math.min(...words.map((w) => w.value));
        const valueRange = maxVal - minVal;

        const size = Math.round(((word.value - minVal) / valueRange) * 7 + 2) * 5;
        const padding = Math.round(((word.value - minVal) / valueRange) * 7 + 2);
        return {
            fontSize: size + 'px',
            padding: padding + 'px',
        };
    };

    const selectionHandler = (index: number) => {
        const newWord = words[index];
        newWord.selected = !newWord.selected;
        const updatedWords = [...words];
        updatedWords[index] = newWord;
        setWords(updatedWords);
        const newTag: CreatorSearchTag = {
            tag: words[index].text,
            value: words[index].text,
        };
        setSelectedTag(newTag);
    };

    return (
        <div className="flex h-full w-full flex-wrap items-center justify-center p-0 leading-10">
            {words.map((word, index) => {
                return (
                    <p
                        key={index}
                        onClick={() => {
                            selectionHandler(index);
                        }}
                        className={`cursor-pointer select-none font-medium transition-all hover:scale-105`}
                        style={{
                            ...getWordColor(word),
                            ...getWordSize(word),
                        }}
                    >
                        {word.text}
                    </p>
                );
            })}
        </div>
    );
};
