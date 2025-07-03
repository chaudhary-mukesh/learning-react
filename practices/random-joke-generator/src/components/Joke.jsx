import React, {useState, useEffect} from 'react'

function Joke() {
    const [joke, setJoke] = useState("");
    const [loading, setLoading] = useState(true)

    const fetchJoke = async() =>{
        try {
            setLoading(true);
            const res = await fetch('https://icanhazdadjoke.com/',{
                headers:{Accept: 'application/json'},
            })
            const data = await res.json();
            setJoke(data.joke);
        } catch (error) {
            setJoke("failed to fetch joke");
        }finally{
            setLoading(false);
        }
    };
    useEffect(()=>{
        fetchJoke();
    },[])

  return (
     <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>😂 Random Joke Generator</h2>
      {loading ? <p>Loading...</p> : <p>{joke}</p>}
      <button onClick={fetchJoke}>Get Another Joke</button>
    </div>
  )
}

export default Joke