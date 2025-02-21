import { useRef, useEffect } from 'react';

const LoadMoreTrigger = ({ fetchNextPage, hasNextPage }) => {
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  return <div ref={ref} style={{ height: 10 }} />;
};


export default LoadMoreTrigger;