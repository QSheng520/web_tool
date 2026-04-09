// 辅助DOM
const showLoading = (msg = "⏳ 处理中，请稍候...") => {
    const toast = document.getElementById('loadingToast');
    toast.textContent = msg;
    toast.classList.add('show');
};
const hideLoading = () => {
    const toast = document.getElementById('loadingToast');
    toast.classList.remove('show');
};
const showError = (errMsg) => {
    alert("❌ 错误: " + errMsg);
    hideLoading();
};

// ===================== 1. 图片合并PDF模块 =====================
let imageFilesArray = []; // 存储File对象
const imgUploadZone = document.getElementById('imgUploadZone');
const imgFileInput = document.getElementById('imgFileInput');
const imgListContainer = document.getElementById('imgFileListContainer');
const mergeImagesBtn = document.getElementById('mergeImagesBtn');

// 渲染图片列表
function renderImageList() {
    if (!imgListContainer) return;
    if (imageFilesArray.length === 0) {
        imgListContainer.innerHTML = '<div class="empty-list">暂无图片，上传后将显示在此处</div>';
        return;
    }
    let html = '';
    imageFilesArray.forEach((file, idx) => {
        const url = URL.createObjectURL(file);
        html += `
            <div class="file-item" data-img-index="${idx}">
                <div class="file-info">
                    <div class="thumbnail"><img src="${url}" style="width:32px; height:32px; object-fit:cover; border-radius:8px;"></div>
                    <div><div class="file-name">${escapeHtml(file.name)}</div><div class="file-meta">${(file.size/1024).toFixed(1)} KB</div></div>
                </div>
                <div class="file-actions">
                    <button class="btn-icon move-up" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''}>↑</button>
                    <button class="btn-icon move-down" data-idx="${idx}" ${idx === imageFilesArray.length-1 ? 'disabled' : ''}>↓</button>
                    <button class="btn-icon btn-danger remove-img" data-idx="${idx}">🗑</button>
                </div>
            </div>
        `;
    });
    imgListContainer.innerHTML = html;
    // 释放临时URL (可选清理, 但保留预览)
    // 绑定动态按钮事件
    document.querySelectorAll('.move-up').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.dataset.idx);
            if (idx > 0) {
                [imageFilesArray[idx-1], imageFilesArray[idx]] = [imageFilesArray[idx], imageFilesArray[idx-1]];
                renderImageList();
            }
        });
    });
    document.querySelectorAll('.move-down').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.dataset.idx);
            if (idx < imageFilesArray.length-1) {
                [imageFilesArray[idx+1], imageFilesArray[idx]] = [imageFilesArray[idx], imageFilesArray[idx+1]];
                renderImageList();
            }
        });
    });
    document.querySelectorAll('.remove-img').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.dataset.idx);
            imageFilesArray.splice(idx, 1);
            renderImageList();
        });
    });
}

// 图片上传处理
function handleImageFiles(files) {
    const allowed = ['image/jpeg','image/png','image/jpg'];
    const newFiles = Array.from(files).filter(f => allowed.includes(f.type));
    if(newFiles.length !== files.length) alert("仅支持 JPEG/PNG 图片格式");
    imageFilesArray.push(...newFiles);
    renderImageList();
}
imgUploadZone.addEventListener('click', () => imgFileInput.click());
imgFileInput.addEventListener('change', (e) => handleImageFiles(e.target.files));
// 拖拽
setupDragAndDrop(imgUploadZone, (files) => handleImageFiles(files), 'image/*');

