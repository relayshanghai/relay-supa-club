import React from 'react';
import { render, fireEvent, waitFor, cleanup, act } from '@testing-library/react';
import InputSearch from './thread-list-input-search';
import { afterEach, describe, expect, test, vi } from 'vitest';

describe('InputSearch Component', () => {
    afterEach(cleanup);

    test('should render component', () => {
        const { getByTestId } = render(<InputSearch />);
        getByTestId('search');
    });

    test('calls onSearch callback when Enter key is pressed', async () => {
        const onSearchMock = vi.fn().mockReturnValue(undefined);
        const { getByTestId } = render(<InputSearch onSearch={onSearchMock} />);
        const inputElement = getByTestId('search-input');
        act(() => {
            fireEvent.change(inputElement, { target: { value: 'test' } });
            fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
        });
        await waitFor(() => {
            expect(onSearchMock).toHaveBeenCalledWith('test');
        });
    });

    test('calls onSearch callback when onBlur is triggered', async () => {
        const onSearchMock = vi.fn();
        const { getByTestId } = render(<InputSearch onSearch={onSearchMock} />);
        const inputElement = getByTestId('search-input');
        fireEvent.change(inputElement, { target: { value: 'test' } });
        fireEvent.blur(inputElement);
        await waitFor(() => {
            expect(onSearchMock).toHaveBeenCalledWith('test');
        });
    });
});
