import { useInfiniteQuery } from '@tanstack/react-query';
import { productsApi } from '../../api/productsApi';
import LoadMoreTrigger from './InfiniteQueries2';

const LIMIT = 5;
const fetchProducts = async ({ pageParam = 1 }) => {
  const res = await productsApi.get({ _page: pageParam, _per_page: LIMIT });
  return res.data;
};

const InfiniteQueries = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage, pages) => {
        console.log('last page', lastPage);
        console.log('all pages', pages);
        return lastPage.next;
    }
  });
  return (
    <div>
      {data?.pages.map((elm, i) => (
          <div key={i}>
          {elm.data.map((product) => (
            <p key={product.id}>{product.productName} ... {product.note}</p>
          ))}
        </div>
      ))}

      {/* <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
        {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load More' : 'No more posts'}
      </button> */}
       <LoadMoreTrigger fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} />
    </div>
  );
};


export default InfiniteQueries;