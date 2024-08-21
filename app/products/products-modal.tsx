import { useEffect, type FC } from 'react';
import { Cross } from '../components/icons';
import { useTranslation } from 'react-i18next';
import { type CreateProductPayload, useProducts } from 'src/hooks/use-products';
import { type ProductEntity } from 'src/backend/database/product/product-entity';
import { Modal } from 'app/components/modals';
import { Input } from 'app/components/inputs';
import { Button } from 'app/components/buttons';
import { useDriverV2 } from 'src/hooks/use-driver-v2';
import toast from 'react-hot-toast';

export type ModalProductProps = {
    modalOpen: boolean;
    setModalOpen: (visible: boolean) => void;
};

export const CreateProductModal: FC<ModalProductProps> = ({ modalOpen, setModalOpen }) => {
    const { t } = useTranslation();
    const initValue: CreateProductPayload = {
        name: '',
        price: 0,
        description: '',
        shopUrl: '',
        currency: '',
    };
    const { createProduct, updateProduct, getProducts, product, setProduct, loading } = useProducts();

    const handleCreateProduct = async () => {
        const isUpdate = !!product.id;
        let action = null;
        if (isUpdate) {
            action = updateProduct(product.id, product as unknown as CreateProductPayload);
        } else {
            action = createProduct(product as unknown as CreateProductPayload);
        }
        action
            .then(() => {
                getProducts();
                setProduct(initValue as unknown as ProductEntity);
                setModalOpen(false);
                toast.success('Product saved successfully');
            })
            .catch(() => {
                toast.error('Failed to save product');
            });
    };

    const { startTour, guidesReady } = useDriverV2();

    useEffect(() => {
        if (modalOpen && guidesReady) {
            startTour('productForm', false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guidesReady, modalOpen]);

    return (
        <Modal visible={modalOpen} onClose={() => null} padding={0} maxWidth="!w-[512px]">
            <div
                className="relative inline-flex h-[482px] w-[512px] flex-col items-start justify-start rounded-lg bg-violet-50"
                id="product-form-modal"
            >
                <div className="absolute right-2 top-2 z-10 h-6 w-6 cursor-pointer" onClick={() => setModalOpen(false)}>
                    <Cross className="flex h-6 w-6 fill-gray-400 stroke-white" />
                </div>

                {/* title section */}
                <div className="inline-flex items-start justify-between self-stretch pl-6 pr-2 pt-6">
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <div className="inline-flex items-start justify-start gap-1">
                            <div className="text-center font-['Poppins'] text-xl font-semibold tracking-tight text-gray-600">
                                {t('products.productModal.addProduct')}
                            </div>
                            <div className="relative h-4 w-4" />
                        </div>
                        <div className="w-80 font-['Poppins'] text-xs font-normal leading-tight tracking-tight text-gray-600">
                            {t('products.productModal.productLinkDescription')}
                        </div>
                    </div>
                    <div className="inline-flex w-6 flex-col items-end justify-start gap-2.5 self-stretch">
                        <div className="relative h-6 w-6" />
                    </div>
                </div>
                {/* title section */}

                {/* form section */}
                <div className="mb-6 flex h-[228px] flex-col items-start justify-start gap-3 self-stretch p-6">
                    <div className="inline-flex items-start justify-center gap-6 self-stretch">
                        <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                            <Input
                                noBottomMargin
                                label={t('products.productModal.productName')}
                                type="text"
                                value={product.name}
                                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                placeholder={t('products.productModal.enterProductName')}
                                data-testid="product-name-input"
                            />
                        </div>
                        <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                            <Input
                                noBottomMargin
                                label={t('products.productModal.price')}
                                type="text"
                                value={product.price}
                                onChange={(e) => {
                                    // check if the value is a number or an empty string using regex
                                    if (!/^\d*\.?\d*$/.test(e.target.value)) return;
                                    setProduct({ ...product, price: e.target.value ? +e.target.value : 0 });
                                }}
                                placeholder={t('products.productModal.enterPrice')}
                                data-testid="product-name-input"
                            />
                        </div>
                    </div>
                    <div className="inline-flex items-start justify-center gap-6 self-stretch">
                        <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                            <Input
                                noBottomMargin
                                label={t('products.productModal.productDescription')}
                                type="text"
                                value={product.description}
                                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                placeholder={t('products.productModal.shortProductDescription')}
                                data-testid="product-name-input"
                            />
                        </div>
                    </div>
                    <div className="inline-flex items-start justify-center gap-6 self-stretch">
                        <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                            <Input
                                noBottomMargin
                                label={t('products.productModal.shopLink')}
                                type="text"
                                value={product.shopUrl}
                                onChange={(e) => setProduct({ ...product, shopUrl: e.target.value })}
                                placeholder={t('products.productModal.shopLinkDescription')}
                                data-testid="product-name-input"
                            />
                        </div>
                    </div>
                </div>
                {/* form section */}

                {/* submit button section */}
                <div className="flex h-[84px] flex-col items-end justify-center gap-6 self-stretch p-6">
                    <div className="inline-flex h-9 items-start justify-start gap-2">
                        <Button
                            type="button"
                            variant="neutral"
                            className="inline-flex !p-2 text-sm !text-gray-400"
                            onClick={() => setModalOpen(false)}
                            data-testid="back-button"
                        >
                            {t('outreaches.back')}
                        </Button>
                        <Button
                            type="button"
                            variant="primary"
                            className="inline-flex items-center border-none !bg-pink-500 !p-2"
                            data-testid="next-button"
                            onClick={() => handleCreateProduct()}
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : t('outreaches.saveAndContinue')}
                        </Button>
                    </div>
                </div>
                {/* submit button section */}
            </div>
        </Modal>
    );
};
