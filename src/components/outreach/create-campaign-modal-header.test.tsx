import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { ModalHeader } from './create-campaign-modal-header';

describe('ModalHeader Component', () => {
    afterEach(() => {
        cleanup();
    });
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('should render the component', () => {
        const { getByTestId } = render(<ModalHeader step="1" />);
        const modalHeader = getByTestId('modal-header');
        const modalStepLine = getByTestId('modal-step-line');
        const modalStep1Indicator = getByTestId('modal-step-1-indicator');
        const modalStep2Indicator = getByTestId('modal-step-2-indicator');
        const modalStep3Indicator = getByTestId('modal-step-3-indicator');
        expect(modalHeader).toBeDefined();
        expect(modalStepLine).toBeDefined();
        expect(modalStep1Indicator).toBeDefined();
        expect(modalStep2Indicator).toBeDefined();
        expect(modalStep3Indicator).toBeDefined();
    });

    test('should render the component with step 1 active', () => {
        const { getByTestId } = render(<ModalHeader step="1" />);
        const modalStep1Indicator = getByTestId('step-1-active-indicator');
        const modalStep2Indicator = getByTestId('step-2-active-indicator');
        const modalStep3Indicator = getByTestId('step-3-active-indicator');
        expect(modalStep1Indicator.className.includes('text-white')).toBeTruthy();
        expect(modalStep2Indicator.className.includes('text-violet-200')).toBeTruthy();
        expect(modalStep3Indicator.className.includes('text-violet-200')).toBeTruthy();
    });

    test('should render the component with step 2 active', () => {
        const { getByTestId } = render(<ModalHeader step="2" />);
        const modalStep1Indicator = getByTestId('step-1-active-indicator');
        const modalStep2Indicator = getByTestId('step-2-active-indicator');
        const modalStep3Indicator = getByTestId('step-3-active-indicator');
        expect(modalStep1Indicator.className.includes('text-violet-400')).toBeTruthy();
        expect(modalStep2Indicator.className.includes('text-white')).toBeTruthy();
        expect(modalStep3Indicator.className.includes('text-violet-200')).toBeTruthy();
    });

    test('should render the component with step 3 active', () => {
        const { getByTestId } = render(<ModalHeader step="3" />);
        const modalStep1Indicator = getByTestId('step-1-active-indicator');
        const modalStep2Indicator = getByTestId('step-2-active-indicator');
        const modalStep3Indicator = getByTestId('step-3-active-indicator');
        expect(modalStep1Indicator.className.includes('text-violet-400')).toBeTruthy();
        expect(modalStep2Indicator.className.includes('text-violet-400')).toBeTruthy();
        expect(modalStep3Indicator.className.includes('text-white')).toBeTruthy();
    });
});
