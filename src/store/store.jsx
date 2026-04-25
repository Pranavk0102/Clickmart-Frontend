import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productReducer from '../features/products/productSlice';
import cartReducer from '../features/cart/cartSlice';
import orderReducer from '../features/orders/orderSlice';
import addressReducer from '../features/profile/addressSlice';
import wishlistReducer from '../features/products/wishlistSlice';
import categoryReducer from '../features/products/categorySlice';
import couponReducer from '../features/checkout/couponSlice';
import adminReducer from '../features/admin/adminSlice';
import ticketReducer from '../features/profile/ticketSlice';
import notificationReducer from '../features/profile/notificationSlice';
import reviewReducer from '../features/products/reviewSlice';

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
