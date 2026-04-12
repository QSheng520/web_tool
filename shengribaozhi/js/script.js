// 复古历史报纸生成器 - 完整逻辑
(function(){
    // ---------- DOM 元素 ----------
    const birthInput = document.getElementById('birthDateInput');
    const generateBtn = document.getElementById('generateBtn');
    const printBtn = document.getElementById('printBtn');
    const contentContainer = document.getElementById('newspaperContent');

    // ---------- 本地 Fallback 数据 (内置10+条历史事件，按MMDD索引，确保离线回退) ----------
    // 每个条目包含 year, text 字段 (维基风格)
    const FALLBACK_EVENTS_DB = {
        "0101": [{ year: 1912, text: "中华民国成立，孙中山在南京就任临时大总统。" },{ year: 1949, text: "中华人民共和国中央人民政府成立典礼（开国大典）举行。" }],
        "0412": [{ year: 1861, text: "美国南北战争：南方军队炮轰萨姆特堡，战争爆发。" },{ year: 1986, text: "中国开始推行九年义务教育制度。" },{ year: 1927, text: "蒋介石发动\"四一二\"反革命政变，在上海大肆搜捕共产党员。" }],
        "0815": [{ year: 1945, text: "日本宣布无条件投降，第二次世界大战结束。" },{ year: 1948, text: "大韩民国正式成立。" }],
        "1001": [{ year: 1949, text: "中华人民共和国开国大典，毛泽东宣告中央人民政府成立。" },{ year: 1930, text: "中国第一届全运会举行。" }],
        "0504": [{ year: 1919, text: "五四运动爆发，中国新民主主义革命开端。" }],
        "0714": [{ year: 1789, text: "法国大革命：攻占巴士底狱。" },{ year: 1889, text: "第二国际成立。" }],
        "1225": [{ year: 1915, text: "蔡锷组织护国军，讨伐袁世凯。" },{ year: 1979, text: "苏联入侵阿富汗。" }],
        "0308": [{ year: 1917, text: "俄国二月革命（儒略历2月23日）爆发。" },{ year: 1924, text: "中国第一次妇女节纪念活动。" }],
        "0918": [{ year: 1931, text: "九一八事变，日本关东军侵占沈阳。" }],
        "1109": [{ year: 1989, text: "柏林墙倒塌，德国统一进程启动。" },{ year: 1938, text: "纳粹发动\"水晶之夜\"迫害犹太人。" }]
    };
    // 通用备用事件 (如果输入的日期没有精确匹配)
    const GENERIC_FALLBACK = [
        { year: 1776, text: "美国独立宣言签署，现代民主制度里程碑。" },
        { year: 1895, text: "中国近代启蒙思想家严复发表《天演论》。" },
        { year: 1969, text: "人类首次登月，阿姆斯特朗踏上月球。" },
        { year: 1543, text: "哥白尼发表《天体运行论》，开启科学革命。" }
    ];

    // 获取本地回退事件 (根据MMDD)
    function getLocalFallbackEvents(month, day) {
        const key = `${month}${day}`;
        if(FALLBACK_EVENTS_DB[key]) {
            return [...FALLBACK_EVENTS_DB[key]];
        }
        // 返回通用事件 (保证始终有数据)
        return [...GENERIC_FALLBACK];
    }

    // ---------- 缓存管理 (localStorage, 有效期7天) ----------
    const CACHE_PREFIX = "hist_paper_";
    function getCacheKey(month, day){
        return `${CACHE_PREFIX}${month}_${day}`;
    }
    function isCacheValid(cacheObj){
        if(!cacheObj || !cacheObj.timestamp) return false;
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        return (Date.now() - cacheObj.timestamp) < sevenDays;
    }
    function setCache(month, day, data){
        const key = getCacheKey(month, day);
        const cacheData = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
    }
    function getCache(month, day){
        const key = getCacheKey(month, day);
        const raw = localStorage.getItem(key);
        if(!raw) return null;
        try{
            const obj = JSON.parse(raw);
            if(isCacheValid(obj)) return obj.data;
            else {
                localStorage.removeItem(key);
                return null;
            }
        }catch(e){
            return null;
        }
    }

    // ---------- 维基API 获取历史事件 ----------
    async function fetchWikiEvents(month, day){
        // 补零确保两位
        const mm = String(month).padStart(2,'0');
        const dd = String(day).padStart(2,'0');
        const url = `https://api.wikimedia.org/feed/v1/wikipedia/zh/onthisday/selected/${mm}/${dd}`;
        try{
            const response = await fetch(url);
            if(!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            // 维基返回结构: { selected: [ { text, year, pages } ] }
            if(data && Array.isArray(data.selected) && data.selected.length){
                // 提取所需字段
                const events = data.selected.map(item => ({
                    year: item.year,
                    text: item.text
                }));
                return events;
            } else {
                throw new Error("无事件数据");
            }
        } catch(err){
            console.warn("API获取失败", err);
            return null;
        }
    }

    // 主数据获取器 (缓存 + API + fallback)
    async function getHistoricalEvents(month, day){
        // 尝试缓存
        const cached = getCache(month, day);
        if(cached && Array.isArray(cached) && cached.length){
            return cached;
        }
        // 尝试API
        const apiEvents = await fetchWikiEvents(month, day);
        if(apiEvents && apiEvents.length){
            setCache(month, day, apiEvents);
            return apiEvents;
        }
        // fallback 本地数据
        const fallbackData = getLocalFallbackEvents(month, day);
        // 也存入缓存（短时避免反复请求失败，缓存24小时即可）
        const tempCache = { data: fallbackData, timestamp: Date.now() - 86400000 }; // 保留一天不过期压力
        const key = getCacheKey(month, day);
        localStorage.setItem(key, JSON.stringify(tempCache));
        return fallbackData;
    }

    // ---------- 生成报纸版面 HTML (核心渲染) ----------
    // 参数: eventsArray (每个包含 year, text), birthDateStr (YYYY-MM-DD), 生成时间戳
    function renderNewspaper(events, birthDateStr, generationTime) {
        if(!events || events.length === 0){
            return `<div class="error-message">📜 未检索到该日期的历史事件，请稍后再试或换一个日期。</div>`;
        }
        // 头条取第一个事件 (最为重大)
        const headlineEvent = events[0];
        const restEvents = events.slice(1);
        // 解析出生日期显示
        const birthDateObj = new Date(birthDateStr);
        const formattedBirth = `${birthDateObj.getFullYear()}年${birthDateObj.getMonth()+1}月${birthDateObj.getDate()}日`;
        
        // 农历日期模拟 (简化版)
        const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
        const lunarDays = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
                          '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
                          '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
        const monthIdx = (birthDateObj.getMonth()) % 12;
        const dayIdx = (birthDateObj.getDate() - 1) % 30;
        const lunarDate = `农历${lunarMonths[monthIdx]}月${lunarDays[dayIdx]}`;
        
        // 期号自动生成: 基于日月组合+年份哈希感
        const dayNum = birthDateObj.getDate();
        const monthNum = birthDateObj.getMonth()+1;
        const issueNumber = `总第${Math.abs((birthDateObj.getFullYear() * monthNum + dayNum * 37) % 8999 + 1000)}期`;
        
        // 天干地支纪年 (简化)
        const tiangan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
        const dizhi = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
        const yearOffset = birthDateObj.getFullYear() - 1984; // 1984是甲子年
        const tgIndex = ((yearOffset % 10) + 10) % 10;
        const dzIndex = ((yearOffset % 12) + 12) % 12;
        const ganzhiYear = `${tiangan[tgIndex]}${dizhi[dzIndex]}年`;
        
        // 口号占位
        const slogan = "秉笔直书 · 藏往知来";
        // 侧边栏名言库
        const quotesList = [
            "「以史为镜，可以知兴替」—— 唐太宗",
            "「历史是过去传到将来的回声」—— 雨果",
            "「鉴于往事，有资于治道」——《资治通鉴》",
            "「究天人之际，通古今之变」—— 司马迁",
            "「读史使人明智」—— 培根",
            "「前事不忘，后事之师」——《战国策》"
        ];
        const randomQuote = quotesList[Math.floor(Math.random() * quotesList.length)];
        // 天气占位（90年代风格，无emoji）
        const weatherList = [
            "晴 · 纸墨凝香，宜读史怀旧",
            "多云 · 岁月静好，往事如烟",
            "小雨 · 故纸堆中觅真知",
            "阴转晴 · 拨云见日，史海钩沉",
            "晴朗 · 阳光明媚，适合翻阅历史"
        ];
        const weatherNote = weatherList[Math.floor(Math.random() * weatherList.length)];

        // 生成多栏正文html (其余事件)
        let multiColumnHtml = '';
        if(restEvents.length){
            restEvents.forEach((ev, index) => {
                // 交替使用横排和竖排样式
                const isVertical = index % 3 === 2; // 每3条中有1条竖排
                const verticalClass = isVertical ? ' news-item--vertical' : '';
                
                multiColumnHtml += `
                    <div class="news-item${verticalClass}">
                        <div class="news-item__year">公元 ${ev.year} 年</div>
                        <div class="news-item__text">${escapeHtml(ev.text)}</div>
                    </div>
                `;
            });
        } else {
            multiColumnHtml = `<div class="placeholder-text" style="font-style:italic;">暂无其他同期大事，岁月静好，亦为纪念。</div>`;
        }

        // 头条详细内容 - 大字标题风格
        const headlineHtml = `
            <div class="headline">
                <h2>【头条特辑】岁月回响</h2>
                <div class="headline-year">—— ${headlineEvent.year} 年 ——</div>
                <div class="headline-desc">${escapeHtml(headlineEvent.text)}</div>
            </div>
        `;

        // 完整版面
        return `
            <div class="newspaper__header">
                <div class="newspaper__title">岁月纪事</div>
                <div class="newspaper__motto">${slogan}</div>
                <div class="header-info">
                    <span>${formattedBirth} · ${lunarDate}</span>
                    <span>${ganzhiYear} · ${issueNumber}</span>
                    <span>号外 · 诞辰特刊</span>
                </div>
            </div>
            <div class="newspaper-grid">
                <div class="main-content">
                    ${headlineHtml}
                    <div class="multi-column">
                        ${multiColumnHtml}
                    </div>
                </div>
                <aside class="sidebar">
                    <div class="sidebar-block">
                        <h4>史海名言</h4>
                        <div class="quote">${randomQuote}</div>
                    </div>
                    <div class="sidebar-block">
                        <h4>当日气象</h4>
                        <div>${weatherNote}</div>
                    </div>
                    <div class="sidebar-block">
                        <h4>印行时刻</h4>
                        <div class="timestamp">${generationTime}</div>
                    </div>
                    <div class="sidebar-block">
                        <h4>岁月印章</h4>
                        <div class="seal-stamp">
                            <div>故纸犹温</div>
                            <div style="font-size:0.85rem;">诞辰纪念</div>
                        </div>
                    </div>
                </aside>
            </div>
        `;
    }

    // 简单防XSS
    function escapeHtml(str){
        if(!str) return '';
        return str.replace(/[&<>]/g, function(m){
            if(m === '&') return '&amp;';
            if(m === '<') return '&lt;';
            if(m === '>') return '&gt;';
            return m;
        }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function(c){
            return c;
        });
    }

    // 显示加载动画
    function showLoading(){
        contentContainer.innerHTML = `
            <div class="loading-cursor" style="text-align:center; margin: 60px auto;">
                打字机排字中·翻阅故纸堆
            </div>
        `;
    }

    // 显示错误友好提示
    function showError(msg){
        contentContainer.innerHTML = `<div class="error-message">⚠️ ${msg}</div>`;
    }

    // 主流程: 根据出生日期生成报纸
    async function generateNewspaper(birthDateValue){
        if(!birthDateValue){
            showError("请先选择出生日期。");
            return;
        }
        const birthDate = new Date(birthDateValue);
        if(isNaN(birthDate.getTime())){
            showError("无效的日期，请重新选择。");
            return;
        }
        const month = birthDate.getMonth() + 1;
        const day = birthDate.getDate();
        // 显示老式加载动画
        showLoading();

        try{
            const events = await getHistoricalEvents(month, day);
            if(!events || events.length === 0){
                showError("未能加载到任何历史事件，可尝试其他日期或检查网络。");
                return;
            }
            const generationTime = new Date().toLocaleString('zh-CN', { hour12: false });
            const renderedHtml = renderNewspaper(events, birthDateValue, generationTime);
            contentContainer.innerHTML = renderedHtml;
        } catch(err){
            console.error(err);
            // 终极fallback: 强制使用本地内置数据集
            const fallbackEvents = getLocalFallbackEvents(month, day);
            if(fallbackEvents.length){
                const generationTime = new Date().toLocaleString('zh-CN');
                const renderedHtml = renderNewspaper(fallbackEvents, birthDateValue, generationTime);
                contentContainer.innerHTML = renderedHtml;
            } else {
                showError("生成报纸时遇到错误，请刷新页面重试。");
            }
        }
    }

    // 默认初始化样例：自动生成一次 1995-08-23 的报纸做演示(但为了体验，不强制触发，但可预先展示默认日期)
    async function initPreview(){
        const defaultDate = birthInput.value; // 默认1995-08-23
        if(defaultDate){
            await generateNewspaper(defaultDate);
        } else {
            // 如果无默认值
            contentContainer.innerHTML = `<div class="placeholder-text">📅 请输入生日日期，生成您的专属历史报。</div>`;
        }
    }

    // 事件绑定
    generateBtn.addEventListener('click', async () => {
        const dateVal = birthInput.value;
        if(!dateVal){
            showError("请填写出生日期后再生成。");
            return;
        }
        await generateNewspaper(dateVal);
    });

    // 打印功能
    printBtn.addEventListener('click', () => {
        window.print();
    });

    // 页面载入后 预先展示一个示例 (让版面非空)
    initPreview();
})();
