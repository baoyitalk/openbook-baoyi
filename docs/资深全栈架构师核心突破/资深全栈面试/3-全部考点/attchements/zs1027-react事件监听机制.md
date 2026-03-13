冒泡就是浏览器事件传播的机制。你点击一个按钮，事件不是只在按钮上触发，而是会像水里的气泡一样**从里往外一层层往上传**：

```
DOM 树结构：

  document
    └── <div id="root">        ← React 的监听器在这里等着
          └── <div class="app">
                └── <ul>
                      └── <li>
                            └── <button>点我</button>  ← 你点了这里
```

点击 button 后，事件传播路径：

```
第1步（捕获阶段，从外到里）：
  document → root → app → ul → li → button
                                        ↓
第2步（目标阶段）：                    button 触发
                                        ↓
第3步（冒泡阶段，从里到外）：
  button → li → ul → app → root → document
                              ↑
                         React 在这里接住事件
```

所以"等冒泡到 root"的意思是：

1. 你点了 button
2. 如果 button 上有**原生** addEventListener，立刻就触发了（事件到 button 就执行）
3. 事件继续往上冒泡：button → li → ul → app → **root**
4. 到了 root，React 的监听器才接住这个事件，然后去 Fiber 树里找对应的 onClick 处理函数
5. 所以 React 的合成事件**总是比同元素上的原生事件晚执行**

就像排队一样——原生事件在前排（目标元素上），合成事件在后排（root 上），事件冒泡经过前排才能到后排。