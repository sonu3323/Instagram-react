import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { Input, Button, Snackbar } from "@material-ui/core";
import { db } from "./firebase";
import firebase from "firebase";

const Post = ({ post, caption, userName, postId, user }) => {
  const [input, setInput] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((Snapshot) => {
          setComments(Snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const commentHandle = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      userName: user.displayName,
      text: input,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput("");
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={userName}
          src="/static/images/avatar/1.jpg"
        />
        <h3>{userName}</h3>
      </div>
      <div>
        <img className="post__image" src={post} alt="post" />
      </div>
      <div className="post__bottom">
        <h4 className="post__text">
          <strong>{userName}:</strong> {caption}
        </h4>
      </div>
      {/* comments */}

      <div className="app__comments">
        {comments.map(({ text, userName }) => {
          return (
            <p>
              <strong>{userName}:</strong> {text}
            </p>
          );
        })}
      </div>
      {user && (
        <div>
          <form onSubmit={commentHandle} className="app__comment__input">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="write comment"
              className="post__comment"
            />
            <Button
              disabled={!input}
              className="app__comment__button"
              type="submit"
            >
              Post
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;
