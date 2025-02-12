import { createSlice } from "@reduxjs/toolkit";
export const productsSlice = createSlice({
    name: 'products',
    initialState: { 
        products: {
            total: '',
            dataList: [],
        },
        cart: [],
    },
    reducers: {

    }
})