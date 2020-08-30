import React, { useState } from 'react'
import { firestore } from 'firebase'
import { db, storage } from './firebase'
import './imageUpload.css'

function ImageUpload({username}) {
        const [caption, setCaption] = useState('')
        const [progress, setProgress] = useState(0)
        const [image, setImage] = useState(null)
        
        const handleChange = (e) => {
                if (e.target.files[0]) {
                        setImage(e.target.files[0])
                }
        }
        const handleUpload = () => {
                const uploadTask = storage.ref(`images/${image.name}`).put(image)

                uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                                const progress = Math.round(
                                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                                )
                                setProgress(progress)
                        },
                        (err) => {
                                console.log(err)
                                alert(err.message)
                        },
                        () => {
                                storage
                                        .ref('images')
                                        .child(image.name)
                                        .getDownloadURL()
                                        .then(url => {
                                                db.collection("posts").add({
                                                        timestamp: firestore.FieldValue.serverTimestamp(),
                                                        caption,
                                                        imageUrl: url,
                                                        username
                                                })
                                                setProgress(0)
                                                setCaption('')
                                                setImage(null)
                                        })
                        }
                )
        }

        return (
                <div className="imageUpload">
                        <progress className="imageUpload__progress" value={progress} max="100" />
                        <input type="text" value={caption} onChange={event => setCaption(event.target.value)} placeholder="Enter a caption" />
                        <input type="file" onChange={handleChange} />
                        <button onClick={handleUpload}>Upload</button>
                </div>
        )
}

export default ImageUpload