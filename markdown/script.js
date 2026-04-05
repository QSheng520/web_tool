// ----------------------------- 初始化配置 -----------------------------
const textarea = document.getElementById('markdownInput');
const previewDiv = document.getElementById('previewContent');
const wordCountSpan = document.getElementById('wordCount');
const cursorPosSpan = document.getElementById('cursorPos');
const syncToggle = document.getElementById('syncScrollToggle');

// 本地存储KEY
const STORAGE_KEY = 'md_editor_content';

// 配置 marked 与 高亮
if (typeof marked !== 'undefined') {
    marked.setOptions({
        gfm: true,
        breaks: true,
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(code, { language: lang }).value;
                } catch(e) {}
            }
            return hljs.highlightAuto(code).value;
        },
        headerIds: true,
        mangle: false
    });
}

// 渲染函数
function renderMarkdown() {
    let raw = textarea.value;
    if (raw === '') {
        previewDiv.innerHTML = '<div class="markdown-body" style="color:#94a3b8; text-align:center; padding:3rem;">✨ 开始书写你的 Markdown 笔记</div>';
        return;
    }
    try {
        // 处理 [TOC] 标签
        let processedText = raw;
        const hasTOC = /\[TOC\]/i.test(raw);
        
        if (hasTOC) {
            // 提取所有标题
            const headings = [];
            const headingRegex = /^(#{1,6})\s+(.+)$/gm;
            let match;
            while ((match = headingRegex.exec(raw)) !== null) {
                const level = match[1].length;
                const text = match[2].trim();
                const id = generateHeadingId(text);
                headings.push({ level, text, id });
            }
            
            // 生成目录 HTML
            let tocHTML = '<div class="toc-container"><h2>📑 目录</h2><ul class="toc-list">';
            let currentLevel = 0;
            
            headings.forEach((heading, index) => {
                const indent = heading.level - 1;
                if (indent > currentLevel) {
                    for (let i = currentLevel; i < indent; i++) {
                        tocHTML += '<ul>';
                    }
                } else if (indent < currentLevel) {
                    for (let i = currentLevel; i > indent; i--) {
                        tocHTML += '</ul>';
                    }
                }
                tocHTML += `<li><a href="#${heading.id}" onclick="scrollToHeading('${heading.id}')">${heading.text}</a></li>`;
                currentLevel = indent;
            });
            
            // 关闭所有未闭合的 ul
            for (let i = currentLevel; i > 0; i--) {
                tocHTML += '</ul>';
            }
            tocHTML += '</ul></div>';
            
            // 替换 [TOC] 标签
            processedText = raw.replace(/\[TOC\]/i, tocHTML);
            
            // 为标题添加 ID
            processedText = processedText.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title) => {
                const id = generateHeadingId(title.trim());
                return `${hashes} <span id="${id}">${title.trim()}</span>`;
            });
        }
        
        let html = marked.parse(processedText);
        previewDiv.innerHTML = `<div class="markdown-body">${html}</div>`;
        
        // 高亮代码块 (额外确保)
        previewDiv.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    } catch(e) {
        previewDiv.innerHTML = `<div class="markdown-body" style="color:red;">解析错误: ${e.message}</div>`;
    }
}

// 生成标题 ID
function generateHeadingId(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// 滚动到指定标题
function scrollToHeading(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// 统计字符 & 更新字数
function updateStats() {
    const content = textarea.value;
    const len = content.length;
    wordCountSpan.innerText = len + (len > 9999 ? ' 字' : ' 字符');
    // 光标行列简单统计
    const start = textarea.selectionStart;
    const lines = content.substring(0, start).split('\n');
    const row = lines.length;
    const col = lines[lines.length - 1].length + 1;
    cursorPosSpan.innerHTML = `<i class="far fa-caret-square-right"></i> 行:${row} 列:${col}`;
}

// 保存到本地存储
function saveToLocal() {
    localStorage.setItem(STORAGE_KEY, textarea.value);
}

// 加载存储内容 or 示例
function loadInitialContent() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved.trim().length > 0) {
        textarea.value = saved;
    } else {
        // 精美示例文档
        textarea.value = `# ✨ 欢迎使用墨客编辑器

[TOC]

> 实时预览 · 优雅高效 · 专注创作

## 📝 基础语法示范

- **加粗** 与 *斜体* 和 ~~删除线~~
- 无序列表项
- [超链接示例](https://github.com)

\`\`\`javascript
// 代码高亮演示
function greet() {
  console.log("Hello Markdown!");
}
\`\`\`

| 功能 | 快捷键 | 说明 |
|------|--------|------|
| 加粗 | Ctrl+B | 选中文本加粗 |
| 斜体 | Ctrl+I | 斜体样式 |
| 保存 | - | 自动存储本地 |

## 🎯 高级功能

### 目录生成
在文档开头添加 \`[TOC]\` 标签即可自动生成目录。

### 同步滚动
左右分栏可拖拽分割线，开启同步滚动更顺滑。

> 开始创作吧！🚀`;
    }
    renderMarkdown();
    updateStats();
    saveToLocal();
}

