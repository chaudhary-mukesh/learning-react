import React, {useState, useCallback, useEffect, useRef} from 'react'

function App() {

    const [length, setLength] = useState(8);
    const [numberAllwoded, setNumberAllowded] = useState(false);
    const [characterAllowded, setCharacterAllowded] = useState(false);
    const [password, setPassword] = useState("");

    const passwordRef= useRef(null);

    const passwordGenerator = useCallback(()=>{
        let pass ="";
        let str= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        if(numberAllwoded) str += "1234567890";
        if(characterAllowded) str +="~!@#$%^&*()_+=-`";

        for (let i = 1; i <= length; i++) {
            let char = Math.floor(Math.random()*str.length)
            pass += str.charAt(char);
        }
        setPassword(pass)

    },[length,numberAllwoded,characterAllowded])

    useEffect(()=>{
        passwordGenerator();
    },[length,numberAllwoded,characterAllowded])

    const copyPasswordToClipboard = useCallback(()=>{
        passwordRef.current.select();
        navigator.clipboard.writeText(password);
    },[password])
  return (
    <>
    <div className='max-w-xl m-auto p-4 bg-green-300'>
        <div className='flex justify-center flex-col'>
            <h1 className='text-center text-2xl mb-3'>Password generator</h1>
            <div className='flex justify-center'>
                <input type="text" readOnly className='max-w-lg w-100 rounded-l-2xl p-3 bg-white' value={password} placeholder='password' ref={passwordRef}/>
            <button className='bg-blue-500 rounded-r-2xl p-3' onClick={copyPasswordToClipboard}>Copy</button>
            </div>
            <div className='flex'>
                <input type="range" max={50} min={6} onChange={(e)=>setLength(e.target.value)} />
                <label htmlFor="Password Length" className='pr-4 pl-1'>length {length}</label>

                <input type="checkbox" onChange={ ()=> setNumberAllowded((prev)=>!prev)} /><label htmlFor="Number" className='pr-4 pl-1'>Number</label>
                <input type="checkbox" onChange={() =>setCharacterAllowded((prev)=>!prev)}/><label htmlFor="Character" className='pl-1'>Character</label>
            </div>
        </div>
    </div>
    </>
  )
}

export default App