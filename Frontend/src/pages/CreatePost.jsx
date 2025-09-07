import React, { useContext, useState } from 'react'
import { JanContext } from '../context/JanContext';
import axios from 'axios';

const CreatePost = () => {

    const [postTitle, setPostTitle] = useState("");
    const [postDescription, setPostDescription] = useState("");
    const [postType, setPostType] = useState("image");
    const [file, setFile] = useState(null);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("")
    const [btnToggle, setBtnToggle] = useState(false)

    

    const { user, backendUrl } = useContext(JanContext);

    const handleTagInput = (e) => {
        setTagInput(e.target.value);
    }

    const handleAddTag = (e) => {
        if(e.key === "Enter" || e.key === ","){
            e.preventDefault();
            const newTag = tagInput.trim().replace(",", "");
            if(newTag && !tags.includes(newTag)){
                setTags([...tags, newTag]);
            }
            setTagInput("")
        }
    }

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag)=> tag != tagToRemove));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) { return; }

        if (selectedFile.size > 5 * 1024 * 1024) {
            alert("File size should be less than 5MB");
            e.target.value = null;
            setFile(null);
            return;
        }

        if (postType === "image" && !selectedFile.type.startsWith("image/")) {
            alert("Please Upload Only Image File");
            e.target.value = null;
            setFile(null)
            return;
        }

        if (postType === "video" && !selectedFile.type.startsWith("video/")) {
            alert("Please Upload Only Video File");
            e.target.value = null;
            setFile(null)
            return;
        }

        setFile(selectedFile);
    };

    const submitPost = async (e) => {
        setBtnToggle(!btnToggle)
        e.preventDefault();
        if (!file) {
            alert("Please upload a valid file");
            return;
        }

        const formData = new FormData();
        formData.append("UID", user);
        formData.append("postTitle", postTitle);
        formData.append("postDescription", postDescription);
        formData.append("postType", postType);
        formData.append("tags", JSON.stringify(tags)); // if tags is array
        formData.append("dataFile", file); // must match upload.single("dataFile")

        const response = await axios.post(`${backendUrl}/api/post/create`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        // const response = axios.post(`${backendUrl}/api/post/create`, { UID: user, postTitle: postTitle, postDescription: postDescription, file: file, postType: postType })
        if (response.data.success) {
            alert("Post Added Successfully")
        }
        else {
            alert("Error")
            console.log(response.error.message);
        }

        console.log("Post Submitted Successfully !", { UID: user, postTitle: postTitle, postDescription: postDescription, file: file, postType: postType })
        setPostTitle("")
        setPostDescription("")
        setTags([])
        setFile(null)
        setPostType("image")
        setTagInput("")
        setBtnToggle(!btnToggle);
    }

    return (
        <div>
            <form onSubmit={(e) => submitPost(e)} >
                <input required value={postTitle} onInput={(e) => setPostTitle(e.target.value)} name='postTitle' type="text" placeholder='Enter Title of the post' />
                <textarea required value={postDescription} onInput={(e) => setPostDescription(e.target.value)} name="postDescription" id="" placeholder='Enter Detailed information'></textarea>
                <div>
                    <label htmlFor="postType">Select File Type : </label>
                    <select value={postType} onChange={(e) => setPostType(e.target.value)} name="postType" id="">
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                    </select>
                    <input required onChange={(e) => handleFileChange(e)} type="file" name="file" id="" />
                </div>
                <label htmlFor="">Add Tags: </label>
                <input required type="text" value={tagInput} onChange={handleTagInput} onKeyDown={handleAddTag} placeholder='Type tag and press Enter' />
                <div style={{ marginTop: "8px" }}>
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            style={{
                                display: "inline-block",
                                padding: "5px 10px",
                                backgroundColor: "#eee",
                                margin: "5px",
                                borderRadius: "5px",
                                cursor: "pointer",
                            }}
                            onClick={() => handleRemoveTag(tag)}
                        >
                            {tag} ✕
                        </span>
                    ))}
                </div>
                <button disabled={btnToggle} type='submit' >Submit</button>
            </form>
        </div>
    )
}

export default CreatePost
