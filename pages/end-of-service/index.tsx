import React from 'react';

const EndOfService = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-900 to-primary-700">
            <div className="px-4 text-center">
                <div className="mx-auto mb-4 w-48 rounded-full bg-white p-8">
                    <img src="/assets/imgs/logos/boostbot.svg" alt="Boostbot Logo" className="w-32" />
                </div>
                <h1 className="mb-4 text-5xl font-bold text-primary-50">End of Service</h1>
                <p className="max-w-2xl text-xl text-primary-50">
                    Our platform service has now ended—thank you for your support and trust on this journey.
                </p>
            </div>
        </div>
    );
};

export default EndOfService;
