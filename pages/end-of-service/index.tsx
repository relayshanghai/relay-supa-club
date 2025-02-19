import React from 'react';

const EndOfService = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-900 to-primary-700">
            <div className="px-4 text-center">
                <div className="mx-auto mb-4 w-48 rounded-full bg-white p-8">
                    <img src="/assets/imgs/logos/boostbot.svg" alt="Boostbot Logo" className="w-32" />
                </div>
                <h1 className="mb-4 text-5xl font-bold text-primary-50">Goodbye for Now</h1>
                <h1 className="mb-4 text-5xl font-bold text-primary-50">再见</h1>
                <p className="max-w-2xl text-xl text-primary-50">
                    BoostBot has come to an end. Thanks for your support along this journey. Get in touch on wechat:
                    XFSP1989
                </p>
                <p className="max-w-2xl text-xl text-primary-50">
                    雷宝平台已停止所有服务。感谢你过往的支持。想了解更多可以v我们：xfsp1989
                </p>
            </div>
        </div>
    );
};

export default EndOfService;
