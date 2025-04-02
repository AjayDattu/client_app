'use client'
import React from 'react'

function Loader() {
  return (
    <div className="fixed z-[1000] w-screen h-screen bg-white">
        <div className='flex justify-center align-middle items-center'>
           <img src="/Loader.gif" alt="Loading..." className="w-48 h-48 m-20 mt-20 " />
      </div>
    </div>
  )
}

export default Loader
