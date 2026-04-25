import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from './productSlice';
import ProductCard from './ProductCard';
import './RelatedProducts.css';

const RelatedProducts = ({ categoryId, currentProductId, limit = 4 }) => {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector(state => state.products);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchProducts({ categoryId, size: limit + 1 }));
    }
  }, [categoryId, dispatch, limit]);

  const relatedProducts = products
    .filter(p => p.id !== currentProductId)
    .slice(0, limit);

  if (loading || relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="related-products">
      <h2 className="related-products-title">You May Also Like</h2>
      <div className="related-products-grid">
        {relatedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
