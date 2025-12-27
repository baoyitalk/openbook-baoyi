## 第一性原理拆解：JSX

### 核心问题：如何在 JavaScript 中优雅地描述 UI 结构？

---

## 一、什么是 JSX？

```
┌─────────────────────────────────────────────────────────┐
│  JSX = JavaScript XML                                   │
│  一种 JavaScript 的语法扩展，让你可以在 JS 中写类似     │
│  HTML 的代码来描述 UI                                   │
└─────────────────────────────────────────────────────────┘
```

### 本质：语法糖

```jsx
// JSX 写法
const element = <h1 className="title">Hello, World!</h1>;

// 编译后的真实代码（React 17 之前）
const element = React.createElement(
    'h1',
    { className: 'title' },
    'Hello, World!'
);

// React 17+ 自动引入
// import { jsx } from 'react/jsx-runtime'
const element = jsx('h1', { className: 'title', children: 'Hello, World!' });
```

### JSX 的特点

```jsx
// 1. 支持表达式（用 {} 包裹）
const name = 'React';
const element = <h1>Hello, {name}</h1>;

// 2. 支持条件和循环
const list = items.map(item => <li key={item.id}>{item.name}</li>);

// 3. 支持展开运算符
const props = { id: 'app', className: 'container' };
const element = <div {...props}>Content</div>;

// 4. 自动转义防 XSS
const userInput = '<script>alert("xss")</script>';
const safe = <div>{userInput}</div>;  // 会显示文本，不会执行

// 5. 忽略 false/null/undefined/true
<div>{false}</div>   // 渲染空
<div>{null}</div>    // 渲染空
<div>{undefined}</div>  // 渲染空
<div>{true}</div>    // 渲染空
```

---

## 二、为什么推荐使用 JSX？

```
┌─────────────────────────────────────────────────────────┐
│  React 的设计哲学：                                      │
│  渲染逻辑本质上与 UI 逻辑内在耦合                        │
│  • 事件绑定在 UI 中                                      │
│  • 状态变化需要通知 UI                                   │
│  • UI 需要展示数据                                       │
│                                                         │
│  所以：把标记（HTML）和逻辑（JS）放在一起 = 组件         │
└─────────────────────────────────────────────────────────┘
```

### 优势

```jsx
// 1. 直观：看起来像 HTML，易于理解
function Welcome({ name }) {
    return <h1>Hello, {name}</h1>;
}

// 2. 强大：可以使用 JS 的全部能力
function List({ items }) {
    return (
        <ul>
            {items
                .filter(item => item.active)
                .map(item => <li key={item.id}>{item.name}</li>)
            }
        </ul>
    );
}

// 3. 类型安全：配合 TypeScript 有完整类型检查
interface Props {
    name: string;
    age: number;
}
function User({ name, age }: Props) {
    return <div>{name}: {age}</div>;
}

// 4. 编译时优化：Babel 可以做静态分析和优化
```

---

## 三、JSX 与 XSS 安全

### 默认转义

```jsx
// React DOM 在渲染前会将所有输入转义为字符串
const userInput = '<script>alert("xss")</script>';
const element = <div>{userInput}</div>;

// 渲染结果：<div>&lt;script&gt;alert("xss")&lt;/script&gt;</div>
// 显示为文本，不会执行脚本
```

### 危险操作

```jsx
// 如果确实需要渲染 HTML，使用 dangerouslySetInnerHTML
// ⚠️ 名字故意设计得很长，提醒你这很危险！
const html = '<strong>加粗文字</strong>';

// ❌ 不会渲染 HTML
<div>{html}</div>  // 显示原始字符串

// ✅ 会渲染 HTML（确保内容可信！）
<div dangerouslySetInnerHTML={{ __html: html }} />

// 实际使用前一定要消毒！
import DOMPurify from 'dompurify';
const cleanHtml = DOMPurify.sanitize(dirtyHtml);
<div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
```

---

## 四、JSX 条件渲染

### 方法一：if/else 语句

```jsx
function Greeting({ isLoggedIn }) {
    if (isLoggedIn) {
        return <h1>Welcome back!</h1>;
    }
    return <h1>Please sign in.</h1>;
}
```

### 方法二：三元运算符

```jsx
function Greeting({ isLoggedIn }) {
    return (
        <div>
            {isLoggedIn ? <UserGreeting /> : <GuestGreeting />}
        </div>
    );
}
```

### 方法三：逻辑与 &&

```jsx
function Mailbox({ unreadMessages }) {
    return (
        <div>
            <h1>Hello!</h1>
            {unreadMessages.length > 0 && (
                <h2>You have {unreadMessages.length} unread messages.</h2>
            )}
        </div>
    );
}

// ⚠️ 注意：0 && <Component /> 会渲染 0
// 解决方案：
{count > 0 && <Component />}      // ✅
{!!count && <Component />}        // ✅
{count ? <Component /> : null}    // ✅
```

### 方法四：封装条件组件

```jsx
// 封装一个条件渲染组件
function If({ condition, children }) {
    return condition ? children : null;
}

// 使用
<If condition={isLoggedIn}>
    <Dashboard />
</If>
```

### 经典面试代码：多条件渲染

```jsx
function StatusBadge({ status }) {
    const statusConfig = {
        pending: { color: 'yellow', text: '待处理' },
        approved: { color: 'green', text: '已通过' },
        rejected: { color: 'red', text: '已拒绝' }
    };
    
    const config = statusConfig[status] || { color: 'gray', text: '未知' };
    
    return (
        <span style={{ color: config.color }}>
            {config.text}
        </span>
    );
}
```

