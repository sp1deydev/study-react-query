import instance from "./axiosClient";

export const productsApi = {
    get: (data) => {
        return instance.get('/products', {params: data})
    },
    post: (data) => {
        return instance.post('/products', data);
    },
    put: (data) => {
        return instance.put(`/products/${data.id}`, data);
    },
    delete: (data) => {
        return instance.delete(`/products/${data.id}`);
    },
}