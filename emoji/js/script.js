// --------------------------------------------------------------
// 1. 丰富完整的 emoji 数据集 (8大分类，总计240+常用表情)
// --------------------------------------------------------------
const EMOJIS_DATA = [];

// 辅助添加分类
function addEmoji(category, list) {
    list.forEach(item => {
        EMOJIS_DATA.push({
            emoji: item.emoji,
            name: item.name,
            category: category
        });
    });
}

// ========= 1. 笑脸 & 人物 (Smileys & People) =========
const smileys = [
    { emoji: "😀", name: "咧嘴大笑" }, { emoji: "😃", name: "开心大笑" }, { emoji: "😄", name: "眯眼笑" },
    { emoji: "😁", name: "露齿笑" }, { emoji: "😆", name: "开怀笑" }, { emoji: "😅", name: "尴尬汗笑" },
    { emoji: "😂", name: "笑哭" }, { emoji: "🤣", name: "笑到流泪" }, { emoji: "🥲", name: "含泪微笑" },
    { emoji: "🙂", name: "微微笑" }, { emoji: "🙃", name: "倒脸" }, { emoji: "😉", name: "眨眼" },
    { emoji: "😊", name: "害羞笑" }, { emoji: "😇", name: "天使光环" }, { emoji: "🥰", name: "爱心环绕" },
    { emoji: "😍", name: "心心眼" }, { emoji: "🤩", name: "星星眼" }, { emoji: "😘", name: "飞吻" },
    { emoji: "😗", name: "亲吻" }, { emoji: "😚", name: "闭眼亲" }, { emoji: "😙", name: "开心亲" },
    { emoji: "😋", name: "好吃" }, { emoji: "😛", name: "吐舌头" }, { emoji: "😜", name: "搞怪眨眼" },
    { emoji: "🤪", name: "疯狂怪脸" }, { emoji: "😝", name: "眯眼吐舌" }, { emoji: "🤑", name: "金钱眼" },
    { emoji: "🤗", name: "拥抱" }, { emoji: "🤭", name: "捂嘴笑" }, { emoji: "🤫", name: "嘘声" },
    { emoji: "🤔", name: "思考" }, { emoji: "🤐", name: "闭嘴" }, { emoji: "😐", name: "中性脸" },
    { emoji: "😑", name: "无言" }, { emoji: "😶", name: "沉默" }, { emoji: "😏", name: "得意" },
    { emoji: "😒", name: "不满" }, { emoji: "🙄", name: "翻白眼" }, { emoji: "😬", name: "牙痛" },
    { emoji: "🤥", name: "说谎长鼻" }, { emoji: "😌", name: "释然" }, { emoji: "😔", name: "失落" },
    { emoji: "😪", name: "瞌睡" }, { emoji: "🤤", name: "流口水" }, { emoji: "😴", name: "睡觉" },
    { emoji: "😷", name: "戴口罩" }, { emoji: "🤒", name: "体温计" }, { emoji: "🤕", name: "绷带伤" },
    { emoji: "🤢", name: "恶心" }, { emoji: "🤮", name: "呕吐" }, { emoji: "🤧", name: "打喷嚏" },
    { emoji: "🥵", name: "炎热" }, { emoji: "🥶", name: "冰冷" }, { emoji: "🥴", name: "醉晕" },
    { emoji: "😵", name: "头晕" }, { emoji: "🤯", name: "爆炸头" }, { emoji: "🤠", name: "牛仔" },
    { emoji: "🥳", name: "派对" }, { emoji: "😎", name: "酷墨镜" }, { emoji: "🤓", name: "书呆子" },
    { emoji: "🧐", name: "单眼镜" }, { emoji: "😕", name: "困惑" }, { emoji: "😟", name: "担忧" },
    { emoji: "🙁", name: "微难过" }, { emoji: "☹️", name: "皱眉" }, { emoji: "😮", name: "惊讶" },
    { emoji: "😯", name: "静默惊" }, { emoji: "😲", name: "目瞪口呆" }, { emoji: "😳", name: "脸红" },
    { emoji: "🥺", name: "恳求脸" }, { emoji: "😢", name: "哭泣" }, { emoji: "😭", name: "嚎啕大哭" },
    { emoji: "😱", name: "惊恐尖叫" }, { emoji: "😖", name: "沮丧" }, { emoji: "😣", name: "忍耐" },
    { emoji: "😞", name: "失望" }, { emoji: "😓", name: "冷汗" }, { emoji: "😩", name: "疲惫" },
    { emoji: "😫", name: "累哭" }, { emoji: "🥱", name: "打哈欠" }, { emoji: "😤", name: "冒气" },
    { emoji: "😡", name: "生气" }, { emoji: "😠", name: "愤怒" }, { emoji: "🤬", name: "脏话" },
    { emoji: "😈", name: "笑脸恶魔" }, { emoji: "👿", name: "怒恶魔" }, { emoji: "💀", name: "骷髅" },
    { emoji: "👻", name: "幽灵" }, { emoji: "🤡", name: "小丑" }, { emoji: "👽", name: "外星人" },
    { emoji: "🤖", name: "机器人" }, { emoji: "💩", name: "便便" }, { emoji: "😺", name: "微笑猫" }
];
addEmoji("smileys", smileys);

