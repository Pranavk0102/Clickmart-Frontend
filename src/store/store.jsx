import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/slices/authSlice';
import productReducer from '../features/products/slices/productSlice';
import cartReducer from '../features/cart/slices/cartSlice';
import orderReducer from '../features/orders/slices/orderSlice';
import addressReducer from '../features/profile/slices/addressSlice';
import wishlistReducer from '../features/products/slices/wishlistSlice';
import categoryReducer from '../features/products/slices/categorySlice';
import couponReducer from '../features/checkout/slices/couponSlice';
import adminReducer from '../features/admin/slices/adminSlice';
import ticketReducer from '../features/profile/slices/ticketSlice';
import notificationReducer from '../features/profile/slices/notificationSlice';
import reviewReducer from '../features/products/slices/reviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    addresses: addressReducer,
    wishlist: wishlistReducer,
    categories: categoryReducer,
    coupons: couponReducer,
    admin: adminReducer,
    tickets: ticketReducer,
    notifications: notificationReducer,
    reviews: reviewReducer,
  },
});

export default store;
