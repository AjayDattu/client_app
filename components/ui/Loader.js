import React from 'react'

function Loader() {
  return (
   <div className="fixed inset-0 flex items-center justify-center z-50  backdrop-blur-lg shadow-lg">
            <iframe
                className="w-50 h-50"
                src="https://lottie.host/embed/88af5a74-0301-41f2-9bce-34b34a0a0800/ioelthaY7g.lottie"
            ></iframe>
    </div>
  )
}

export default Loader