// 图片合并PDF核心
mergeImagesBtn.addEventListener('click', async () => {
    if (imageFilesArray.length === 0) return showError("请先上传至少一张图片");
    showLoading("📸 正在生成PDF，请稍等...");
    try {
        const pdfDoc = await PDFLib.PDFDocument.create();
        for (let i = 0; i < imageFilesArray.length; i++) {
            const file = imageFilesArray[i];
            const bytes = await file.arrayBuffer();
            let imageEmbed;
            if (file.type === 'image/jpeg') imageEmbed = await pdfDoc.embedJpg(bytes);
            else if (file.type === 'image/png') imageEmbed = await pdfDoc.embedPng(bytes);
            else continue;
            const { width, height } = imageEmbed.scale(1);
            const pageWidth = 595; // A4 width points
            const pageHeight = 842;
            const page = pdfDoc.addPage([pageWidth, pageHeight]);
            const scaleW = pageWidth / width;
            const scaleH = pageHeight / height;
            const scale = Math.min(scaleW, scaleH);
            const scaledWidth = width * scale;
            const scaledHeight = height * scale;
            const x = (pageWidth - scaledWidth) / 2;
            const y = (pageHeight - scaledHeight) / 2;
            page.drawImage(imageEmbed, { x, y, width: scaledWidth, height: scaledHeight });
        }
        const pdfBytes = await pdfDoc.save();
        downloadBlob(pdfBytes, `merged_images_${Date.now()}.pdf`, 'application/pdf');
        hideLoading();
    } catch(e) { console.error(e); showError("图片合并失败: "+e.message); hideLoading(); }
});

// ===================== 2. 合并多个PDF模块 =====================
let pdfMergeFiles = []; // 存储 {file, pageCount}
const pdfMergeZone = document.getElementById('pdfMergeZone');
const pdfMergeInput = document.getElementById('pdfMergeInput');
const pdfMergeListContainer = document.getElementById('pdfMergeListContainer');
const mergePdfsBtn = document.getElementById('mergePdfsBtn');

async function loadPdfPageCount(file) {
    const arrayBuf = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(arrayBuf);
    return pdf.getPageCount();
}

async function updatePdfMergeList() {
    if (pdfMergeFiles.length === 0) {
        pdfMergeListContainer.innerHTML = '<div class="empty-list">未上传PDF，点击上方区域添加</div>';
        return;
    }
    let html = '';
    for (let i = 0; i < pdfMergeFiles.length; i++) {
        const item = pdfMergeFiles[i];
        const pageCount = item.pageCount !== undefined ? item.pageCount : '?';
        html += `
            <div class="file-item" data-pdf-idx="${i}">
                <div class="file-info">
                    <div class="thumbnail">📑</div>
                    <div><div class="file-name">${escapeHtml(item.file.name)}</div><div class="file-meta">${pageCount} 页 · ${(item.file.size/1024).toFixed(1)}KB</div></div>
                </div>
                <div class="file-actions">
                    <button class="btn-icon move-pdf-up" data-idx="${i}" ${i===0?'disabled':''}>↑</button>
                    <button class="btn-icon move-pdf-down" data-idx="${i}" ${i===pdfMergeFiles.length-1?'disabled':''}>↓</button>
                    <button class="btn-icon btn-danger remove-pdf" data-idx="${i}">🗑</button>
                </div>
            </div>
        `;
    }
    pdfMergeListContainer.innerHTML = html;
    // 绑定排序删除
    document.querySelectorAll('.move-pdf-up').forEach(btn => {
        btn.addEventListener('click', () => { let idx = parseInt(btn.dataset.idx); if(idx>0){ [pdfMergeFiles[idx-1], pdfMergeFiles[idx]] = [pdfMergeFiles[idx], pdfMergeFiles[idx-1]]; updatePdfMergeList(); } });
    });
    document.querySelectorAll('.move-pdf-down').forEach(btn => {
        btn.addEventListener('click', () => { let idx = parseInt(btn.dataset.idx); if(idx<pdfMergeFiles.length-1){ [pdfMergeFiles[idx+1], pdfMergeFiles[idx]] = [pdfMergeFiles[idx], pdfMergeFiles[idx+1]]; updatePdfMergeList(); } });
    });
    document.querySelectorAll('.remove-pdf').forEach(btn => {
        btn.addEventListener('click', () => { let idx = parseInt(btn.dataset.idx); pdfMergeFiles.splice(idx,1); updatePdfMergeList(); });
    });
}