// ========= 2. 动物 & 自然 =========
const animals = [
    { emoji: "🐶", name: "狗脸" }, { emoji: "🐱", name: "猫脸" }, { emoji: "🐭", name: "老鼠" },
    { emoji: "🐹", name: "仓鼠" }, { emoji: "🐰", name: "兔子" }, { emoji: "🦊", name: "狐狸" },
    { emoji: "🐻", name: "熊" }, { emoji: "🐼", name: "熊猫" }, { emoji: "🐨", name: "考拉" },
    { emoji: "🐯", name: "老虎" }, { emoji: "🦁", name: "狮子" }, { emoji: "🐮", name: "牛" },
    { emoji: "🐷", name: "猪" }, { emoji: "🐸", name: "青蛙" }, { emoji: "🐵", name: "猴脸" },
    { emoji: "🐒", name: "猴子" }, { emoji: "🐔", name: "鸡" }, { emoji: "🐧", name: "企鹅" },
    { emoji: "🐦", name: "鸟" }, { emoji: "🐤", name: "小鸡" }, { emoji: "🐥", name: "幼鸡" },
    { emoji: "🐺", name: "狼" }, { emoji: "🐗", name: "野猪" }, { emoji: "🐴", name: "马" },
    { emoji: "🦄", name: "独角兽" }, { emoji: "🐝", name: "蜜蜂" }, { emoji: "🐛", name: "毛毛虫" },
    { emoji: "🦋", name: "蝴蝶" }, { emoji: "🐌", name: "蜗牛" }, { emoji: "🐞", name: "瓢虫" },
    { emoji: "🐜", name: "蚂蚁" }, { emoji: "🦟", name: "蚊子" }, { emoji: "🦗", name: "蟋蟀" },
    { emoji: "🕷️", name: "蜘蛛" }, { emoji: "🦂", name: "蝎子" }, { emoji: "🐢", name: "乌龟" },
    { emoji: "🐍", name: "蛇" }, { emoji: "🦎", name: "蜥蜴" }, { emoji: "🐙", name: "章鱼" },
    { emoji: "🦑", name: "鱿鱼" }, { emoji: "🦐", name: "虾" }, { emoji: "🦞", name: "龙虾" },
    { emoji: "🐠", name: "热带鱼" }, { emoji: "🐟", name: "鱼" }, { emoji: "🐬", name: "海豚" },
    { emoji: "🐳", name: "鲸鱼" }, { emoji: "🐋", name: "巨鲸" }, { emoji: "🦈", name: "鲨鱼" },
    { emoji: "🌵", name: "仙人掌" }, { emoji: "🌸", name: "樱花" }, { emoji: "🌻", name: "向日葵" },
    { emoji: "🍂", name: "落叶" }, { emoji: "☀️", name: "太阳" }, { emoji: "⭐", name: "星星" }
];
addEmoji("animals", animals);

// ========= 3. 食物 & 饮料 =========
const foods = [
    { emoji: "🍎", name: "苹果" }, { emoji: "🍐", name: "梨" }, { emoji: "🍊", name: "橘子" },
    { emoji: "🍋", name: "柠檬" }, { emoji: "🍌", name: "香蕉" }, { emoji: "🍉", name: "西瓜" },
    { emoji: "🍇", name: "葡萄" }, { emoji: "🍓", name: "草莓" }, { emoji: "🫐", name: "蓝莓" },
    { emoji: "🍒", name: "樱桃" }, { emoji: "🥝", name: "奇异果" }, { emoji: "🍅", name: "番茄" },
    { emoji: "🥑", name: "牛油果" }, { emoji: "🍆", name: "茄子" }, { emoji: "🥔", name: "土豆" },
    { emoji: "🥕", name: "胡萝卜" }, { emoji: "🌽", name: "玉米" }, { emoji: "🥦", name: "西兰花" },
    { emoji: "🍔", name: "汉堡" }, { emoji: "🍟", name: "薯条" }, { emoji: "🍕", name: "披萨" },
    { emoji: "🌭", name: "热狗" }, { emoji: "🥪", name: "三明治" }, { emoji: "🍚", name: "米饭" },
    { emoji: "🍣", name: "寿司" }, { emoji: "🍜", name: "拉面" }, { emoji: "🍦", name: "冰淇淋" },
    { emoji: "🍩", name: "甜甜圈" }, { emoji: "🍪", name: "饼干" }, { emoji: "☕", name: "热饮" },
    { emoji: "🍺", name: "啤酒" }, { emoji: "🥂", name: "干杯" }, { emoji: "🍷", name: "红酒" }
];
addEmoji("food", foods);

