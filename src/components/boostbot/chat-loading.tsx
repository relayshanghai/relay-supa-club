import { BoltIcon } from '@heroicons/react/24/solid';

const RADIUS = 60;
const STROKE = 8;

const ChatLoading = ({ progress }: { progress: number }) => {
    const normalizedRadius = RADIUS - STROKE * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex justify-center drop-shadow-md">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="animate-spin-burst">
                    <div className="relative animate-float">
                        <BoltIcon className="text-yellow-400" height={42} width={42} />
                        <BoltIcon className="absolute top-1 text-yellow-300" height={42} width={42} />
                    </div>
                </div>
            </div>

            <svg height={RADIUS * 2} width={RADIUS * 2} className="inline-block">
                <defs>
                    <linearGradient id="blue-purple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#EC4899' }} />
                        <stop offset="50%" style={{ stopColor: '#A855F7' }} />
                        <stop offset="100%" style={{ stopColor: '#3B82F6' }} />
                    </linearGradient>
                </defs>
                <circle
                    className="text-neutral-200"
                    stroke="currentColor"
                    fill="transparent"
                    strokeWidth={STROKE}
                    r={normalizedRadius}
                    cx={RADIUS}
                    cy={RADIUS}
                />
                <circle
                    className="origin-center -rotate-90 transition-[stroke-dashoffset] duration-[1500ms]"
                    stroke="url(#blue-purple-gradient)"
                    fill="transparent"
                    strokeDasharray={`${circumference} ${circumference}`}
                    style={{ strokeDashoffset }}
                    strokeWidth={STROKE}
                    r={normalizedRadius}
                    cx={RADIUS}
                    cy={RADIUS}
                />
            </svg>
        </div>
    );
};

export default ChatLoading;
