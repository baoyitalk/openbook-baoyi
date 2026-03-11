import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import './App.css';

/**
 * 方案1：使用 React.memo 优化
 * 优点：改动小，快速优化
 * 缺点：需要注意 props 引用稳定性
 * 适用场景：快速优化现有代码
 */

function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [likeCount, setLikeCount] = useState(0);

  const videoRef = useRef(null);
  const inputRef = useRef(null);
  const renderCountRef = useRef(0);

  useEffect(() => {
    const savedComments = localStorage.getItem('comments-memo');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem('comments-memo', JSON.stringify(comments));
    }
  }, [comments]);

  useEffect(() => {
    document.title = `${likeCount} 个赞 - React.memo版`;
  }, [likeCount]);

  useEffect(() => {
    renderCountRef.current++;
    console.log('[React.memo版] 根组件渲染了', renderCountRef.current, '次');
  });

  const filteredComments = useMemo(() => {
    console.log('[React.memo版] 正在过滤评论...');
    return comments.filter(comment => 
      comment.text.includes(searchKeyword)
    );
  }, [comments, searchKeyword]);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const addComment = useCallback(() => {
    if (newComment.trim() === '') return;
  
    const comment = {
      id: Date.now(),
      text: newComment,
      likes: 0
    };
  
    setComments([...comments, comment]);
    setNewComment('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [comments, newComment]);

  // ⭐ 关键：使用 useCallback 保持函数引用稳定
  const likeComment = useCallback((id) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === id 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  }, []); // 使用函数式更新，不依赖 comments

  return (
    <div className="video-player-container">
      <h1>方案1：React.memo 优化版</h1>
      <p style={{ color: '#666', fontSize: '14px' }}>
        💡 点击点赞按钮，观察控制台：CommentSection 不会重新渲染
      </p>
      
      <div className="video-section">
        <video 
          ref={videoRef} 
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          style={{ width: '100%', maxWidth: '800px', borderRadius: '8px' }}
          controls
        />
        <div className="video-controls">
          <button onClick={togglePlay} className="play-button">
            {isPlaying ? '⏸ 暂停' : '▶️ 播放'}
          </button>
          
          <button onClick={() => setLikeCount(likeCount + 1)} className="like-button">
            ❤️ {likeCount}
          </button>
        </div>
      </div>
    
      {/* ⭐ 使用 memo 包裹的评论区组件 */}
      <CommentSection 
        comments={comments}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        newComment={newComment}
        setNewComment={setNewComment}
        addComment={addComment}
        likeComment={likeComment}
        inputRef={inputRef}
        filteredComments={filteredComments}
      />
      
      <div className="debug-info">
        <small>根组件渲染次数: {renderCountRef.current}</small>
      </div>
    </div>
  );
}

// ⭐ 使用 React.memo 包裹评论区，避免不必要的重新渲染
const CommentSection = memo(({ 
  searchKeyword, 
  setSearchKeyword, 
  newComment, 
  setNewComment, 
  addComment, 
  likeComment,
  inputRef,
  filteredComments
}) => {
  const renderCountRef = useRef(0);
  
  useEffect(() => {
    renderCountRef.current++;
    console.log('[React.memo版] CommentSection 渲染了', renderCountRef.current, '次');
  });

  return (
    <>
      <div className="search-section">
        <input
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="🔍 搜索评论..."
          className="search-input"
        />
      </div>
    
      <div className="comment-input-section">
        <input
          ref={inputRef}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addComment()}
          placeholder="写评论..."
          className="comment-input"
        />
        <button onClick={addComment} className="send-button">发送</button>
      </div>
    
      <div className="comments-section">
        <h3>评论 ({filteredComments.length})</h3>
        {filteredComments.length === 0 ? (
          <p className="no-comments">暂无评论，快来抢沙发吧！</p>
        ) : (
          filteredComments.map(comment => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              onLike={likeComment}
            />
          ))
        )}
      </div>
      
      <div className="debug-info">
        <small>CommentSection 渲染次数: {renderCountRef.current}</small>
      </div>
    </>
  );
});

CommentSection.displayName = 'CommentSection';

// ⭐ 评论项也用 memo 包裹
const CommentItem = memo(({ comment, onLike }) => {
  console.log('[React.memo版] CommentItem 渲染:', comment.text);

  return (
    <div className="comment-item">
      <p className="comment-text">{comment.text}</p>
      <button onClick={() => onLike(comment.id)} className="comment-like-button">
        👍 {comment.likes}
      </button>
    </div>
  );
});

CommentItem.displayName = 'CommentItem';

export default VideoPlayer;
