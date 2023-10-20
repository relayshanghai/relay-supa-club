// import { useTranslation } from 'react-i18next';
// import { Button } from '../button';
// import type { ModalProps } from '../modal';
// import { Modal } from '../modal';
// import type { AccordionContent } from './accordion';
// import { Accordion } from './accordion';
// import { Cross } from '../icons';
// import { CloseHelpModal } from 'src/utils/analytics/events';
// import { useRudderstackTrack } from 'src/hooks/use-rudderstack';

// export interface DiscoveryFaqModalProps extends Omit<ModalProps, 'children'> {
//     content: AccordionContent[];
//     title: string;
//     description?: string | null;
//     getMoreInfoButtonText?: string;
//     source: string;
//     /** will close the modal and then call this */
//     getMoreInfoButtonAction?: () => void;
// }

// // // const { t } = useTranslation();

// // export const NeedHelpModal=({show, setShow}:NeedHelpModalProps)=>{
// //     const data =[['What topics should I search for?','Try to think of a word or topic that that is related to your product or the target audience you want to reach with your collab videos and type it in the search field.\n Once you input a word, look at the Topic Cloud on the right, and we ll display a bunch of related tags for you to add into your search.\n Large words are attached to more influencer profiles, and darker words are more closely related to your original topic.'],
// //     ['How can I get the best results?','Try searching with only 2-3 topics at a time, otherwise it s too difficult to find influencers that relate to all of your topics.\nUtilize the Topic Cloud to help you explore new combos.\n Make sure to set your filters properly as well:\na. Audience Geo >5% in a market you re trying to sell in. We recommend setting it this low because for countries other than the U.S. the number of users on the platforms is relatively small, so filtering for influencers with audiences primarily >10% or above in these countries will return relatively few results.\nb. Recent post less than 30 days means your influencer is active and posts regularly!\nc. Engagement rate is important but do not set it too high. >1% is the highest we recommend but we have had great success with influencers with lower engagement rates as well.'],
// //     ["What kind of influencers should I search for?","In our experience the influencers who get the best results are smaller profiles, that are focused an a particular niche, and have good engagement with their audiences.\n Larger influencers do not respond to collab offers as often as smaller ones, so you will have more effective outreach conversion too!\nThe influencer is just a way for you to reach and communicate with your target audience, so try exploring niches and topics that branch out from things directly related to your product but will still appeal to your target audience."],
// //     ["What filters should I use for YouTube?","We recommend the following settings:\nAudience Geo: 2-3 locations you want to sell in,>5\% \nSubscribers: 5k - 250k\nLast Post: 30 days\nIf you have specific gender or age requirements for your target audience, include those as well.\nWe recommend smaller channels on YouTube because these audiences are more engaged with the influencers the follow, and content created on YouTube exists forever! So even a small channel can accumulate a lot of engagement over time."],
// //     ["What filters should I use for Instagram and TikTok?","We recommend the following settings:\n Audience Geo: 2-3 locations you want to sell in, >15\%\nSubscribers: 50k - 1m\n Last Post: 30 days\nIf you have specific gender or age requirements for your target audience, include those as well.\nTikTok and Instagram influencers tend to have larger audiences that might not be as dedicated as YouTube but the chances of a viral post are much higher!"]
// // ];

// //         return (
// //         <div>
// //                <Modal
// //             maxWidth="max-w-2xl"
// //             visible={show}
// //             onClose={() => {
// //                 setShow(false);
// //             }}
// //             // title={t('Discovery FAQs') || ''}
// //             title='Discover FAQs'
// //             padding={10}
// //             >
// //                      <div className="flex w-full rounded-lg bg-primary-100 p-6">
// //                 <section className="flex flex-col gap-2">
// //                     <h2 className="w-full text-2xl text-primary-500">{title} </h2>

// //                 </section>
// //                 <button
// //                     data-testid="faq-modal-close-button"
// //                     className="ml-auto"
// //                     onClick={() => {
// //                         track(CloseHelpModal, {
// //                             type: 'FAQ',
// //                             modal_name: source,
// //                             method: 'X',
// //                         });
// //                         modalProps.onClose(false);
// //                     }}
// //                 >
// //                     <Cross className="h-6 w-6 fill-primary-500 " />
// //                 </button>
// //             </div>

// //                 <div>
// //                     {data.map((text) => (
// //                         <div className='p-2 border-b-2  pb-4 mt-4 prose whitespace-pre-line'>
// //                             <h2 className='mb-4 font-semibold'>Q: {text[0]}</h2>
// //                             {/* <p>A: {text[1]}</p> */}
// //                             <div>
// //                             {text[1].split('\n').map((line) => (
// //                                 <p className='mb-4'>{line}</p>
// //                             ))}
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>
// //                 <div className="flex w-full justify-end space-x-2 p-y-4">
// //                     <Button onClick={()=>setShow(false)}>
// //                            Back
// //                         {/* {t('filters.searchButton')} */}
// //                     </Button>
// //                     <Button onClick={()=>}>
// //                             Get more info about Discover
// //                         {/* {t('filters.searchButton')} */}
// //                     </Button>
// //                 </div>
// //             </Modal>
// //         </div>
// //     )
// // }
