import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../features/products/categorySlice';

const SideMenu = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const getCategoryIcon = (name) => {
    const iconMap = {
      'Electronics': 'fa-laptop',
      'Fashion': 'fa-tshirt',
      'Home and Garden': 'fa-home',
      'Health and Beauty': 'fa-spa',
      'Books': 'fa-book',
      'Sports': 'fa-dumbbell',
      'Toys and Games': 'fa-gamepad',
      'Automotive': 'fa-car',
      'Watches': 'fa-clock',
      'Gaming': 'fa-headset',
    };
    return iconMap[name] || 'fa-tag';
  };

  return (
    <>
      <div className={`side-menu ${isOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <span>
            <i className="fas fa-list"></i> Shop by Category
          </span>
          <button className="menu-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${encodeURIComponent(cat.name)}`}
            className="menu-item"
            onClick={onClose}
          >
            <i className={`fas ${getCategoryIcon(cat.name)}`}></i> {cat.name}
          </Link>
        ))}
      </div>

      {isOpen && (
        <div className="menu-overlay open" onClick={onClose}></div>
      )}
    </>
  );
};

export default SideMenu;
