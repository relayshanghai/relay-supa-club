import type { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import { Spinner } from './icons';

export interface Props extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    disabled?: boolean;
    tags: {
        value: string;
    }[];
    onTagRemove: (tag: string) => void;
    TagComponent?: React.FC<any>;
    spinnerLoading: boolean;
    setSpinnerLoading: (value: boolean) => void;
}
export const InputWithTags = ({ disabled, tags = [], onTagRemove, TagComponent, spinnerLoading, ...rest }: Props) => {
    return (
        <label className="flex w-full flex-col text-xs font-medium text-gray-500">
            <div className="flex w-full flex-row items-center rounded-md border border-gray-200 bg-white px-2 text-gray-900 ring-1 ring-gray-900 ring-opacity-5 focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm">
                <div className="my-2 flex h-6 space-x-2">
                    {tags
                        ? tags.map((item: any, i: any) => {
                              if (TagComponent) {
                                  return <TagComponent key={i} {...item} onClick={() => onTagRemove(item)} />;
                              }
                              return (
                                  <p
                                      className="flex cursor-pointer justify-center self-center whitespace-nowrap rounded bg-gray-100 px-2 text-gray-900 hover:bg-gray-200"
                                      key={i}
                                      onClick={() => onTagRemove(item)}
                                  >
                                      {item.value || item.title}
                                      <span
                                          className="ml-2 cursor-pointer whitespace-nowrap text-gray-400"
                                          id={`remove-tag-${item.value}`}
                                      >
                                          x
                                      </span>
                                  </p>
                              );
                          })
                        : null}
                </div>
                <input
                    disabled={disabled}
                    className="w-full appearance-none border border-transparent bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                    {...rest}
                />
                {spinnerLoading && <Spinner className="h-5 w-5 fill-primary-600 text-white" />}
            </div>
        </label>
    );
};
