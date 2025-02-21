import React, { useEffect, useState } from "react";
import { productsApi } from "../../api/productsApi";
import { Button, Form, Input, Modal, Table } from "antd";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import InfiniteQueries from "../InfiniteQueries/InfiniteQueries";

const LIMIT = 5;
function Home() {
  const queryClient = useQueryClient();
  const [addNewProductForm] = Form.useForm();
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [editingKey, setEditingKey] = useState(null);
  const [form] = Form.useForm();

  const fetchCountAllProducts = async () => {
    const response = await productsApi.get({ _page: 1 });
    return response.data.items;
  };

  //react-query
  const results = useQueries({
    queries: [
      {
        queryKey: ["products", page],
        queryFn: async () => {
          const data = await productsApi.get({ _page: page, _per_page: LIMIT });
          return data.data.data;
        },
        staleTime: 2000,
        // refetchOnWindowFocus: false,
        // placeholderData: (prevData) => prevData ||  [{
        //     productName: "Loading...",
        //     productQuantity: "Loading...",
        //     note: "Loading..."
        // }],
      },
      {
        queryKey: ["products-count"],
        queryFn: fetchCountAllProducts,
      },
    ],
  });
  //optimistic update
  const updateProductMutation = useMutation({
    mutationFn: async (data) => {
      return await productsApi.put(data);
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["products", page] });

      const previousProducts = queryClient.getQueryData(["products", page]);
      toast.success(`Product was successfully updated!`, {autoClose: 1000})
      queryClient.setQueryData(["products", page], (oldProducts) => {
        return oldProducts.map((product) =>
          product.id === data.id ? { ...product, ...data } : product
        );
      });
      return { previousProducts };
    },
    onError: (err, data, context) => {
      toast.error(err);
      queryClient.setQueryData(["products"], context.previousProducts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
  // nomal mutation
  // const updateProductMutation = useMutation({
  //     mutationFn: async (data) => {
  //         return await productsApi.put(data);
  //     },
  //     onSuccess: () => {
  //         toast.success(`Product was successfully updated!`, {autoClose: 1000})
  //         // queryClient.invalidateQueries({ queryKey: ['products'] })
  //     },
  // })
  // nomal mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (data) => {
      return await productsApi.delete(data);
    },
    onSuccess: () => {
      toast.success(`Product was successfully deleted!`, { autoClose: 1000 });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleOpenAddProductModal = () => setIsOpen(true);
  const handleCloseAddProductModal = () => setIsOpen(false);

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };

  const cancel = () => setEditingKey(null);

  const save = async (id) => {
    try {
      const row = await form.validateFields();
      updateProductMutation.mutate({ id, ...row });
      setEditingKey(null);
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleTableChange = debounce((pagination) => {
    setPage(pagination.current);
  }, 300);

  const handleDelete = (id) => {
    deleteProductMutation.mutate({ id });
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "name",
      editable: true,
    },
    {
      title: "Product Quantity",
      dataIndex: "productQuantity",
      key: "productQuantity",
      editable: true,
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      editable: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <>
            <Button onClick={() => save(record.id)} type="link">
              Save
            </Button>
            <Button onClick={cancel} type="link" danger>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => edit(record)} type="link">
              Edit
            </Button>
            <Button danger type="link" onClick={() => handleDelete(record.id)}>
              Delete
            </Button>
          </>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item name={dataIndex} style={{ margin: 0 }}>
            <Input />
          </Form.Item>
        ) : (
          restProps.children
        )}
      </td>
    );
  };
  if (results.some((q) => q.isLoading)) return <p>Loading...</p>;
  return (
    <>
      <div className="home-container">
        <Button
          type="primary"
          className="mb-1"
          onClick={handleOpenAddProductModal}
        >
          Add a Product
        </Button>
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            dataSource={results[0].data}
            columns={mergedColumns}
            pagination={{
              current: page,
              pageSize: LIMIT,
              total: results[1].data,
            }}
            rowClassName="editable-row"
            onChange={handleTableChange}
          />
        </Form>
        <Modal
          title="Add a Product"
          visible={isOpen}
          onCancel={handleCloseAddProductModal}
          footer={null}
        >
          <Form form={addNewProductForm} layout="vertical" autoComplete="off">
            <Form.Item
              name="name"
              rules={[
                { required: true, message: "Please input product name!" },
              ]}
            >
              <Input placeholder="Input product name" />
            </Form.Item>
            <Form.Item
              name="quantity"
              rules={[{ required: true, message: "Please input quantity!" }]}
            >
              <Input placeholder="Input quantity" />
            </Form.Item>
            <Form.Item name="note">
              <Input placeholder="Input note" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Add a new Product
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <InfiniteQueries/>
      </div>
    </>
  );
}

export default Home;
