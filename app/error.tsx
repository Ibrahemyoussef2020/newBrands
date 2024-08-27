'use client'

import { useRouter } from "next/navigation";



interface ErrorPage  {
    error:Error,
    reset:()=> void
}

const Page = ({error,reset}:ErrorPage) => {

  const navigate = useRouter();

  const reloadPage = ()=>{
    navigate.push('/')
    reset();
    location.reload();
  }

  return (
      <div className='error-page'>
        <div>
          <h1>An error occurred</h1>
          <button onClick={reloadPage}>Try Again</button>
        </div>
      </div>
  )
}

export default Page