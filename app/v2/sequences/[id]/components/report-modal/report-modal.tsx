import { Modal } from "app/components/modals";
import type { InfluencerSocialProfileEntity } from "src/backend/database/influencer/influencer-social-profile-entity";
import { AvatarWithFallback } from "../avatar/avatar-with-fallback";

export interface ReportModalProps {
    influencerSocialProfiles: InfluencerSocialProfileEntity;
    open: boolean;
}
export default function ReportModal({
    influencerSocialProfiles,
    open
}: ReportModalProps) {
    return (
        <Modal
          padding={0}
          visible={open}
          onClose={() => null}
        >
            <>
            <div className=" bg-[#fefefe] rounded-xl shadow flex-col justify-start items-center inline-flex">
              <div className="self-stretch h-24 bg-gradient-to-tr from-[#52379e] to-[#6840c6] flex-col justify-start items-center flex">
                <div className="self-stretch h-[84px] px-6 pt-6 flex-col justify-start items-start gap-4 flex">
                  <div className="self-stretch justify-between items-center inline-flex">
                    <div className="justify-start items-center gap-3 flex">
                      <div className="w-[60px] h-[60px] rounded-[200px] justify-center items-center flex">
                        <div className="w-[60px] h-[60px] relative opacity-10 rounded-[200px] border border-gray-800" />
                      </div>
                      <div className="flex-col justify-start items-start inline-flex">
                        <AvatarWithFallback
                          url={influencerSocialProfiles.avatarUrl}
                          name={influencerSocialProfiles.username}
                        />
                      </div>
                      <div className="self-stretch justify-start items-start gap-2.5 flex">
                        <div className="w-9 h-9 px-[11px] py-2.5 bg-[#fefefe] rounded-[28px] border-4 border-green-100 flex-col justify-center items-center gap-2.5 inline-flex">
                          <div className="w-[21px] h-[23px] text-center text-green-600 text-sm font-bold font-['Poppins'] leading-normal tracking-tight">86</div>
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch pr-3 flex-col justify-end items-center gap-1 inline-flex">
                      <div className="text-center text-gray-200 text-xs font-normal font-['Poppins'] leading-tight tracking-tight">Unlock detailed analysis report</div>
                    </div>
                  </div>
                </div>
                <div className="w-11 h-11 p-2 rounded-lg justify-center items-center inline-flex">
                  <div className="w-6 h-6 relative" />
                </div>
                <div className="self-stretch h-3" />
              </div>
              <div className="self-stretch pl-2 pr-6 py-2.5 justify-start items-start gap-6 inline-flex">
                <div className="flex-col justify-start items-start gap-6 inline-flex">
                  <div className="px-4 bg-[#fefefe] rounded flex-col justify-start items-start gap-1 flex">
                    <div className="self-stretch h-8 flex-col justify-start items-start gap-1 flex">
                      <div className="self-stretch text-gray-800 text-lg font-semibold font-['Poppins'] tracking-tight">Top Niches</div>
                      <div className="w-3 h-3 relative" />
                    </div>
                    <div className="bg-[#fefefe] justify-center items-center gap-4 inline-flex">
                      <div className="w-[302px] bg-[#fefefe] flex-col justify-start items-start gap-2.5 inline-flex">
                        <div className="self-stretch h-[280px] py-[5px] flex-col justify-start items-start gap-2.5 flex">
                          <div className="w-[302px] h-[271px] relative">
                            <div className="left-[117px] top-0 absolute text-center text-gray-400 text-xs font-medium font-['Poppins'] leading-tight tracking-tight">Productivity</div>
                            <div className="left-[244px] top-[43px] absolute text-center text-gray-400 text-xs font-medium font-['Poppins'] leading-tight tracking-tight">Fitness                 Routine</div>
                            <div className="left-[251px] top-[149px] absolute text-center text-gray-400 text-xs font-medium font-['Poppins'] leading-tight tracking-tight">Sports                 Training</div>
                            <div className="left-[174px] top-[251px] absolute text-center text-gray-400 text-xs font-medium font-['Poppins'] leading-tight tracking-tight">Theraputics</div>
                            <div className="left-[73px] top-[247px] absolute text-center text-gray-400 text-xs font-medium font-['Poppins'] leading-tight tracking-tight">Yoga</div>
                            <div className="left-0 top-[154px] absolute text-center text-gray-400 text-xs font-medium font-['Poppins'] leading-tight tracking-tight">Wellness</div>
                            <div className="left-[2px] top-[28px] absolute text-center text-gray-400 text-xs font-medium font-['Poppins'] leading-tight tracking-tight">Injury                 Recovery</div>
                            <div className="w-[117.95px] h-[137.59px] left-[108px] top-[44px] absolute" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="self-stretch h-[190px] px-4 py-3 bg-[#fefefe] flex-col justify-start items-start gap-3 flex">
                    <div className="self-stretch h-8 flex-col justify-start items-start gap-1 flex">
                      <div className="self-stretch text-gray-800 text-lg font-semibold font-['Poppins'] tracking-tight">Audience Gender</div>
                      <div className="w-3 h-3 relative" />
                    </div>
                    <div className="h-[122px] flex-col justify-end items-start gap-0.5 flex">
                      <div className="self-stretch px-1.5 justify-between items-end inline-flex">
                        <div className="justify-start items-end gap-0.5 flex" />
                        <div className="justify-start items-end gap-0.5 flex" />
                        <div className="justify-start items-end gap-0.5 flex" />
                        <div className="justify-start items-end gap-0.5 flex" />
                        <div className="justify-start items-end gap-0.5 flex" />
                      </div>
                      <div className="w-[270px] pl-2 pr-3 justify-between items-end inline-flex">
                        <div className="text-right text-gray-600 text-[10px] font-medium font-['Poppins'] leading-tight tracking-tight">13-17</div>
                        <div className="text-right text-gray-600 text-[10px] font-medium font-['Poppins'] leading-tight tracking-tight">18-24</div>
                        <div className="text-right text-gray-600 text-[10px] font-medium font-['Poppins'] leading-tight tracking-tight">25-40</div>
                        <div className="text-right text-gray-600 text-[10px] font-medium font-['Poppins'] leading-tight tracking-tight">40-65</div>
                        <div className="text-gray-600 text-[10px] font-medium font-['Poppins'] leading-tight tracking-tight">65+</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start gap-8 inline-flex">
                  <div className="self-stretch h-[306px] flex-col justify-start items-start gap-3 flex">
                    <div className="self-stretch h-8 flex-col justify-start items-start gap-1 flex">
                      <div className="self-stretch text-gray-800 text-lg font-semibold font-['Poppins'] tracking-tight">Audience Engagement Stats</div>
                    </div>
                    <div className="self-stretch h-[125px] p-6 bg-[#fefefe] rounded-xl shadow border border-gray-200 flex-col justify-start items-start gap-2 flex">
                      <div />
                      <div className="self-stretch text-gray-600 text-sm font-medium font-['Poppins'] leading-normal tracking-tight">Audience Engagement Rate</div>
                      <div className="self-stretch justify-start items-end gap-4 inline-flex">
                        <div className="grow shrink basis-0 text-gray-800 text-3xl font-medium font-['Poppins'] tracking-tight">8%</div>
                        <div className="pb-2 justify-start items-start flex">
                          <div className="w-8 h-8 p-2 bg-yellow-100 rounded-[28px] border-4 border-yellow-50 justify-center items-center flex">
                            <div className="w-4 h-4 relative flex-col justify-start items-start flex" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-3 h-3 relative" />
                    <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
                      <div className="grow shrink basis-0 p-6 bg-[#fefefe] rounded-xl shadow border border-gray-200 flex-col justify-start items-start gap-2 inline-flex">
                        <div />
                        <div className="text-gray-600 text-sm font-medium font-['Poppins'] leading-normal tracking-tight">Followers</div>
                        <div className="self-stretch justify-start items-end gap-3 inline-flex">
                          <div className="grow shrink basis-0 text-gray-800 text-3xl font-medium font-['Poppins'] tracking-tight">48k</div>
                        </div>
                      </div>
                      <div className="grow shrink basis-0 p-6 bg-[#fefefe] rounded-xl shadow border border-gray-200 flex-col justify-start items-start gap-2 inline-flex">
                        <div />
                        <div className="self-stretch text-gray-600 text-sm font-medium font-['Poppins'] leading-normal tracking-tight">Avg. Views</div>
                        <div className="self-stretch justify-start items-end gap-3 inline-flex">
                          <div className="grow shrink basis-0 text-gray-800 text-3xl font-medium font-['Poppins'] tracking-tight">555k</div>
                          <div className="pb-2 justify-start items-start flex">
                            <div className="w-8 h-8 p-2 bg-green-100 rounded-[28px] border-4 border-green-50 justify-center items-center flex">
                              <div className="w-4 h-4 relative flex-col justify-start items-start flex" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-3 h-3 relative" />
                    </div>
                  </div>
                  <div className="self-stretch h-[167px] flex-col justify-start items-start gap-2.5 flex">
                    <div className="self-stretch h-8 flex-col justify-start items-start gap-1 flex">
                      <div className="self-stretch text-gray-800 text-lg font-semibold font-['Poppins'] tracking-tight">Channel Stats</div>
                    </div>
                    <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
                      <div className="grow shrink basis-0 p-6 bg-[#fefefe] rounded-xl shadow border border-gray-200 flex-col justify-start items-start gap-2 inline-flex">
                        <div />
                        <div className="self-stretch text-gray-600 text-sm font-medium font-['Poppins'] leading-normal tracking-tight">Follower Growth</div>
                        <div className="self-stretch justify-start items-end gap-3 inline-flex">
                          <div className="grow shrink basis-0 text-gray-800 text-3xl font-medium font-['Poppins'] tracking-tight">4%</div>
                          <div className="pb-2 justify-start items-start flex">
                            <div className="w-8 h-8 p-2 bg-green-100 rounded-[28px] border-4 border-green-50 justify-center items-center flex">
                              <div className="w-4 h-4 relative flex-col justify-start items-start flex" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-3 h-3 relative" />
                      <div className="grow shrink basis-0 p-6 bg-[#fefefe] rounded-xl shadow border border-gray-200 flex-col justify-start items-start gap-2 inline-flex">
                        <div />
                        <div className="self-stretch text-gray-600 text-sm font-medium font-['Poppins'] leading-normal tracking-tight">Total Posts</div>
                        <div className="self-stretch justify-start items-end gap-3 inline-flex">
                          <div className="grow shrink basis-0 text-gray-800 text-3xl font-medium font-['Poppins'] tracking-tight">232</div>
                          <div className="pb-2 justify-start items-start flex">
                            <div className="w-8 h-8 p-2 bg-green-100 rounded-[28px] border-4 border-green-50 justify-center items-center flex">
                              <div className="w-4 h-4 relative flex-col justify-start items-start flex" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch h-[76px] pt-3 flex-col justify-start items-start flex">
                <div className="self-stretch px-6 pb-6 justify-end items-start gap-3 inline-flex">
                  <div className="h-10 px-3.5 py-2 bg-[#f53d86] rounded-lg shadow justify-center items-center gap-1 flex">
                    <div className="px-0.5 justify-center items-center flex">
                      <div className="text-[#fefefe] text-sm font-semibold font-['Poppins'] leading-normal tracking-tight">Add to Sequence</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </>
        </Modal>
    )
}