import React from 'react';
import OrdersList from '../../components/OrdersList';
import Navbar from '../../components/Navbar';

const OrderPage: React.FC = () => {
  return <>
    <Navbar />
    <OrdersList />
  </>
};

export default OrderPage;
