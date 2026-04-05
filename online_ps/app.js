class OnlinePS {
    constructor() {
        this.canvas = document.getElementById('editor-canvas');
        this.ctx = this.canvas.getContext('2d');

        // 状态变量
        this.isDrawing = false;
        this.currentTool = 'brush';
        this.color = '#000000';
        this.brushSize = 5;
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 15;
        this.lastX = 0;
        this.lastY = 0;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.saveState(); // 记录初始空白状态
    }

    setupEventListeners() {
        // 工具切换
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentTool = e.target.dataset.tool;
            });
        });

        // 画布事件
        this.canvas.addEventListener('mousedown', this.startDraw.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDraw.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDraw.bind(this));
        // 阻止移动端滚动
        this.canvas.addEventListener('touchstart', e => e.preventDefault(), { passive: false });

        // 控件事件
        document.getElementById('color-picker').addEventListener('input', e => this.color = e.target.value);
        document.getElementById('brush-size').addEventListener('input', e => this.brushSize = parseInt(e.target.value));
        document.getElementById('btn-undo').addEventListener('click', () => this.undo());
        document.getElementById('btn-redo').addEventListener('click', () => this.redo());
        document.getElementById('btn-download').addEventListener('click', () => this.download());
        document.getElementById('upload-image').addEventListener('change', e => this.loadImage(e));
        document.getElementById('apply-filters').addEventListener('click', () => this.applyFilters());
    }

    getCanvasPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: clientX - rect.left, y: clientY - rect.top };
    }

    startDraw(e) {
        this.isDrawing = true;
        const pos = this.getCanvasPos(e);
        this.lastX = pos.x;
        this.lastY = pos.y;

        if (this.currentTool === 'text') {
            const text = prompt('请输入文字内容:');
            if (text) {
                this.ctx.font = `${Math.max(this.brushSize * 4, 16)}px Arial`;
                this.ctx.fillStyle = this.color;
                this.ctx.fillText(text, pos.x, pos.y);
                this.saveState();
            }
            this.isDrawing = false;
        } else if (this.currentTool === 'rect') {
            this.startRectX = pos.x;
            this.startRectY = pos.y;
        }
    }

    draw(e) {
        if (!this.isDrawing || this.currentTool === 'rect') return;
        const pos = this.getCanvasPos(e);
        this.ctx.lineWidth = this.brushSize;

        if (this.currentTool === 'brush') {
            this.ctx.strokeStyle = this.color;
            this.ctx.globalCompositeOperation = 'source-over';
        } else if (this.currentTool === 'eraser') {
            this.ctx.globalCompositeOperation = 'destination-out';
        }

        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();

        this.lastX = pos.x;
        this.lastY = pos.y;
    }

    stopDraw(e) {
        if (!this.isDrawing) return;

        if (this.currentTool === 'rect') {
            const pos = this.getCanvasPos(e);
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.brushSize;
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.beginPath();
            this.ctx.strokeRect(this.startRectX, this.startRectY, pos.x - this.startRectX, pos.y - this.startRectY);
        }

        this.ctx.globalCompositeOperation = 'source-over'; // 恢复默认混合模式
        this.isDrawing = false;
        this.saveState();
    }

    // 历史记录管理
    saveState() {
        // 裁剪历史栈，防止前进失效时出现分支
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }
        this.history.push(this.canvas.toDataURL('image/png'));
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
        this.historyIndex = this.history.length - 1;
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.restoreState(this.history[this.historyIndex]);
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.restoreState(this.history[this.historyIndex]);
        }
    }

    restoreState(dataUrl) {
        const img = new Image();
        img.onload = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(img, 0, 0);
        };
        img.src = dataUrl;
    }

    // 图片上传
    loadImage(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                // 限制最大尺寸保证性能
                const MAX_W = 1200, MAX_H = 900;
                let w = img.width, h = img.height;
                if (w > MAX_W || h > MAX_H) {
                    const ratio = Math.min(MAX_W / w, MAX_H / h);
                    w *= ratio; h *= ratio;
                }
                this.canvas.width = w;
                this.canvas.height = h;
                this.ctx.drawImage(img, 0, 0, w, h);

                this.history = [];
                this.historyIndex = -1;
                this.saveState();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 滤镜应用
    applyFilters() {
        const brightness = document.getElementById('filter-brightness').value;
        const contrast = document.getElementById('filter-contrast').value;
        const grayscale = document.getElementById('filter-grayscale').value;

        const filterStr = `brightness(${1 + brightness / 100}) contrast(${1 + contrast / 100}) grayscale(${grayscale / 100})`;

        // 使用离屏Canvas应用滤镜，避免污染原画布上下文
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.filter = filterStr;
        tempCtx.drawImage(this.canvas, 0, 0);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(tempCanvas, 0, 0);

        // 重置滑块
        document.getElementById('filter-brightness').value = 0;
        document.getElementById('filter-contrast').value = 0;
        document.getElementById('filter-grayscale').value = 0;

        this.saveState();
    }

    // 导出下载
    download() {
        const link = document.createElement('a');
        link.download = `edited_${Date.now()}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new OnlinePS();
});