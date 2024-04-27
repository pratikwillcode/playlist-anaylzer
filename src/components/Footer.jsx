import React from 'react'
import { AiFillHeart } from "react-icons/ai";


function Footer() {
  return (
    <footer className='fixed bottom-0  mx-auto flex w-full items-center py-4 bg-gray-50 dark:bg-[#111417]'>
        <div className='flex justify-center items-center w-full gap-1'>Made with <span className=' text-red-600 pt-0.5'><AiFillHeart/></span> by <span><a className=' text-blue-600 hover:underline underline-offset-2' href='https://www.linkedin.com/in/pratik-awari-608908218/' target='_blank'>Pratik Awari</a></span> </div>
    </footer>
  )
}

export default Footer