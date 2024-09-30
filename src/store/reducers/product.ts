import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../hooks';
import { type ProductEntity } from 'src/backend/database/product/product-entity';
import { type Paginated } from 'types/pagination';

interface ProductState {
    list: Paginated<ProductEntity>;
    item: ProductEntity;
}

const initialState: ProductState = {
    list: {
        items: [],
        page: 1,
        totalPages: 1,
        size: 0,
        totalSize: 0,
    },
    item: {
        id: '',
        name: '',
        brandName: '',
        description: '',
        price: 0,
        shopUrl: '',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
};

const pageSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<Paginated<ProductEntity>>) => {
            state.list = action.payload;
        },
        setProduct: (state, action: PayloadAction<ProductEntity>) => {
            state.item = action.payload;
        },
    },
});

const { setProducts, setProduct } = pageSlice.actions;

export const useProductStore = () => {
    const dispatch = useAppDispatch();
    const states = useAppSelector((state) => state.product);
    return {
        ...states,
        setProducts: (products: Paginated<ProductEntity>) => dispatch(setProducts(products)),
        setProduct: (product: ProductEntity) => dispatch(setProduct(product)),
    };
};

export default pageSlice.reducer;
