import { useState } from 'react';
import './App.css'

function App() {

  let [counter,setCounter] = useState(17);
  //let counter =6;

  const addValue = ()=>{
    // console.log("add value",Math.random());
    if(counter<20){
    setCounter(counter + 1);
    //differnt method
    // setCounter(counter + 1);
    // setCounter(prevCounter => prevCounter+1);
    // setCounter(prevCounter => prevCounter+1);
    }
  }
  const decreaseValue = () =>{
    // console.log("decrease value",Math.random());
    if(counter !=0){
    setCounter(counter - 1);
    }
  }
  return (
    <>
    <h1>hello</h1>
    <h2>Counter value : {counter}</h2>
    <button onClick={addValue}>Increase value</button>
    <br/>
    <button onClick={decreaseValue}>Decrease Value</button>
    </>
  )
}

export default App
