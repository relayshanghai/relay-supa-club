'use client';

import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

import { cn } from 'shadcn/lib/utils';

const ToggleGroup = React.forwardRef<
    React.ElementRef<typeof ToggleGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, children, ...props }, ref) => {
    return (
        <ToggleGroupPrimitive.Root
            ref={ref}
            className={cn(
                'flex items-center justify-center gap-1 space-x-px rounded-full border-2 !border-gray-200 bg-white px-2 py-1',
                className,
            )}
            {...props}
        >
            {children}
        </ToggleGroupPrimitive.Root>
    );
});

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;
const toggleGroupItemClasses =
    'flex items-center justify-center bg-white text-base px-2 py-1 rounded-full focus:bg-violet-600 focus:text-white focus:z-10';
const ToggleGroupItem = React.forwardRef<
    React.ElementRef<typeof ToggleGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
    return (
        <ToggleGroupPrimitive.Item ref={ref} className={cn(toggleGroupItemClasses, className)} {...props}>
            {children}
        </ToggleGroupPrimitive.Item>
    );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
