import React, { useCallback, useEffect, useState } from 'react';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import type { CreatorPlatform, CreatorSearchTag } from 'types';
import type { TopicTensorData } from 'src/utils/api/iqdata/topics/get-relevant-topic-tags';
import { nextFetch } from 'src/utils/fetcher';

type WordCloudData = {
    value: number;
    text: string;
    selected: boolean;
    index: number;
    distance: number;
};

const renameElements = (tag: TopicTensorData[], tags: CreatorSearchTag[]): WordCloudData[] => {
    const maxFreq = Math.max(...tag.map((tagElement) => tagElement.freq));
    const minFreq = Math.min(...tag.map((tagElement) => tagElement.freq));
    const freqRange = maxFreq - minFreq;

    return tag.map((tagElement, index) => {
        const normalizedFreq = ((tagElement.freq - minFreq) / freqRange) * 999 + 1;
        const tagName = tagElement.tag.replace('#', '');
        return {
            value: normalizedFreq,
            text: tagName,
            selected: tags.some((topic: CreatorSearchTag) => topic.tag === tagName) ? true : false,
            index: index,
            distance: tagElement.distance,
        };
    });
};

interface WordCloudProps {
    tags: CreatorSearchTag[];
    updateTags: (tags: CreatorSearchTag[]) => void;
    platform: CreatorPlatform;
}

const WordCloudComponent = ({ tags, updateTags, platform }: WordCloudProps) => {
    const [fixedWords, setFixedWords] = useState<WordCloudData[]>([]);

    const [selectedTag, setSelectedTag] = useState<CreatorSearchTag | null>(null);

    const addTag = useCallback(
        (item: any) => {
            updateTags([...tags, item]);
            setSelectedTag(null);
        },
        [tags, updateTags],
    );

    const removeTag = useCallback(
        (item: any) => {
            const entry = tags.find((tag) => tag.tag === item.tag);

            if (entry) {
                const clone = tags.slice();
                clone.splice(clone.indexOf(entry), 1);
                updateTags(clone);
            }

            setSelectedTag(null);
        },
        [tags, updateTags],
    );

    useEffect(() => {
        const setWordArray = async () => {
            const body = {
                term: tags.length > 0 ? tags[0].tag : 'influencer',
                limit: 25,
                platform: platform,
            };
            const res = await nextFetch('topics/tensor', {
                method: 'post',
                body,
            });
            const finalWords = renameElements(res.data, tags);
            setFixedWords(finalWords);
        };
        setWordArray();
    }, [tags, platform]);

    useEffect(() => {
        if (!selectedTag) return;
        if (tags.some((tag) => tag.tag === selectedTag.tag)) {
            removeTag(selectedTag);
            return;
        }
        addTag(selectedTag);
    }, [selectedTag, tags, addTag, removeTag]);

    const callbacks = {
        getWordColor: (word: any) => {
            if (!fixedWords) return;
            if (word.selected) return `#EC4899`;
            const maxDistance = Math.max(...fixedWords.map((w) => w.distance));
            const minDistance = Math.min(...fixedWords.map((w) => w.distance));
            const distanceRange = maxDistance - minDistance;
            const opacity = 1.3 - ((word.distance - minDistance) / distanceRange) ** 2;
            return `rgba(139, 92, 246, ${opacity})`;
        },
        onWordClick: async (word: any) => {
            setFixedWords((prevWords) => {
                const index = word.index;
                const updatedWords = [...prevWords];
                updatedWords[index] = { ...updatedWords[index], selected: !updatedWords[index].selected };
                return updatedWords;
            });
            const newTag: CreatorSearchTag = {
                tag: word.text,
                value: word.text,
            };
            setSelectedTag(newTag);
        },
    };
    const options = {
        rotations: 0,
        fontFamily: 'Poppins',
        fontSizes: [12, 96] as [number, number],
        fontWeight: 'normal',
        padding: 1.5,
        enableTooltip: false,
        deterministic: true,
        transitionDuration: 500,
    };

    return (
        <div className="bg-primary flex w-1/2 text-center">
            <ReactWordcloud callbacks={callbacks} options={options} words={fixedWords} />
        </div>
    );
};

export default WordCloudComponent;
