(function(){
    // ---------- 密本映射表 ----------
    // Base64 标准字符集 65个 (A-Z a-z 0-9 + / =)
    const BASE64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    // 对应65个常用且不重复的中文字符（暗码表），保证一一对应，使密文看起来像"中文段落"
    // 长度严格65，每个汉字映射一个Base64字符
    const CHINESE_MAP_LIST = [
        '的','一','是','不','了','人','我','在','有','他',
        '这','为','之','大','来','以','个','中','上','们',
        '到','说','国','和','地','也','时','出','就','可',
        '下','对','生','成','会','自','发','着','那','能',
        '动','静','分','好','都','高','于','经','方','平',
        '法','如','所','其','手','行','制','体','但','此',
        '意','本','女','又','信'   // 第65个汉字 '信' 映射 '='
    ];

    // 校验长度
    if(BASE64_CHARS.length !== CHINESE_MAP_LIST.length) {
        console.error("映射表长度不一致！", BASE64_CHARS.length, CHINESE_MAP_LIST.length);
        // 应急补丁：若长度不足或超出，强行补足 (但硬编码保证65)
        while(CHINESE_MAP_LIST.length < BASE64_CHARS.length) CHINESE_MAP_LIST.push('密');
        while(CHINESE_MAP_LIST.length > BASE64_CHARS.length) CHINESE_MAP_LIST.pop();
    }

    // 构建加密映射: base64字符 -> 汉字
    const encryptMap = new Map();
    // 构建解密映射: 汉字 -> base64字符
    const decryptMap = new Map();

    for(let i = 0; i < BASE64_CHARS.length; i++) {
        const baseChar = BASE64_CHARS[i];
        const chineseChar = CHINESE_MAP_LIST[i];
        encryptMap.set(baseChar, chineseChar);
        decryptMap.set(chineseChar, baseChar);
    }

    // ---------- 辅助函数：UTF-8 <-> Base64 (支持中文、emoji全兼容) ----------
    // 将字符串转为 base64 (UTF-8编码)
    function utf8ToBase64(str) {
        try {
            // 使用 encodeURIComponent + unescape 经典方案处理全部unicode
            return btoa(unescape(encodeURIComponent(str)));
        } catch(e) {
            console.error("UTF-8转Base64失败", e);
            throw new Error("编码失败，文本包含无法处理的字符");
        }
    }

    // 将 base64 还原为原始字符串
    function base64ToUtf8(base64Str) {
        try {
            return decodeURIComponent(escape(atob(base64Str)));
        } catch(e) {
            console.error("Base64转UTF-8失败", e);
            throw new Error("密文Base64解码失败，可能不是有效的加密内容");
        }
    }

    // ---------- 核心加密 ----------
    function encryptText(plainText) {
        if (!plainText || plainText.trim() === "") {
            return "";
        }
        // 1. 获取base64串
        let base64Str = utf8ToBase64(plainText);
        // 2. 将base64每个字符映射为汉字
        let encryptedChinese = "";
        for(let ch of base64Str) {
            const mappedChar = encryptMap.get(ch);
            if(!mappedChar) {
                // 理论上不可能，因为base64字符集完整覆盖
                throw new Error(`加密映射失败：未知Base64字符 "${ch}"`);
            }
            encryptedChinese += mappedChar;
        }
        return encryptedChinese;
    }

    // ---------- 核心解密 ----------
    function decryptText(cipherChinese) {
        if (!cipherChinese || cipherChinese.trim() === "") {
            return "";
        }
        // 移除所有空白字符（空格、换行、制表符等）因为密文必须是连续汉字，用户可能误加空格
        let cleanChinese = cipherChinese.replace(/\s+/g, '');
        if(cleanChinese.length === 0) {
            throw new Error("密文为空，请输入有效的中文暗号");
        }
        // 将每个汉字映射回 base64 字符
        let base64Buffer = "";
        for(let ch of cleanChinese) {
            const baseChar = decryptMap.get(ch);
            if(!baseChar) {
                throw new Error(`解密失败：汉字「${ch}」不在密本中，请确认密文由本工具加密生成`);
            }
            base64Buffer += baseChar;
        }
        // 还原原始文本
        let originalText = base64ToUtf8(base64Buffer);
        return originalText;
    }

    // ---------- DOM 元素绑定与辅助交互 ----------
    // 加密区
    const plainInput = document.getElementById('plainInput');
    const encryptedResultDiv = document.getElementById('encryptedResult');
    const encryptBtn = document.getElementById('encryptBtn');
    const clearPlainBtn = document.getElementById('clearPlainBtn');
    const examplePlainBtn = document.getElementById('examplePlainBtn');
    const copyEncryptBtn = document.getElementById('copyEncryptBtn');
    const fillToDecryptBtn = document.getElementById('fillToDecryptBtn');

    // 解密区
    const cipherInput = document.getElementById('cipherInput');
    const decryptedResultDiv = document.getElementById('decryptedResult');
    const decryptBtn = document.getElementById('decryptBtn');
    const clearCipherBtn = document.getElementById('clearCipherBtn');
    const exampleCipherBtn = document.getElementById('exampleCipherBtn');
    const copyDecryptBtn = document.getElementById('copyDecryptBtn');

    // 辅助显示错误消息 (简短提示)
    function showTemporaryError(element, message) {
        const originalText = element.innerText;
        element.innerText = `⚠️ ${message}`;
        element.style.color = "#ffbbaa";
        setTimeout(() => {
            if(element.innerText === `⚠️ ${message}`) {
                element.innerText = originalText;
                element.style.color = "#d6e6ff";
            } else {
                element.style.color = "#d6e6ff";
            }
        }, 2000);
    }

    function showSuccessMsg(element, newContent) {
        // 展示新内容，颜色正常即可
        element.style.color = "#d6e6ff";
    }

    // 加密逻辑
    function doEncrypt() {
        let plain = plainInput.value;
        if(!plain.trim()) {
            encryptedResultDiv.innerText = "❗ 请输入原始情报";
            showTemporaryError(encryptedResultDiv, "文本不能为空");
            return;
        }
        try {
            let cipher = encryptText(plain);
            encryptedResultDiv.innerText = cipher;
            showSuccessMsg(encryptedResultDiv, cipher);
        } catch(err) {
            console.error(err);
            encryptedResultDiv.innerText = "❌ 加密失败";
            showTemporaryError(encryptedResultDiv, err.message || "加密异常");
        }
    }

    // 解密逻辑
    function doDecrypt() {
        let cipher = cipherInput.value;
        if(!cipher.trim()) {
            decryptedResultDiv.innerText = "❗ 请输入待解密的密文";
            showTemporaryError(decryptedResultDiv, "密文不能为空");
            return;
        }
        try {
            let plain = decryptText(cipher);
            decryptedResultDiv.innerText = plain;
            showSuccessMsg(decryptedResultDiv, plain);
        } catch(err) {
            console.error(err);
            decryptedResultDiv.innerText = "❌ 解密失败";
            showTemporaryError(decryptedResultDiv, err.message || "密文无效或非本工具生成");
        }
    }

    // 复制文本
    async function copyToClipboard(text, successMsg) {
        if(!text || text.includes("等待加密") || text.includes("等待解密") || text.includes("无效") || text.includes("失败")) {
            alert("没有可复制的内容或结果无效");
            return false;
        }
        try {
            await navigator.clipboard.writeText(text);
            alert(`✅ ${successMsg}\n已复制到剪贴板`);
            return true;
        } catch(err) {
            alert("❌ 复制失败，可手动选择复制");
            return false;
        }
    }

    // 填充加密结果到解密输入框
    function fillCipherToDecrypt() {
        let cipherText = encryptedResultDiv.innerText;
        if(!cipherText || cipherText.includes("等待加密") || cipherText.includes("失败") || cipherText.includes("请输入")) {
            alert("请先成功加密一段文本，再填入解密区");
            return;
        }
        cipherInput.value = cipherText;
        // 可选自动清除解密结果区域，让用户手动解密
        decryptedResultDiv.innerText = "—— 已填入密文，点击解密 ——";
    }

    // 范例: 典型卧底情报
    function setPlainExample() {
        plainInput.value = "【卧底急报】今晚22:00，东区码头货柜A7，接头暗号\"夜莺啼血\"，怀疑有新型毒品，请求警力埋伏。";
        doEncrypt(); // 自动加密展示
    }

    // 密文范例 (基于上面明文生成的密文，方便体验)
    function setCipherExample() {
        // 用上面的范例生成好密文（预置一个典型密文，以确保用户理解）
        const examplePlain = "【卧底急报】今晚22:00，东区码头货柜A7，接头暗号\"夜莺啼血\"，怀疑有新型毒品，请求警力埋伏。";
        const preEncrypted = encryptText(examplePlain);
        cipherInput.value = preEncrypted;
        decryptedResultDiv.innerText = "—— 已填入范例密文，点击解密 ——";
    }

    // 清空
    function clearPlain() {
        plainInput.value = "";
        encryptedResultDiv.innerText = "—— 等待加密 ——";
    }
    function clearCipher() {
        cipherInput.value = "";
        decryptedResultDiv.innerText = "—— 等待解密 ——";
    }

    // 额外交互：复制加密结果
    copyEncryptBtn.addEventListener('click', () => {
        let encText = encryptedResultDiv.innerText;
        if(encText && !encText.includes("等待加密") && !encText.includes("失败") && !encText.includes("请输入")) {
            copyToClipboard(encText, "密文已复制");
        } else {
            alert("没有有效的密文可复制，请先加密一段文本");
        }
    });

    copyDecryptBtn.addEventListener('click', () => {
        let decText = decryptedResultDiv.innerText;
        if(decText && !decText.includes("等待解密") && !decText.includes("失败") && !decText.includes("无效") && !decText.includes("请输入")) {
            copyToClipboard(decText, "明文已复制");
        } else {
            alert("没有有效的解密结果可复制，请先解密一段密文");
        }
    });

    // 绑定按钮事件
    encryptBtn.addEventListener('click', doEncrypt);
    decryptBtn.addEventListener('click', doDecrypt);
    clearPlainBtn.addEventListener('click', clearPlain);
    clearCipherBtn.addEventListener('click', clearCipher);
    examplePlainBtn.addEventListener('click', setPlainExample);
    exampleCipherBtn.addEventListener('click', setCipherExample);
    fillToDecryptBtn.addEventListener('click', fillCipherToDecrypt);

    // 附加用户体验: 如果解密区的密文直接粘贴后 按解密键 没问题
    // 支持回车快捷方式? 简单做可选，不做复杂

    // 初始时在控制台显示已准备
    console.log("卧底加密工具已启动 | 密本加载成功，映射汉字数:", CHINESE_MAP_LIST.length);

    // 额外检测：对于加密结果展示，若是空加密展示友好
    // 对解密输入自动去除首尾空白演示 (在解密函数内部已经移除所有空白字符)

    // 美化一下：点击复制时，给用户更好体验，无额外动作
    // 若用户想验证密文可逆：示例内建测试
    // 添加一个隐藏测试自检 (确保映射完美)
    (function selfTest() {
        const testStr = "卧底行动代号: 猎隼🐉🔫 2025";
        try {
            const encrypted = encryptText(testStr);
            const decrypted = decryptText(encrypted);
            if(decrypted === testStr) {
                console.log("✅ 自检通过：加解密闭环正常，密文为全中文:", encrypted.substring(0,20)+"...");
            } else {
                console.warn("⚠️ 自检失败");
            }
        } catch(e) {
            console.error("自检异常", e);
        }
    })();
})();
