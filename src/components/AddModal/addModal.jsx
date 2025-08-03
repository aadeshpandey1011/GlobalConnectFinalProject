import React, { useState } from 'react'
import ImageIcon from '@mui/icons-material/Image';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
const AddModal = (props) => {

    const [imageUrl, setImageUrl] = useState(null)
    const [desc, setDesc] = useState("");

    // cloudname = mashhuudanny
    // presetName = linkedInClone

    const handlePost = async () => {
        if (desc.trim().length === 0 & !imageUrl) return toast.error("Please enter any field");

        await axios.post('http://localhost:4000/api/post',{desc:desc,imageLink:imageUrl},{withCredentials:true}).then((res=>{
            window.location.reload();
        })).catch(err => {
            console.log(err)

        })

    }

    const handleUploadImage = async(e)=>{
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        
        data.append('upload_preset', 'linkedInClone');
        try {
            const response = await axios.post("https://api.cloudinary.com/v1_1/mashhuudanny/image/upload", data)

            const imageUrl = response.data.url;
            setImageUrl(imageUrl)
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div className=''>
            {/* 
                        Please Watch the video for full code
                    */}

            <div className='flex justify-between items-center'>
                <div className="my-6">
                    <label className="cursor-pointer" htmlFor="inputFile"><ImageIcon /></label>
                    <input onChange={handleUploadImage} type="file" className="hidden" id="inputFile" />
                </div>
                <div className="bg-blue-950 text-white py-1 px-3 cursor-pointer rounded-2xl h-fit" onClick={handlePost}> Post</div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default AddModal