// ========= 4. 旅行 & 地点 =========
const travels = [
    { emoji: "🚗", name: "汽车" }, { emoji: "🚕", name: "出租车" }, { emoji: "🚌", name: "公交车" },
    { emoji: "🚲", name: "自行车" }, { emoji: "✈️", name: "飞机" }, { emoji: "🚀", name: "火箭" },
    { emoji: "🚁", name: "直升机" }, { emoji: "⛵", name: "帆船" }, { emoji: "🏖️", name: "海滩" },
    { emoji: "🏔️", name: "雪山" }, { emoji: "🗽", name: "自由女神" }, { emoji: "🏯", name: "日本城堡" },
    { emoji: "🎡", name: "摩天轮" }, { emoji: "🌋", name: "火山" }, { emoji: "🌈", name: "彩虹" },
    { emoji: "🌙", name: "月亮" }, { emoji: "⭐", name: "星星" }, { emoji: "🌍", name: "地球" }
];
addEmoji("travel", travels);

// ========= 5. 活动 =========
const activities = [
    { emoji: "⚽", name: "足球" }, { emoji: "🏀", name: "篮球" }, { emoji: "🏈", name: "橄榄球" },
    { emoji: "⚾", name: "棒球" }, { emoji: "🎾", name: "网球" }, { emoji: "🏐", name: "排球" },
    { emoji: "🎮", name: "电子游戏" }, { emoji: "🎲", name: "骰子" }, { emoji: "🎯", name: "靶心" },
    { emoji: "🎳", name: "保龄球" }, { emoji: "🎤", name: "麦克风" }, { emoji: "🎧", name: "耳机" },
    { emoji: "🎸", name: "吉他" }, { emoji: "🎹", name: "钢琴" }, { emoji: "🎭", name: "戏剧" },
    { emoji: "🎨", name: "艺术" }
];
addEmoji("activities", activities);

// ========= 6. 物体 =========
const objects = [
    { emoji: "⌚", name: "手表" }, { emoji: "📱", name: "手机" }, { emoji: "💻", name: "笔记本电脑" },
    { emoji: "⌨️", name: "键盘" }, { emoji: "🖥️", name: "电脑" }, { emoji: "🖨️", name: "打印机" },
    { emoji: "📷", name: "相机" }, { emoji: "📺", name: "电视" }, { emoji: "💡", name: "灯泡" },
    { emoji: "🔦", name: "手电筒" }, { emoji: "📚", name: "书本" }, { emoji: "✏️", name: "铅笔" },
    { emoji: "📎", name: "回形针" }, { emoji: "🔒", name: "锁" }, { emoji: "🔑", name: "钥匙" },
    { emoji: "🧸", name: "泰迪熊" }, { emoji: "🎁", name: "礼物" }
];
addEmoji("objects", objects);

// ========= 7. 符号 =========
const symbols = [
    { emoji: "❤️", name: "红心" }, { emoji: "🧡", name: "橙心" }, { emoji: "💛", name: "黄心" },
    { emoji: "💚", name: "绿心" }, { emoji: "💙", name: "蓝心" }, { emoji: "💜", name: "紫心" },
    { emoji: "🖤", name: "黑心" }, { emoji: "💔", name: "心碎" }, { emoji: "💯", name: "百分百" },
    { emoji: "❗", name: "感叹号" }, { emoji: "❓", name: "问号" }, { emoji: "♻️", name: "回收" },
    { emoji: "⚜️", name: "鸢尾花" }, { emoji: "®️", name: "注册" }, { emoji: "©️", name: "版权" }
];
addEmoji("symbols", symbols);

