export default function RoundedTag({ handleSelect, key, label }) {
  return (
    <div onClick={() => handleSelect()} key={key} className="bg-white text-gray-600 hover:bg-primary-100 duration-300 cursor-pointer text-sm inline-block px-2.5 py-1 rounded-full mr-2 mb-2">
      <div className="text-sm ">
        { label }
      </div>
    </div>
  )
}
