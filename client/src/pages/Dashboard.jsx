import NavBar from "../components/NavBar.jsx";
export default function Dashboard() {
  return (
    <>
      <NavBar />
      <div className=' min-h-screen w-full '>
        <div className='flex flex-col'>
          <header className='flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40'>
            <a className='lg:hidden' href='#'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                className='h-6 w-6'
              >
                <path d='M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z'></path>
                <path d='m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9'></path>
                <path d='M12 3v6'></path>
              </svg>
              <span className='sr-only'>Home</span>
            </a>
            <div className='flex-1'>
              <h1 className='font-semibold text-lg'>Courses</h1>
            </div>
            <nav className='flex items-center gap-4 md:gap-2 lg:gap-4'>
              <a
                className='rounded-lg border border-gray-200  px-3 py-2 text-sm  dark:border-gray-800'
                href='/new-course'
              >
                Add New Course
              </a>
            </nav>
          </header>
          <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6'>
            <div className='border shadow-sm rounded-lg'>
              <div className='grid items-center grid-cols-[50px_1fr_100px_100px] px-4 py-2 md:grid-cols-[100px_1fr_150px_150px] dark:grid-cols-[100px_1fr_150px_150px] f] gap-x-4'>
                <div className='font-medium'>Thumbnail</div>
                <div className='font-medium'>Title</div>
                <div className='font-medium'>Rating</div>
                <div className='font-medium'>Actions</div>
              </div>

              <div className='grid items-center grid-cols-[50px_1fr_100px_100px] px-4 py-2 md:grid-cols-[100px_1fr_150px_150px] dark:grid-cols-[100px_1fr_150px_150px] gap-x-4'>
                <div>
                  <img
                    src='https://via.placeholder.com/150'
                    width='100'
                    height='60'
                    alt='Course thumbnail'
                    className='rounded-md aspect-video overflow-hidden object-cover border'
                  />
                </div>
                <div className='truncate'>Introduction to Computer Science</div>
                <div className='truncate'>4 / 5</div>
                <div className='flex gap-4'>
                  <button className='bg-[#fafafa] p-2 rounded-lg'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 512 512'
                      className='h-8 w-8'
                    >
                      <path
                        d='M384 224v184a40 40 0 01-40 40H104a40 40 0 01-40-40V168a40 40 0 0140-40h167.48'
                        fill='none'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='32'
                      />
                      <path d='M459.94 53.25a16.06 16.06 0 00-23.22-.56L424.35 65a8 8 0 000 11.31l11.34 11.32a8 8 0 0011.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38zM399.34 90L218.82 270.2a9 9 0 00-2.31 3.93L208.16 299a3.91 3.91 0 004.86 4.86l24.85-8.35a9 9 0 003.93-2.31L422 112.66a9 9 0 000-12.66l-9.95-10a9 9 0 00-12.71 0z' />
                    </svg>
                  </button>
                  <button className='bg-[#fafafa] p-2 rounded-lg'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 512 512'
                      className='h-8 w-8'
                    >
                      <path
                        d='M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320'
                        fill='none'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='32'
                      />
                      <path
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeMiterlimit='10'
                        strokeWidth='32'
                        d='M80 112h352'
                      />
                      <path
                        d='M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224'
                        fill='none'
                        stroke='currentColor'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='32'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
