// ----------------------------- 初始化配置 -----------------------------
const textarea = document.getElementById('markdownInput');
const previewDiv = document.getElementById('previewContent');
const wordCountSpan = document.getElementById('wordCount');
const cursorPosSpan = document.getElementById('cursorPos');
const syncToggle = document.getElementById('syncScrollToggle');

// 本地存储KEY
const STORAGE_KEY = 'md_editor_content';

// 模板库
const TEMPLATES = [
    {
        id: 'welcome',
        type: 'doc',
        icon: '✨',
        title: '欢迎文档',
        description: '编辑器功能介绍与基础语法演示',
        tags: ['入门', '示例'],
        content: `# ✨ 欢迎使用墨客编辑器

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

> 开始创作吧！🚀`
    },
    {
        id: 'tech-doc',
        type: 'doc',
        icon: '📄',
        title: '技术文档',
        description: '标准的技术文档模板，包含API、示例等',
        tags: ['技术', '文档'],
        content: `# [项目名称] 技术文档

[TOC]

## 📋 概述

简要描述项目的背景、目标和主要功能。

### 核心特性

- 特性一：描述
- 特性二：描述
- 特性三：描述

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装步骤

\`\`\`bash
npm install project-name
cd project-name
npm start
\`\`\`

### 基本用法

\`\`\`javascript
const app = require('project-name');
app.init({
  port: 3000,
  debug: true
});
\`\`\`

## 📖 API 参考

### 方法一：initialize()

初始化应用实例。

**参数：**

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| options | Object | 是 | 配置对象 |
| options.port | Number | 否 | 端口号，默认 3000 |

**返回值：** Promise<void>

**示例：**

\`\`\`javascript
await app.initialize({ port: 8080 });
console.log('应用已启动');
\`\`\`

## 🔧 配置说明

### 环境变量

\`\`\`
DATABASE_URL=mongodb://localhost:27017/mydb
API_KEY=your_api_key_here
DEBUG=true
\`\`\`

## 📝 更新日志

### v1.0.0 (2024-01-01)

- ✨ 初始版本发布
- 🐛 修复已知问题
- 📝 完善文档

## ❓ 常见问题

**Q: 如何修改默认端口？**
A: 在配置文件中设置 \`port\` 参数即可。

**Q: 支持哪些数据库？**
A: 目前支持 MongoDB、PostgreSQL 和 MySQL。

## 📞 联系方式

- 邮箱：support@example.com
- GitHub：[issues](https://github.com/example/project/issues)

---

> 最后更新：2024-01-01`
    },
    {
        id: 'meeting-notes',
        type: 'meeting',
        icon: '📅',
        title: '会议记录',
        description: '结构化的会议纪要模板',
        tags: ['会议', '记录'],
        content: `# 会议记录

[TOC]

## 📋 基本信息

- **会议主题：** [填写主题]
- **会议时间：** 2024-01-01 14:00-15:30
- **会议地点：** [线上/线下地点]
- **主持人：** [姓名]
- **记录人：** [姓名]
- **参会人员：** [列出所有参会者]
- **缺席人员：** [如有]

## 📝 议程

1. 议题一：[标题]
2. 议题二：[标题]
3. 议题三：[标题]

## 💬 讨论内容

### 议题一：[标题]

**讨论要点：**
- 要点一
- 要点二

**决策结果：**
> [记录达成的共识或决策]

**待办事项：**
- [ ] [任务描述] - @[负责人] - 截止日期：YYYY-MM-DD

### 议题二：[标题]

**讨论要点：**
- 要点一
- 要点二

**决策结果：**
> [记录达成的共识或决策]

## ✅ 行动项汇总

| 序号 | 任务描述 | 负责人 | 截止日期 | 优先级 |
|------|----------|--------|----------|--------|
| 1 | [任务一] | @某人 | 2024-01-15 | 🔴 高 |
| 2 | [任务二] | @某人 | 2024-01-20 | 🟡 中 |
| 3 | [任务三] | @某人 | 2024-01-25 | 🟢 低 |

## 📌 下次会议

- **时间：** [待定]
- **议题：** [初步计划]

## 📎 附件

- [相关文档链接](#)
- [演示文稿](#)

---
*会议记录创建于 ${new Date().toLocaleDateString('zh-CN')}*`
    },
    {
        id: 'project-plan',
        type: 'project',
        icon: '📊',
        title: '项目计划',
        description: '完整的项目规划与管理模板',
        tags: ['项目', '管理'],
        content: `# [项目名称] 项目计划

[TOC]

## 🎯 项目概述

### 项目背景
[描述项目的背景和必要性]

### 项目目标
- **主要目标：** [SMART原则描述]
- **次要目标：** [其他目标]

### 成功指标
- 指标一：[具体数值]
- 指标二：[具体数值]

## 👥 团队组成

| 角色 | 姓名 | 职责 | 联系方式 |
|------|------|------|----------|
| 项目经理 | [姓名] | 整体协调 | email@example.com |
| 技术负责人 | [姓名] | 技术架构 | email@example.com |
| 前端开发 | [姓名] | 界面开发 | email@example.com |
| 后端开发 | [姓名] | 服务端开发 | email@example.com |
| UI设计师 | [姓名] | 视觉设计 | email@example.com |

## 📅 时间计划

### 里程碑

| 阶段 | 开始日期 | 结束日期 | 交付物 |
|------|----------|----------|--------|
| 需求分析 | 2024-01-01 | 2024-01-15 | 需求文档 |
| 系统设计 | 2024-01-16 | 2024-01-31 | 设计文档 |
| 开发实现 | 2024-02-01 | 2024-03-15 | 源代码 |
| 测试验收 | 2024-03-16 | 2024-03-31 | 测试报告 |
| 上线部署 | 2024-04-01 | 2024-04-07 | 上线系统 |

### 甘特图（简化版）

\`\`\`
1月: [====需求====][====设计====]
2月: [========开发========]
3月: [====开发====][====测试====]
4月: [==部署==]
\`\`\`

## 📦 资源需求

### 人力资源
- 开发人员：X人
- 测试人员：X人
- 设计人员：X人

### 技术资源
- 服务器：[配置要求]
- 软件许可：[清单]
- 第三方服务：[清单]

### 预算估算

| 项目 | 金额 | 备注 |
|------|------|------|
| 人力成本 | ¥XXX,XXX | X人×X月 |
| 服务器费用 | ¥XX,XXX | 云服务 |
| 软件许可 | ¥X,XXX | 工具授权 |
| **总计** | **¥XXX,XXX** | - |

## ⚠️ 风险管理

| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| 技术风险 | 中 | 高 | 提前技术预研 |
| 人员变动 | 低 | 中 | 建立备份机制 |
| 需求变更 | 高 | 高 | 严格变更流程 |

## 📊 沟通计划

- **每日站会：** 9:30 AM，15分钟
- **周例会：** 每周一 2:00 PM
- **月度汇报：** 每月最后一个周五
- **沟通工具：** Slack / 企业微信

## 📝 附录

- [需求文档链接](#)
- [设计稿链接](#)
- [技术规范](#)

---
*文档版本：v1.0 | 最后更新：${new Date().toLocaleDateString('zh-CN')}*`
    },
    {
        id: 'study-note',
        type: 'note',
        icon: '📚',
        title: '学习笔记',
        description: '结构化的知识整理与复习笔记',
        tags: ['学习', '笔记'],
        content: `# [主题] 学习笔记

[TOC]

## 📖 学习概览

- **学习主题：** [填写主题]
- **学习时间：** YYYY-MM-DD
- **资料来源：** [书籍/课程/文章链接]
- **学习时长：** X小时

## 🎯 学习目标

- [ ] 掌握核心概念
- [ ] 理解关键原理
- [ ] 能够实际应用

## 💡 核心知识点

### 1. [知识点名称]

**定义：**
> [简明扼要的定义]

**关键要点：**
- 要点一
- 要点二
- 要点三

**示例：**

\`\`\`javascript
// 代码示例
const example = 'demo';
console.log(example);
\`\`\`

**个人理解：**
[用自己的话解释这个概念]

### 2. [知识点名称]

**对比分析：**

| 特性 | 方案A | 方案B |
|------|-------|-------|
| 优点 | ... | ... |
| 缺点 | ... | ... |
| 适用场景 | ... | ... |

## ❓ 疑问与解答

**Q1：** [问题描述]

**A：** [答案或思考过程]

**Q2：** [问题描述]

**A：** [答案或思考过程]

## 🔗 相关知识链接

- [相关文章1](#)
- [视频教程](#)
- [官方文档](#)

## 📝 总结与反思

### 收获
1. 学到了...
2. 理解了...
3. 掌握了...

### 不足
- [ ] 需要进一步学习的部分
- [ ] 实践中遇到的问题

### 下一步计划
- [ ] 练习题目/项目
- [ ] 深入学习相关主题
- [ ] 分享给他人

## 🔄 复习计划

- **第一次复习：** 学习后1天
- **第二次复习：** 学习后3天
- **第三次复习：** 学习后7天
- **第四次复习：** 学习后30天

---
*笔记创建时间：${new Date().toLocaleString('zh-CN')}*
*下次复习时间：[日期]*`
    },
    {
        id: 'blog-post',
        type: 'blog',
        icon: '✍️',
        title: '博客文章',
        description: '适合发布的技术博客或个人文章',
        tags: ['博客', '写作'],
        content: `# [吸引人的标题]

> [副标题或简短摘要，一句话概括文章核心内容]

![封面图片](https://picsum.photos/800/400)

## 📝 前言

[引入话题，说明为什么要写这篇文章，读者能从中获得什么价值]

**阅读本文你将学到：**
- ✅ 知识点一
- ✅ 知识点二
- ✅ 知识点三

**预计阅读时间：** X分钟

---

## 🎯 问题背景

[描述要解决的问题或要探讨的主题，给出必要的背景信息]

### 为什么这很重要？

[解释这个问题的重要性，为什么值得讨论]

## 💡 解决方案

### 方法一：[方案名称]

[详细描述第一种解决方案]

**优点：**
- 优势一
- 优势二

**缺点：**
- 劣势一
- 劣势二

**代码示例：**

\`\`\`javascript
// 实现代码
function solution1() {
  // 你的代码
  return result;
}
\`\`\`

### 方法二：[方案名称]

[详细描述第二种解决方案]

**性能对比：**

| 方案 | 时间复杂度 | 空间复杂度 | 可读性 |
|------|-----------|-----------|--------|
| 方法一 | O(n) | O(1) | ⭐⭐⭐ |
| 方法二 | O(log n) | O(n) | ⭐⭐⭐⭐ |

## 🔍 深入分析

[更深入的技术细节或原理解释]

### 关键代码解析

\`\`\`javascript
// 重点代码片段
const keyPart = () => {
  // 这是核心逻辑
  return importantResult;
};
\`\`\`

**代码说明：**
1. 第一步做什么
2. 第二步做什么
3. 最终得到什么结果

## 📊 实践案例

[给出一个实际的例子或应用场景]

**场景描述：**
> [具体场景]

**实施步骤：**
1. 步骤一
2. 步骤二
3. 步骤三

**最终效果：**
![效果展示](https://picsum.photos/600/300)

## ⚠️ 注意事项

- **注意一：** [重要提醒]
- **注意二：** [常见陷阱]
- **注意三：** [最佳实践]

## 🎓 总结

[总结全文要点，强调核心价值]

**核心要点回顾：**
1. 要点一
2. 要点二
3. 要点三

## 📚 延伸阅读

- [相关主题文章1](#)
- [推荐书籍](#)
- [在线资源](#)

## 💬 互动环节

**思考题：** [提出一个问题让读者思考]

欢迎在评论区分享你的想法和经验！

---

**关于作者：**
> [简短的自我介绍]

**喜欢这篇文章？**
- 👍 点赞支持
- 🔄 分享给朋友
- 💬 留下评论

*原文发布于：${new Date().toLocaleDateString('zh-CN')}*
*本文链接：[URL]*`
    },
    {
        id: 'api-doc',
        type: 'api',
        icon: '🔌',
        title: 'API 文档',
        description: 'RESTful API 接口文档模板',
        tags: ['API', '接口'],
        content: `# API 接口文档

[TOC]

## 📋 概述

本文档描述了 [系统名称] 的所有 RESTful API 接口。

**Base URL:** \`https://api.example.com/v1\`

**认证方式：** Bearer Token

## 🔐 认证

### 获取 Token

\`\`\`http
POST /auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "your_password"
}
\`\`\`

**响应：**

\`\`\`json
{
  "code": 200,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}
\`\`\`

### 使用 Token

在所有请求的 Header 中添加：

\`\`\`
Authorization: Bearer {your_token}
\`\`\`

## 📊 用户管理

### 1. 获取用户列表

**接口：** \`GET /users\`

**查询参数：**

| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| page | Integer | 否 | 页码，默认1 | 1 |
| limit | Integer | 否 | 每页数量，默认20 | 20 |
| keyword | String | 否 | 搜索关键词 | john |

**请求示例：**

\`\`\`bash
curl -X GET "https://api.example.com/v1/users?page=1&limit=10" \\
  -H "Authorization: Bearer YOUR_TOKEN"
\`\`\`

**成功响应 (200)：**

\`\`\`json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "items": [
      {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
\`\`\`

### 2. 创建用户

**接口：** \`POST /users\`

**请求体：**

\`\`\`json
{
  "username": "new_user",
  "email": "newuser@example.com",
  "password": "secure_password",
  "role": "user"
}
\`\`\`

**字段说明：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | String | 是 | 用户名，3-20个字符 |
| email | String | 是 | 邮箱地址 |
| password | String | 是 | 密码，最少8个字符 |
| role | String | 否 | 角色，默认"user" |

**成功响应 (201)：**

\`\`\`json
{
  "code": 201,
  "message": "用户创建成功",
  "data": {
    "id": 123,
    "username": "new_user",
    "email": "newuser@example.com"
  }
}
\`\`\`

### 3. 获取用户详情

**接口：** \`GET /users/{id}\`

**路径参数：**

| 参数 | 类型 | 说明 |
|------|------|------|
| id | Integer | 用户ID |

**成功响应 (200)：**

\`\`\`json
{
  "code": 200,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "profile": {
      "avatar": "https://example.com/avatar.jpg",
      "bio": "开发者"
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T00:00:00Z"
  }
}
\`\`\`

### 4. 更新用户

**接口：** \`PUT /users/{id}\`

**请求体：**

\`\`\`json
{
  "email": "newemail@example.com",
  "profile": {
    "bio": "新的个人简介"
  }
}
\`\`\`

### 5. 删除用户

**接口：** \`DELETE /users/{id}\`

**成功响应 (204)：**

\`\`\`json
{
  "code": 204,
  "message": "用户已删除"
}
\`\`\`

## ⚠️ 错误码

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权，Token无效或过期 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 409 | 资源冲突（如用户名已存在） |
| 429 | 请求频率超限 |
| 500 | 服务器内部错误 |

**错误响应格式：**

\`\`\`json
{
  "code": 400,
  "message": "参数验证失败",
  "errors": [
    {
      "field": "email",
      "message": "邮箱格式不正确"
    }
  ]
}
\`\`\`

## 📈 速率限制

- 普通用户：100次/分钟
- VIP用户：1000次/分钟

**响应头：**

\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
\`\`\`

## 📞 技术支持

- 邮箱：api-support@example.com
- 文档：https://docs.example.com

---
*API版本：v1.0 | 最后更新：${new Date().toLocaleDateString('zh-CN')}*`
    },
    {
        id: 'tutorial',
        type: 'tutorial',
        icon: '🎓',
        title: '教程指南',
        description: '逐步教学的操作指南',
        tags: ['教程', '指南'],
        content: `# [主题] 完全教程

[TOC]

## 🎯 学习目标

完成本教程后，你将能够：
- ✅ 技能一
- ✅ 技能二
- ✅ 技能三

**难度等级：** ⭐⭐☆ 初级/中级/高级  
**预计时间：** X小时

## 📋 前置要求

在开始之前，请确保你具备：

- [ ] 基础知识一
- [ ] 基础知识二
- [ ] 所需软件/工具已安装

### 环境准备

\`\`\`bash
# 安装必要工具
npm install -g required-tool

# 验证安装
required-tool --version
\`\`\`

## 🚀 第一步：[步骤名称]

### 1.1 子步骤

[详细说明操作内容]

**操作截图：**
![步骤说明](https://picsum.photos/600/300)

**代码示例：**

\`\`\`javascript
// 执行这个操作
const result = doSomething();
console.log(result);
\`\`\`

> 💡 **提示：** 这里可以添加有用的提示

### 1.2 验证结果

[说明如何验证这一步是否成功]

**预期输出：**

\`\`\`
Success: Operation completed!
\`\`\`

## 🔧 第二步：[步骤名称]

### 2.1 配置设置

[详细的配置说明]

**配置文件示例：**

\`\`\`json
{
  "setting1": "value1",
  "setting2": true,
  "options": {
    "option1": "enabled"
  }
}
\`\`\`

### 2.2 常见问题

**问题：** [可能遇到的问题]

**解决方案：**
\`\`\`bash
# 运行这个命令修复
fix-command --option
\`\`\`

## 💻 第三步：[实践操作]

### 3.1 动手练习

[给出具体的练习任务]

**任务要求：**
1. 完成功能一
2. 实现功能二
3. 优化性能

**参考代码：**

\`\`\`javascript
// 尝试自己完成，再看答案
function practice() {
  // 你的代码在这里
  return solution;
}
\`\`\`

<details>
<summary>👁️ 点击查看答案</summary>

\`\`\`javascript
function practice() {
  // 参考答案
  return correctSolution;
}
\`\`\`

</details>

## 🎨 第四步：[进阶内容]

### 4.1 最佳实践

- **实践一：** [说明]
- **实践二：** [说明]
- **实践三：** [说明]

### 4.2 性能优化

[优化技巧和注意事项]

**优化前后对比：**

| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| 加载时间 | 2s | 0.5s | 75% ↓ |
| 内存占用 | 100MB | 60MB | 40% ↓ |

## 📝 总结

### 核心要点

1. **要点一：** [总结]
2. **要点二：** [总结]
3. **要点三：** [总结]

### 知识图谱

\`\`\`
基础概念 → 核心技能 → 进阶应用 → 实战项目
\`\`\`

## 🎓 下一步学习

- [ ] 完成课后练习
- [ ] 阅读进阶教程
- [ ] 参与实际项目

### 推荐资源

- 📖 [相关书籍](#)
- 🎥 [视频教程](#)
- 💬 [社区论坛](#)

## ❓ 常见问题 FAQ

**Q1：[常见问题]**

A：[详细解答]

**Q2：[常见问题]**

A：[详细解答]

## 💬 反馈与交流

如果遇到问题或有建议：
- 📧 邮件：tutorial@example.com
- 💬 讨论区：[链接]
- 🐛 问题反馈：[GitHub Issues]

---

**教程版本：** v1.0  
**最后更新：** ${new Date().toLocaleDateString('zh-CN')}  
**作者：** [你的名字]

*觉得有用？请给个 ⭐ Star！*`
    },
    {
        id: 'changelog',
        type: 'changelog',
        icon: '📝',
        title: '更新日志',
        description: '软件版本的变更记录',
        tags: ['版本', '日志'],
        content: `# 更新日志 (Changelog)

[TOC]

所有重要的项目更改都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/)，
版本号遵循 [语义化版本](https://semver.org/)。

## [未发布]

### 新增
- 🆕 新功能一
- 🆕 新功能二

### 改进
- ⚡ 性能优化一
- 🎨 用户体验改进

### 修复
- 🐛 修复Bug一
- 🐛 修复Bug二

## [v1.2.0] - 2024-01-15

### 新增
- 🆕 添加了用户权限管理系统
- 🆕 支持多语言国际化
- 🆕 新增数据导出功能（CSV/Excel）

### 改进
- ⚡ 优化数据库查询性能，提升 50%
- 🎨 重新设计用户界面，更加现代化
- 📱 改进移动端适配
- ♿ 增强无障碍访问支持

### 修复
- 🐛 修复登录时的会话超时问题
- 🐛 修复文件上传大小限制不生效
- 🐛 修复时区显示错误
- 🐛 修复某些浏览器下的样式兼容性问题

### 变更
- 🔄 更新了依赖库到最新版本
- 🔄 修改了 API 响应格式（向后兼容）

### 废弃
- ⚠️ 废弃旧版 API 端点 \`/api/v1/legacy\`

## [v1.1.0] - 2023-12-01

### 新增
- 🆕 添加了搜索功能
- 🆕 支持批量操作
- 🆕 新增数据统计面板

### 改进
- ⚡ 提升了页面加载速度
- 🔒 增强了安全性，添加了 CSRF 保护

### 修复
- 🐛 修复分页显示错误
- 🐛 修复数据排序问题

## [v1.0.0] - 2023-10-15

### 新增
- 🎉 首次正式发布
- 🆕 基础 CRUD 功能
- 🆕 用户认证与授权
- 🆕 RESTful API 接口
- 🆕 响应式 Web 界面

### 说明
这是第一个稳定版本，包含了核心功能。

---

## 版本说明

### 语义化版本格式

- **主版本号（MAJOR）：** 不兼容的 API 修改
- **次版本号（MINOR）：** 向下兼容的功能性新增
- **修订号（PATCH）：** 向下兼容的问题修正

### 更新类型标识

- 🆕 **Added** - 新增功能
- 🔄 **Changed** - 功能变更
- ⚠️ **Deprecated** - 即将废弃的功能
- ❌ **Removed** - 已移除的功能
- 🐛 **Fixed** - Bug 修复
- 🔒 **Security** - 安全性改进
- ⚡ **Performance** - 性能优化
- 🎨 **UI** - 界面改进
- 📝 **Docs** - 文档更新

---

*完整的发布说明请访问：[Releases Page](#)*`
    }
];

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
    sample: () => showTemplateModal(),
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

