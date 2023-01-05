import { useContext } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../button';
import { Input } from '../input';
import { AccountContext } from './account-context';

export const CompanyDetails = () => {
    const {
        loading,
        companyValues,
        setCompanyFieldValues,
        setShowAddMoreMembers,
        profile,
        company,
        updateCompany
    } = useContext(AccountContext);
    return (
        <div className="flex flex-col items-start space-y-4 p-4 bg-white rounded-lg w-full lg:max-w-2xl">
            <div className="">Here you can change your Company account details.</div>
            <div className={`flex flex-row space-x-4 ${loading ? 'opacity-50' : ''}`}>
                <Input
                    label={'Company name'}
                    type="text"
                    value={companyValues.name}
                    required
                    onChange={(e: any) => {
                        setCompanyFieldValues('name', e.target.value);
                    }}
                />
                <Input
                    label={'Website'}
                    type="text"
                    value={companyValues.website}
                    placeholder="website address"
                    required
                    onChange={(e: any) => {
                        setCompanyFieldValues('website', e.target.value);
                    }}
                />
            </div>
            <div className="w-full">
                <div className="pb-4">Members</div>
                <div className="divide-y divide-grey-200">
                    {Array.isArray(company?.profiles)
                        ? company?.profiles.map((item: any) => {
                              return (
                                  <div
                                      key={item.id}
                                      className="flex flex-row space-x-8 items-center w-full py-2"
                                  >
                                      <div className="w-1/3">
                                          <div className="text-xs text-gray-500">Full name</div>
                                          {item.first_name}
                                          {` `}
                                          {item.last_name}
                                      </div>
                                      <div className="text-sm font-bold">
                                          <div className="text-xs font-normal text-gray-500">
                                              Role
                                          </div>
                                          {item.admin ? 'Admin' : 'Member'}
                                      </div>
                                  </div>
                              );
                          })
                        : null}
                </div>
                {Array.isArray(company?.invites) && company?.invites.length ? (
                    <>
                        <div className="text-sm pt-8 pb-2">Pending invitations</div>
                        {company?.invites.map((item: any) => {
                            return (
                                <div
                                    key={item.id}
                                    className="flex flex-row space-x-8 items-center border-t border-b border-grey-200 w-full py-2"
                                >
                                    <div className="">
                                        <div className="text-xs text-gray-500">Email</div>
                                        {item.email}
                                    </div>
                                </div>
                            );
                        })}
                    </>
                ) : null}
                <div className="pt-4">
                    {profile?.admin ? (
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowAddMoreMembers(true);
                            }}
                        >
                            Add more members
                        </Button>
                    ) : null}
                </div>
            </div>
            {profile?.admin ? (
                <div className="flex flex-row justify-end w-full">
                    <Button
                        onClick={async () => {
                            try {
                                await updateCompany({
                                    name: companyValues.name,
                                    website: companyValues.website
                                });
                                toast.success('Company profile updated');
                            } catch (e) {
                                toast.error('Ops, something went wrong.');
                            }
                        }}
                    >
                        Update Company
                    </Button>
                </div>
            ) : null}
        </div>
    );
};
