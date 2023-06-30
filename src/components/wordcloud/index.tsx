import React, { useCallback, useEffect, useState } from 'react';
import type { CreatorPlatform, CreatorSearchTag } from 'types';
import type { TopicTensorData } from 'src/utils/api/iqdata/topics/get-relevant-topic-tags';
import { nextFetch } from 'src/utils/fetcher';
import WordCloud from 'react-d3-cloud';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import { Tooltip } from '../library';
import { useTranslation } from 'react-i18next';

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

    const maxDistance = Math.max(...tag.map((tagElement) => tagElement.distance));
    const minDistance = Math.min(...tag.map((tagElement) => tagElement.distance));
    const distanceRange = maxDistance - minDistance;

    return tag.map((tagElement, _index) => {
        const normalizedDistance = (tagElement.distance - minDistance) / distanceRange;
        const tagName = tagElement.tag.replace('#', '');
        return {
            distance: normalizedDistance,
            text: tagName,
        };
    });
};
const normalizeFontSize = (tags: any[], fontSize: number) => {
    // Calculate the average word length.
    const totalCharacters = tags.reduce((sum, word) => sum + word.text.length, 0);
    const averageWordLength = totalCharacters / tags.length;

    // Minimum fontSize.
    const minFontSize = 10;
    // Maximum fontSize.
    const maxFontSize = tags[0].length > 8 ? 13 : 15;

    // Determine the normalized fontSize based on the average word length.
    const normalizedFontSize =
        minFontSize + ((fontSize - averageWordLength) * (maxFontSize - minFontSize)) / maxFontSize;

    return Math.floor(normalizedFontSize);
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

    const { t } = useTranslation();

    useEffect(() => {
        const term = tags.length > 0 ? tags[0].tag : 'influencer';
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
    }, [tags, platform]);

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
                tag: w.replace(/ /g, '_'),
                value: w,
            };
            setSelectedTag(newTag);
        },
        [setSelectedTag],
    );

    const colorWord = useCallback(
        (wo: string) => {
            if (tags.some((w) => w.value === wo) || !wordsDistance.some((word) => word.text === wo)) {
                return `#EC4899`;
            }
            const word = wordsDistance.find((word) => word.text === wo);
            const opacity = word?.distance || 1;
            return `rgba(139, 92, 246, ${opacity})`;
        },
        [tags, wordsDistance],
    );

    return (
        <div className="group relative mt-6 hidden w-full pt-4 lg:block 2xl:pt-10">
            <div className="absolute right-0 top-0 h-6 w-6">
                <Tooltip
                    content={t('tooltips.topicCloud.title')}
                    detail={t('tooltips.topicCloud.description')}
                    position="bottom-left"
                >
                    <p>
                        <QuestionMarkCircleIcon color="#D1D5DB" />
                    </p>
                </Tooltip>
            </div>
            <WordCloud
                data={words}
                font="Poppins"
                padding={0.1}
                width={500}
                height={170}
                rotate={0}
                spiral={'rectangular'}
                random={() => {
                    return 0;
                }}
                fontSize={(word: any) => normalizeFontSize(words, word.value)}
                fill={(word: any, _index: number) => colorWord(word.text)}
                onWordClick={(_event: any, word: any) => {
                    handleWord(word.text);
                }}
                onWordMouseOver={(event: any, _word: any) => {
                    event.target.style.cursor = 'pointer';
                }}
            />
        </div>
    );
};

export default WordCloudComponent;