// ========= 8. 旗帜 =========
const flags = [
    { emoji: "🏁", name: "方格旗" }, { emoji: "🚩", name: "三角旗" }, { emoji: "🎌", name: "交叉旗" },
    { emoji: "🇨🇳", name: "中国" }, { emoji: "🇺🇸", name: "美国" }, { emoji: "🇯🇵", name: "日本" },
    { emoji: "🇰🇷", name: "韩国" }, { emoji: "🇬🇧", name: "英国" }, { emoji: "🇫🇷", name: "法国" },
    { emoji: "🇩🇪", name: "德国" }, { emoji: "🇮🇹", name: "意大利" }
];
addEmoji("flags", flags);

// 分类元数据 (显示名称和key)
const categoriesMeta = [
    { key: "all", label: "✨ 全部" },
    { key: "smileys", label: "😊 笑脸 & 人物" },
    { key: "animals", label: "🐾 动物 & 自然" },
    { key: "food", label: "🍕 食物 & 饮料" },
    { key: "travel", label: "✈️ 旅行 & 地点" },
    { key: "activities", label: "⚽ 活动" },
    { key: "objects", label: "📦 物体" },
    { key: "symbols", label: "💟 符号" },
    { key: "flags", label: "🏳️ 旗帜" }
];

// DOM 元素
const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearSearchBtn');
const categoriesContainer = document.getElementById('categoriesContainer');
const emojiGrid = document.getElementById('emojiGrid');
const resultCountSpan = document.getElementById('resultCount');
const toastMsg = document.getElementById('toastMsg');

// 当前状态
let currentCategory = "all";
let searchKeyword = "";

// 渲染分类按钮
function renderCategories() {
    categoriesContainer.innerHTML = '';
    categoriesMeta.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `cat-btn ${currentCategory === cat.key ? 'active' : ''}`;
        btn.setAttribute('data-cat', cat.key);
        btn.innerHTML = cat.label;
        btn.addEventListener('click', () => {
            currentCategory = cat.key;
            renderCategories();
            renderEmojiGrid();
        });
        categoriesContainer.appendChild(btn);
    });
}

// 过滤表情
function getFilteredEmojis() {
    let filtered = [...EMOJIS_DATA];
    // 分类筛选
    if (currentCategory !== "all") {
        filtered = filtered.filter(emo => emo.category === currentCategory);
    }
    // 搜索筛选 (匹配名称或者emoji自身)
    if (searchKeyword.trim() !== "") {
        const kw = searchKeyword.trim().toLowerCase();
        filtered = filtered.filter(emo =>
            emo.name.toLowerCase().includes(kw) ||
            emo.emoji === kw ||
            emo.emoji.toLowerCase().includes(kw)  // 部分表情符号匹配
        );
    }
    return filtered;
}

// 渲染表情网格
function renderEmojiGrid() {
    const filtered = getFilteredEmojis();
    resultCountSpan.innerHTML = `📋 共 ${filtered.length} 个表情符号`;
    if (filtered.length === 0) {
        emojiGrid.innerHTML = `<div class="empty-state">😢 没有找到相关表情，试试其他关键词~</div>`;
        return;
    }
    // 生成卡片
    const fragment = document.createDocumentFragment();
    filtered.forEach(emo => {
        const card = document.createElement('div');
        card.className = 'emoji-card';
        card.setAttribute('data-emoji', emo.emoji);
        card.setAttribute('data-name', emo.name);
        card.innerHTML = `
            <div class="emoji-display">${emo.emoji}</div>
            <div class="emoji-name">${escapeHtml(emo.name)}</div>
        `;
        card.addEventListener('click', (e) => {
            e.stopPropagation();
            copyToClipboard(emo.emoji, emo.name);
        });
        fragment.appendChild(card);
    });
    emojiGrid.innerHTML = '';
    emojiGrid.appendChild(fragment);
}

// 简单防XSS
function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// 复制功能
function copyToClipboard(emojiChar, name) {
    if (!emojiChar) return;
    navigator.clipboard.writeText(emojiChar).then(() => {
        showToast(`✅ 已复制 ${emojiChar}  (${name})`);
    }).catch(() => {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = emojiChar;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`📋 已复制 ${emojiChar}  (${name})`);
    });
}

let toastTimer = null;
function showToast(msg) {
    toastMsg.textContent = msg.length > 40 ? msg.slice(0, 38) + '..' : msg;
    toastMsg.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toastMsg.classList.remove('show');
    }, 1800);
}

// 搜索联动
function handleSearch() {
    searchKeyword = searchInput.value;
    renderEmojiGrid();
}

function clearSearch() {
    searchInput.value = '';
    searchKeyword = '';
    renderEmojiGrid();
    searchInput.focus();
}

// 初始化事件监听
function initEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    clearBtn.addEventListener('click', clearSearch);
}

// 初始加载
function init() {
    renderCategories();
    renderEmojiGrid();
    initEventListeners();
}

init();
