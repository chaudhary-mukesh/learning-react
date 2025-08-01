import React, { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom'

function Github() {
  const data = useLoaderData();
  // const [data, setData] = useState([])
  // useEffect(()=>{
  //   fetch('https://api.github.com/users/chaudhary-mukesh')
  //   .then(res=>res.json())
  //   .then(data=>{
  //     console.log(data);
  //     setData(data);
  //   })
  // },[])
  return (
    <div className='text-3xl text-center m-4 bg-gray-600 text-white p-4'>
        Github Id: {data.id}
        <img src={data.avatar_url} width={100} alt="github-profile" />
    </div>
  )
}

export default Github

export const githubInfoLoader = async ()=>{
  const res= await fetch('https://api.github.com/users/chaudhary-mukesh');
  return res.json();
}