'use client';

import * as React from 'react';

export const Timer = () => {
    const [time, setTime] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="text-sm font-medium">
            {formatTime(time)}
        </div>
    );
};