async function addPdfMergeFiles(files) {
    const pdfFiles = Array.from(files).filter(f => f.type === 'application/pdf');
    if(pdfFiles.length === 0) return alert("请上传PDF文件");
    for(let file of pdfFiles) {
        try {
            const pageCount = await loadPdfPageCount(file);
            pdfMergeFiles.push({ file, pageCount });
        } catch(e) { alert(`无法解析PDF: ${file.name}`); }
    }
    await updatePdfMergeList();
}

pdfMergeZone.addEventListener('click', () => pdfMergeInput.click());
pdfMergeInput.addEventListener('change', (e) => addPdfMergeFiles(e.target.files));
setupDragAndDrop(pdfMergeZone, (files) => addPdfMergeFiles(files), 'application/pdf');

mergePdfsBtn.addEventListener('click', async () => {
    if(pdfMergeFiles.length === 0) return showError("请至少上传一个PDF文件");
    showLoading("🔗 正在合并PDF，大文件请稍候...");
    try {
        const mergedPdf = await PDFLib.PDFDocument.create();
        for (let item of pdfMergeFiles) {
            const arrayBuf = await item.file.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(arrayBuf);
            const indices = pdfDoc.getPageIndices();
            const copiedPages = await mergedPdf.copyPages(pdfDoc, indices);
            copiedPages.forEach(page => mergedPdf.addPage(page));
        }
        const pdfBytes = await mergedPdf.save();
        downloadBlob(pdfBytes, `merged_pdfs_${Date.now()}.pdf`, 'application/pdf');
        hideLoading();
    } catch(e) { showError("合并失败: "+e.message); hideLoading(); }
});

// ===================== 3. PDF拆分模块 =====================
let splitPdfFile = null;       // 存储单个文件对象
let splitPdfDoc = null;        // 缓存pdf实例，总页数
let totalSplitPages = 0;
const splitZone = document.getElementById('splitZone');
const splitFileInput = document.getElementById('splitFileInput');
const splitInfoArea = document.getElementById('splitInfoArea');
const splitModeSelect = document.getElementById('splitModeSelect');
const rangeOptionArea = document.getElementById('rangeOptionArea');
const pageRangesInput = document.getElementById('pageRangesInput');
const perPageNote = document.getElementById('perPageNote');
const splitPdfBtn = document.getElementById('splitPdfBtn');

splitModeSelect.addEventListener('change', () => {
    const mode = splitModeSelect.value;
    if(mode === 'single') {
        rangeOptionArea.style.display = 'none';
        perPageNote.style.display = 'block';
    } else {
        rangeOptionArea.style.display = 'flex';
        perPageNote.style.display = 'none';
    }
});
splitModeSelect.dispatchEvent(new Event('change'));

async function loadSplitPdf(file) {
    if(!file) return;
    try {
        const arrayBuf = await file.arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuf);
        splitPdfDoc = pdfDoc;
        totalSplitPages = pdfDoc.getPageCount();
        splitInfoArea.innerHTML = `<div class="flex-between"><span>📄 ${escapeHtml(file.name)}</span><span class="info-badge">总页数: ${totalSplitPages}</span></div>
                                    <div style="margin-top:8px; font-size:0.75rem;">✅ 已加载，可设置拆分规则</div>`;
        pageRangesInput.placeholder = `例: 1-3,4,5-7 (1-${totalSplitPages})`;
    } catch(e) { splitInfoArea.innerHTML = `<div class="empty-list">❌ PDF解析失败</div>`; splitPdfDoc=null; }
}

async function handleSplitFile(files) {
    if(!files.length) return;
    const file = files[0];
    if(file.type !== 'application/pdf') return alert("请上传PDF文件");
    splitPdfFile = file;
    await loadSplitPdf(file);
}
splitZone.addEventListener('click', () => splitFileInput.click());
splitFileInput.addEventListener('change', (e) => handleSplitFile(e.target.files));
setupDragAndDrop(splitZone, (files) => handleSplitFile(files), 'application/pdf');

