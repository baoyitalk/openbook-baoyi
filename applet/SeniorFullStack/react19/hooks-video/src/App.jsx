import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './App.css';

function VideoPlayer() {
  // ========== useState：保存数据，显示在页面上 ==========

  const [isPlaying, setIsPlaying] = useState(false);        // 视频是否播放
  const [comments, setComments] = useState([]);             // 评论列表
  const [newComment, setNewComment] = useState('');         // 新评论内容
  const [searchKeyword, setSearchKeyword] = useState('');   // 搜索关键词
  const [likeCount, setLikeCount] = useState(0);            // 点赞数


  // ========== useRef：保存数据，但不触发渲染 ==========

  const videoRef = useRef(null);           // 保存 video 元素
  const inputRef = useRef(null);           // 保存 input 元素
  const renderCountRef = useRef(0);        // 保存渲染次数


  // ========== useEffect：数据变化后做事情 ==========

  // 1. 组件挂载时，从 localStorage 获取评论
  useEffect(() => {
    const savedComments = localStorage.getItem('comments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);  // 空依赖，只执行一次

  // 2. 评论变化时，保存到 localStorage
  useEffect(() => {
    if (comments.length > 0) {
      localStorage.setItem('comments', JSON.stringify(comments));
    }
  }, [comments]);  // comments 变化时执行

  // 3. 点赞数变化时，修改页面标题
  useEffect(() => {
    document.title = `${likeCount} 个赞`;
  }, [likeCount]);

  // 4. 记录渲染次数
  useEffect(() => {
    renderCountRef.current++;
    console.log('组件渲染了', renderCountRef.current, '次');
  });


  // ========== useMemo：缓存计算结果 ==========

  // 过滤评论（根据搜索关键词）
  const filteredComments = useMemo(() => {
    console.log('正在过滤评论...');
    return comments.filter(comment => 
      comment.text.includes(searchKeyword)
    );
  }, [comments, searchKeyword]);  // comments 或 searchKeyword 变化时重新计算


  // ========== useCallback：缓存函数 ==========

  // 播放/暂停视频
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

  // 添加评论
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
      inputRef.current.focus();  // 添加后聚焦输入框
    }
  }, [comments, newComment]);

  // 点赞评论
  const likeComment = useCallback((id) => {
    setComments(comments.map(comment => 
      comment.id === id 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  }, [comments]);


  // ========== 渲染 ==========

  return (
    <div className="video-player-container">
      <h1>React 19 Hooks 视频播放器</h1>
      
      {/* 视频播放器 */}
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
    
      {/* 搜索框 */}
      <div className="search-section">
        <input
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="🔍 搜索评论..."
          className="search-input"
        />
      </div>
    
      {/* 添加评论 */}
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
    
      {/* 评论列表 */}
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
        <small>渲染次数: {renderCountRef.current}</small>
      </div>
    </div>
  );
}

// 评论组件
function CommentItem({ comment, onLike }) {
  console.log('CommentItem 渲染:', comment.text);

  return (
    <div className="comment-item">
      <p className="comment-text">{comment.text}</p>
      <button onClick={() => onLike(comment.id)} className="comment-like-button">
        👍 {comment.likes}
      </button>
    </div>
  );
}

export default VideoPlayer;
