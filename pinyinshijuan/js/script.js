(function(){
    "use strict";

    // ---------- 全局变量 ----------
    // 当前抽出的题目列表 (用于渲染)
    let currentQuestions = [];         // 每个元素: { text, type, grade }
    let currentShowAnswer = false;     // 与复选框同步

    // DOM 元素
    const chkSingle = document.getElementById('typeSingle');
    const chkDouble = document.getElementById('typeDouble');
    const chkIdiom = document.getElementById('typeIdiom');
    const chkPoly = document.getElementById('typePoly');
    const countInput = document.getElementById('questionCount');
    const gradeSelect = document.getElementById('gradeSelect');
    const generateBtn = document.getElementById('generateBtn');
    const printPaperBtn = document.getElementById('printPaperBtn');
    const printAnswerBtn = document.getElementById('printAnswerBtn');
    const showAnswerCheck = document.getElementById('showAnswerCheck');
    const hideAnswerInlineBtn = document.getElementById('hideAnswerInlineBtn');
    const gridContainer = document.getElementById('wordsGridContainer');
    const answerList = document.getElementById('answerList');
    const answerPanel = document.getElementById('answerPanel');
    const messageArea = document.getElementById('messageArea');

    // ---------- 内置词库 (符合中文教育规范) ----------
    // 结构: { text: "词语", type: "单字/双字词/成语/易错多音字", grade: 1~4 (1最简) }
    const rawWordBank = [
        // ========== 单字 (grade 1~2) ==========
        { text: "我", type: "单字", grade: 1 },
        { text: "你", type: "单字", grade: 1 },
        { text: "他", type: "单字", grade: 1 },
        { text: "妈", type: "单字", grade: 1 },
        { text: "爸", type: "单字", grade: 1 },
        { text: "大", type: "单字", grade: 1 },
        { text: "小", type: "单字", grade: 1 },
        { text: "多", type: "单字", grade: 2 },
        { text: "少", type: "单字", grade: 2 },
        { text: "天", type: "单字", grade: 1 },
        { text: "地", type: "单字", grade: 1 },
        { text: "人", type: "单字", grade: 1 },
        { text: "口", type: "单字", grade: 1 },
        { text: "手", type: "单字", grade: 1 },
        { text: "水", type: "单字", grade: 2 },
        { text: "火", type: "单字", grade: 2 },
        { text: "山", type: "单字", grade: 1 },
        { text: "石", type: "单字", grade: 1 },
        { text: "田", type: "单字", grade: 1 },
        { text: "土", type: "单字", grade: 1 },
        { text: "木", type: "单字", grade: 1 },
        { text: "禾", type: "单字", grade: 1 },
        { text: "日", type: "单字", grade: 1 },
        { text: "月", type: "单字", grade: 1 },
        { text: "年", type: "单字", grade: 1 },
        { text: "时", type: "单字", grade: 2 },
        { text: "分", type: "单字", grade: 2 },
        { text: "秒", type: "单字", grade: 2 },
        { text: "东", type: "单字", grade: 1 },
        { text: "西", type: "单字", grade: 1 },
        { text: "南", type: "单字", grade: 1 },
        { text: "北", type: "单字", grade: 1 },
        { text: "中", type: "单字", grade: 1 },
        { text: "上", type: "单字", grade: 1 },
        { text: "下", type: "单字", grade: 1 },
        { text: "左", type: "单字", grade: 1 },
        { text: "右", type: "单字", grade: 1 },
        { text: "前", type: "单字", grade: 2 },
        { text: "后", type: "单字", grade: 2 },
        { text: "里", type: "单字", grade: 1 },
        { text: "外", type: "单字", grade: 2 },
        { text: "红", type: "单字", grade: 1 },
        { text: "黄", type: "单字", grade: 1 },
        { text: "蓝", type: "单字", grade: 1 },
        { text: "绿", type: "单字", grade: 1 },
        { text: "白", type: "单字", grade: 1 },
        { text: "黑", type: "单字", grade: 1 },
        { text: "花", type: "单字", grade: 1 },
        { text: "草", type: "单字", grade: 1 },
        { text: "树", type: "单字", grade: 2 },
        { text: "鸟", type: "单字", grade: 1 },
        { text: "鱼", type: "单字", grade: 1 },
        { text: "虫", type: "单字", grade: 2 },
        { text: "马", type: "单字", grade: 1 },
        { text: "牛", type: "单字", grade: 1 },
        { text: "羊", type: "单字", grade: 1 },
        { text: "狗", type: "单字", grade: 1 },
        { text: "猫", type: "单字", grade: 1 },
        { text: "吃", type: "单字", grade: 1 },
        { text: "喝", type: "单字", grade: 1 },
        { text: "跑", type: "单字", grade: 2 },
        { text: "跳", type: "单字", grade: 2 },
        { text: "走", type: "单字", grade: 1 },
        { text: "飞", type: "单字", grade: 2 },
        { text: "游", type: "单字", grade: 2 },
        { text: "看", type: "单字", grade: 1 },
        { text: "听", type: "单字", grade: 1 },
        { text: "说", type: "单字", grade: 1 },
        { text: "读", type: "单字", grade: 1 },
        { text: "写", type: "单字", grade: 1 },
        { text: "画", type: "单字", grade: 1 },
        { text: "唱", type: "单字", grade: 2 },
        { text: "笑", type: "单字", grade: 1 },
        { text: "哭", type: "单字", grade: 1 },
        { text: "好", type: "单字", grade: 1 },
        { text: "坏", type: "单字", grade: 2 },
        { text: "美", type: "单字", grade: 2 },
        { text: "丑", type: "单字", grade: 2 },
        { text: "高", type: "单字", grade: 1 },
        { text: "矮", type: "单字", grade: 2 },
        { text: "胖", type: "单字", grade: 2 },
        { text: "瘦", type: "单字", grade: 2 },
        
        // ========== 双字词 ==========
        { text: "中国", type: "双字词", grade: 1 },
        { text: "学校", type: "双字词", grade: 1 },
        { text: "老师", type: "双字词", grade: 1 },
        { text: "同学", type: "双字词", grade: 1 },
        { text: "美丽", type: "双字词", grade: 2 },
        { text: "快乐", type: "双字词", grade: 2 },
        { text: "读书", type: "双字词", grade: 2 },
        { text: "跑步", type: "双字词", grade: 2 },
        { text: "北京", type: "双字词", grade: 2 },
        { text: "天气", type: "双字词", grade: 2 },
        { text: "苹果", type: "双字词", grade: 1 },
        { text: "大象", type: "双字词", grade: 2 },
        { text: "火车", type: "双字词", grade: 3 },
        { text: "海洋", type: "双字词", grade: 3 },
        { text: "朋友", type: "双字词", grade: 1 },
        { text: "家庭", type: "双字词", grade: 2 },
        { text: "父母", type: "双字词", grade: 1 },
        { text: "兄弟", type: "双字词", grade: 2 },
        { text: "姐妹", type: "双字词", grade: 2 },
        { text: "爷爷", type: "双字词", grade: 1 },
        { text: "奶奶", type: "双字词", grade: 1 },
        { text: "外公", type: "双字词", grade: 2 },
        { text: "外婆", type: "双字词", grade: 2 },
        { text: "医生", type: "双字词", grade: 2 },
        { text: "护士", type: "双字词", grade: 2 },
        { text: "警察", type: "双字词", grade: 3 },
        { text: "司机", type: "双字词", grade: 3 },
        { text: "农民", type: "双字词", grade: 2 },
        { text: "工人", type: "双字词", grade: 2 },
        { text: "商人", type: "双字词", grade: 3 },
        { text: "学生", type: "双字词", grade: 1 },
        { text: "校长", type: "双字词", grade: 2 },
        { text: "教室", type: "双字词", grade: 1 },
        { text: "操场", type: "双字词", grade: 2 },
        { text: "图书馆", type: "双字词", grade: 3 },
        { text: "食堂", type: "双字词", grade: 2 },
        { text: "宿舍", type: "双字词", grade: 3 },
        { text: "花园", type: "双字词", grade: 2 },
        { text: "公园", type: "双字词", grade: 2 },
        { text: "动物园", type: "双字词", grade: 2 },
        { text: "植物园", type: "双字词", grade: 3 },
        { text: "超市", type: "双字词", grade: 2 },
        { text: "商场", type: "双字词", grade: 3 },
        { text: "医院", type: "双字词", grade: 2 },
        { text: "银行", type: "双字词", grade: 3 },
        { text: "邮局", type: "双字词", grade: 3 },
        { text: "饭店", type: "双字词", grade: 2 },
        { text: "旅馆", type: "双字词", grade: 3 },
        { text: "飞机", type: "双字词", grade: 2 },
        { text: "轮船", type: "双字词", grade: 3 },
        { text: "汽车", type: "双字词", grade: 2 },
        { text: "自行车", type: "双字词", grade: 2 },
        { text: "地铁", type: "双字词", grade: 3 },
        { text: "公交", type: "双字词", grade: 2 },
        { text: "出租", type: "双字词", grade: 3 },
        { text: "春天", type: "双字词", grade: 1 },
        { text: "夏天", type: "双字词", grade: 1 },
        { text: "秋天", type: "双字词", grade: 1 },
        { text: "冬天", type: "双字词", grade: 1 },
        { text: "早晨", type: "双字词", grade: 2 },
        { text: "中午", type: "双字词", grade: 2 },
        { text: "下午", type: "双字词", grade: 2 },
        { text: "晚上", type: "双字词", grade: 1 },
        { text: "今天", type: "双字词", grade: 1 },
        { text: "明天", type: "双字词", grade: 1 },
        { text: "昨天", type: "双字词", grade: 2 },
        { text: "现在", type: "双字词", grade: 2 },
        { text: "将来", type: "双字词", grade: 3 },
        { text: "过去", type: "双字词", grade: 3 },
        { text: "学习", type: "双字词", grade: 1 },
        { text: "工作", type: "双字词", grade: 2 },
        { text: "休息", type: "双字词", grade: 2 },
        { text: "运动", type: "双字词", grade: 2 },
        { text: "游戏", type: "双字词", grade: 2 },
        { text: "音乐", type: "双字词", grade: 2 },
        { text: "美术", type: "双字词", grade: 2 },
        { text: "体育", type: "双字词", grade: 2 },
        { text: "科学", type: "双字词", grade: 3 },
        { text: "历史", type: "双字词", grade: 3 },
        { text: "地理", type: "双字词", grade: 3 },
        { text: "数学", type: "双字词", grade: 2 },
        { text: "语文", type: "双字词", grade: 1 },
        { text: "英语", type: "双字词", grade: 2 },
        { text: "电脑", type: "双字词", grade: 3 },
        { text: "手机", type: "双字词", grade: 3 },
        { text: "电视", type: "双字词", grade: 2 },
        { text: "电影", type: "双字词", grade: 3 },
        { text: "新闻", type: "双字词", grade: 3 },
        { text: "故事", type: "双字词", grade: 2 },
        { text: "童话", type: "双字词", grade: 2 },
        { text: "诗歌", type: "双字词", grade: 3 },
        { text: "小说", type: "双字词", grade: 3 },
        { text: "报纸", type: "双字词", grade: 3 },
        { text: "杂志", type: "双字词", grade: 3 },
        { text: "字典", type: "双字词", grade: 2 },
        { text: "课本", type: "双字词", grade: 1 },
        { text: "作业", type: "双字词", grade: 1 },
        { text: "考试", type: "双字词", grade: 2 },
        { text: "成绩", type: "双字词", grade: 3 },
        { text: "分数", type: "双字词", grade: 2 },
        { text: "问题", type: "双字词", grade: 2 },
        { text: "答案", type: "双字词", grade: 2 },
        { text: "方法", type: "双字词", grade: 3 },
        { text: "结果", type: "双字词", grade: 3 },
        { text: "原因", type: "双字词", grade: 3 },
        { text: "目的", type: "双字词", grade: 3 },
        { text: "意义", type: "双字词", grade: 3 },
        { text: "价值", type: "双字词", grade: 3 },
        { text: "重要", type: "双字词", grade: 3 },
        { text: "简单", type: "双字词", grade: 2 },
        { text: "困难", type: "双字词", grade: 3 },
        { text: "容易", type: "双字词", grade: 2 },
        { text: "复杂", type: "双字词", grade: 3 },
        { text: "清楚", type: "双字词", grade: 2 },
        { text: "明白", type: "双字词", grade: 2 },
        { text: "知道", type: "双字词", grade: 1 },
        { text: "认识", type: "双字词", grade: 2 },
        { text: "理解", type: "双字词", grade: 3 },
        { text: "发现", type: "双字词", grade: 2 },
        { text: "发明", type: "双字词", grade: 3 },
        { text: "创造", type: "双字词", grade: 3 },
        { text: "改进", type: "双字词", grade: 3 },
        { text: "提高", type: "双字词", grade: 3 },
        { text: "降低", type: "双字词", grade: 3 },
        { text: "增加", type: "双字词", grade: 3 },
        { text: "减少", type: "双字词", grade: 3 },
        { text: "扩大", type: "双字词", grade: 3 },
        { text: "缩小", type: "双字词", grade: 3 },
        { text: "打开", type: "双字词", grade: 1 },
        { text: "关闭", type: "双字词", grade: 2 },
        { text: "开始", type: "双字词", grade: 2 },
        { text: "结束", type: "双字词", grade: 2 },
        { text: "继续", type: "双字词", grade: 3 },
        { text: "停止", type: "双字词", grade: 3 },
        { text: "准备", type: "双字词", grade: 2 },
        { text: "完成", type: "双字词", grade: 2 },
        { text: "成功", type: "双字词", grade: 2 },
        { text: "失败", type: "双字词", grade: 3 },
        { text: "胜利", type: "双字词", grade: 3 },
        { text: "和平", type: "双字词", grade: 3 },
        { text: "战争", type: "双字词", grade: 3 },
        { text: "安全", type: "双字词", grade: 2 },
        { text: "危险", type: "双字词", grade: 3 },
        { text: "健康", type: "双字词", grade: 2 },
        { text: "疾病", type: "双字词", grade: 3 },
        { text: "幸福", type: "双字词", grade: 3 },
        { text: "痛苦", type: "双字词", grade: 3 },
        { text: "高兴", type: "双字词", grade: 1 },
        { text: "伤心", type: "双字词", grade: 2 },
        { text: "生气", type: "双字词", grade: 2 },
        { text: "害怕", type: "双字词", grade: 2 },
        { text: "勇敢", type: "双字词", grade: 3 },
        { text: "胆小", type: "双字词", grade: 2 },
        { text: "聪明", type: "双字词", grade: 2 },
        { text: "愚蠢", type: "双字词", grade: 3 },
        { text: "勤奋", type: "双字词", grade: 3 },
        { text: "懒惰", type: "双字词", grade: 3 },
        { text: "诚实", type: "双字词", grade: 2 },
        { text: "虚伪", type: "双字词", grade: 3 },
        { text: "善良", type: "双字词", grade: 2 },
        { text: "邪恶", type: "双字词", grade: 3 },
        { text: "温柔", type: "双字词", grade: 3 },
        { text: "粗暴", type: "双字词", grade: 3 },
        { text: "安静", type: "双字词", grade: 2 },
        { text: "吵闹", type: "双字词", grade: 2 },
        { text: "干净", type: "双字词", grade: 1 },
        { text: "肮脏", type: "双字词", grade: 3 },
        { text: "整齐", type: "双字词", grade: 2 },
        { text: "凌乱", type: "双字词", grade: 3 },
        
        // ========== 成语 ==========
        { text: "一帆风顺", type: "成语", grade: 3 },
        { text: "马到成功", type: "成语", grade: 3 },
        { text: "三心二意", type: "成语", grade: 3 },
        { text: "五颜六色", type: "成语", grade: 3 },
        { text: "七上八下", type: "成语", grade: 3 },
        { text: "十全十美", type: "成语", grade: 4 },
        { text: "百花齐放", type: "成语", grade: 4 },
        { text: "春风化雨", type: "成语", grade: 4 },
        { text: "一心一意", type: "成语", grade: 2 },
        { text: "二话不说", type: "成语", grade: 3 },
        { text: "四面八方", type: "成语", grade: 3 },
        { text: "五花八门", type: "成语", grade: 3 },
        { text: "六神无主", type: "成语", grade: 4 },
        { text: "九牛一毛", type: "成语", grade: 4 },
        { text: "千军万马", type: "成语", grade: 4 },
        { text: "万众一心", type: "成语", grade: 3 },
        { text: "画龙点睛", type: "成语", grade: 4 },
        { text: "守株待兔", type: "成语", grade: 3 },
        { text: "亡羊补牢", type: "成语", grade: 3 },
        { text: "刻舟求剑", type: "成语", grade: 4 },
        { text: "掩耳盗铃", type: "成语", grade: 4 },
        { text: "井底之蛙", type: "成语", grade: 4 },
        { text: "狐假虎威", type: "成语", grade: 4 },
        { text: "叶公好龙", type: "成语", grade: 4 },
        { text: "对牛弹琴", type: "成语", grade: 4 },
        { text: "杯弓蛇影", type: "成语", grade: 4 },
        { text: "自相矛盾", type: "成语", grade: 4 },
        { text: "拔苗助长", type: "成语", grade: 4 },
        { text: "坐井观天", type: "成语", grade: 3 },
        { text: "买椟还珠", type: "成语", grade: 4 },
        { text: "郑人买履", type: "成语", grade: 4 },
        { text: "滥竽充数", type: "成语", grade: 4 },
        { text: "画蛇添足", type: "成语", grade: 3 },
        { text: "惊弓之鸟", type: "成语", grade: 4 },
        { text: "愚公移山", type: "成语", grade: 3 },
        { text: "精卫填海", type: "成语", grade: 4 },
        { text: "夸父追日", type: "成语", grade: 4 },
        { text: "女娲补天", type: "成语", grade: 4 },
        { text: "后羿射日", type: "成语", grade: 4 },
        { text: "嫦娥奔月", type: "成语", grade: 4 },
        { text: "牛郎织女", type: "成语", grade: 4 },
        { text: "八仙过海", type: "成语", grade: 4 },
        { text: "各显神通", type: "成语", grade: 4 },
        { text: "塞翁失马", type: "成语", grade: 4 },
        { text: "焉知非福", type: "成语", grade: 4 },
        { text: "锦上添花", type: "成语", grade: 3 },
        { text: "雪中送炭", type: "成语", grade: 3 },
        { text: "锦上添花", type: "成语", grade: 3 },
        { text: "画饼充饥", type: "成语", grade: 4 },
        { text: "望梅止渴", type: "成语", grade: 4 },
        { text: "纸上谈兵", type: "成语", grade: 4 },
        { text: "草木皆兵", type: "成语", grade: 4 },
        { text: "风声鹤唳", type: "成语", grade: 4 },
        { text: "破釜沉舟", type: "成语", grade: 4 },
        { text: "卧薪尝胆", type: "成语", grade: 4 },
        { text: "负荆请罪", type: "成语", grade: 4 },
        { text: "完璧归赵", type: "成语", grade: 4 },
        { text: "闻鸡起舞", type: "成语", grade: 3 },
        { text: "悬梁刺股", type: "成语", grade: 4 },
        { text: "凿壁偷光", type: "成语", grade: 4 },
        { text: "囊萤映雪", type: "成语", grade: 4 },
        { text: "程门立雪", type: "成语", grade: 4 },
        { text: "铁杵成针", type: "成语", grade: 3 },
        { text: "水滴石穿", type: "成语", grade: 3 },
        { text: "绳锯木断", type: "成语", grade: 4 },
        { text: "积少成多", type: "成语", grade: 3 },
        { text: "聚沙成塔", type: "成语", grade: 3 },
        { text: "集腋成裘", type: "成语", grade: 4 },
        { text: "持之以恒", type: "成语", grade: 3 },
        { text: "锲而不舍", type: "成语", grade: 4 },
        { text: "坚持不懈", type: "成语", grade: 3 },
        { text: "半途而废", type: "成语", grade: 3 },
        { text: "前功尽弃", type: "成语", grade: 4 },
        { text: "功亏一篑", type: "成语", grade: 4 },
        { text: "事半功倍", type: "成语", grade: 3 },
        { text: "事倍功半", type: "成语", grade: 3 },
        { text: "一举两得", type: "成语", grade: 3 },
        { text: "一箭双雕", type: "成语", grade: 4 },
        { text: "一石二鸟", type: "成语", grade: 3 },
        { text: "一劳永逸", type: "成语", grade: 4 },
        { text: "一蹴而就", type: "成语", grade: 4 },
        { text: "一曝十寒", type: "成语", grade: 4 },
        { text: "一知半解", type: "成语", grade: 3 },
        { text: "一窍不通", type: "成语", grade: 4 },
        { text: "一目了然", type: "成语", grade: 3 },
        { text: "一见钟情", type: "成语", grade: 4 },
        { text: "一往情深", type: "成语", grade: 4 },
        { text: "一视同仁", type: "成语", grade: 4 },
        { text: "一如既往", type: "成语", grade: 3 },
        { text: "一诺千金", type: "成语", grade: 4 },
        { text: "一言九鼎", type: "成语", grade: 4 },
        { text: "一字千金", type: "成语", grade: 4 },
        { text: "一本万利", type: "成语", grade: 4 },
        { text: "一贫如洗", type: "成语", grade: 4 },
        { text: "一清二楚", type: "成语", grade: 3 },
        { text: "一干二净", type: "成语", grade: 3 },
        { text: "一穷二白", type: "成语", grade: 4 },
        { text: "一石二鸟", type: "成语", grade: 3 },
        { text: "三长两短", type: "成语", grade: 4 },
        { text: "三言两语", type: "成语", grade: 3 },
        { text: "三番五次", type: "成语", grade: 3 },
        { text: "三头六臂", type: "成语", grade: 3 },
        { text: "三生有幸", type: "成语", grade: 4 },
        { text: "四海为家", type: "成语", grade: 4 },
        { text: "四分五裂", type: "成语", grade: 4 },
        { text: "四通八达", type: "成语", grade: 3 },
        { text: "四面楚歌", type: "成语", grade: 4 },
        { text: "五湖四海", type: "成语", grade: 3 },
        { text: "五体投地", type: "成语", grade: 4 },
        { text: "五脏六腑", type: "成语", grade: 4 },
        { text: "六亲不认", type: "成语", grade: 4 },
        { text: "七嘴八舌", type: "成语", grade: 3 },
        { text: "七手八脚", type: "成语", grade: 3 },
        { text: "七拼八凑", type: "成语", grade: 4 },
        { text: "八面玲珑", type: "成语", grade: 4 },
        { text: "九死一生", type: "成语", grade: 4 },
        { text: "九霄云外", type: "成语", grade: 4 },
        
        // ========== 易错多音字 (词语形式) ==========
        { text: "音乐", type: "易错多音字", grade: 2 },    // 乐 yuè
        { text: "快乐", type: "易错多音字", grade: 2 },    // 乐 lè
        { text: "银行", type: "易错多音字", grade: 3 },    // 行 háng
        { text: "行走", type: "易错多音字", grade: 3 },    // 行 xíng
        { text: "长大", type: "易错多音字", grade: 2 },    // 长 zhǎng
        { text: "长短", type: "易错多音字", grade: 2 },    // 长 cháng
        { text: "重新", type: "易错多音字", grade: 3 },    // 重 chóng
        { text: "重要", type: "易错多音字", grade: 3 },    // 重 zhòng
        { text: "睡觉", type: "易错多音字", grade: 2 },    // 觉 jiào
        { text: "感觉", type: "易错多音字", grade: 3 },    // 觉 jué
        { text: "方便", type: "易错多音字", grade: 3 },    // 便 biàn
        { text: "便宜", type: "易错多音字", grade: 3 },    // 便 pián
        { text: "好人", type: "易错多音字", grade: 1 },    // 好 hǎo
        { text: "好奇", type: "易错多音字", grade: 2 },    // 好 hào
        { text: "少数", type: "易错多音字", grade: 2 },    // 少 shǎo
        { text: "少年", type: "易错多音字", grade: 2 },    // 少 shào
        { text: "分开", type: "易错多音字", grade: 2 },    // 分 fēn
        { text: "分数", type: "易错多音字", grade: 2 },    // 分 fèn
        { text: "中间", type: "易错多音字", grade: 1 },    // 中 zhōng
        { text: "中奖", type: "易错多音字", grade: 3 },    // 中 zhòng
        { text: "看见", type: "易错多音字", grade: 1 },    // 看 kàn
        { text: "看守", type: "易错多音字", grade: 3 },    // 看 kān
        { text: "说话", type: "易错多音字", grade: 1 },    // 说 shuō
        { text: "说服", type: "易错多音字", grade: 3 },    // 说 shuì
        { text: "没有", type: "易错多音字", grade: 1 },    // 没 méi
        { text: "淹没", type: "易错多音字", grade: 3 },    // 没 mò
        { text: "得到", type: "易错多音字", grade: 2 },    // 得 dé
        { text: "得意", type: "易错多音字", grade: 3 },    // 得 dé
        { text: "跑得快", type: "易错多音字", grade: 2 },  // 得 de
        { text: "必须", type: "易错多音字", grade: 3 },    // 得 děi
        { text: "出发", type: "易错多音字", grade: 2 },    // 发 fā
        { text: "头发", type: "易错多音字", grade: 2 },    // 发 fà
        { text: "地方", type: "易错多音字", grade: 1 },    // 地 dì
        { text: "慢慢地", type: "易错多音字", grade: 2 },  // 地 de
        { text: "天空", type: "易错多音字", grade: 1 },    // 空 kōng
        { text: "空地", type: "易错多音字", grade: 3 },    // 空 kòng
        { text: "传说", type: "易错多音字", grade: 3 },    // 传 chuán
        { text: "传记", type: "易错多音字", grade: 4 },    // 传 zhuàn
        { text: "转身", type: "易错多音字", grade: 2 },    // 转 zhuǎn
        { text: "转动", type: "易错多音字", grade: 3 },    // 转 zhuàn
        { text: "参加", type: "易错多音字", grade: 2 },    // 参 cān
        { text: "人参", type: "易错多音字", grade: 3 },    // 参 shēn
        { text: "差别", type: "易错多音字", grade: 3 },    // 差 chā
        { text: "差不多", type: "易错多音字", grade: 2 },  // 差 chà
        { text: "出差", type: "易错多音字", grade: 3 },    // 差 chāi
        { text: "应当", type: "易错多音字", grade: 3 },    // 应 yīng
        { text: "答应", type: "易错多音字", grade: 2 },    // 应 yìng
        { text: "要求", type: "易错多音字", grade: 3 },    // 要 yāo
        { text: "需要", type: "易错多音字", grade: 2 },    // 要 yào
        { text: "还是", type: "易错多音字", grade: 2 },    // 还 hái
        { text: "还书", type: "易错多音字", grade: 2 },    // 还 huán
        { text: "给予", type: "易错多音字", grade: 3 },    // 给 jǐ
        { text: "送给", type: "易错多音字", grade: 1 },    // 给 gěi
        { text: "朝向", type: "易错多音字", grade: 3 },    // 朝 cháo
        { text: "朝阳", type: "易错多音字", grade: 3 },    // 朝 zhāo
        { text: "数量", type: "易错多音字", grade: 3 },    // 数 shù
        { text: "数数", type: "易错多音字", grade: 2 },    // 数 shǔ
        { text: "频繁", type: "易错多音字", grade: 4 },    // 数 shuò
        { text: "类似", type: "易错多音字", grade: 3 },    // 似 sì
        { text: "似的", type: "易错多音字", grade: 2 },    // 似 shì
        { text: "载重", type: "易错多音字", grade: 3 },    // 载 zài
        { text: "记载", type: "易错多音字", grade: 3 },    // 载 zǎi
        { text: "调节", type: "易错多音字", grade: 3 },    // 调 tiáo
        { text: "调查", type: "易错多音字", grade: 3 },    // 调 diào
        { text: "和平", type: "易错多音字", grade: 3 },    // 和 hé
        { text: "附和", type: "易错多音字", grade: 4 },    // 和 hè
        { text: "暖和", type: "易错多音字", grade: 2 },    // 和 huo
        { text: "称心", type: "易错多音字", grade: 4 },    // 称 chèn
        { text: "称呼", type: "易错多音字", grade: 2 },    // 称 chēng
        { text: "积累", type: "易错多音字", grade: 3 },    // 累 lěi
        { text: "劳累", type: "易错多音字", grade: 3 },    // 累 lèi
        { text: "果实累累", type: "易错多音字", grade: 4 },// 累 léi
        { text: "强迫", type: "易错多音字", grade: 4 },    // 强 qiǎng
        { text: "强大", type: "易错多音字", grade: 2 },    // 强 qiáng
        { text: "倔强", type: "易错多音字", grade: 4 },    // 强 jiàng
        { text: "降落", type: "易错多音字", grade: 2 },    // 降 jiàng
        { text: "投降", type: "易错多音字", grade: 3 },    // 降 xiáng
        { text: "模仿", type: "易错多音字", grade: 3 },    // 模 mó
        { text: "模样", type: "易错多音字", grade: 3 },    // 模 mú
        { text: "压迫", type: "易错多音字", grade: 4 },    // 压 yā
        { text: "压根儿", type: "易错多音字", grade: 4 },  // 压 yà
        { text: "恶心", type: "易错多音字", grade: 3 },    // 恶 ě
        { text: "凶恶", type: "易错多音字", grade: 3 },    // 恶 è
        { text: "厌恶", type: "易错多音字", grade: 4 },    // 恶 wù
        { text: "露水", type: "易错多音字", grade: 3 },    // 露 lù
        { text: "露脸", type: "易错多音字", grade: 3 },    // 露 lòu
        { text: "剥削", type: "易错多音字", grade: 4 },    // 削 xuē
        { text: "削皮", type: "易错多音字", grade: 2 },    // 削 xiāo
        { text: "薄雾", type: "易错多音字", grade: 4 },    // 薄 bó
        { text: "薄片", type: "易错多音字", grade: 3 },    // 薄 báo
        { text: "薄荷", type: "易错多音字", grade: 3 },    // 薄 bò
        { text: "晕车", type: "易错多音字", grade: 3 },    // 晕 yùn
        { text: "头晕", type: "易错多音字", grade: 2 },    // 晕 yūn
        { text: "挣扎", type: "易错多音字", grade: 3 },    // 扎 zhá
        { text: "扎实", type: "易错多音字", grade: 3 },    // 扎 zhā
        { text: "包扎", type: "易错多音字", grade: 3 },    // 扎 zā
    ];

    // ---------- 辅助函数：获取拼音 (使用 pinyin-pro) ----------
    function getPinyinMarked(word) {
        if (typeof pinyinPro === 'undefined') {
            console.warn('pinyin-pro未加载');
            return word; // fallback
        }
        try {
            // 返回带声调符号的拼音 (如 "zhōng guó")
            return pinyinPro.pinyin(word, { toneType: "mark", type: "string" });
        } catch (e) {
            return word;
        }
    }

    // ---------- 筛选题库 (根据勾选题型 & 年级) ----------
    function getFilteredBank() {
        const types = [];
        if (chkSingle.checked) types.push("单字");
        if (chkDouble.checked) types.push("双字词");
        if (chkIdiom.checked) types.push("成语");
        if (chkPoly.checked) types.push("易错多音字");

        const selectedGrade = gradeSelect.value; // "all" 或 "1","2"...

        return rawWordBank.filter(item => {
            if (!types.includes(item.type)) return false;
            if (selectedGrade === 'all') return true;
            return item.grade === parseInt(selectedGrade, 10);
        });
    }

    // ---------- 随机抽取不重复题目 ----------
    function pickRandomQuestions(bank, count) {
        if (bank.length === 0) return [];
        const shuffled = [...bank];
        // Fisher–Yates 洗牌
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        const actualCount = Math.min(count, bank.length);
        return shuffled.slice(0, actualCount);
    }

    // ---------- 渲染试卷 (根据 currentQuestions 和 showAnswer) ----------
    function renderExam() {
        if (!currentQuestions || currentQuestions.length === 0) {
            gridContainer.innerHTML = `<div class="empty-message">✨ 暂无题目，请生成试卷</div>`;
            answerList.innerHTML = '<li class="empty-msg">— 暂无答案 —</li>';
            return;
        }

        const showAns = currentShowAnswer;
        let html = '';
        currentQuestions.forEach((q, idx) => {
            const pinyinStr = getPinyinMarked(q.text);
            // 答案可见性类
            const answerVisibilityClass = showAns ? '' : 'hidden-answer';

            html += `
                <div class="word-card">
                    <div class="word-hanzi">${idx+1}. ${q.text}</div>
                    <div class="pinyin-area">
                        <div class="pinyin-answer ${answerVisibilityClass}">${pinyinStr}</div>
                        <div class="write-line"></div>
                    </div>
                </div>
            `;
        });
        gridContainer.innerHTML = html;

        // 渲染答案列表
        let ansHtml = '';
        currentQuestions.forEach((q, index) => {
            const pinyinStr = getPinyinMarked(q.text);
            ansHtml += `<li class="answer-item"><span class="answer-value">${pinyinStr}</span></li>`;
        });
        answerList.innerHTML = ansHtml;

        // 确保答案面板可见
        if (answerPanel.classList.contains('answer-hidden')) {
            answerPanel.classList.remove('answer-hidden');
        }

        // 显示消息（抽取结果提示）
        const totalInBank = getFilteredBank().length;
        messageArea.innerHTML = `📚 已从 ${totalInBank} 个词中抽取 ${currentQuestions.length} 题。`;
    }

    // ---------- 生成新试卷 (校验 + 抽题) ----------
    function generateNewPaper() {
        // 1. 获取筛选后题库
        const filtered = getFilteredBank();

        // 2. 校验题型是否至少勾选一项
        const anyChecked = chkSingle.checked || chkDouble.checked || chkIdiom.checked || chkPoly.checked;
        if (!anyChecked) {
            alert('⚠️ 请至少选择一种题型');
            return;
        }

        if (filtered.length === 0) {
            alert('当前筛选条件下没有词语，请调整年级或题型。');
            return;
        }

        // 3. 获取题数并校验范围
        let desiredCount = parseInt(countInput.value, 10);
        if (isNaN(desiredCount) || desiredCount < 5) desiredCount = 5;
        if (desiredCount > 50) desiredCount = 50;
        countInput.value = desiredCount;

        // 4. 如果题库不足，则调整题数并提示
        let actualCount = desiredCount;
        if (filtered.length < desiredCount) {
            actualCount = filtered.length;
            countInput.value = actualCount;
            messageArea.innerHTML = `⚠️ 词库仅有 ${filtered.length} 个词，已自动调整题数。`;
        } else {
            messageArea.innerHTML = '';
        }

        // 5. 随机抽取
        currentQuestions = pickRandomQuestions(filtered, actualCount);

        // 6. 保持答案显示状态与复选框同步
        currentShowAnswer = showAnswerCheck.checked;

        // 7. 渲染
        renderExam();
    }

    // ---------- 切换答案显示 (由复选框触发) ----------
    function toggleAnswerDisplay() {
        currentShowAnswer = showAnswerCheck.checked;
        renderExam();  // 重新渲染 (仅仅更新可见性)
    }

    // ---------- 显示/隐藏答案面板 ----------
    function toggleAnswerVisibility(force) {
        if (typeof force === 'boolean') {
            if (force) answerPanel.classList.remove('answer-hidden');
            else answerPanel.classList.add('answer-hidden');
        } else {
            answerPanel.classList.toggle('answer-hidden');
        }
    }
    
    // ---------- 打印控制 ----------
    function printWithMode(mode) {
        const bodyClass = mode === 'paper' ? 'print-paper' : 'print-answer';
        document.body.classList.add(bodyClass);
    
        window.print();
    
        const afterPrint = () => {
            document.body.classList.remove('print-paper', 'print-answer');
            window.removeEventListener('afterprint', afterPrint);
        };
        window.addEventListener('afterprint', afterPrint);
        setTimeout(() => {
            document.body.classList.remove('print-paper', 'print-answer');
        }, 500);
    }

    // ---------- 初始化事件绑定 & 默认生成一份试卷 ----------
    function init() {
        // 生成按钮
        generateBtn.addEventListener('click', generateNewPaper);
    
        // 显示答案复选框
        showAnswerCheck.addEventListener('change', toggleAnswerDisplay);
        hideAnswerInlineBtn.addEventListener('click', () => toggleAnswerVisibility());
    
        // 打印按钮
        printPaperBtn.addEventListener('click', () => {
            if (currentQuestions.length === 0) {
                alert('请先生成试卷');
                return;
            }
            printWithMode('paper');
        });
    
        printAnswerBtn.addEventListener('click', () => {
            if (currentQuestions.length === 0) {
                alert('暂无答案可打印');
                return;
            }
            printWithMode('answer');
        });
    
        // 输入校验: 限制范围
        countInput.addEventListener('change', function() {
            let val = parseInt(this.value, 10);
            if (val < 5) this.value = 5;
            if (val > 50) this.value = 50;
        });
    
        // 默认生成一份试卷（启动时）
        // 确俚pinyin-pro已加载，但通常已加载
        setTimeout(() => {
            generateNewPaper();
        }, 20);
    }

    init();
})();
