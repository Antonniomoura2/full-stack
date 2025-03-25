import React from 'react';
import ProductPage from '../components/ProductPage';
import Navbar from '../components/Navbar';
import DashboardPage from '../components/Dashboard';

const Products: React.FC = () => {
  return <>
    <Navbar />
    <DashboardPage />
  </>
};

export default Products;
