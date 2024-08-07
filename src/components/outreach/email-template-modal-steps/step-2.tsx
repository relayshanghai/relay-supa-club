/* eslint-disable react-hooks/exhaustive-deps */

import { Input } from 'src/components/input';
import { Switch } from 'shadcn/components/ui/switch';
import { Button } from 'src/components/button';
import { useTranslation } from 'react-i18next';
import { useEffect, useState, type FC } from 'react';
import { type ModalStepProps } from '../campaign-wizard-modal';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from 'shadcn/components/ui/dropdown-menu';
import { ChevronDown, Plus } from 'src/components/icons';
import { useProducts } from 'src/hooks/use-products';
import { type ProductEntity } from 'src/backend/database/product/product-entity';
import { type Nullable } from 'types/nullable';
import { CreateProductModal } from 'src/components/products/products-modal';

export const CampaignModalStepTwo: FC<ModalStepProps> = ({ onNextStep, onPrevStep }) => {
    const { t } = useTranslation();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Nullable<ProductEntity>>(null);
    const { getProducts, products } = useProducts();

    useEffect(() => {
        getProducts();
    }, []);

    return (
        <>
            <div className="flex h-full w-full justify-center" data-testid="step2-outreach-form">
                <div className="mt-20 inline-flex h-[366px] w-[512px] flex-col items-start justify-start rounded-2xl bg-white p-3 shadow">
                    <div className="inline-flex items-start justify-between self-stretch pl-6 pr-2 pt-6">
                        <div className="flex h-[30px] shrink grow basis-0 items-start justify-start gap-1">
                            <div className="text-center font-['Poppins'] text-xl font-semibold tracking-tight text-gray-600">
                                {t('outreaches.setupSequence')}
                            </div>
                        </div>
                    </div>
                    <div className="relative flex h-72 flex-col items-start justify-start gap-12 self-stretch px-6 pb-4 pt-5">
                        <div className="flex h-[164px] flex-col items-start justify-start gap-4 self-stretch">
                            <div className="flex h-[164px] flex-col items-start justify-start gap-4 self-stretch">
                                <div className="flex h-[164px] flex-col items-start justify-start gap-6 self-stretch">
                                    <div className="inline-flex items-start justify-center gap-6 self-stretch">
                                        <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                                            <Input
                                                label={t('outreaches.sequenceName')}
                                                type="text"
                                                value={''}
                                                onChange={() => null}
                                                placeholder={'eg. Mavic Pro 3 Black Friday Camping Niche'}
                                                data-testid="sequence-name-input"
                                            />
                                        </div>
                                    </div>
                                    <div className="inline-flex items-start justify-center gap-6 self-stretch">
                                        <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-2">
                                            <div className="text-sm font-medium text-gray-700">
                                                {t('outreaches.product')}
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger className="flex w-full">
                                                    <section className="flex w-full flex-shrink-0 flex-grow-0 items-center justify-between gap-3 rounded-lg border px-2 py-1 font-semibold shadow">
                                                        <span className="text-sm font-normal text-gray-400">
                                                            {selectedProduct ? selectedProduct.name : 'eg. Mavic Pro 3'}
                                                        </span>{' '}
                                                        <ChevronDown className="h-4 w-4 text-black" />
                                                    </section>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent className="w-[210px]">
                                                    {products?.items.map((d) => (
                                                        <DropdownMenuItem
                                                            key={d.id}
                                                            onSelect={() => {
                                                                setSelectedProduct(d);
                                                            }}
                                                            className="flex w-full"
                                                        >
                                                            {d.name}
                                                        </DropdownMenuItem>
                                                    ))}
                                                    <DropdownMenuItem
                                                        onSelect={() => {
                                                            setModalOpen(true);
                                                        }}
                                                        className="flex w-full cursor-pointer focus:bg-white"
                                                    >
                                                        <div className="inline-flex space-x-2 text-gray-400">
                                                            <Plus className="h-4 w-4" strokeWidth={2} />
                                                            <span className="">{t('outreaches.addNewProduct')}</span>
                                                        </div>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="inline-flex shrink grow basis-0 flex-col items-start justify-end gap-1">
                                            <div className="inline-flex items-start justify-start gap-1">
                                                <div className="font-['Poppins'] text-sm font-semibold leading-normal tracking-tight text-gray-500">
                                                    {t('outreaches.autoStart')}
                                                </div>
                                                <div className="relative h-3 w-3" />
                                            </div>
                                            <div className="inline-flex h-10 items-center justify-start gap-1 self-stretch">
                                                <Switch />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-4 right-4 flex justify-center space-x-2">
                            <Button
                                type="button"
                                variant="neutral"
                                className="inline-flex !p-2 text-sm !text-gray-400"
                                onClick={() => onPrevStep()}
                            >
                                {t('outreaches.back')}
                            </Button>
                            <Button
                                type="button"
                                variant="primary"
                                className="inline-flex items-center border-none !bg-pink-500 !p-2"
                                onClick={() => onNextStep()}
                            >
                                <span className="ml-1">{t('outreaches.saveAndContinue')}</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <CreateProductModal modalOpen={modalOpen} setModalOpen={(v) => setModalOpen(v)} />
        </>
    );
};
