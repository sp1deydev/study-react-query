import instance from "./axiosClient";

export const productsApi = {
    get: () => {
        return instance.get('/posts')
    },
    post: (data) => {
        return instance.post('/posts', data);
    },
}