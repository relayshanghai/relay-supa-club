
export default function CreatorCardSkeleton() {
  return (
    <div className="relative">
    <div className="group absolute top-3 right-3 flex items-center justify-center w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-100 duration-300 text-sm text-gray-500 font-semibold rounded-lg mr-2 cursor-pointer z-10 animate-pulse" />
    <div className="h-64 bg-white cursor-pointer duration-300 rounded-2xl p-4 relative">
      <div className="flex flex-col items-center">
        <div className="h-24 w-24 box-border mb-2 z-10 relative bg-gray-200 animate-pulse rounded-lg" />
        <div className="text-gray-600 font-semibold truncate animate-pulse bg-gray-200 h-4 mb-2 w-24" />
        <div className="text-sm bg-gray-200 h-4 mb-2 w-32 animate-pulse">
        </div>
        <div className="flex justify-evenly mt-6 w-full">
          <div className="flex flex-col items-center">
            <div className="text-gray-600 animate-pulse w-12 h-4 mb-2 bg-gray-200"></div>
            <div className="text-sm text-gray-600 animate-pulse w-24 h-4 mb-2 bg-gray-200"></div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-gray-600 animate-pulse w-12 h-4 mb-2 bg-gray-200"></div>
            <div className="text-sm text-gray-600 animate-pulse w-24 h-4 mb-2 bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
