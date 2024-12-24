import React, { useState } from 'react'

function LargeTextHandler(text, size) {
    const [seeMore, setSeeMore] = useState(false)
  return (
    <>
        {
            seeMore ? (
                <div className='flex items-center justify-start'>
                <p>{text}
                <button className='text-blue-500 cursor-pointer text-xs' onClick={() => setSeeMore(false)}>see less</button>
                </p>
                </div>

            ) : (
                <div className='flex items-center justify-between'>
                <p>{text.length <= size ? text : text.substr(0, size).concat('...')}</p>
                <button className='text-blue-500 cursor-pointer text-xs' onClick={() => setSeeMore(true)}>see more</button>
                </div>
            )
        }

    </>
  )
}

export default LargeTextHandler
