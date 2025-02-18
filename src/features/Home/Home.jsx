import React, { useEffect, useState } from 'react';
import { productsApi } from '../../api/productsApi';
import { Button, Form, Input, Modal, Table, Typography } from 'antd';
import { useQuery } from '@tanstack/react-query';

const dataSource = [
  {
    key: '1',
    productName: 'Mike',
    productQuantity: 32,
    note: '10 Downing Street',
  },
  {
    key: '2',
    productName: 'John',
    productQuantity: 42,
    note: '10 Downing Street',
  },
];
  
const columns = [
  {
    title: 'Product Name',
    dataIndex: 'productName',
    key: 'name',
  },
  {
    title: 'Product Quantity',
    dataIndex: 'productQuantity',
    key: 'productQuantity',
  },
  {
    title: 'Note',
    dataIndex: 'note',
    key: 'note',
  },
  {
      title: 'Actions',
      key: 'actions',
      render: (a, b) => (
          <div className='flex start gap-1'>
              {console.log('a', a) || console.log('b', b)}
              <Button>Edit</Button>
              <Button danger>Delete</Button>
          </div>
      )
  }
];

function Home(props) {
    const [addNewProductForm] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const response = await productsApi.get();
                console.log(response.data);
                setIsLoading(false);
            }
            catch (err) {
                alert(err.message);
                setIsLoading(false);
            }
        } 
        fetchData();
    }, [])
    const result = useQuery({
        queryKey: ['product'],
        queryFn: async () => {
            const data = await productsApi.get();
            return data.data;
        } 
    })
    console.log('result',result);


    const handleOpenAddProductModal = () => {
        setIsOpen(true);
    }
    const handleCloseAddProductModal = () => {
        setIsOpen(false);
    }

    return (
        <>
            {isLoading && <>Loading...</>}
        
            {!isLoading && (
                <div className='home-container'>
                    <div className='right'>
                        <Button type='primary' className='mb-1' onClick={handleOpenAddProductModal}>Add a Product</Button>
                    </div>
                    <Table dataSource={dataSource} columns={columns} />
                    <Modal
                        title="Add a Product"
                        visible={isOpen}
                        onCancel={handleCloseAddProductModal}
                        // width={660}
                        footer={null}
                    >
                        <Form
                            form={addNewProductForm}
                            layout="vertical"
                            // onFinish={onForgotPassword}
                            // onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            >
                            <Form.Item
                                name="name"
                                rules={[
                                { required: true, message: "Please input product name!" },
                                ]}
                            >
                                <Input placeholder='Input product name'/>
                            </Form.Item>
                            <Form.Item
                                name="quantity"
                                rules={[
                                { required: true, message: "Please input quantity!" },
                                ]}
                            >
                                <Input placeholder='Input quantity'/>
                            </Form.Item>
                            <Form.Item
                                name="note"
                                rules={[
                                // { required: true, message: "Please input note!" },
                                ]}
                            >
                                <Input placeholder='Input note'/>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{ width: '100%' }} >
                                    {/* {isLoading && <Loading color="#fff" bgColor="#1677ff" size="50"/>} */}
                                    Add a new Product
                                </Button>
                            </Form.Item>
                            </Form>
                    </Modal>
                </div>
            )}
        </>
    );
}

export default Home;