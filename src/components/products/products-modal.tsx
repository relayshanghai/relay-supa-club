import { type FC } from 'react';
import { Cross } from '../icons';
import { Modal } from '../modal';
import { Input } from '../input';
import { Button } from '../button';
import { useTranslation } from 'react-i18next';
import { type CreateProductPayload, useProducts } from 'src/hooks/use-products';
import { type ProductEntity } from 'src/backend/database/product/product-entity';

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
    const { createProduct, updateProduct, getProducts, product, setProduct } = useProducts();

    const handleCreateProduct = async () => {
        const isUpdate = product.id !== undefined;
        let action = null;
        if (isUpdate) {
            action = updateProduct(product.id as string, product as unknown as CreateProductPayload);
        } else {
            action = createProduct(product as unknown as CreateProductPayload);
        }
        action.then(() => {
            getProducts();
            setProduct(initValue as unknown as ProductEntity);
            setModalOpen(false);
        });
    };

    return (
        <Modal visible={modalOpen} onClose={() => null} padding={0} maxWidth="!w-[512px]">
            <div className="relative inline-flex h-[482px] w-[512px] flex-col items-start justify-start rounded-lg bg-violet-50">
                <div className="absolute right-2 top-2 z-10 h-6 w-6 cursor-pointer" onClick={() => setModalOpen(false)}>
                    <Cross className="flex h-6 w-6 fill-gray-400 stroke-white" />
                </div>

                {/* title section */}
                <div className="inline-flex items-start justify-between self-stretch pl-6 pr-2 pt-6">
                    <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                        <div className="inline-flex items-start justify-start gap-1">
                            <div className="text-center font-['Poppins'] text-xl font-semibold tracking-tight text-gray-600">
                                Add a product
                            </div>
                            <div className="relative h-4 w-4" />
                        </div>
                        <div className="w-80 font-['Poppins'] text-xs font-normal leading-tight tracking-tight text-gray-600">
                            We link your products to searches and sequences to track performance, and help improve
                            search results.
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
                                label={'Product Name'}
                                type="text"
                                value={product.name}
                                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                                placeholder={'Enter Product Name'}
                                data-testid="product-name-input"
                            />
                        </div>
                        <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                            <Input
                                noBottomMargin
                                label={'Price'}
                                type="text"
                                value={product.price}
                                onChange={(e) => {
                                    // check if the value is a number or an empty string using regex
                                    if (!/^\d*\.?\d*$/.test(e.target.value)) return;
                                    setProduct({ ...product, price: e.target.value ? +e.target.value : 0 });
                                }}
                                placeholder={'Enter price'}
                                data-testid="product-name-input"
                            />
                        </div>
                    </div>
                    <div className="inline-flex items-start justify-center gap-6 self-stretch">
                        <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                            <Input
                                noBottomMargin
                                label={'Product Description'}
                                type="text"
                                value={product.description}
                                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                                placeholder={'Short, clear product description'}
                                data-testid="product-name-input"
                            />
                        </div>
                    </div>
                    <div className="inline-flex items-start justify-center gap-6 self-stretch">
                        <div className="inline-flex shrink grow basis-0 flex-col items-start justify-start gap-1">
                            <Input
                                noBottomMargin
                                label={'Shop Link'}
                                type="text"
                                value={product.shopUrl}
                                onChange={(e) => setProduct({ ...product, shopUrl: e.target.value })}
                                placeholder={'The products Amazon, Shopify, or other store link'}
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
                        >
                            {t('outreaches.saveAndContinue')}
                        </Button>
                    </div>
                </div>
                {/* submit button section */}
            </div>
        </Modal>
    );
};