// ----- 工具栏插入操作 (核心) -----
function insertTextAtCursor(text, surroundBefore = '', surroundAfter = '') {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    let replacement = '';
    if (selected) {
        replacement = surroundBefore + selected + surroundAfter;
    } else {
        replacement = text;
    }
    const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    textarea.value = newValue;
    const newCursorPos = start + replacement.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
    renderMarkdown();
    updateStats();
    saveToLocal();
}

// 包装选中文本
function wrapSelection(before, after) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    let replacement = before + selected + after;
    if (!selected) {
        replacement = before + 'text' + after;
    }
    const newValue = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    textarea.value = newValue;
    const newCursor = start + replacement.length;
    textarea.setSelectionRange(newCursor, newCursor);
    textarea.focus();
    renderMarkdown();
    updateStats();
    saveToLocal();
}

// 工具栏映射
const actions = {
    bold: () => wrapSelection('**', '**'),
    italic: () => wrapSelection('*', '*'),
    heading: () => insertTextAtCursor('## 标题', '## 标题'),
    link: () => {
        const url = prompt('请输入链接URL:', 'https://');
        if (url) insertTextAtCursor(`[链接文字](${url})`, `[链接文字](${url})`);
    },
    image: () => {
        const imgUrl = prompt('图片地址:', 'https://picsum.photos/200/150');
        if (imgUrl) insertTextAtCursor(`![图片描述](${imgUrl})`, `![图片描述](${imgUrl})`);
    },
    ulist: () => insertTextAtCursor('- 列表项\n', '- 列表项\n'),
    olist: () => insertTextAtCursor('1. 有序项\n', '1. 有序项\n'),
    codeblock: () => insertTextAtCursor('```\n代码块\n```\n', '```\n代码块\n```\n'),
    quote: () => insertTextAtCursor('> 引用内容\n', '> 引用内容\n'),
    table: () => insertTextAtCursor('| 列1 | 列2 |\n| --- | --- |\n| 内容 | 内容 |\n', '| 列1 | 列2 |\n| --- | --- |\n| 内容 | 内容 |\n'),
    toc: () => insertTextAtCursor('[TOC]\n\n', '[TOC]\n\n'),
    save: () => {
        const blob = new Blob([textarea.value], {type: 'text/markdown'});
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `markdown_${new Date().toISOString().slice(0,19)}.md`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },
    copyMd: async () => {
        try {
            await navigator.clipboard.writeText(textarea.value);
            alert('✅ Markdown 源码已复制');
        } catch(e) { alert('复制失败'); }
    },
    copyHtml: async () => {
        const htmlContent = previewDiv.innerHTML;
        try {
            await navigator.clipboard.writeText(htmlContent);
            alert('✅ HTML 内容已复制到剪贴板');
        } catch(e) { alert('复制失败'); }
    },
    clear: () => {
        if (confirm('确定清空所有内容？')) {
            textarea.value = '';
            renderMarkdown();
            updateStats();
            saveToLocal();
        }
    },
    sample: () => {
        if (confirm('加载示例会覆盖当前内容，确认吗？')) {
            textarea.value = `# 🎉 示例文档

## 快速开始
1. 实时预览
2. 工具栏快捷插入
3. 支持表格、代码块、引用

\`\`\`python
print("Hello, Markdown World!")
\`\`\`

> 拖拽中央分隔条调整左右视野，开启同步滚动更流畅。

**享受写作吧！** 😊`;
            renderMarkdown();
            updateStats();
            saveToLocal();
        }
    }
};

// 绑定工具栏按钮
document.querySelectorAll('.toolbar-btn').forEach(btn => {
    const action = btn.getAttribute('data-action');
    if (action && actions[action]) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            actions[action]();
        });
    }
});

// 快捷键支持 Ctrl+B / Ctrl+I
textarea.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 'b') {
            e.preventDefault();
            actions.bold();
        } else if (e.key === 'i') {
            e.preventDefault();
            actions.italic();
        }
    }
    // 更新光标位置实时
    setTimeout(() => updateStats(), 5);
});

// 监听输入与滚动同步
textarea.addEventListener('input', () => {
    renderMarkdown();
    updateStats();
    saveToLocal();
});

textarea.addEventListener('click', updateStats);
textarea.addEventListener('keyup', updateStats);
textarea.addEventListener('select', updateStats);

// ----------------- 同步滚动逻辑 (优雅实现) -----------------
let isSyncing = false;
const leftPane = document.querySelector('.editor-pane');
const rightScrollable = document.querySelector('.preview-content');
const leftTextarea = textarea;