---

## 五、JSX 循环渲染

### 方法一：map（最常用）

```jsx
function List({ items }) {
    return (
        <ul>
            {items.map(item => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
}
```

### 方法二：filter + map

```jsx
function ActiveList({ items }) {
    return (
        <ul>
            {items
                .filter(item => item.active)
                .map(item => (
                    <li key={item.id}>{item.name}</li>
                ))
            }
        </ul>
    );
}
```

### 方法三：for 循环（需要变量存储）

```jsx
function List({ items }) {
    const listItems = [];
    for (let i = 0; i < items.length; i++) {
        listItems.push(<li key={items[i].id}>{items[i].name}</li>);
    }
    return <ul>{listItems}</ul>;
}
```

### 经典面试：key 的作用

```jsx
// ❌ 错误：使用 index 作为 key
{items.map((item, index) => (
    <li key={index}>{item.name}</li>
))}

// ✅ 正确：使用唯一且稳定的 id
{items.map(item => (
    <li key={item.id}>{item.name}</li>
))}

// key 的作用：
// 1. 帮助 React 识别哪些元素改变了
// 2. 提高 diff 算法效率
// 3. 避免状态错乱

// 什么时候可以用 index？
// • 列表不会重新排序
// • 列表不会过滤
// • 列表项没有自己的状态
```

---

## 六、为什么 class 变成 className？

```
┌─────────────────────────────────────────────────────────┐
│  本质原因：                                              │
│  class 是 HTML 属性名                                    │
│  className 是 DOM 元素的属性名                           │
│                                                         │
│  JSX 更接近 JavaScript/DOM，而不是 HTML                  │
└─────────────────────────────────────────────────────────┘
```

### 代码说明

```javascript
// HTML 属性
<div class="container"></div>

// DOM 属性（JavaScript 操作）
element.className = 'container';  // ✅ className
element.class = 'container';      // ❌ 无效，因为 class 是保留字

// JSX 使用 DOM 属性名
<div className="container"></div>
```

### 其他类似转换

```jsx
// HTML 属性 → JSX 属性
// class → className
// for → htmlFor（label 标签）
// tabindex → tabIndex
// onclick → onClick（驼峰命名）

// 示例
<label htmlFor="email">Email:</label>
<input id="email" tabIndex={1} onClick={handleClick} />
```

---

## 七、经典面试代码

### 1. JSX 编译结果

```jsx
// 面试题：下面 JSX 编译后是什么？
const element = (
    <div className="container">
        <h1>Title</h1>
        <p>Content</p>
    </div>
);

// 答案：
const element = React.createElement(
    'div',
    { className: 'container' },
    React.createElement('h1', null, 'Title'),
    React.createElement('p', null, 'Content')
);
```

### 2. 条件渲染的坑

```jsx
// 面试题：下面代码有什么问题？
function App({ count }) {
    return (
        <div>
            {count && <span>Count: {count}</span>}
        </div>
    );
}

// 问题：当 count = 0 时，会渲染数字 0
// 解决：
{count > 0 && <span>Count: {count}</span>}
// 或
{count ? <span>Count: {count}</span> : null}
```

### 3. Fragment 使用

```jsx
// 需要返回多个元素但不想增加额外 DOM 节点
function Columns() {
    return (
        <>
            <td>Column 1</td>
            <td>Column 2</td>
        </>
    );
}

// 需要传 key 时使用完整语法
function List({ items }) {
    return items.map(item => (
        <React.Fragment key={item.id}>
            <dt>{item.term}</dt>
            <dd>{item.description}</dd>
        </React.Fragment>
    ));
}
```

### 4. 动态组件渲染

```jsx
// 根据类型渲染不同组件
const components = {
    text: TextInput,
    number: NumberInput,
    select: SelectInput
};

function DynamicField({ type, ...props }) {
    const Component = components[type];
    
    if (!Component) {
        return <div>Unknown field type: {type}</div>;
    }
    
    return <Component {...props} />;
}
```

### 5. 子元素处理

```jsx
// React.Children API
function List({ children }) {
    return (
        <ul>
            {React.Children.map(children, (child, index) => (
                <li key={index}>{child}</li>
            ))}
        </ul>
    );
}

// 使用
<List>
    <span>Item 1</span>
    <span>Item 2</span>
    <span>Item 3</span>
</List>
```

---

## 总结

```
┌─────────────────────────────────────────────────────────────────┐
│                         JSX 核心要点                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  本质                                                           │
│  └── React.createElement 的语法糖，编译后变成函数调用           │
│                                                                 │
│  特点                                                           │
│  ├── {} 内可写任意 JS 表达式                                    │
│  ├── 自动转义防 XSS                                             │
│  ├── false/null/undefined/true 不渲染                           │
│  └── 使用 className 代替 class                                  │
│                                                                 │
│  条件渲染                                                       │
│  ├── if/else（return 前判断）                                   │
│  ├── 三元运算符（condition ? A : B）                            │
│  ├── 逻辑与（condition && A）                                   │
│  └── ⚠️ 注意 0 && A 会渲染 0                                    │
│                                                                 │
│  循环渲染                                                       │
│  ├── map 最常用                                                 │
│  ├── key 必须唯一且稳定                                         │
│  └── 避免用 index 作为 key（除非列表静态）                      │
│                                                                 │
│  安全                                                           │
│  ├── 默认转义所有输入                                           │
│  └── dangerouslySetInnerHTML 需谨慎使用                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**核心记忆：JSX 是语法糖，{} 写表达式，自动防 XSS，key 要稳定唯一。**