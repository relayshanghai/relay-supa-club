// import { useTranslation } from 'react-i18next';
import { Modal } from 'src/components/modal';
import { Button } from 'src/components/button';
import {
    Bar,
    BarChart,
    CartesianGrid,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';

type InfluencerDetailsModalProps = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
};

export const InfluencerDetailsModal = ({ isOpen, setIsOpen }: InfluencerDetailsModalProps) => {
    // const { t } = useTranslation();
    const dummyRadarGraphData = [
        { subject: 'Productivity', A: 90, fullMark: 150 },
        { subject: 'Fitness Routine', A: 60, fullMark: 150 },
        { subject: 'Sports', A: 88, fullMark: 150 },
        { subject: 'Theraputics', A: 66, fullMark: 150 },
        { subject: 'Yoga', A: 80, fullMark: 150 },
        { subject: 'Wellness', A: 90, fullMark: 150 },
        { subject: 'Injury Recovery', A: 23, fullMark: 150 },
    ];

    const dummyBarChartData = [
        {
            name: '13-17',
            uv: 4000,
            pv: 2400,
            amt: 2400,
        },
        {
            name: '18-24',
            uv: 3000,
            pv: 1398,
            amt: 2210,
        },
        {
            name: '25-40',
            uv: 2000,
            pv: 1800,
            amt: 2290,
        },
        {
            name: '40-65',
            uv: 2780,
            pv: 2908,
            amt: 2000,
        },
        {
            name: '65+',
            uv: 1890,
            pv: 3800,
            amt: 2181,
        },
    ];

    return (
        <Modal maxWidth="max-w-3xl" visible={isOpen} onClose={() => setIsOpen(false)}>
            <div className="flex flex-col items-center justify-center">
                {/* influencers thumbnail and info */}
                <div className="flex w-full justify-between">
                    <div className="mb-5 flex gap-3">
                        {/* TODO: make the influencer thumbnail reusable component */}
                        <div className="h-16 w-16 align-middle">
                            <img
                                className="h-full w-full rounded-full border border-gray-200 bg-gray-100 object-cover"
                                src=""
                                alt="@tomorrowTech"
                            />
                        </div>
                        <div>
                            <div className="text-base font-semibold text-gray-700">Adrianne Smalls</div>
                            <div className="flex">
                                <div className="text-sm text-primary-500 ">@</div>
                                <span className="text-sm text-gray-600">tomorrowTech</span>
                            </div>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-primary-50 bg-primary-100 font-semibold text-primary-600">
                            <div>86</div>
                        </div>
                    </div>

                    <div className="text-xs font-semibold text-gray-400 hover:cursor-pointer hover:text-primary-500">
                        Unlock Detailed Analysis Report
                    </div>
                </div>

                {/* stats info */}
                <div className="flex w-full gap-6">
                    <div className="w-1/2 px-3">
                        <div className="border-b border-gray-200 text-base font-semibold text-gray-700">Top Niches</div>
                        <div className="w-full">
                            <ResponsiveContainer width={320} height={280}>
                                <RadarChart outerRadius={90} cx="50%" cy="50%" data={dummyRadarGraphData}>
                                    <PolarGrid stroke="#e5e7eb" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                                    <PolarRadiusAxis tick={false} axisLine={false} />
                                    <Radar
                                        name="top_niches"
                                        dataKey="A"
                                        strokeWidth={2}
                                        stroke="#7C3AED" //text-primary-600
                                        fill="#DDD6FE" //text-primary-200
                                        fillOpacity={0.6}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="w-1/2">
                        <div className="border-b border-gray-200 text-base font-semibold text-gray-700">
                            Audience Engagement Stats
                        </div>
                        <div>stat cards</div>
                    </div>
                </div>

                <div className="flex w-full gap-6">
                    <div className="w-1/2 px-3">
                        <div className="border-b border-gray-200 text-base font-semibold text-gray-700">
                            Audience Gender
                        </div>
                        <div className="w-full">
                            <ResponsiveContainer width={320} height={100}>
                                <BarChart
                                    data={dummyBarChartData}
                                    margin={{
                                        top: 18,
                                        right: 6,
                                        left: 6,
                                        bottom: 6,
                                    }}
                                >
                                    <CartesianGrid vertical={false} horizontal={false} />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                    <YAxis tick={false} axisLine={false} />
                                    <Bar dataKey="pv" fill="#b2ccff" />
                                    <Bar dataKey="uv" fill="#fcceee" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="w-1/2">
                        <div className="border-b border-gray-200 text-base font-semibold text-gray-700">
                            Channel Stats
                        </div>
                        <div>stat cards</div>
                    </div>
                </div>

                {/* buttons */}
                <div className="mt-8 box-border flex w-full justify-center space-x-3 px-6 pt-6 font-semibold">
                    <Button variant="gray" className="w-1/2" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button className="boostbot-gradient w-1/2 border-none">Add to Sequence</Button>
                </div>
            </div>
        </Modal>
    );
};
