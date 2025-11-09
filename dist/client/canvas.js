// Canvas drawing logic: Handles tools, rendering, and layers for efficiency.
// Uses off-screen canvas for layers to avoid full redraws on every update.
export class CanvasManager {
    constructor(canvasId) {
        this.currentTool = 'brush';
        this.color = '#000000';
        this.strokeWidth = 5;
        this.isDrawing = false;
        this.paths = []; // Array of path objects for undo/redo
        this.currentPath = null;
        this.fps = 0;
        this.lastFrameTime = 0;
        this.frameCount = 0;
        this.shapeStart = null; // for rectangle/circle
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCanvas.width = this.canvas.width;
        this.offscreenCanvas.height = this.canvas.height;
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');
        this.bindEvents();
    }
    bindEvents() {
        // Mouse events for desktop
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        // Touch events for mobile (bonus)
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startDrawing(e.touches[0]);
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.draw(e.touches[0]);
        });
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopDrawing();
        });
    }
    startDrawing(event) {
        const { x, y } = this.getMousePos(event);
        this.isDrawing = true;
        this.shapeStart = { x, y };
        if (this.currentTool === 'brush' || this.currentTool === 'eraser') {
            this.currentPath = { tool: this.currentTool, color: this.color, width: this.strokeWidth, points: [{ x, y }] };
        }
    }
    draw(event) {
        if (!this.isDrawing || !this.shapeStart)
            return;
        const { x, y } = this.getMousePos(event);
        // Clear the visible canvas for live shape preview
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.offscreenCanvas, 0, 0);
        if (this.currentTool === 'brush' || this.currentTool === 'eraser') {
            this.currentPath.points.push({ x, y });
            this.renderPath(this.currentPath, this.offscreenCtx);
        }
        else if (this.currentTool === 'rectangle') {
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.strokeWidth;
            this.ctx.strokeRect(this.shapeStart.x, this.shapeStart.y, x - this.shapeStart.x, y - this.shapeStart.y);
        }
        else if (this.currentTool === 'circle') {
            const radius = Math.sqrt(Math.pow(x - this.shapeStart.x, 2) + Math.pow(y - this.shapeStart.y, 2));
            this.ctx.strokeStyle = this.color;
            this.ctx.lineWidth = this.strokeWidth;
            this.ctx.beginPath();
            this.ctx.arc(this.shapeStart.x, this.shapeStart.y, radius, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
        this.updateMetrics();
    }
    stopDrawing(event) {
        if (!this.isDrawing)
            return;
        this.isDrawing = false;
        const { x, y } = event ? this.getMousePos(event) : { x: 0, y: 0 };
        if (this.currentTool === 'brush' || this.currentTool === 'eraser') {
            this.paths.push(this.currentPath);
            window.dispatchEvent(new CustomEvent('pathDrawn', { detail: this.currentPath }));
            this.currentPath = null;
        }
        else if (this.currentTool === 'rectangle' && this.shapeStart) {
            const rectPath = {
                tool: 'rectangle',
                color: this.color,
                width: this.strokeWidth,
                start: this.shapeStart,
                end: { x, y }
            };
            this.paths.push(rectPath);
            this.renderShape(rectPath);
            window.dispatchEvent(new CustomEvent('pathDrawn', { detail: rectPath }));
        }
        else if (this.currentTool === 'circle' && this.shapeStart) {
            const circlePath = {
                tool: 'circle',
                color: this.color,
                width: this.strokeWidth,
                start: this.shapeStart,
                end: { x, y }
            };
            this.paths.push(circlePath);
            this.renderShape(circlePath);
            window.dispatchEvent(new CustomEvent('pathDrawn', { detail: circlePath }));
        }
        this.rebuildOffscreen();
        this.redraw();
        this.shapeStart = null;
    }
    renderPath(path, ctx) {
        if (!path.points)
            return;
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        path.points.forEach((point, i) => {
            if (i === 0)
                ctx.moveTo(point.x, point.y);
            else
                ctx.lineTo(point.x, point.y);
        });
        if (path.tool === 'eraser')
            ctx.globalCompositeOperation = 'destination-out';
        else
            ctx.globalCompositeOperation = 'source-over';
        ctx.stroke();
    }
    renderShape(path) {
        const ctx = this.offscreenCtx;
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.width;
        if (path.tool === 'rectangle') {
            ctx.strokeRect(path.start.x, path.start.y, path.end.x - path.start.x, path.end.y - path.start.y);
        }
        else if (path.tool === 'circle') {
            const radius = Math.sqrt(Math.pow(path.end.x - path.start.x, 2) + Math.pow(path.end.y - path.start.y, 2));
            ctx.beginPath();
            ctx.arc(path.start.x, path.start.y, radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    }
    redraw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.offscreenCanvas, 0, 0);
        this.updateMetrics();
    }
    updateMetrics() {
        const now = performance.now();
        this.frameCount++;
        if (now - this.lastFrameTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFrameTime));
            this.frameCount = 0;
            this.lastFrameTime = now;
            const metrics = document.getElementById('metrics');
            if (metrics)
                metrics.innerText = `FPS: ${this.fps} | Latency: 0ms`;
        }
    }
    setTool(tool) { this.currentTool = tool; }
    setColor(color) { this.color = color; }
    setStrokeWidth(width) { this.strokeWidth = width; }
    undo() {
        if (this.paths.length) {
            this.paths.pop();
            this.rebuildOffscreen();
            this.redraw();
        }
    }
    redo() { }
    rebuildOffscreen() {
        this.offscreenCtx.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height);
        this.paths.forEach(path => {
            if (path.tool === 'brush' || path.tool === 'eraser')
                this.renderPath(path, this.offscreenCtx);
            else
                this.renderShape(path);
        });
    }
    loadState(paths) {
        this.paths = paths;
        this.rebuildOffscreen();
        this.redraw();
    }
    getMousePos(event) {
        const rect = this.canvas.getBoundingClientRect();
        return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }
}
