import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { SequenceStepItem } from './sequence-step-item';

describe('SequenceStepItem', () => {
    test('renders the correct title and description', () => {
        const onDelete = vi.fn();
        const title = 'Test Title';
        const description = 'Test Description';

        const { getByText } = render(<SequenceStepItem title={title} description={description} onDelete={onDelete} />);

        const titleElement = getByText(title);
        const descriptionElement = getByText(description);

        expect(titleElement).toBeDefined();
        expect(descriptionElement).toBeDefined();
    });
});
