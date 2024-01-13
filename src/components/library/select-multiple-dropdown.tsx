import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, FilterFunnel } from 'src/components/icons';
import type { FunnelStatus, EmailTrackingStatus, EmailDeliveryStatus } from 'src/utils/api/db/types';
import type { SequenceEmailStep } from 'types';

export type MultipleDropdownObject = {
    [key: string]: {
        value?: number;
        style?: string;
        icon?: JSX.Element;
    };
};

export type CommonStatusType = FunnelStatus | EmailDeliveryStatus | EmailTrackingStatus | SequenceEmailStep | number;

export const SelectMultipleDropdown = ({
    text,
    options,
    selectedOptions,
    setSelectedOptions,
    translationPath,
}: {
    text: string;
    options: MultipleDropdownObject | any;
    selectedOptions: CommonStatusType[] | any[];
    setSelectedOptions: (filters: CommonStatusType[]) => void;
    translationPath: string;
}) => {
    const detailsRef = useRef<HTMLDetailsElement>(null); // Tracks the details element in the returned JSX
    const { t } = useTranslation();

    // Collapses the details bar if the clicked event is not a child of the details element
    const collapseDetails = (event: any) => {
        const detailsTarget = event.target as Node;
        const detailsCurrent = detailsRef.current;
        if (detailsCurrent && !detailsCurrent.contains(detailsTarget)) {
            detailsCurrent.removeAttribute('open');
        }
    };

    const resetSelection = () => {
        setSelectedOptions([]);
    };

    // Adding event listeners to the document (onBlur will not work as clicking a non-focusable element,
    // returns null and does not allow us to check whether it is a child of an element)
    useEffect(() => {
        document.addEventListener('mousedown', collapseDetails);

        return () => {
            document.removeEventListener('mousedown', collapseDetails);
        };
    }, []);

    return (
        <details
            ref={detailsRef}
            className="relative flex w-32 min-w-fit cursor-pointer select-none appearance-none flex-row items-center justify-between gap-2 rounded-md border border-gray-200 bg-white font-medium text-gray-400 ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:border-transparent focus:outline-none focus:ring-0 focus:ring-primary-500 sm:w-64 sm:text-sm"
        >
            <summary className={`flex h-full min-w-full flex-row items-center justify-between gap-2`}>
                <section className="flex flex-row items-center gap-2 px-3 py-1">
                    <FilterFunnel className="h-4 w-4 flex-shrink-0 stroke-slate-500" />
                    {selectedOptions.length > 0 ? (
                        selectedOptions.map((selectedOption, _index) => (
                            <p
                                key={selectedOption}
                                className={`rounded text-xs font-medium ${
                                    options[selectedOption]?.style || ''
                                } whitespace-nowrap px-2 py-2`}
                            >
                                {t(`${translationPath}.${selectedOption}`)}
                            </p>
                        ))
                    ) : (
                        <p className="px-2 py-1.5">{text}</p>
                    )}
                </section>
                {selectedOptions.length > 0 ? (
                    <p
                        onClick={resetSelection}
                        className="flex h-full items-center px-3 text-lg font-semibold hover:bg-slate-200"
                    >
                        x
                    </p>
                ) : (
                    <ChevronDown className="mr-2 h-6 w-6 flex-shrink-0" />
                )}
            </summary>
            <ul className="absolute z-10 mt-2 w-full select-none rounded-lg border bg-white text-sm shadow-lg">
                {Object.keys(options).map((option) => (
                    <li key={option}>
                        <label
                            className="flex cursor-pointer flex-row items-center justify-between rounded-lg px-3 py-2 hover:bg-primary-600 hover:text-slate-100"
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <section className="flex flex-row items-center gap-2">
                                <input
                                    type="checkbox"
                                    value={option}
                                    checked={selectedOptions.includes(option as FunnelStatus)}
                                    className="appearance-none rounded border-gray-300 checked:text-primary-500"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedOptions([...selectedOptions, option as FunnelStatus]);
                                            return;
                                        }
                                        setSelectedOptions(selectedOptions.filter((o) => o !== option));
                                    }}
                                />
                                <p
                                    className={`${
                                        options[option as CommonStatusType]?.style || ''
                                    } whitespace-nowrap rounded-md px-3 py-2 text-xs`}
                                >
                                    {t(`${translationPath}.${option}`)}
                                </p>
                            </section>
                            <p>{options[option as CommonStatusType].value}</p>
                        </label>
                    </li>
                ))}
                <li className="p-2">
                    <label onClick={resetSelection} className="cursor-pointer text-center">
                        <p className="rounded-lg border-2 border-gray-200 px-4 py-2">{t('manager.clearFilters')}</p>
                    </label>
                </li>
            </ul>
        </details>
    );
};
