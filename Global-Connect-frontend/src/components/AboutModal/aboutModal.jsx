import React, { useState } from 'react'
import axios from 'axios';

const AboutModal = ({ handleEditFunc, selfData }) => {
    console.log("AboutModal rendered with selfData:", selfData); // Debug log

    const [data, setData] = useState({
        about: selfData?.about || '',
        skillInp: selfData?.skills?.join(',') || '',
        resume: selfData?.resume || ''
    });
    const [loading, setLoading] = useState(false)

    const onChangeHandle = (event, key) => {
        setData({ ...data, [key]: event.target.value })
    }

    const handleInputImage = async (e) => {
        const files = e.target.files;
        if (!files || !files[0]) return;

        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('upload_preset', 'GlobalConnect');

        setLoading(true)
        try {
            const response = await axios.post("https://api.cloudinary.com/v1_1/dxpjl64r4/image/upload", formData)
            const imageUrl = response.data.url;

            setData(prevData => ({ ...prevData, resume: imageUrl }))

        } catch (err) {
            console.log(err)
            alert("Error uploading file")
        } finally {
            setLoading(false)
        }
    }

    const handleOnSave = async () => {
        console.log("Save clicked with data:", data); // Debug log

        let arr = [];
        if (data?.skillInp) {
            arr = data.skillInp.split(',').map(skill => skill.trim()).filter(skill => skill);
        }

        let newData = { ...selfData, about: data.about, skills: arr, resume: data.resume };
        console.log("Calling handleEditFunc with:", newData); // Debug log

        handleEditFunc(newData);
    }

    return (
        <div className='mt-8 w-full h-[400px] overflow-auto'>
            <div className='w-full mb-4'>
                <label>About*</label>
                <br />
                <textarea
                    value={data.about}
                    onChange={(e) => { onChangeHandle(e, 'about') }}
                    className='p-2 mt-1 w-full border-1 rounded-md'
                    cols={10}
                    rows={4}
                    placeholder="Tell us about yourself..."
                ></textarea>
            </div>
            <div className='w-full mb-4'>
                <label>Skills* (Add by separating comma)</label>
                <br />
                <textarea
                    value={data.skillInp}
                    onChange={(e) => { onChangeHandle(e, 'skillInp') }}
                    className='p-2 mt-1 w-full border-1 rounded-md'
                    cols={10}
                    rows={3}
                    placeholder="React, Node.js, JavaScript, Python, etc."
                ></textarea>
            </div>
            <div className='w-full mb-4'>
                <label htmlFor='resumeUpload' className='p-2 bg-blue-800 text-white rounded-lg cursor-pointer inline-block'>
                    {loading ? 'Uploading...' : 'Upload Resume'}
                </label>
                <input onChange={handleInputImage} type='file' className='hidden' id='resumeUpload' accept=".jpg,.png,.jpeg" />
                {
                    data.resume && (
                        <div className='my-2 text-sm text-green-600'>
                            ✓ Resume uploaded successfully!
                        </div>
                    )
                }
            </div>

            <div className="bg-blue-950 text-white w-fit py-2 px-4 cursor-pointer rounded-2xl hover:bg-blue-900" onClick={handleOnSave}>
                Save
            </div>

        </div>
    )
}

export default AboutModal







// import React, { useState } from 'react'
// import axios from 'axios';


// const AboutModal = ({ handleEditFunc, selfData }) => {

//     const [data, setData] = useState({ about: selfData?.about, skillInp: selfData?.skills?.join(','), resume: selfData?.resume });
//     const [loading, setLoading] = useState(false)

//     const onChangeHandle = (event, key) => {
//         setData({ ...data, [key]: event.target.value })
//     }

//     const handleInputImage = async (e) => {
//         const files = e.target.files;
//         const data = new FormData();
//         data.append('file', files[0]);

//         data.append('upload_preset', 'linkedInClone');
//         setLoading(true)
//         try {
//             const response = await axios.post("https://api.cloudinary.com/v1_1/mashhuudanny/image/upload", data)

//             const imageUrl = response.data.url;
//             setData({ ...data, resume: imageUrl })

//         } catch (err) {
//             console.log(err)
//         } finally {
//             setLoading(false)
//         }
//     }

//     const handleOnSave = async () => {
//         let arr = data?.skillInp?.split(',');

//         let newData = { ...selfData, about: data.about, skills: arr, resume: data.resume };
//         handleEditFunc(newData);
//     }

//     return (
//         <div className='my-8'>
//            <div className='w-full mb-4'>
//              <label>About*</label>
//              <br />
//              <textarea value={data.about} onChange={(e)=>{onChangeHandle(e,'about')}} className='p-2 mt-1 w-full border-1 rounded-md' cols={10} rows={3}></textarea>
//             </div>
//            <div className='w-full mb-4'>
//              <label>Skills*(Add by seperating comma)</label>
//              <br />
//              <textarea value={data.skillInp} onChange={(e)=>{onChangeHandle(e,'skillInp')}} className='p-2 mt-1 w-full border-1 rounded-md' cols={10} rows={3}></textarea>
//             </div>
//             <div className='w-full mb-4'>
//                 <label htmlFor='resumeUpload' className='p-2 bg-blue-800 text-white rounded-lg cursor-pointer'>Resume Upload</label>
//                 <input onChange={handleInputImage} type='file' className='hidden' id='resumeUpload' />
//                 {
//                     data.resume && <div className='my-2'>{data.resume}</div>
//                 }
//             </div>

//             <div className="bg-blue-950 text-white w-fit py-1 px-3 cursor-pointer rounded-2xl" onClick={handleOnSave}>Save</div>

//         </div>
//     )
// }

// export default AboutModal