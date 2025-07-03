import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Card from './components/card'


function App() {
  const [count, setCount] = useState(0)
let obj = {
  name:"Mukesh",
  age:21,
}
let arr =[1,2,3,4,5,6];
  return (
    <>
      <h1 className='bg-green-400 text-black p-5 rounded-2xl'>hello</h1>
    <Card user="Mhere" price="123"></Card>
    <Card user="Ritesh" price="400"></Card>
    <Card user="Nitesh"></Card>
    </>
  )
}

export default App
