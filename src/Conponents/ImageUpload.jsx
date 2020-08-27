import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { db, storage } from "../Conponents/firebase";
import firebase from "firebase";
import "./ImageUpload.css";

const ImageUpload = ({ userName }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  console.log(userName);

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        //progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        //Error
        console.log(error);
        alert(error.message);
      },
      () => {
        //conplete function

        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            //post image insire DB
            db.collection("posts").add({
              username: userName,
              imageUrl: url,
              caption: caption,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            });

            setProgress(0);
            setCaption("");
            setImage(null);
          })
          .catch((error) => console.log("error of downloadUrl => ", error));
      }
    );
  };

  return (
    <div className="imageUpload">
      <progress className="progressbar" value={progress} max="100" />
      <input
        type="text"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default ImageUpload;
