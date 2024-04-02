import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { SequenceStepDuration } from './sequence-step-duration';

describe('SequenceStepDuration', () => {
    test('renders the correct duration', () => {
        const duration = 48;
        const { getByTestId } = render(<SequenceStepDuration duration={duration} />);
        const durationText = getByTestId('duration-text');
        expect(durationText).toBeDefined();
        expect(durationText.textContent).toBe('2');
    });
});
