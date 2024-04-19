import Sidebar from "../components/Sidebar";

function AdminPanelPage() {
  return (
    <div className='flex justify-start'>
      <Sidebar />
      <div className='w-screen grid place-items-center'>
        Get started by selecting an option from the sidebar
      </div>
    </div>
  );
}

export default AdminPanelPage;
