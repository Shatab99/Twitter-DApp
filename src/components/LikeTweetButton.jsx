import { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import Swal from "sweetalert2";


// eslint-disable-next-line react/prop-types
const LikeTweetButton = ({ account, web3, abi, address,tweet, refetchTweet }) => {
    const [likeLoading, setLikeLoading] = useState(false)

    const likeTweetFunc = async (author, id) => {
        if (web3 && account) {
            // eslint-disable-next-line react/prop-types
            const twitterContract = new web3.eth.Contract(abi, address)
            try {
                setLikeLoading(true)
                const tx = await twitterContract.methods.likeTweet(author, id).send({
                    from: account
                })
                console.log(tx)
                refetchTweet();
            } catch (err) {
                console.log(err)
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Something went wrong . Please check the internet Connection !",
                    showConfirmButton: false,
                    timer: 1500
                });
            } finally {
                setLikeLoading(false)
            }
        }
        else {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Something went wrong !",
                showConfirmButton: false,
                timer: 1500
            });
        }
    }


    return (
        <div>
            {
                likeLoading ? <VscLoading className='text-xl animate-spin' /> :
                    // eslint-disable-next-line react/prop-types
                    <button onClick={() => likeTweetFunc(tweet.author, Number(tweet.id))} className='flex items-center gap-1'><FaRegHeart className='text-xl hover:text-red-600' /> <p className='text-xl'>{Number(tweet.likes)}</p></button>
            }
        </div>
    );
};

export default LikeTweetButton;