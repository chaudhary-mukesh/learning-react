import React from 'react'

function ColorButton({color="green"}) {
    const changeColor = ()=>{
        // console.log("Button clikced")
        document.body.style.backgroundColor= color;
    }
  return (
    <button className="p-3 border-solid border-2 border-black ml-5" onClick={changeColor}>{color}</button>
  )
}

export default ColorButton