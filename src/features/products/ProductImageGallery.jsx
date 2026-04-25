import { useState } from 'react';
import './ProductImageGallery.css';

const ProductImageGallery = ({ images = [], productName = '' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const imageList = images.length > 0 ? images : ['/placeholder-product.jpg'];
  const selectedImage = imageList[selectedIndex];

  return (
    <div className="product-image-gallery">
      <div className="main-image-container">
        <img
          src={selectedImage}
          alt={`${productName} - View ${selectedIndex + 1}`}
          className="main-image"
        />
      </div>
      
      {imageList.length > 1 && (
        <div className="thumbnail-container">
          {imageList.map((image, index) => (
            <button
              key={index}
              className={`thumbnail ${index === selectedIndex ? 'active' : ''}`}
              onClick={() => setSelectedIndex(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
