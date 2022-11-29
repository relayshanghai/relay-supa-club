export default function CreatorIntroLoader() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center mb-6">
        <div className="rounded-full relative w-36 h-36 bg-gray-200 animate-pulse sm:mr-6 mb-6 sm:mb-0">
          {/* <div className="w-7 h-7 absolute right-1.5 bottom-1.5 bg-gray-200 animate-pulse rounded-full" /> */}
        </div>
        <div className="text-center sm:text-left">
          <div className="poppins font-bold text-4xl text-gray-800 h-10 w-24 bg-gray-200 animate-pulse mb-2" />
          <div className="text-sm text-primary-500 hover:text-primary-700 h-5 w-12 bg-gray-200 animate-pulse duration-300 cursor-pointer"></div>
        </div>
      </div>
      <div className="flex justify-center sm:justify-start text-right mt-4 sm:mt-0">
         <div className="flex items-center justify-center w-8 h-8 bg-gray-200 animate-pulse text-sm text-primary-500 duration-300 font-semibold rounded-lg mr-2 cursor-pointer">
        </div>
        <div className="flex items-center justify-center px-4 h-8 w-24 bg-gray-200 animate-pulse text-sm text-primary-500 font-semibold rounded-lg cursor-pointer duration-300"></div>
      </div>
    </div>
  )
}
