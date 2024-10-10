import { useEffect, useState } from 'react'
import abi from "./abi.json"
import Web3 from 'web3';
import Swal from 'sweetalert2';
import { VscLoading } from "react-icons/vsc";
import { ImUser } from "react-icons/im";
import LikeTweetButton from './components/LikeTweetButton';

function App() {

  const address = '0x5356258f0Bb97eAd9940b7d258B10724226D637A'

  const [account, setAccount] = useState(null)
  const [web3, setWeb3] = useState(null)
  const [errorMessage, setErrorMessage] = useState('');
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [tweets, setTweets] = useState([])


  console.log('Error : ', errorMessage)
  console.log(loading)

  const fetchTweets = async () => {
    if (web3 && account) {
      const twitterContract = new web3.eth.Contract(abi, address);
      try {
        const tweetArray = await twitterContract.methods.getAllTweet().call({
          from: account,
        });
        setTweets(tweetArray);
        console.log(tweetArray); // Display fetched tweets
      } catch (err) {
        console.error('Error fetching tweets:', err);
      }
    }
  };

  const refetchTweet= async()=>{
    await fetchTweets();
  }

  useEffect(() => {
    if (web3 && account) {
      fetchTweets();
    }
  }, [web3, account])

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
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Connection Failed !",
          showConfirmButton: false,
          timer: 1500
        });
      }

    }
    else {
      setErrorMessage("Meta Mask not Installed. Please install the metamask !")
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Meta Mask not Installed. Please install the metamask !",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  const disconnect = () => {
    setAccount(null);
    setWeb3(null);
    setErrorMessage('');
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Account disconnected Successfully !",
      showConfirmButton: false,
      timer: 1500
    });
  }

  const createTweet = async () => {
    if (web3 && account && content) {
      const twitterContract = new web3.eth.Contract(abi, address)
      try {
        setLoading(true)
        const tx = await twitterContract.methods.createTweet(content).send({
          from: account
        })
        setContent('')
        console.log(tx)
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Twitter Created Successfully !",
          showConfirmButton: false,
          timer: 1500
        });

        refetchTweet();

      }
      catch (err) {
        console.log(err)
        Swal.fire({
          position: "center",
          icon: "error",
          title: err,
          showConfirmButton: false,
          timer: 1500
        });
      }
      finally {
        setLoading(false)
      }
    }
    else {
      setErrorMessage("Accounts not found ")
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Please check your tweet again !",
        showConfirmButton: false,
        timer: 1500
      });
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
                <h1 className='border-4 border-blue-600 text-blue-400 px-3 rounded-full font-semibold'>User : {account.slice(0, 5) + '....' + account.slice(-5)}</h1>
                <button onClick={disconnect} className='bg-blue-400 text-white py-2 px-4 rounded-full hover:bg-red-950'>Disconnect</button>
              </div>
              <div className='w-full flex flex-col items-start gap-3'>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's going on ......" name="" id="" className='w-full border-blue-400 border-2 rounded-2xl p-5 focus:border-blue-800 focus:outline-none focus:border-4'></textarea>
                {
                  loading ? <button className=' text-white text-2xl py-1 rounded-full px-6 bg-blue-800'><VscLoading className='animate-spin' /></button> :
                    <button onClick={createTweet} className='bg-blue-400 text-white py-2 px-4 rounded-full transition-all duration-700 hover:px-6 hover:bg-blue-800'>Tweet</button>
                }


              </div>
            </div>

        }

        {/* Display All tweets */}

        <div className='max-w-4xl mx-auto mb-12'>
          <h1 className={`text-center text-2xl font-semibold mb-6 ${!account && 'hidden'}`}>All Tweets</h1>
          <div className='flex flex-col items-center gap-5 w-full '>
            {
              tweets.map(tweet => <>
                <div className='border rounded-3xl p-5 flex flex-col items-start gap-3 w-full'>
                  <div className='flex items-center gap-2'>
                    <ImUser className='border border-blue-400  text-blue-600 text-3xl rounded-full' />
                    <h1 className='font-semibold text-blue-500'>{tweet.author.slice(0,6)+'....'+tweet.author.slice(-6)}</h1>
                  </div>
                  <p>{tweet.content}</p>
                  <LikeTweetButton account={account} web3={web3} abi={abi} address={address} tweet={tweet} refetchTweet={refetchTweet}/>
                </div>
              </>)
            }
          </div>
        </div>

      </div>
    </>
  )
}

export default App
