import React from 'react'
import { useFetch } from '../helper/useFetch'

function Joke2() {
    const {data, loading, error} = useFetch('https://icanhazdadjoke.com/');
  return (
     <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Random Joke</h2>
      <p>{data.joke}</p>
    </div>
  )
}

export default Joke2