// 解析页码范围 "1-3,4,5-6" 返回 [[1,3],[4,4],[5,6]]
function parseRanges(rangesStr, totalPages) {
    const parts = rangesStr.split(',').map(s=>s.trim()).filter(s=>s);
    const ranges = [];
    for(let part of parts) {
        if(part.includes('-')) {
            let [start,end] = part.split('-').map(Number);
            if(isNaN(start) || isNaN(end) || start<1 || end>totalPages || start>end) throw new Error(`无效范围: ${part}`);
            ranges.push([start,end]);
        } else {
            let p = Number(part);
            if(isNaN(p) || p<1 || p>totalPages) throw new Error(`无效页码: ${part}`);
            ranges.push([p,p]);
        }
    }
    // 合并重叠区间？简化，按照顺序生成区间列表，不合并但后续提取时可能重复，但一般用户合理
    return ranges;
}

splitPdfBtn.addEventListener('click', async () => {
    if(!splitPdfDoc || !splitPdfFile) return showError("请先上传一个PDF文件");
    const mode = splitModeSelect.value;
    showLoading("✂️ 正在拆分并打包ZIP...");
    try {
        const zip = new JSZip();
        let splitTasks = [];
        if(mode === 'single') {
            // 每页独立PDF
            for(let i=0; i<totalSplitPages; i++) {
                const newPdf = await PDFLib.PDFDocument.create();
                const [page] = await newPdf.copyPages(splitPdfDoc, [i]);
                newPdf.addPage(page);
                const bytes = await newPdf.save();
                splitTasks.push({ name: `page_${i+1}.pdf`, bytes });
            }
        } else {
            // 自定义范围
            let rawRange = pageRangesInput.value.trim();
            if(!rawRange) throw new Error("请输入页码范围");
            const ranges = parseRanges(rawRange, totalSplitPages);
            for(let idx=0; idx<ranges.length; idx++) {
                const [s,e] = ranges[idx];
                const pagesToCopy = [];
                for(let p=s; p<=e; p++) pagesToCopy.push(p-1);
                const newPdf = await PDFLib.PDFDocument.create();
                const copied = await newPdf.copyPages(splitPdfDoc, pagesToCopy);
                copied.forEach(page => newPdf.addPage(page));
                const bytes = await newPdf.save();
                splitTasks.push({ name: `split_${s}-${e}.pdf`, bytes });
            }
        }
        for(let task of splitTasks) {
            zip.file(task.name, task.bytes);
        }
        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadBlob(zipBlob, `split_pdfs_${Date.now()}.zip`, 'application/zip');
        hideLoading();
    } catch(e) { showError("拆分失败: "+e.message); hideLoading(); }
});

// 通用函数
function downloadBlob(blob, fileName, mimeType) {
    const url = URL.createObjectURL(new Blob([blob], { type: mimeType }));
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
function escapeHtml(str) { return str.replace(/[&<>]/g, function(m){if(m==='&') return '&amp;'; if(m==='<') return '&lt;'; if(m==='>') return '&gt;'; return m;}); }
function setupDragAndDrop(zoneElement, onDropCallback, acceptPattern) {
    zoneElement.addEventListener('dragover', (e) => { e.preventDefault(); zoneElement.classList.add('drag-over'); });
    zoneElement.addEventListener('dragleave', () => zoneElement.classList.remove('drag-over'));
    zoneElement.addEventListener('drop', async (e) => {
        e.preventDefault();
        zoneElement.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        if(acceptPattern === 'image/*') {
            const imgFiles = files.filter(f => f.type.startsWith('image/'));
            if(imgFiles.length) onDropCallback(imgFiles);
            else alert("请拖拽图片文件");
        } else if(acceptPattern === 'application/pdf') {
            const pdfs = files.filter(f => f.type === 'application/pdf');
            if(pdfs.length) onDropCallback(pdfs);
            else alert("请拖拽PDF文件");
        } else {
            onDropCallback(files);
        }
    });
}
// 初始渲染空列表
renderImageList();
updatePdfMergeList();
