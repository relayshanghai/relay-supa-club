import type { HTMLAttributes } from 'react';

/**
 * Takes a string and splits it into <p> paragraphs if it contains \n characters
 * className is applied to each p */
export const SplitParagraphs = ({
    text,
    className,
}: {
    text: string;
    className?: HTMLAttributes<HTMLParagraphElement>['className'];
}) => {
    const lines = text.split('\n');
    return (
        <>
            {lines.map((line, i) => (
                <p className={className} key={i}>
                    {line}
                </p>
            ))}
        </>
    );
};
