//sidebar + topbar
import Sidebar from '../../components/Sidebar'
import TopBar from '../../components/TopBar'

export default function layout({children}:{children: React.ReactNode}){

    return (
        <>
        <div className="h-screen flex">
            <Sidebar />
            <div className="flex flex-col flex-1 ">
                <TopBar />
                <main className="flex flex-1 overflow-y-auto p-8">{children}</main>
            </div>
        </div>
        </>
    );
    
}