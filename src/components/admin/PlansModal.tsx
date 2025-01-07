import { type FC } from 'react';
import { Modal } from '../modal';
import { BillingPeriod, Currency, PriceType } from 'src/backend/database/plan/plan-entity';
import { Input } from '../input';
import Select from '../form/select';
import { enumToArray } from 'src/utils/enum';
import { Button } from '../button';
import { initialPlanData, usePlans } from 'src/hooks/use-plans';
import { type PlanSummary, type PlanDetail } from 'types/plans';

type Props = {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    planData: PlanSummary | null;
    setPlanData: (data: PlanSummary) => void;
};

export const PlansModal: FC<Props> = ({ isOpen, setIsOpen, planData, setPlanData }) => {
    const { createPlan, loading } = usePlans();
    const onOpenModal = (o: boolean) => {
        setIsOpen(o);
        setPlanData(initialPlanData);
    };

    const handleCreatePlan = async () => {
        if (planData) {
            createPlan(planData)
                .then(() => {
                    setIsOpen(false);
                })
                .catch(() => null);
        }
    };

    const onDetailChange = (currency: Currency, key: keyof PlanDetail, value: PlanDetail[keyof PlanDetail]) => {
        const planDetails = planData?.details.length
            ? planData.details
            : [{ currency: Currency.CNY } as PlanDetail, { currency: Currency.USD } as PlanDetail];
        const detailIndex = currency === Currency.CNY ? 0 : 1;
        planDetails[detailIndex] = { ...planDetails[detailIndex], [key]: value };
        setPlanData({ ...planData, details: planDetails } as PlanSummary);
    };

    return (
        <Modal maxWidth="max-w-4xl" visible={isOpen} onClose={() => onOpenModal(false)}>
            <></>
            <div className="flex min-h-[300px] flex-col items-start justify-start gap-3 self-stretch p-6">
                <div className="inline-flex items-start justify-center gap-6 self-stretch">
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Item Name'}
                            type="text"
                            value={planData?.itemName}
                            onChange={(e) => setPlanData({ ...planData, itemName: e.target.value } as PlanSummary)}
                            placeholder={'20 Credits'}
                            data-testid="product-name-input"
                        />
                    </div>
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Select
                            onChange={(v) => setPlanData({ ...planData, priceType: v as PriceType } as PlanSummary)}
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
                            onChange={(v) =>
                                setPlanData({ ...planData, billingPeriod: v as BillingPeriod } as PlanSummary)
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
                            label={'Profile Credit Amount'}
                            type="number"
                            value={planData?.profiles === 0 ? '' : planData?.profiles}
                            onChange={(e) => setPlanData({ ...planData, profiles: +e.target.value } as PlanSummary)}
                            placeholder={'100'}
                            data-testid="product-name-input"
                        />
                    </div>
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Search Credit Amount'}
                            type="number"
                            value={planData?.searches === 0 ? '' : planData?.searches}
                            onChange={(e) => setPlanData({ ...planData, searches: +e.target.value } as PlanSummary)}
                            placeholder={'200'}
                            data-testid="product-name-input"
                        />
                    </div>
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Export Credit Amount'}
                            type="number"
                            value={planData?.exports === 0 ? '' : planData?.exports}
                            onChange={(e) => setPlanData({ ...planData, exports: +e.target.value } as PlanSummary)}
                            placeholder={'50'}
                            data-testid="product-name-input"
                        />
                    </div>
                </div>
                <div className="inline-flex items-start justify-center gap-6 self-stretch">
                    <div className="inline-flex shrink grow-[0.4] basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Price (CNY)'}
                            type="text"
                            value={planData?.details?.[0]?.price}
                            onChange={(e) => onDetailChange(Currency.CNY, 'price', +e.target.value)}
                            placeholder={'100'}
                            data-testid="product-name-input"
                        />
                    </div>
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Price ID (CNY)'}
                            type="text"
                            value={planData?.details?.[0]?.priceId}
                            onChange={(e) => onDetailChange(Currency.CNY, 'priceId', e.target.value)}
                            placeholder={'price_abcdefghijklmnopqrstuvwxyz'}
                            data-testid="product-name-input"
                        />
                    </div>
                    <div className="inline-flex shrink grow-[0.4] basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Price (USD)'}
                            type="text"
                            value={planData?.details?.[1]?.price}
                            onChange={(e) => onDetailChange(Currency.USD, 'price', +e.target.value)}
                            placeholder={'100'}
                            data-testid="product-name-input"
                        />
                    </div>
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Price ID (USD)'}
                            type="text"
                            value={planData?.details?.[1]?.priceId}
                            onChange={(e) => onDetailChange(Currency.USD, 'priceId', e.target.value)}
                            placeholder={'price_abcdefghijklmnopqrstuvwxyz'}
                            data-testid="product-name-input"
                        />
                    </div>
                </div>
                <div className="inline-flex items-start justify-center gap-6 self-stretch">
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Original Price (CNY)'}
                            type="text"
                            value={planData?.details?.[0]?.originalPrice ?? ''}
                            onChange={(e) => onDetailChange(Currency.CNY, 'originalPrice', +e.target.value)}
                            placeholder={'100'}
                            data-testid="product-name-input"
                        />
                    </div>
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Original Price ID (CNY)'}
                            type="text"
                            value={planData?.details?.[0]?.originalPriceId ?? ''}
                            onChange={(e) => onDetailChange(Currency.CNY, 'originalPriceId', e.target.value)}
                            placeholder={'price_abcdefghijklmnopqrstuvwxyz'}
                            data-testid="product-name-input"
                        />
                    </div>
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Original Price (USD)'}
                            type="text"
                            value={planData?.details?.[1]?.originalPrice ?? ''}
                            onChange={(e) => onDetailChange(Currency.USD, 'originalPrice', +e.target.value)}
                            placeholder={'100'}
                            data-testid="product-name-input"
                        />
                    </div>
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'Original Price ID (USD)'}
                            type="text"
                            value={planData?.details?.[1]?.originalPriceId ?? ''}
                            onChange={(e) => onDetailChange(Currency.USD, 'originalPriceId', e.target.value)}
                            placeholder={'price_abcdefghijklmnopqrstuvwxyz'}
                            data-testid="product-name-input"
                        />
                    </div>
                </div>
                <div className="inline-flex items-start justify-center gap-6 self-stretch">
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'User Price (CNY)'}
                            type="text"
                            value={planData?.details?.[0]?.originalPrice ?? ''}
                            onChange={(e) => onDetailChange(Currency.CNY, 'originalPrice', +e.target.value)}
                            placeholder={'100'}
                            data-testid="product-name-input"
                        />
                    </div>
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'User Price ID (CNY)'}
                            type="text"
                            value={planData?.details?.[0]?.originalPriceId ?? ''}
                            onChange={(e) => onDetailChange(Currency.CNY, 'originalPriceId', e.target.value)}
                            placeholder={'price_abcdefghijklmnopqrstuvwxyz'}
                            data-testid="product-name-input"
                        />
                    </div>
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'User Price (USD)'}
                            type="text"
                            value={planData?.details?.[1]?.existingUserPrice ?? ''}
                            onChange={(e) => onDetailChange(Currency.USD, 'existingUserPrice', +e.target.value)}
                            placeholder={'100'}
                            data-testid="product-name-input"
                        />
                    </div>
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Input
                            noBottomMargin
                            label={'User Price ID (USD)'}
                            type="text"
                            value={planData?.details?.[1]?.originalPriceId ?? ''}
                            onChange={(e) => onDetailChange(Currency.USD, 'originalPriceId', e.target.value)}
                            placeholder={'price_abcdefghijklmnopqrstuvwxyz'}
                            data-testid="product-name-input"
                        />
                    </div>
                </div>
                <div className="inline-flex items-start justify-center gap-6 self-stretch">
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <Select
                            onChange={(v) => {
                                onDetailChange(Currency.CNY, 'isActive', v === 'active');
                                onDetailChange(Currency.USD, 'isActive', v === 'active');
                            }}
                            value={planData?.details?.[0]?.isActive ? 'active' : 'inactive'}
                            label={'Status'}
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
