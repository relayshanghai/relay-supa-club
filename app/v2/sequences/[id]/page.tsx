'use client'

import LightningIcon from "app/components/icons/lightning"
import ToolsIcon from "app/components/icons/tools"

export interface SequenceDetailPageProps {
    params: {
        id: string
    }
}

export default function SequenceDetailPage( { params: { id } }: SequenceDetailPageProps) {
    return <div className="px-8 pt-8 pb-4 flex-col justify-start items-start gap-8 inline-flex w-full">
        <div className="h-[45px] justify-start items-start gap-6 inline-flex w-full">
            <div className="grow shrink basis-0 h-[45px] justify-start items-center gap-6 flex">
                <div className="justify-start items-center gap-1 flex">
                <div className="text-gray-600 text-3xl font-semibold font-['Poppins'] tracking-tight">Xiaomi CES Campaign</div>
                </div>
                <div className="justify-start items-start flex">
                {/* 
                    to do auto schedule toogle
                    <div className="justify-start items-start flex">
                    <div className="justify-start items-center gap-4 flex">
                    <div className="p-0.5 bg-violet-400 rounded-[999px] justify-start items-start flex">
                        <div className="w-6 h-6 rounded-[999px] shadow" />
                        <div className="w-6 h-6 bg-[#fefefe] rounded-[999px]" />
                    </div>
                    <div className="text-gray-500 text-sm font-semibold font-['Poppins'] leading-normal tracking-tight">Auto-schedule</div>
                    </div>
                </div> */}
                <div className="w-3 h-3 relative" />
                </div>
            </div>
            <div className="justify-end items-start gap-6 flex">
                <button className="px-5 py-2 bg-[#eef5ff] rounded-md justify-start items-center gap-2 flex">
                    <ToolsIcon fill="none"/>
                    <button className="text-center text-[#2970ff] text-sm font-medium font-['Poppins'] leading-normal tracking-tight">Edit campaign</button>
                </button>
                <button className="px-5 py-2 bg-[#fefefe] rounded-md border border-violet-600 justify-start items-center gap-2 flex">
                    <LightningIcon fill="none" />
                    <div className="text-center text-violet-600 text-sm font-medium font-['Poppins'] leading-normal tracking-tight">Campaigns template variables</div>
                </button>
            </div>
        </div>
    </div>
}