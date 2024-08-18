/* eslint-disable complexity */

'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProductsTable from './products-table';
import { CreateProductModal } from './products-modal';
import { useProducts } from 'src/hooks/use-products';
import { type ProductEntity } from 'src/backend/database/product/product-entity';
import { ProductDeleteModal } from './product-delete-modal';
import { DeleteOutline } from 'app/components/icons';
import { Button } from 'app/components/buttons';
import { useDriverV2 } from 'src/hooks/use-driver-v2';
import { productForm, productGuide } from 'src/guides/product.guide';
import toast from 'react-hot-toast';

const ProductsPageComponent = () => {
    const { t } = useTranslation();

    const [modalOpen, setModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selection, setSelection] = useState<string[]>([]);
    const { products, getProducts, setProduct, deleteProduct } = useProducts();
    const [productParam, setProductParam] = useState({
        page: 1,
    });

    useEffect(() => {
        getProducts({ page: productParam.page });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productParam.page]);

    const handleDeleteProduct = async () => {
        const promises = selection.map((id) => deleteProduct(id));
        const res = await Promise.allSettled(promises);
        const message = `Success to delete ${res.filter((r) => r.status === 'fulfilled').length} products`;
        toast.success(message);
        setSelection([]);
        getProducts({ page: productParam.page });
    };

    const { setGuides, startTour, guidesReady } = useDriverV2();

    useEffect(() => {
        setGuides({
            productGuide: productGuide,
            productForm: productForm,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (guidesReady) {
            startTour('productGuide');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guidesReady]);

    return (
        <>
            <ProductDeleteModal
                show={showDeleteModal}
                setShow={setShowDeleteModal}
                handleDelete={handleDeleteProduct}
            />
            <CreateProductModal modalOpen={modalOpen} setModalOpen={(v) => setModalOpen(v)} />
            <div className=" mx-6 flex flex-col space-y-4 py-6" id="product-page">
                <div className="flex w-full justify-between">
                    <div className="mb-6 md:w-1/2">
                        <h1
                            className="mr-4 self-center text-3xl font-semibold text-gray-800"
                            data-testid="outreach-text"
                        >
                            Products
                        </h1>
                    </div>
                </div>
                <div className="flex w-full justify-end gap-4">
                    <button
                        data-testid="delete-sequences-button"
                        className={`h-fit ${
                            selection.length < 1 && 'hidden'
                        } w-fit cursor-pointer rounded-md border border-red-100 p-[10px]`}
                        onClick={() => setShowDeleteModal(true)}
                    >
                        <DeleteOutline className="h-4 w-4 stroke-red-500" />
                    </button>
                    <Button
                        onClick={() => {
                            setModalOpen(true);
                            setProduct({
                                name: '',
                                price: 0,
                                description: '',
                                shopUrl: '',
                                currency: '',
                            } as unknown as ProductEntity);
                        }}
                        variant="ghost"
                        className="flex items-center !bg-blue-50"
                        data-testid="create-campaign-button"
                        id="add-product-button"
                    >
                        <p className="self-center text-blue-600">{t('products.addNewProduct')}</p>
                    </Button>
                </div>

                <ProductsTable
                    products={products?.items}
                    selection={selection}
                    setSelection={setSelection}
                    currentPage={products?.page ?? 1}
                    totalPages={products?.totalPages ?? 0}
                    setPage={(page) => {
                        setProductParam({
                            ...productParam,
                            page,
                        });
                    }}
                    onRowClick={(product) => {
                        setProduct(product);
                        setModalOpen(true);
                    }}
                />
            </div>
        </>
    );
};

export default ProductsPageComponent;