// ----------------- 模板选择对话框功能 -----------------
const templateModal = document.getElementById('templateModal');
const closeModalBtn = document.getElementById('closeModal');
const templateGrid = document.getElementById('templateGrid');

// 显示模板选择对话框
function showTemplateModal() {
    renderTemplateCards();
    templateModal.classList.add('active');
}

// 关闭模板选择对话框
function hideTemplateModal() {
    templateModal.classList.remove('active');
}

// 渲染模板卡片
function renderTemplateCards() {
    templateGrid.innerHTML = TEMPLATES.map(template => `
        <div class="template-card" data-type="${template.type}" data-id="${template.id}">
            <span class="template-icon">${template.icon}</span>
            <h4 class="template-title">${template.title}</h4>
            <p class="template-desc">${template.description}</p>
            <div class="template-tags">
                ${template.tags.map(tag => `<span class="template-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');

    // 绑定点击事件
    templateGrid.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', () => {
            const templateId = card.getAttribute('data-id');
            const template = TEMPLATES.find(t => t.id === templateId);
            if (template) {
                loadTemplate(template);
            }
        });
    });
}

// 加载选中的模板
function loadTemplate(template) {
    if (textarea.value.trim().length > 0) {
        if (!confirm(`确定要加载「${template.title}」模板吗？当前内容将被覆盖。`)) {
            return;
        }
    }
    
    textarea.value = template.content;
    renderMarkdown();
    updateStats();
    saveToLocal();
    hideTemplateModal();
}

// 关闭按钮事件
closeModalBtn.addEventListener('click', hideTemplateModal);

// 点击遮罩层关闭
templateModal.addEventListener('click', (e) => {
    if (e.target === templateModal) {
        hideTemplateModal();
    }
});

// ESC键关闭
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && templateModal.classList.contains('active')) {
        hideTemplateModal();
    }
});

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