function getScrollPercentage(element, isTextarea = true) {
    if (isTextarea) {
        const sh = element.scrollHeight;
        const ch = element.clientHeight;
        if (sh <= ch) return 0;
        return element.scrollTop / (sh - ch);
    } else {
        const sh = element.scrollHeight;
        const ch = element.clientHeight;
        if (sh <= ch) return 0;
        return element.scrollTop / (sh - ch);
    }
}

function setScrollPercentage(element, percent, isTextarea = true) {
    if (isTextarea) {
        const sh = element.scrollHeight;
        const ch = element.clientHeight;
        if (sh > ch) {
            element.scrollTop = percent * (sh - ch);
        }
    } else {
        const sh = element.scrollHeight;
        const ch = element.clientHeight;
        if (sh > ch) {
            element.scrollTop = percent * (sh - ch);
        }
    }
}

function onLeftScroll() {
    if (!syncToggle.checked) return;
    if (isSyncing) return;
    isSyncing = true;
    const percent = getScrollPercentage(leftTextarea, true);
    setScrollPercentage(rightScrollable, percent, false);
    isSyncing = false;
}

function onRightScroll() {
    if (!syncToggle.checked) return;
    if (isSyncing) return;
    isSyncing = true;
    const percent = getScrollPercentage(rightScrollable, false);
    setScrollPercentage(leftTextarea, percent, true);
    isSyncing = false;
}

leftTextarea.addEventListener('scroll', onLeftScroll);
rightScrollable.addEventListener('scroll', onRightScroll);

// 渲染后可能导致高度变化, 重新微调同步 (可选防抖)
let resizeObserverTimer = null;
const reSyncOnRender = () => {
    if (syncToggle.checked && !isSyncing) {
        // 不做强行跳跃，维持比例优雅即可
    }
};
// 监听预览区内容变化后，尝试轻微同步保持阅读体验
const observer = new MutationObserver(() => {
    if (syncToggle.checked && !isSyncing) {
        // 不自动覆盖滚动，避免干扰；用户滚动行为优先
    }
});
observer.observe(previewDiv, { childList: true, subtree: true, characterData: true });

// ----------------- 拖拽分割线实现左右自由调整宽度 -----------------
const resizer = document.getElementById('resizer');
const editorPane = document.getElementById('editorPane');
const previewPane = document.getElementById('previewPane');
let startX, startLeftWidth, startRightWidth;
let isResizing = false;

function initResize() {
    if (!resizer || !editorPane || !previewPane) return;
    const container = document.querySelector('.editor-container');
    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        const containerRect = container.getBoundingClientRect();
        const leftRect = editorPane.getBoundingClientRect();
        startLeftWidth = leftRect.width;
        startRightWidth = previewPane.getBoundingClientRect().width;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        resizer.classList.add('active');
        e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const dx = e.clientX - startX;
        let newLeftWidth = startLeftWidth + dx;
        const containerRect = container.getBoundingClientRect();
        const minWidth = 220;
        const maxLeft = containerRect.width - minWidth - 5;
        if (newLeftWidth < minWidth) newLeftWidth = minWidth;
        if (newLeftWidth > maxLeft) newLeftWidth = maxLeft;
        const newRightWidth = containerRect.width - newLeftWidth - 5;
        if (newRightWidth < minWidth) return;
        editorPane.style.flex = 'none';
        previewPane.style.flex = 'none';
        editorPane.style.width = newLeftWidth + 'px';
        previewPane.style.width = newRightWidth + 'px';
    });
    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            resizer.classList.remove('active');
        }
    });
    window.addEventListener('resize', () => {
        if (!editorPane.style.width) return;
        const containerRect = container.getBoundingClientRect();
        const leftW = parseFloat(editorPane.style.width);
        if (leftW > containerRect.width - 230) {
            editorPane.style.width = containerRect.width - 230 + 'px';
            previewPane.style.width = 'auto';
        }
    });
}

// 重置宽度样式以便响应式
function resetWidthsOnMobile() {
    if (window.innerWidth <= 768) {
        editorPane.style.width = '';
        previewPane.style.width = '';
        editorPane.style.flex = '';
        previewPane.style.flex = '';
    }
}
window.addEventListener('resize', resetWidthsOnMobile);
resetWidthsOnMobile();

// 自动保存防抖 + 初始加载
let autoSaveTimer;
textarea.addEventListener('input', () => {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => saveToLocal(), 400);
});

// 启动编辑器
loadInitialContent();
initResize();

// 额外优化预览内链接在新窗口打开
document.addEventListener('click', (e) => {
    if (e.target.closest('.markdown-body a')) {
        const link = e.target.closest('a');
        if (link && link.href && !link.href.startsWith('#')) {
            e.preventDefault();
            window.open(link.href, '_blank');
        }
    }
});
