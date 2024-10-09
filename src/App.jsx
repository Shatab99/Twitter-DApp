import { useState } from 'react'
import abi from "./abi.json"
import Web3 from 'web3';

function App() {

  const [account, setAccount] = useState(null)
  const [web3, setWeb3] = useState(null)
  const [errorMessage, setErrorMessage] = useState('');

  console.log(account)
  console.log(web3)
  console.log(errorMessage)


  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        setAccount(accounts[0])

        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);


      }
      catch (err) {
        console.log(err)
        setErrorMessage("Connection Failed !")
      }

    }
    else {
      setErrorMessage("Meta Mask not Installed. Please install the metamask !")
    }
  }



  return (
    <>
      <div>
        <h1 className='text-5xl font-bold text-blue-500 my-8 text-center'>Twitter DAPP</h1>
        {
          !account ? <div className='flex items-center justify-center'>
            <button onClick={connectWallet} className='bg-blue-400 text-white p-3 rounded-full transition-all duration-700 hover:px-6 hover:bg-blue-800'>Connect Wallet</button>
          </div> :

            <div className='max-w-4xl mx-auto flex flex-col gap-5 items-center justify-normal'>
              <div className='flex gap-4 items-center justify-center'>
                <h1 className='border-4 border-blue-500 px-3 rounded-full font-semibold'>User : {account.slice(0,5)+'....'+account.slice(-5)}</h1>
                <button onClick={()=>{
                  setAccount(null);
                  setWeb3(null);
                  setErrorMessage('');
                }} className='bg-blue-400 text-white py-2 px-4 rounded-full hover:bg-red-950'>Disconnect</button>
              </div>
              <div className='w-full flex flex-col items-start gap-3'>
                <textarea name="" id="" className='w-full border-blue-400 border-2 rounded-2xl p-5 focus:border-blue-800 focus:outline-none focus:border-4'></textarea>
                <button className='bg-blue-400 text-white py-2 px-4 rounded-full transition-all duration-700 hover:px-6 hover:bg-blue-800'>Tweet</button>
              </div>
            </div>

        }

        {/* Display All tweets */}

        <div className='max-w-4xl mx-auto my-12'>
          <h1 className='text-center text-2xl font-semibold '>All Tweets</h1>
        </div>

      </div>
    </>
  )
}

export default App
