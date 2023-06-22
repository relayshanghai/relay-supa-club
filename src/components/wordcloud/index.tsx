import React, { useCallback, useEffect, useState } from 'react';
import type { CreatorPlatform, CreatorSearchTag } from 'types';
import type { TopicTensorData } from 'src/utils/api/iqdata/topics/get-relevant-topic-tags';
import { nextFetch } from 'src/utils/fetcher';
import WordCloud from 'react-d3-cloud';

type DistanceType = {
    text: string;
    distance: number;
};

const getWordElements = (tag: TopicTensorData[]): any[] => {
    if (!tag) return [];
    const maxFreq = Math.max(...tag.map((tagElement) => tagElement.freq));
    const minFreq = Math.min(...tag.map((tagElement) => tagElement.freq));
    const freqRange = maxFreq - minFreq;

    return tag.map((tagElement, _index) => {
        const normalizedFreq = ((tagElement.freq - minFreq) / freqRange) * 99 + 1;
        const tagName = tagElement.tag.replace('#', '');
        return {
            value: normalizedFreq,
            text: tagName,
        };
    });
};

const getWordDistances = (tag: TopicTensorData[]): DistanceType[] => {
    if (!tag) return [];

    const maxDistance = Math.max(...tag.map((tagElement) => tagElement.freq));
    const minDistance = Math.min(...tag.map((tagElement) => tagElement.freq));
    const distanceRange = maxDistance - minDistance;

    return tag.map((tagElement, _index) => {
        const normalizedDistance = (tagElement.freq - minDistance) / distanceRange;
        const tagName = tagElement.tag.replace('#', '');
        return {
            distance: normalizedDistance,
            text: tagName,
        };
    });
};

interface WordCloudProps {
    tags: CreatorSearchTag[];
    updateTags: (tags: CreatorSearchTag[]) => void;
    platform: CreatorPlatform;
}

const WordCloudComponent = ({ tags, platform, updateTags }: WordCloudProps) => {
    const [words, setWords] = useState<any[]>([]);
    const [wordsDistance, setWordsDistance] = useState<DistanceType[]>([]);
    const [selectedTag, setSelectedTag] = useState<CreatorSearchTag | null>(null);

    useEffect(() => {
        const term = tags.length > 0 ? tags[0].tag : 'influencer';
        if (words.length > 0 && words[0]?.text === term) return;
        const setWordArray = async () => {
            const body = {
                term: term,
                limit: 20,
                platform: platform,
            };
            const res = await nextFetch('topics/tensor', {
                method: 'post',
                body,
            });
            const finalWords = getWordElements(res.data);
            const finalDistances = getWordDistances(res.data);
            setWords(finalWords);
            setWordsDistance(finalDistances);
        };
        setWordArray();
    }, [tags, platform, words]);

    const addTag = useCallback(
        (item: any) => {
            updateTags([...tags, item]);
            setSelectedTag(null);
        },
        [tags, updateTags],
    );

    const removeTag = useCallback(
        (item: any) => {
            const clone = tags.slice();
            clone.splice(tags.indexOf(item), 1);
            updateTags(clone);
            setSelectedTag(null);
        },
        [tags, updateTags],
    );

    useEffect(() => {
        if (!selectedTag) return;
        if (tags.some((tag) => tag.tag === selectedTag.tag)) {
            const index = tags.find((tag) => tag.tag === selectedTag.tag);
            removeTag(index);
            return;
        }
        addTag(selectedTag);
    }, [selectedTag, tags, addTag, removeTag]);

    const handleWord = useCallback(
        async (w: string) => {
            const newTag: CreatorSearchTag = {
                tag: w,
                value: w,
            };
            setSelectedTag(newTag);
        },
        [setSelectedTag],
    );

    const colorWord = useCallback(
        (wo: string) => {
            if (tags.some((w) => w.tag === wo) || !wordsDistance.some((word) => word.text === wo)) {
                return `#EC4899`;
            }
            const word = wordsDistance.find((word) => word.text === wo);
            const opacity = word?.distance || 1;
            return `rgba(139, 92, 246, ${0.3 + opacity})`;
        },
        [tags, wordsDistance],
    );

    // const callbacks = {
    //     getWordColor: (word: any) => {
    //         return colorWord(word.text);
    //     },
    //     onWordClick: async (word: any) => {
    //         handleWord(word.text);
    //     },
    // };

    // const options = {
    //     rotations: 0,
    //     rotationAngles: [0, 0] as [number, number],
    //     fontFamily: 'Poppins',
    //     fontSizes: [12, 50] as [number, number],
    //     padding: 1.5,
    //     deterministic: true,
    //     enableTooltip: false,
    // };

    return (
        <div className="bg-primary h-auto w-full text-center transition-all">
            {/* <MyCloud
                words={fixedWords}
                setWords={(words: WordCloudData[]) => {
                    setFixedWords(words);
                }}
                setSelectedTag={setSelectedTag}
                tags={tags}
            /> */}
            {/* <ReactWordCloud callbacks={callbacks} options={options} words={words} /> */}
            <WordCloud
                data={words}
                font="Poppins"
                padding={1.5}
                width={500}
                height={200}
                rotate={0}
                random={() => {
                    return 0;
                }}
                fontSize={(word) => Math.log2(word.value) * 5}
                fill={(word: any, _index: number) => colorWord(word.text)}
                onWordClick={(_event: any, word: any) => {
                    handleWord(word.text);
                }}
                onWordMouseOver={(event: any, _word: any) => {
                    event.target.style.cursor = 'pointer';
                    event.target.style.animationTimingFunction = 'ease-in-out';
                }}
            />
        </div>
    );
};

export default WordCloudComponent;
