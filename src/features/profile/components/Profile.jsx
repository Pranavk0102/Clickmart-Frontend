import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addAddress, deleteAddress, fetchAddresses, setDefaultAddress, updateAddress } from '../slices/addressSlice';
import { fetchMyOrders } from '../../orders/slices/orderSlice';
// import { fetchWishlist } from '../../products/slices/wishlistSlice';
import { fetchNotifications } from '../slices/notificationSlice';
import { fetchTickets } from '../slices/ticketSlice';
import ProfileTabLayout from './ProfileTabLayout';
import PersonalInfoTab from './PersonalInfoTab';
import OrdersTab from '../../orders/components/OrdersTab';
// import WishlistTab from './WishlistTab';
import NotificationsTab from './NotificationsTab';
import TicketsTab from './TicketsTab';
import AddressCard from './AddressCard';
import AddressFormModal from './AddressFormModal';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'personal');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const { addresses, loading } = useSelector((state) => state.addresses);

  useEffect(() => {
    dispatch(fetchAddresses());
    dispatch(fetchMyOrders());
    // dispatch(fetchWishlist());
    dispatch(fetchNotifications());
    dispatch(fetchTickets());
  }, [dispatch]);

  const handleDeleteAddress = async (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const confirmDeleteAddress = async () => {
    try {
      await dispatch(deleteAddress(deleteConfirm.id)).unwrap();
      toast.success('Address deleted successfully');
    } catch {
      toast.error('Failed to delete address');
    } finally {
      setDeleteConfirm({ open: false, id: null });
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await dispatch(setDefaultAddress(id)).unwrap();
      toast.success('Default address updated');
    } catch {
      toast.error('Failed to update default address');
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleAddressSubmit = async (formData) => {
    try {
      if (editingAddress?.id) {
        await dispatch(updateAddress({ id: editingAddress.id, addressData: formData })).unwrap();
        toast.success('Address updated successfully');
      } else {
        await dispatch(addAddress(formData)).unwrap();
        toast.success('Address added successfully');
      }

      setIsAddressModalOpen(false);
      setEditingAddress(null);
    } catch (error) {
      toast.error(error || 'Failed to save address');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return <PersonalInfoTab />;
      
      case 'addresses':
        return (
          <div className="addresses-tab">
            <div className="section-head">
              <i className="fas fa-map-marker-alt"></i>
              Saved Addresses
              <button type="button" className="btn-shop" onClick={handleAddAddress}>
                Add New Address
              </button>
            </div>

            {loading ? (
              <div className="loading">Loading addresses...</div>
            ) : addresses.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-map-marker-alt"></i>
                <p>No saved addresses</p>
                <button type="button" className="btn-shop" onClick={handleAddAddress}>
                  Add New Address
                </button>
              </div>
            ) : (
              <div className="address-grid">
                {addresses.map((address) => (
                  <AddressCard
                    key={address.id}
                    address={address}
                    onEdit={handleEditAddress}
                    onDelete={handleDeleteAddress}
                    onSetDefault={handleSetDefault}
                  />
                ))}
              </div>
            )}
          </div>
        );
      
      case 'orders':
        return <OrdersTab />;
      
      // case 'wishlist':
      //   return <WishlistTab />;
      
      case 'notifications':
        return <NotificationsTab />;
      
      case 'tickets':
        return <TicketsTab />;
      
      default:
        return <PersonalInfoTab />;
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Profile</span>
        </div>

        <ProfileTabLayout activeTab={activeTab} onTabChange={setActiveTab}>
          {renderTabContent()}
        </ProfileTabLayout>

        <AddressFormModal
          key={editingAddress?.id || 'new-address'}
          isOpen={isAddressModalOpen}
          onClose={() => {
            setIsAddressModalOpen(false);
            setEditingAddress(null);
          }}
          onSubmit={handleAddressSubmit}
          address={editingAddress}
        />

        <ConfirmModal
          isOpen={deleteConfirm.open}
          title="Delete Address"
          message="Are you sure you want to delete this address? This cannot be undone."
          confirmText="Delete"
          danger={true}
          onConfirm={confirmDeleteAddress}
          onCancel={() => setDeleteConfirm({ open: false, id: null })}
        />
      </div>
    </div>
  );
};

export default Profile;
