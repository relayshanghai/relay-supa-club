import { useState, useRef } from 'react';
import useOnOutsideClick from 'src/hooks/use-on-outside-click';

type Suggestion = {
    value: string;
    label: string;
};

type Props = {
    suggestions: Suggestion[];
    onSelect: (value: string) => void;
};

export const InputWithSuggestions = ({ suggestions, onSelect }: Props) => {
    const inputWithSuggestionsRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState('');
    useOnOutsideClick(inputWithSuggestionsRef, () => setIsOpen(false));

    const handleSelect = (value: string) => {
        onSelect(value);
        setValue('');
        setIsOpen(false);
    };

    const filteredSuggestions = suggestions.filter((suggestion) =>
        suggestion.label.toLowerCase().includes(value.toLowerCase()),
    );

    return (
        <div className="relative w-full" ref={inputWithSuggestionsRef}>
            <input
                className="w-full rounded-md border-none px-1 py-2 text-xs ring-2 ring-gray-200 hover:ring-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setIsOpen(true)}
            />

            {isOpen && (
                <ul className="absolute z-10 mt-2 max-h-32 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white text-gray-700 shadow-md">
                    {filteredSuggestions.map((suggestion) => (
                        <li key={suggestion.value}>
                            <button
                                onClick={() => handleSelect(suggestion.value)}
                                className="w-full px-4 py-2 text-left text-sm font-medium hover:bg-gray-100"
                            >
                                {suggestion.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
