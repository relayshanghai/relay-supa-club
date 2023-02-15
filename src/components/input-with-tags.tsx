import { DetailedHTMLProps, InputHTMLAttributes } from 'react';

export interface Props
    extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    disabled?: boolean;
    tags: string[];
    onTagRemove: (tag: string) => void;
    TagComponent?: React.FC<any>;
}
export const InputWithTags = ({
    disabled,
    tags = [],
    onTagRemove,
    TagComponent,
    ...rest
}: Props) => {
    return (
        <label className="flex flex-col text-xs text-gray-500 font-medium w-full">
            <div className="text-gray-900 ring-gray-900 ring-opacity-5 bg-white rounded-md w-full border border-transparent shadow ring-1 sm:text-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none flex flex-row items-center px-2">
                <div className="flex space-x-2 my-2 h-6">
                    {tags
                        ? tags.map((item: any, i: any) => {
                              if (TagComponent) {
                                  return (
                                      <TagComponent
                                          key={i}
                                          {...item}
                                          onClick={() => onTagRemove(item)}
                                      />
                                  );
                              }
                              return (
                                  <p
                                      className="px-2 text-gray-900 rounded bg-gray-100 whitespace-nowrap hover:bg-gray-200 cursor-pointer flex justify-center self-center"
                                      key={i}
                                      onClick={() => onTagRemove(item)}
                                  >
                                      {item.value || item.title}
                                      <p className="ml-2 text-gray-400 whitespace-nowrap cursor-pointer">
                                          x
                                      </p>
                                  </p>
                              );
                          })
                        : null}
                </div>
                <input
                    disabled={disabled}
                    className="w-full text-gray-900 placeholder-gray-400 appearance-none bg-white px-3 py-2 border border-transparent sm:text-sm focus:border-transparent focus:ring-0 focus:outline-none"
                    {...rest}
                />
            </div>
        </label>
    );
};
