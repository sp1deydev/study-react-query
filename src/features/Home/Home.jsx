import React, { useEffect, useState } from 'react';
import { productsApi } from '../../api/productsApi';
import { Button, Table } from 'antd';

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
    const [isLoading, setIsLoading] = useState(false)

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
    return (
        <>
            {isLoading && <>Loading...</>}
        
            {!isLoading && (
                <div className='home-container'>
                    <div className='right'>
                        <Button type='primary' className='mb-1'>Add a Product</Button>
                    </div>
                    <Table dataSource={dataSource} columns={columns} />
                </div>
            )}
        </>
    );
}

export default Home;