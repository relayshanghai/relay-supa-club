import React, { useMemo, useState } from 'react';
import ReactWordcloud from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

const words = [
    {
        tag: '#gourmet',
        distance: 0,
        freq: 12.606270573031932,
        tag_cnt: 298424,
    },
    {
        tag: '#gourmetfood',
        distance: 0.1698368787765503,
        freq: 10.798370769971397,
        tag_cnt: 48941,
    },
    {
        tag: '#finefood',
        distance: 0.3413642644882202,
        freq: 9.354613861132608,
        tag_cnt: 11552,
    },
    {
        tag: '#gormet',
        distance: 0.36553287506103516,
        freq: 8.064321960910803,
        tag_cnt: 3179,
    },
    {
        tag: '#gastronomy',
        distance: 0.37739241123199463,
        freq: 11.364135391385066,
        tag_cnt: 86175,
    },
    {
        tag: '#cuisine',
        distance: 0.3863717317581177,
        freq: 12.01369469225829,
        tag_cnt: 164999,
    },
    {
        tag: '#gourmetfoods',
        distance: 0.38953280448913574,
        freq: 7.6362696033793735,
        tag_cnt: 2072,
    },
    {
        tag: '#gourmetexperience',
        distance: 0.40019404888153076,
        freq: 8.947415950650129,
        tag_cnt: 7688,
    },
    {
        tag: '#finefoods',
        distance: 0.40899431705474854,
        freq: 7.537962659768208,
        tag_cnt: 1878,
    },
    {
        tag: '#gourmand',
        distance: 0.4130781888961792,
        freq: 10.322756941620689,
        tag_cnt: 30417,
    },
    {
        tag: '#gourmetparadise',
        distance: 0.41925758123397827,
        freq: 7.900266036767701,
        tag_cnt: 2698,
    },
    {
        tag: '#gourmetartistry',
        distance: 0.4197559356689453,
        freq: 8.984443032465352,
        tag_cnt: 7978,
    },
    {
        tag: '#culinary',
        distance: 0.4257463812828064,
        freq: 11.362358356474322,
        tag_cnt: 86022,
    },
    {
        tag: '#chef',
        distance: 0.4326472282409668,
        freq: 13.225172641385466,
        tag_cnt: 554140,
    },
    {
        tag: '#finedining',
        distance: 0.4450076222419739,
        freq: 11.634054009277705,
        tag_cnt: 112877,
    },
    {
        tag: '#taste',
        distance: 0.4481083154678345,
        freq: 11.79717164148611,
        tag_cnt: 132876,
    },
    {
        tag: '#chefmade',
        distance: 0.4530639052391052,
        freq: 7.1846291527173145,
        tag_cnt: 1319,
    },
    {
        tag: '#truffles',
        distance: 0.46011650562286377,
        freq: 10.596234653074733,
        tag_cnt: 39984,
    },
    {
        tag: '#culinaryexperience',
        distance: 0.4623236060142517,
        freq: 8.125926802707886,
        tag_cnt: 3381,
    },
    {
        tag: '#gourmetchef',
        distance: 0.46937882900238037,
        freq: 7.590852123688581,
        tag_cnt: 1980,
    },
    {
        tag: '#delectable',
        distance: 0.4707139730453491,
        freq: 8.247220052745229,
        tag_cnt: 3817,
    },
    {
        tag: '#truffle',
        distance: 0.4716039299964905,
        freq: 11.225310056962991,
        tag_cnt: 75005,
    },
    {
        tag: '#gastronomic',
        distance: 0.4779539108276367,
        freq: 8.273591798199632,
        tag_cnt: 3919,
    },
    {
        tag: '#finedinning',
        distance: 0.48041045665740967,
        freq: 9.137339479091693,
        tag_cnt: 9296,
    },
    {
        tag: '#culinarydelights',
        distance: 0.48070693016052246,
        freq: 6.794586580876499,
        tag_cnt: 893,
    },
];

const renameElements = (tag: typeof words) => {
    const maxFreq = Math.max(...tag.map((tagElement) => tagElement.freq));
    const minFreq = Math.min(...tag.map((tagElement) => tagElement.freq));
    const freqRange = maxFreq - minFreq;

    return tag.map((tagElement, index) => {
        const normalizedFreq = ((tagElement.freq - minFreq) / freqRange) * 999 + 1;
        const tagName = tagElement.tag.replace('#', '');
        return {
            ...tagElement,
            value: normalizedFreq,
            text: tagName,
            selected: index === 0 ? true : false,
            index: index,
        };
    });
};

const finalWords = renameElements(words);

export const WordCloudComponent = () => {
    const [fixedWords, setFixedWords] = useState(finalWords);

    const callbacks = useMemo(
        () => ({
            getWordColor: (word: any) => {
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
            },
        }),
        [fixedWords],
    );
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
