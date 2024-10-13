import React from 'react';
import { Outlet } from '@tanstack/react-router';
import './App.css';
import Layout from '@/common/components/Layout/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Layout>
      <Outlet />
      <ToastContainer
        position="top-right"  
        autoClose={3000}     
        hideProgressBar={false} 
        newestOnTop={true}    
        closeOnClick          
        pauseOnHover           
        draggable             
        theme="colored"      
      />
    </Layout>
  );
}

export default App;
