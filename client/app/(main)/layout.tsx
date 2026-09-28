//sidebar + topbar
import Sidebar from '../../components/Sidebar'
import TopBar from '../../components/TopBar'
//top and sidebar layout, stays in the same place no matter what..

export default function layout({children}:{children: React.ReactNode}){//CHILDREN

    return (
        <>
        <div className="h-screen flex">
            <Sidebar />
            <div className="flex flex-col flex-1 ">
                <TopBar />
                <main className="flex flex-col overflow-y-auto p-8">{children}</main>
            </div>
        </div>
        </>
    );
    
}