'use client'

import Link from "next/link"


const NotFoundSource = () => {
  return (
      <div className='error-page'>
        <div>
            <h1>Location is Wrong!</h1>
            <Link href='/'>Return To Home</Link>
        </div>
      </div>
  )
}

export default NotFoundSource

