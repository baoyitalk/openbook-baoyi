import { useState } from 'react';
import './App.css';
import OriginalVersion from './App-Original';
import MemoVersion from './App-Memo';
import SplitVersion from './App-Split';

/**
 * 主入口：三种方案对比
 * 用于面试复习和性能优化学习
 */

function App() {
  const [currentVersion, setCurrentVersion] = useState('original');
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);

  return (
    <div style={{ padding: '20px' }}>
      {/* 版本切换器 */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        padding: '30px', 
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        zIndex: 1000,
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          marginBottom: '20px', 
          color: 'white',
          fontSize: '28px',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          🚀 React 性能优化三种方案对比
        </h2>
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button 
            onClick={() => setCurrentVersion('original')}
            style={{
              padding: '15px 30px',
              background: currentVersion === 'original' ? '#dc3545' : 'white',
              color: currentVersion === 'original' ? 'white' : '#333',
              border: currentVersion === 'original' ? 'none' : '2px solid #ddd',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              transition: 'all 0.3s',
              boxShadow: currentVersion === 'original' ? '0 4px 8px rgba(220,53,69,0.3)' : 'none',
              transform: currentVersion === 'original' ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            ❌ 方案0：原始版本
          </button>
          
          <button 
            onClick={() => setCurrentVersion('memo')}
            style={{
              padding: '15px 30px',
              background: currentVersion === 'memo' ? '#28a745' : 'white',
              color: currentVersion === 'memo' ? 'white' : '#333',
              border: currentVersion === 'memo' ? 'none' : '2px solid #ddd',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              transition: 'all 0.3s',
              boxShadow: currentVersion === 'memo' ? '0 4px 8px rgba(40,167,69,0.3)' : 'none',
              transform: currentVersion === 'memo' ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            ✅ 方案1：React.memo
          </button>
          
          <button 
            onClick={() => setCurrentVersion('split')}
            style={{
              padding: '15px 30px',
              background: currentVersion === 'split' ? '#ffc107' : 'white',
              color: currentVersion === 'split' ? '#333' : '#333',
              border: currentVersion === 'split' ? 'none' : '2px solid #ddd',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              transition: 'all 0.3s',
              boxShadow: currentVersion === 'split' ? '0 4px 8px rgba(255,193,7,0.3)' : 'none',
              transform: currentVersion === 'split' ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            ⭐ 方案2：组件拆分（推荐）
          </button>
        </div>
        
        {/* 折叠按钮 */}
        <button
          onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          style={{
            marginTop: '15px',
            padding: '8px 20px',
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '15px auto 0'
          }}
        >
          {isDescriptionOpen ? '▲ 收起说明' : '▼ 展开说明'}
        </button>

        {/* 说明文字 - 可折叠 */}
        {isDescriptionOpen && (
          <div style={{ 
            marginTop: '15px', 
            padding: '20px', 
            background: 'rgba(255,255,255,0.95)', 
            borderRadius: '10px',
            fontSize: '15px',
            lineHeight: '1.8',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            animation: 'slideDown 0.3s ease-out'
          }}>
          {currentVersion === 'original' && (
            <div>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '10px',
                color: '#dc3545'
              }}>
                ❌ 方案0：原始版本
              </div>
              <div style={{ 
                padding: '15px',
                background: '#fff3cd',
                borderLeft: '4px solid #ffc107',
                borderRadius: '5px'
              }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                  ⚠️ 问题：所有状态在根组件，任何状态变化都会导致整个组件树重新渲染
                </p>
                <p style={{ margin: '0', color: '#666' }}>
                  💡 测试方法：打开控制台，点击点赞按钮，观察所有组件都会重新渲染
                </p>
              </div>
            </div>
          )}
          {currentVersion === 'memo' && (
            <div>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '10px',
                color: '#28a745'
              }}>
                ✅ 方案1：React.memo 优化
              </div>
              <div style={{ 
                padding: '15px',
                background: '#d4edda',
                borderLeft: '4px solid #28a745',
                borderRadius: '5px'
              }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                  ✨ 优化：使用 React.memo 包裹子组件，配合 useCallback 保持函数引用稳定
                </p>
                <p style={{ margin: '0', color: '#666' }}>
                  💡 测试方法：打开控制台，点击点赞按钮，CommentSection 不会重新渲染
                </p>
              </div>
            </div>
          )}
          {currentVersion === 'split' && (
            <div>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '10px',
                color: '#ff6b35'
              }}>
                ⭐ 方案2：组件拆分（推荐）
              </div>
              <div style={{ 
                padding: '15px',
                background: '#fff3e0',
                borderLeft: '4px solid #ff6b35',
                borderRadius: '5px'
              }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                  🎯 最佳实践：状态下沉到各自组件，天然隔离，无需 memo
                </p>
                <p style={{ margin: '0', color: '#666' }}>
                  💡 测试方法：打开控制台，点击点赞按钮，只有 VideoSection 重新渲染
                </p>
              </div>
            </div>
          )}
          </div>
        )}
      </div>

      {/* 渲染对应版本 */}
      {currentVersion === 'original' && <OriginalVersion />}
      {currentVersion === 'memo' && <MemoVersion />}
      {currentVersion === 'split' && <SplitVersion />}
    </div>
  );
}

export default App;
