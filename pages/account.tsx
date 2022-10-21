import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from 'src/components/button';
import { Input } from 'src/components/input';
import { Layout } from 'src/components/layout';
import { useCompany } from 'src/hooks/use-company';
import { useFields } from 'src/hooks/use-fields';
import { useSubscription } from 'src/hooks/use-subscription';
import { useUser } from 'src/hooks/use-user';
import { format } from 'date-fns';
import { Modal } from 'src/components/modal';

const Page = () => {
    const { profile, user, loading, updateProfile } = useUser();
    const [confirmModal, setShowConfirmModal] = useState<any>();
    const [inviteEmail, setInviteEmail] = useState<any>();
    const [showAddMoreMembers, setShowAddMoreMembers] = useState<any>(false);
    const {
        values: { firstName, lastName, email },
        setFieldValue,
        reset
    } = useFields({
        firstName: '',
        lastName: '',
        email: ''
    });
    const {
        values: companyValues,
        setFieldValue: setCompanyFieldValue,
        reset: resetCompanyValues
    } = useFields({
        name: '',
        website: ''
    });
    const { company, updateCompany, createInvite } = useCompany();
    const { subscription, plans, createSubscriptions } = useSubscription();

    useEffect(() => {
        if (!loading && profile) {
            reset({
                firstName: profile.first_name,
                lastName: profile.last_name,
                email: user?.email
            });
        }
    }, [loading, profile, user, reset]);

    useEffect(() => {
        if (company) {
            resetCompanyValues({ ...company });
        }
    }, [company, resetCompanyValues]);

    return (
        <Layout>
            <div className="flex flex-col p-6 space-y-6">
                <div className="text-lg font-bold">Account</div>
                <div className="flex flex-col items-start space-y-4 p-4 bg-white rounded-lg max-w-lg">
                    <div className="">Here you can change your personal account details.</div>
                    <div className={`w-full ${loading ? 'opacity-50' : ''}`}>
                        <Input
                            label={'First Name'}
                            type="first_name"
                            placeholder="Enter your first name"
                            value={firstName}
                            required
                            onChange={(e: any) => {
                                setFieldValue('firstName', e.target.value);
                            }}
                        />
                        <Input
                            label={'Last Name'}
                            type="last_name"
                            placeholder="Enter your last name"
                            value={lastName}
                            required
                            onChange={(e: any) => {
                                setFieldValue('lastName', e.target.value);
                            }}
                        />
                        <Input
                            label={'Email'}
                            type="email"
                            placeholder="hello@relay.club"
                            value={email}
                            required
                            onChange={(e: any) => {
                                setFieldValue('email', e.target.value);
                            }}
                        />
                    </div>
                    <div className="flex flex-row justify-end w-full">
                        <Button
                            disabled={loading}
                            onClick={async () => {
                                try {
                                    await updateProfile({
                                        first_name: firstName,
                                        last_name: lastName,
                                        email: email
                                    });
                                    toast.success('Profile updated');
                                } catch (e) {
                                    toast.error('Ops, something went wrong.');
                                }
                            }}
                        >
                            Update
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col items-start space-y-4 p-4 bg-white rounded-lg max-w-lg">
                    <div className="">Here you can change your Company account details.</div>
                    <div className={`flex flex-row space-x-4 ${loading ? 'opacity-50' : ''}`}>
                        <Input
                            label={'Company name'}
                            type="text"
                            value={companyValues.name}
                            required
                            onChange={(e: any) => {
                                setCompanyFieldValue('name', e.target.value);
                            }}
                        />
                        <Input
                            label={'Website'}
                            type="text"
                            value={companyValues.website}
                            placeholder="website address"
                            required
                            onChange={(e: any) => {
                                setCompanyFieldValue('website', e.target.value);
                            }}
                        />
                    </div>
                    <div className="w-full">
                        <div className="pb-4">Members</div>
                        <div className="divide-y divide-grey-200">
                            {Array.isArray(company?.profiles)
                                ? company.profiles.map((item: any) => {
                                      return (
                                          <div
                                              key={item.id}
                                              className="flex flex-row space-x-8 items-center w-full py-2"
                                          >
                                              <div className="w-1/3">
                                                  <div className="text-xs text-gray-500">
                                                      Full name
                                                  </div>
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
                        {Array.isArray(company?.invites) && company.invites.length ? (
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
                                    type="secondary"
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
                <div className="flex flex-col items-start space-y-4 p-4 bg-white rounded-lg max-w-lg">
                    <div className="">Subscription</div>
                    <div className={`flex flex-row space-x-4 ${loading ? 'opacity-50' : ''}`}>
                        {subscription ? (
                            <div className="flex flex-col space-y-2">
                                <div className="flex flex-row space-x-8">
                                    <div className="text-sm font-bold">
                                        <div className="text-xs text-gray-500 font-normal">
                                            Name
                                        </div>
                                        {subscription.plans.name}
                                    </div>
                                    <div className="text-sm font-bold">
                                        <div className="text-xs text-gray-500 font-normal">
                                            Price
                                        </div>
                                        ${subscription.plans.value} monthly
                                    </div>
                                    <div className="text-sm font-bold">
                                        <div className="text-xs text-gray-500 font-normal">
                                            Amount
                                        </div>
                                        {subscription.plans.amount} KOLs / search
                                    </div>
                                    <div className="text-sm font-bold">
                                        <div className="text-xs text-gray-500 font-normal">
                                            Until
                                        </div>
                                        {format(new Date(subscription.expire_at), 'MMMM e, Y')}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm py-2 text-gray-500">
                                You have no active subscription. Please purchase one below.
                            </div>
                        )}
                    </div>
                    <div className="w-full pt-8 divide-y divide-gray-200">
                        <div className="pb-4">Available plans</div>
                        {Array.isArray(plans)
                            ? plans.map((item: any, i: any) => {
                                  return (
                                      <div
                                          key={item.id}
                                          className="flex flex-row space-x-2 items-center justify-between w-full py-2"
                                      >
                                          <div className="text-sm font-bold w-1/6">
                                              {i === 0 ? (
                                                  <div className="text-xs text-gray-500 font-normal">
                                                      Name
                                                  </div>
                                              ) : null}
                                              {item.name}
                                          </div>
                                          <div className="text-sm font-bold w-1/6">
                                              {i === 0 ? (
                                                  <div className="text-xs text-gray-500 font-normal">
                                                      Price
                                                  </div>
                                              ) : null}
                                              ${item.value}
                                          </div>
                                          <div className="text-sm font-bold w-1/4">
                                              {i === 0 ? (
                                                  <div className="text-xs text-gray-500 font-normal">
                                                      KOLs / search
                                                  </div>
                                              ) : null}
                                              {item.amount}
                                          </div>
                                          {profile?.admin ? (
                                              <div className="text-sm font-bold w-2/6 flex flex-row justify-end">
                                                  <Button
                                                      disabled={item.id === subscription?.plan_id}
                                                      onClick={async () => {
                                                          setShowConfirmModal(item);
                                                      }}
                                                  >
                                                      Purchase for ${item.value}
                                                  </Button>
                                              </div>
                                          ) : null}
                                      </div>
                                  );
                              })
                            : null}
                    </div>
                </div>
            </div>
            <Modal
                title={'Confirm purchase'}
                visible={!!confirmModal}
                onClose={() => {
                    setShowConfirmModal(undefined);
                }}
            >
                <div className="py-4">You are about to purchase the plan below:</div>
                <div className="flex flex-row space-x-2 items-center justify-between border-t border-grey-200 w-full py-2">
                    <div className="text-sm font-bold w-1/6">
                        <div className="text-xs text-gray-500 font-normal">Name</div>
                        {confirmModal?.name}
                    </div>
                    <div className="text-sm font-bold w-1/6">
                        <div className="text-xs text-gray-500 font-normal">Price</div>$
                        {confirmModal?.value}
                    </div>
                    <div className="text-sm font-bold w-1/4">
                        <div className="text-xs text-gray-500 font-normal">KOLs / search</div>
                        {confirmModal?.amount}
                    </div>
                </div>
                <div className="pt-8 space-x-16 justify-center flex flex-row w-full">
                    <Button
                        onClick={async () => {
                            try {
                                createSubscriptions(confirmModal.id);
                                setShowConfirmModal(undefined);
                                toast.success('Subscription purchased');
                            } catch (e) {
                                toast.error('Ops, something went wrong');
                            }
                        }}
                    >
                        Confirm
                    </Button>
                    <Button
                        type="secondary"
                        onClick={async () => {
                            setShowConfirmModal(undefined);
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </Modal>
            <Modal
                title={'Invite members'}
                visible={!!showAddMoreMembers}
                onClose={() => {
                    setShowAddMoreMembers(false);
                }}
            >
                <div className="py-4">Invite more members to your company</div>
                <div>
                    <Input
                        type="email"
                        placeholder="Type here the email address"
                        label="Email address"
                        value={inviteEmail}
                        required
                        onChange={(e: any) => {
                            setInviteEmail(e.target.value);
                        }}
                    />
                </div>
                <div className="pt-8 space-x-16 justify-center flex flex-row w-full">
                    <Button
                        disabled={!inviteEmail}
                        onClick={async () => {
                            await createInvite(inviteEmail);
                            setInviteEmail('');
                            setShowAddMoreMembers(false);
                            toast.success('Invite sent');
                        }}
                    >
                        Send invitation
                    </Button>
                    <Button
                        type="secondary"
                        onClick={async () => {
                            setShowAddMoreMembers(false);
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </Modal>
        </Layout>
    );
};

export default Page;
