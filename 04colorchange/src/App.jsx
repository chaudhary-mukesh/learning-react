import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ColorButton from './components/ColorButton'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <ColorButton color='Red'></ColorButton>
        <ColorButton color='Blue'></ColorButton>
        <ColorButton color='Orange'></ColorButton>
        <ColorButton color='white'></ColorButton>
        <ColorButton color='pink'></ColorButton>
        <ColorButton color='grey'></ColorButton>
        <ColorButton color='black'></ColorButton>
      </div>
    </>
  )
}

export default App
