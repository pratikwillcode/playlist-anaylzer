import React from 'react'
import { ImYoutube2 } from "react-icons/im";
import ThemeBtn from './ThemeBtn'


function Header() {
  return (

    <header className='sticky top-0 z-[20]  mx-auto flex w-full items-center   flex-wrap justify-between px-4 sm:px-12 md:px-24 lg:px-32 py-4 dark:bg-[#111417] bg-gray-50'>
      <div className='flex justify-center items-center gap-1'>
        <div>
          {/* <img src="/ytlogodark.png" alt="logo" className='h-10' /> */}
          <ImYoutube2 className='h-10 text-red-500 text-5xl' />
        </div>
        <div className='font-bold text-sm text-red-500 '>
          Analyzer
        </div>


      </div>
      <div className='pt-2'>
      <ThemeBtn />
      </div>

    </header>

  )
}

export default Header