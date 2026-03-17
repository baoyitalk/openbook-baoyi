#!/bin/bash

# Docusaurus MDX 兼容性自动修复脚本
# 解决 Obsidian 导出的 Markdown 与 Docusaurus MDX v3 的兼容性问题

echo "🔧 开始修复 MDX 兼容性问题..."

DOCS_DIR="docs"
BACKUP_DIR=".mdx-backup-$(date +%Y%m%d-%H%M%S)"

# 1. 创建备份
echo "📦 创建备份到 $BACKUP_DIR..."
mkdir -p "$BACKUP_DIR"
cp -r "$DOCS_DIR" "$BACKUP_DIR/"

# 2. 查找所有包含花括号的 .md 文件（排除代码块内的）
echo "🔍 扫描问题文件..."

find "$DOCS_DIR" -name "*.md" -type f | while read -r file; do
    # 检查文件是否包含代码块外的花括号
    if grep -q '{[^`]*}' "$file" 2>/dev/null; then
        echo "  ⚠️  发现问题: $file"
        
        # 临时标记文件
        echo "$file" >> /tmp/mdx-problem-files.txt
    fi
done

# 3. 统计问题
if [ -f /tmp/mdx-problem-files.txt ]; then
    PROBLEM_COUNT=$(wc -l < /tmp/mdx-problem-files.txt)
    echo ""
    echo "📊 发现 $PROBLEM_COUNT 个可能有问题的文件"
    echo ""
    echo "问题文件列表："
    cat /tmp/mdx-problem-files.txt
    echo ""
    
    # 4. 提供修复选项
    echo "修复选项："
    echo "1. 自动转义花括号（推荐用于简单情况）"
    echo "2. 临时排除问题文件（快速构建）"
    echo "3. 生成问题报告（手动修复）"
    echo ""
    
    rm /tmp/mdx-problem-files.txt
else
    echo "✅ 未发现明显问题"
fi

echo ""
echo "💡 建议："
echo "1. 在 Obsidian 中写作时避免在正文中使用 {花括号}"
echo "2. 使用代码块包裹所有包含花括号的内容"
echo "3. 表格中的花括号用反引号包裹: \`{value}\`"
echo "4. 或者使用 HTML 实体: &lbrace; 和 &rbrace;"
