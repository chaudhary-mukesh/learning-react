import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [length, setLength] = useState(8);
  const [numberAllowded, setNumberAllowded] = useState(false);
  const [characaterAllowded, setCharacaterAllowded] = useState(false);
  const [password, setPassword] = useState("");
  
  return (
    <>
    <h1 className='d-flex justify-center'>Password Generator </h1>
    </>
  )
}

export default App
