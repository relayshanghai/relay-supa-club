/* eslint-disable complexity */

'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../button';
import ProductsTable from './products-table';
import { DeleteSequenceModal } from '../modal-delete-sequence';
import { CreateProductModal } from './products-modal';

export const ProductsPageComponent = () => {
    const { t } = useTranslation();

    const [modalOpen, setModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selection, setSelection] = useState<string[]>([]);

    const handleDeleteProduct = async () => null;

    return (
        <>
            <DeleteSequenceModal
                show={showDeleteModal}
                setShow={setShowDeleteModal}
                handleDelete={handleDeleteProduct}
            />
            <CreateProductModal modalOpen={modalOpen} setModalOpen={(v) => setModalOpen(v)} />
            <div className=" mx-6 flex flex-col space-y-4 py-6">
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
                    <Button
                        onClick={() => setModalOpen(true)}
                        variant="ghost"
                        className="flex items-center !bg-blue-50"
                        data-testid="create-campaign-button"
                    >
                        <p className="self-center text-blue-600">{t('products.addNewProduct')}</p>
                    </Button>
                </div>

                <ProductsTable products={[]} selection={selection} setSelection={setSelection} />
            </div>
        </>
    );
};
