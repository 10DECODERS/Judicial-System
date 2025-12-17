import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const Layout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex h-screen bg-background w-full">
            <Sidebar isCollapsed={isCollapsed} />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <TopBar toggleSidebar={toggleSidebar} isSidebarCollapsed={isCollapsed} />
                <main className="flex-1 overflow-y-auto bg-[#F9F9FC]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
