import { type FC } from 'react';
import { Modal } from '../modal';
import { BillingPeriod, Currency, PriceType } from 'src/backend/database/plan/plan-entity';
import type { PlanEntity } from 'src/backend/database/plan/plan-entity';
import { Input } from '../input';
import Select from '../form/select';
import { enumToArray } from 'src/utils/enum';
import { Button } from '../button';
import { usePlans } from 'src/hooks/use-plans';
import toast from 'react-hot-toast';

type Props = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    planData: PlanEntity | null;
    setPlanData: (data: PlanEntity | null) => void;
};

export const PlansModal: FC<Props> = ({ isOpen, setIsOpen, planData, setPlanData }) => {
    const { createPlan, loading } = usePlans();
    const onOpenModal = (o: boolean) => {
        setIsOpen(o);
        setPlanData(null);
    };

    const handleCreatePlan = async () => {
        if (planData) {
            createPlan(planData).then(() => {
                toast.success(`Plan ${planData.id ? 'Updated' : 'Created'} successfully`);
            });
        }
    };

    return (
        <Modal maxWidth="max-w-4xl" visible={isOpen} onClose={() => onOpenModal(false)}>
            <div className="flex min-h-[300px] flex-col items-start justify-start gap-3 self-stretch p-6">
                <div className="inline-flex items-start justify-center gap-6 self-stretch">
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Item Name'}
                            type="text"
                            value={planData?.itemName}
                            onChange={(e) => setPlanData({ ...planData, itemName: e.target.value } as PlanEntity)}
                            placeholder={'Insert item name'}
                            data-testid="product-name-input"
                        />
                    </div>
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Select
                            onChange={(v) => setPlanData({ ...planData, priceType: v as PriceType } as PlanEntity)}
                            value={planData?.priceType as PriceType}
                            label={'Price Type'}
                            options={enumToArray(PriceType).map((v) => ({
                                value: v,
                                label: v.replace(/-/g, ' ').toUpperCase(),
                            }))}
                        />
                    </div>
                </div>
                <div className="inline-flex items-start justify-center gap-6 self-stretch">
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Select
                            onChange={(v) => setPlanData({ ...planData, currency: v as Currency } as PlanEntity)}
                            value={planData?.currency as Currency}
                            label={'Currency'}
                            options={enumToArray(Currency).map((v) => ({
                                value: v,
                                label: v.replace(/-/g, ' ').toUpperCase(),
                            }))}
                        />
                    </div>
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Select
                            onChange={(v) =>
                                setPlanData({ ...planData, billingPeriod: v as BillingPeriod } as PlanEntity)
                            }
                            value={planData?.billingPeriod as BillingPeriod}
                            label={'Billing Period'}
                            options={enumToArray(BillingPeriod).map((v) => ({
                                value: v,
                                label: v.replace(/-/g, ' ').toUpperCase(),
                            }))}
                        />
                    </div>
                </div>
                <div className="inline-flex items-start justify-center gap-6 self-stretch">
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Price'}
                            type="text"
                            value={planData?.price}
                            onChange={(e) => setPlanData({ ...planData, price: +e.target.value } as PlanEntity)}
                            placeholder={'Insert item name'}
                            data-testid="product-name-input"
                        />
                    </div>
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Price Id'}
                            type="text"
                            value={planData?.priceId}
                            onChange={(e) => setPlanData({ ...planData, priceId: e.target.value } as PlanEntity)}
                            placeholder={'Insert item name'}
                            data-testid="product-name-input"
                        />
                    </div>
                </div>
                <div className="inline-flex items-start justify-center gap-6 self-stretch">
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Original Price'}
                            type="text"
                            value={planData?.originalPrice}
                            onChange={(e) => setPlanData({ ...planData, originalPrice: +e.target.value } as PlanEntity)}
                            placeholder={'Insert item name'}
                            data-testid="product-name-input"
                        />
                    </div>
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Original Price Id'}
                            type="text"
                            value={planData?.originalPriceId}
                            onChange={(e) =>
                                setPlanData({ ...planData, originalPriceId: e.target.value } as PlanEntity)
                            }
                            placeholder={'Insert item name'}
                            data-testid="product-name-input"
                        />
                    </div>
                </div>
                <div className="inline-flex items-start justify-center gap-6 self-stretch">
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Existing User Price'}
                            type="text"
                            value={planData?.existingUserPrice}
                            onChange={(e) =>
                                setPlanData({ ...planData, existingUserPrice: +e.target.value } as PlanEntity)
                            }
                            placeholder={'Insert item name'}
                            data-testid="product-name-input"
                        />
                    </div>
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Existing User Price Id'}
                            type="text"
                            value={planData?.existingUserPriceId}
                            onChange={(e) =>
                                setPlanData({ ...planData, existingUserPriceId: e.target.value } as PlanEntity)
                            }
                            placeholder={'Insert item name'}
                            data-testid="product-name-input"
                        />
                    </div>
                </div>
                <div className="inline-flex items-start justify-center gap-6 self-stretch">
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Profiles'}
                            type="text"
                            value={planData?.profiles}
                            onChange={(e) => setPlanData({ ...planData, profiles: +e.target.value } as PlanEntity)}
                            placeholder={'Insert item name'}
                            data-testid="product-name-input"
                        />
                    </div>
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Searches'}
                            type="text"
                            value={planData?.searches}
                            onChange={(e) => setPlanData({ ...planData, searches: +e.target.value } as PlanEntity)}
                            placeholder={'Insert item name'}
                            data-testid="product-name-input"
                        />
                    </div>
                </div>
                <div className="inline-flex items-start justify-center gap-6 self-stretch">
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Exports'}
                            type="text"
                            value={planData?.exports}
                            onChange={(e) => setPlanData({ ...planData, exports: +e.target.value } as PlanEntity)}
                            placeholder={'Insert item name'}
                            data-testid="product-name-input"
                        />
                    </div>
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Select
                            onChange={(v) => setPlanData({ ...planData, isActive: v === 'active' } as PlanEntity)}
                            value={planData?.isActive ? 'active' : 'inactive'}
                            label={'Is Active'}
                            options={[
                                {
                                    value: 'active',
                                    label: 'Active',
                                },
                                {
                                    value: 'inactive',
                                    label: 'Inactive',
                                },
                            ]}
                        />
                    </div>
                </div>
                {/* submit button section */}
                <div className="flex h-[84px] flex-col items-end justify-center gap-6 self-stretch py-6">
                    <div className="inline-flex h-9 items-start justify-start gap-2">
                        <Button
                            type="button"
                            variant="neutral"
                            className="inline-flex !p-2 text-sm !text-gray-400"
                            onClick={() => onOpenModal(false)}
                            data-testid="back-button"
                        >
                            Back
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            className="inline-flex items-center border-none !bg-pink-500 !p-2"
                            data-testid="next-button"
                            onClick={() => handleCreatePlan()}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
