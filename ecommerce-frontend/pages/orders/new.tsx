import React from 'react';
import OrderForm from '../../components/OrderForm';
import Navbar from '../../components/Navbar';

const NewOrderPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <OrderForm />
    </>
  );
};

export default NewOrderPage;
