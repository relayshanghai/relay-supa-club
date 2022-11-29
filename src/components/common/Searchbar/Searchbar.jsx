import Icon from '@/res/images/Icon';

export default function SearchBar({ query, handleSearch, placeholder }) {
  return (
    <div className="flex justify-between px-4 bg-white sm:w-96 h-10 rounded-lg mr-2">
      <input defaultValue={query} onChange={handleSearch} className="bg-white text-gray-600 text-sm border-unset-all w-4/5" type="text" placeholder={placeholder || 'Search here...'} />
      {/* <img className="w-5 hover:text-gray-600" src={MagnifierSvg} alt="search icon" /> */}
      <Icon name="magnifier" className="w-5 hover:text-gray-600" />
    </div>
  );
}
