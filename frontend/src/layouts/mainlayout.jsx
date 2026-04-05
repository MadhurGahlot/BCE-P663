import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';

const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
