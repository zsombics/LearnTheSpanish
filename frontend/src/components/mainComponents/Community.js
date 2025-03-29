import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Community.css';
import { FaImage, FaHeart, FaComment, FaTrash, FaEdit, FaTimes, FaPaperPlane } from 'react-icons/fa';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [commentRefs, setCommentRefs] = useState({});

  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1zaXplPSIxMiI+VXNlcjwvdGV4dD48L3N2Zz4=';

  useEffect(() => {
    fetchPosts();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    Object.values(commentRefs).forEach(ref => {
      if (ref && document.activeElement === ref) {
        ref.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }, [commentRefs]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('/api/auth/profile');
      setCurrentUser(response.data.user);
    } catch (error) {
      console.error('Felhasználó lekérési hiba:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Bejegyzések lekérési hiba:', error);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('A kép mérete nem lehet nagyobb 5MB-nál!');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (editingPost) {
      setPosts(posts.map(post => 
        post._id === editingPost ? { ...post, image: null } : post
      ));
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) {
      alert('A bejegyzés nem lehet üres!');
      return;
    }
    
    try {
      const response = await axios.post('/api/posts', {
        content: newPost,
        image: selectedImage
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });
      
      setPosts([response.data, ...posts]);
      setNewPost('');
      setSelectedImage(null);
      setIsModalOpen(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Bejegyzés létrehozási hiba:', error);
      alert('Hiba történt a bejegyzés létrehozásakor. Kérjük próbáld újra!');
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post._id === postId ? {
          ...post,
          likes: response.data.likes,
          user: response.data.user,
          comments: response.data.comments
        } : post
      ));
    } catch (error) {
      console.error('Like hiba:', error);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText.trim()) return;
    
    try {
      const response = await axios.post(`/api/posts/${postId}/comments`, {
        content: commentText
      });
      setPosts(posts.map(post => 
        post._id === postId ? {
          ...post,
          comments: response.data.comments,
          user: response.data.user
        } : post
      ));
      setCommentText('');
      setCommentRefs(prev => {
        const newRefs = { ...prev };
        delete newRefs[postId];
        return newRefs;
      });
    } catch (error) {
      console.error('Komment hiba:', error);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Biztosan törölni szeretnéd ezt a bejegyzést?')) return;
    
    try {
      await axios.delete(`/api/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Törlési hiba:', error);
    }
  };

  const handleEdit = async (postId) => {
    try {
      const response = await axios.put(`/api/posts/${postId}`, {
        content: newPost,
        image: selectedImage
      });
      setPosts(posts.map(post => 
        post._id === postId ? response.data : post
      ));
      setEditingPost(null);
      setSelectedImage(null);
      setNewPost('');
    } catch (error) {
      console.error('Módosítási hiba:', error);
    }
  };

  const toggleComments = (postId) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    
    if (!expandedComments[postId]) {
      setTimeout(() => {
        const commentInput = document.querySelector(`#comment-input-${postId}`);
        if (commentInput) {
          commentInput.focus();
          setCommentRefs(prev => ({
            ...prev,
            [postId]: commentInput
          }));
        }
      }, 100);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPerformanceIcon = (level) => {
    switch (level) {
      case 'Bronz': return '🥉';
      case 'Ezüst': return '🥈';
      case 'Arany': return '🥇';
      case 'Platina': return '💎';
      case 'Gyémánt': return '👑';
      default: return '⭐';
    }
  };

  return (
    <div className="community-container">
      <div className="community-header">
        <h1>Közösségi Folyóirat</h1>
        <p>Oszd meg tapasztalataidat, kérdéseidet és ötleteidet a spanyol tanulásról!</p>
        <button className="post-button" onClick={() => setIsModalOpen(true)}>
          Új bejegyzés
        </button>
      </div>

      {showSuccess && (
        <div className="success-message">
          Bejegyzés sikeresen létrehozva!
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Új bejegyzés</h2>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handlePostSubmit} className="modal-form">
              <textarea
                placeholder="Mit szeretnél megosztani?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <label className="image-upload">
                <FaImage />
                <span>Kép hozzáadása</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
              {selectedImage && (
                <div className="post-image-container">
                  <img src={selectedImage} alt="Preview" className="modal-image-preview" />
                  <button type="button" className="remove-image" onClick={handleRemoveImage}>
                    <FaTimes />
                  </button>
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="post-button" onClick={() => setIsModalOpen(false)}>
                  Mégse
                </button>
                <button type="submit" className="post-button">
                  Közzététel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="posts-list">
        {posts.map(post => (
          <div key={post._id} className="post">
            <div className="post-header">
              <img
                src={post.user.avatar || defaultAvatar}
                alt={post.user.name}
                className="user-avatar"
              />
              <div className="user-info">
                <div className="user-name">{post.user.name}</div>
                <div className="post-date">{formatDate(post.createdAt)}</div>
              </div>
              <div className="performance-level">
                {getPerformanceIcon(post.user.performanceLevel)} {post.user.performanceLevel}
              </div>
            </div>

            {editingPost === post._id ? (
              <div className="edit-post">
                <textarea
                  className="post-input"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                />
                <label className="image-upload">
                  <FaImage />
                  <span>Kép módosítása</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                {(selectedImage || post.image) && (
                  <div className="post-image-container">
                    <img 
                      src={selectedImage || post.image} 
                      alt="Preview" 
                      className="modal-image-preview" 
                    />
                    <button type="button" className="remove-image" onClick={handleRemoveImage}>
                      <FaTimes />
                    </button>
                  </div>
                )}
                <div className="post-actions">
                  <button
                    className="post-button"
                    onClick={() => handleEdit(post._id)}
                  >
                    Mentés
                  </button>
                  <button
                    className="post-button"
                    onClick={() => {
                      setEditingPost(null);
                      setSelectedImage(null);
                      setNewPost('');
                    }}
                  >
                    Mégse
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="post-content">{post.content}</div>
                {post.image && (
                  <div className="post-image-container">
                    <img src={post.image} alt="Post" className="post-image" />
                  </div>
                )}
                <div className="post-actions">
                  <button
                    className={`action-button ${post.likes.includes(currentUser?._id) ? 'liked' : ''}`}
                    onClick={() => handleLike(post._id)}
                  >
                    <FaHeart />
                    <span>{post.likes.length}</span>
                  </button>
                  <button 
                    className="action-button"
                    onClick={() => toggleComments(post._id)}
                  >
                    <FaComment />
                    <span>{post.comments.length}</span>
                  </button>
                  {currentUser && post.user._id === currentUser._id && (
                    <>
                      <button
                        className="action-button"
                        onClick={() => {
                          setEditingPost(post._id);
                          setNewPost(post.content);
                          setSelectedImage(post.image);
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-button"
                        onClick={() => handleDelete(post._id)}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>

                <div className={`comments-section ${expandedComments[post._id] ? 'show' : ''}`}>
                  <div className="comments-list">
                    {post.comments.map((comment, index) => (
                      <div key={index} className="comment">
                        <img
                          src={comment.user.avatar || defaultAvatar}
                          alt={comment.user.name}
                          className="comment-avatar"
                        />
                        <div className="comment-content">
                          <div className="comment-header">
                            <div className="comment-user">{comment.user.name}</div>
                            <div className="comment-date">
                              {formatDate(comment.createdAt)}
                            </div>
                          </div>
                          <div className="comment-text">{comment.content}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="comment-input">
                    <img
                      src={currentUser?.avatar || defaultAvatar}
                      alt={currentUser?.name}
                      className="comment-avatar"
                    />
                    <div className="comment-input-wrapper">
                      <input
                        id={`comment-input-${post._id}`}
                        type="text"
                        placeholder="Írj te is egy hozzászólást..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleComment(post._id);
                          }
                        }}
                      />
                      <button
                        className={`comment-button ${commentText.trim() ? 'active' : ''}`}
                        onClick={() => handleComment(post._id)}
                        disabled={!commentText.trim()}
                      >
                        <FaPaperPlane />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community; 