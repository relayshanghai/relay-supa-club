export const InputWithTags = ({ label, tags = [], onTagRemove, ...rest }: any) => {
    return (
        <label className="flex flex-col text-xs text-gray-500 font-bold w-full">
            <div className="text-gray-900 ring-gray-900 ring-opacity-5 bg-white rounded-md block w-full border border-transparent shadow ring-1 sm:text-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none flex flex-row items-center px-2">
                <div className="flex space-x-2 my-2">
                    {tags
                        ? tags.map((item: any, i: any) => {
                              return (
                                  <div
                                      className="px-3 py-1 bg-white text-gray-900 rounded bg-gray-100 whitespace-nowrap hover:bg-gray-200 cursor-pointer"
                                      key={i}
                                      onClick={() => onTagRemove(item)}
                                  >
                                      {item.value || item.title}
                                  </div>
                              );
                          })
                        : null}
                </div>
                <input
                    className="w-full text-gray-900 placeholder-gray-400 appearance-none bg-white px-3 py-2 border border-transparent sm:text-sm focus:border-transparent focus:ring-0 focus:outline-none"
                    {...rest}
                />
            </div>
        </label>
    );
};
