import React, { useState } from 'react';
import { Switch } from 'src/components/library';

export const OnlyMe = () => {
    const [onlyMe, setOnlyMe] = useState<boolean>(false);
    return (
        <div className="flex flex-row items-center gap-2 text-gray-500">
            <p>View only mine</p>
            <Switch
                checked={onlyMe}
                onChange={() => {
                    setOnlyMe(!onlyMe);
                }}
            />
        </div>
    );
};
