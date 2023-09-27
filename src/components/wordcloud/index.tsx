import React, { useCallback, useEffect, useState } from 'react';
import type { CreatorPlatform, CreatorSearchTag } from 'types';
import type { TopicTensorData } from 'src/utils/api/iqdata/topics/get-relevant-topic-tags';
import { nextFetch } from 'src/utils/fetcher';
import WordCloud from 'react-d3-cloud';
import { Tooltip } from '../library';
import { useTranslation } from 'react-i18next';
import { Question } from '../icons';
import { useSearchTrackers } from '../rudder/searchui-rudder-calls';
import { clientLogger } from 'src/utils/logger-client';

type DistanceType = {
    text: string;
    distance: number;
};

export interface Word {
    text: string;
    value: number;
}

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
const normalizeFontSize = (tags: Word[], fontSize: number) => {
    const totalCharacters = tags.reduce((sum, word) => sum + word.text.length, 0);
    const averageWordLength = totalCharacters / tags.length;

    const minFontSize = 10;
    const maxFontSize =
        tags.some((tag) => tag.text.length > 10 && tag.value > 80) || tags.filter((tag) => tag.value > 60).length > 6
            ? 13
            : 17;

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
    const [words, setWords] = useState<Word[]>([]);
    const [wordsDistance, setWordsDistance] = useState<DistanceType[]>([]);
    const [selectedTag, setSelectedTag] = useState<CreatorSearchTag | null>(null);

    const { trackWordCloudAddTag, trackWordCloudRemoveTag } = useSearchTrackers();

    const { t } = useTranslation();

    useEffect(() => {
        const term = tags.length > 0 ? tags[0].tag : 'influencer';
        const setWordArray = async () => {
            try {
                const body = {
                    term,
                    limit: 20,
                    platform,
                };
                const res = await nextFetch('topics/tensor', {
                    method: 'post',
                    body,
                });

                setWords(getWordElements(res.data));
                setWordsDistance(getWordDistances(res.data));
            } catch (error) {
                clientLogger(error, 'error');
            }
        };

        setWordArray();
    }, [tags, platform]);

    const addTag = useCallback(
        (item: CreatorSearchTag) => {
            const term = tags.length > 0 ? tags[0].tag : 'influencer';
            updateTags([...tags, item]);
            setSelectedTag(null);
            trackWordCloudAddTag({ item, search_topic: term, all_selected_topics: tags });
        },
        [tags, updateTags, trackWordCloudAddTag],
    );

    const removeTag = useCallback(
        (item: CreatorSearchTag | undefined) => {
            if (!item) return;
            const clone = tags.slice();
            clone.splice(tags.indexOf(item), 1);
            updateTags(clone);
            setSelectedTag(null);
            trackWordCloudRemoveTag(item);
        },
        [tags, updateTags, trackWordCloudRemoveTag],
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
        async (word: string) => {
            const newTag: CreatorSearchTag = {
                tag: word.replaceAll(' ', '_'),
                value: word,
            };
            setSelectedTag(newTag);
        },
        [setSelectedTag],
    );

    const colorWord = useCallback(
        (word: string) => {
            if (
                tags.some((tagWords) => tagWords.value === word) ||
                !wordsDistance.some((distancedWords) => distancedWords.text === word)
            ) {
                return `#EC4899`;
            }
            const foundWord = wordsDistance.find((distancedWords) => distancedWords.text === word);
            const opacity = foundWord?.distance || 1;
            // this color is our primary tailwind color class, cannot use tailwind with this library
            return `rgba(139, 92, 246, ${opacity})`;
        },
        [tags, wordsDistance],
    );

    return (
        <div className="group relative hidden w-full pt-4 lg:block lg:pt-10">
            <div className="absolute right-0 top-0 h-6 w-6">
                <Tooltip
                    content={t('tooltips.topicCloud.title')}
                    detail={t('tooltips.topicCloud.description')}
                    position="bottom-left"
                >
                    <Question className="stroke-gray-400" />
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
                fontSize={(word: Word) => normalizeFontSize(words, word.value)}
                fill={(word: Word, _index: number) => colorWord(word.text)}
                onWordClick={(_event: any, word: Word) => {
                    handleWord(word.text);
                }}
                onWordMouseOver={(event: any, _word: Word) => {
                    event.target.style.cursor = 'pointer';
                }}
            />
        </div>
    );
};

export default WordCloudComponent;
