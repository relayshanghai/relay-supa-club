import React from 'react';

export default function ChannelCard() {
  return (
    <div className="flex items-center h-16 w-80 flex-shrink-0 bg-white rounded-xl mr-2 my-4 p-4 cursor-pointer">
      <div className="w-12 h-12 mr-4 rounded-full bg-gray-200 animate-pulse" />
      <div>
        <div className="bg-gray-200 font-semibold w-52 h-4 animate-pulse mb-1" />
        <div className="text-sm bg-gray-200 h-4 w-12 animate-pulse" />
      </div>
    </div>
  );
}
