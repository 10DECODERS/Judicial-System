import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const Layout = () => {
    return (
        <div className="flex h-screen bg-background w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <TopBar />
                <main className="flex-1 overflow-y-auto p-6 bg-muted/40">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
