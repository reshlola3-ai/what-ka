// 卡通身体模板定义
const CUP_TEMPLATES = {
    'A': {
        name: '坦荡A咖',
        slogan: '我平我骄傲',
        color: '#ff6b6b', // 红色系
        body: (ctx, width, height) => {
            // A咖：纸片人身材
            ctx.fillStyle = '#ffcccc';
            ctx.fillRect(width * 0.3, height * 0.4, width * 0.4, height * 0.3); // 平板身体
            
            // 委屈猫耳
            ctx.fillStyle = '#ff9999';
            ctx.beginPath();
            ctx.arc(width * 0.25, height * 0.25, width * 0.1, 0, Math.PI * 2);
            ctx.arc(width * 0.75, height * 0.25, width * 0.1, 0, Math.PI * 2);
            ctx.fill();
            
            // 委屈表情符号
            ctx.font = `${width * 0.15}px Arial`;
            ctx.fillStyle = '#666';
            ctx.fillText('😢', width * 0.45, height * 0.7);
        }
    },
    'B': {
        name: '薛定谔B咖',
        slogan: '挤一挤就有',
        color: '#4ecdc4', // 青色系
        body: (ctx, width, height) => {
            // B咖：微胖熊猫身材
            ctx.fillStyle = '#333';
            
            // 身体（微胖）
            ctx.beginPath();
            ctx.ellipse(width * 0.5, height * 0.55, width * 0.25, height * 0.2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // 微隆起的胸部
            ctx.fillStyle = '#555';
            ctx.beginPath();
            ctx.arc(width * 0.4, height * 0.45, width * 0.08, 0, Math.PI * 2);
            ctx.arc(width * 0.6, height * 0.45, width * 0.08, 0, Math.PI * 2);
            ctx.fill();
            
            // 傲娇表情
            ctx.font = `${width * 0.15}px Arial`;
            ctx.fillStyle = '#666';
            ctx.fillText('😏', width * 0.45, height * 0.7);
        }
    },
    'C': {
        name: 'C位大咖',
        slogan: '自信放光芒',
        color: '#45b7d1', // 蓝色系
        body: (ctx, width, height) => {
            // C咖：性感曲线身材
            ctx.fillStyle = '#ff99cc';
            
            // 沙漏型身体
            ctx.beginPath();
            ctx.moveTo(width * 0.3, height * 0.3);
            ctx.bezierCurveTo(width * 0.2, height * 0.5, width * 0.2, height * 0.7, width * 0.3, height * 0.8);
            ctx.lineTo(width * 0.7, height * 0.8);
            ctx.bezierCurveTo(width * 0.8, height * 0.7, width * 0.8, height * 0.5, width * 0.7, height * 0.3);
            ctx.closePath();
            ctx.fill();
            
            // 明显胸部
            ctx.fillStyle = '#ff66aa';
            ctx.beginPath();
            ctx.arc(width * 0.4, height * 0.45, width * 0.12, 0, Math.PI * 2);
            ctx.arc(width * 0.6, height * 0.45, width * 0.12, 0, Math.PI * 2);
            ctx.fill();
            
            // 自信表情
            ctx.font = `${width * 0.15}px Arial`;
            ctx.fillStyle = '#666';
            ctx.fillText('😎', width * 0.45, height * 0.7);
        }
    },
    'D': {
        name: '灭世D咖',
        slogan: '胸怀天下',
        color: '#96ceb4', // 绿色系
        body: (ctx, width, height) => {
            // D咖：夸张巨乳奶牛风格
            ctx.fillStyle = '#fff';
            
            // 奶牛斑点身体
            ctx.fillRect(width * 0.2, height * 0.3, width * 0.6, height * 0.5);
            
            // 奶牛斑点
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(width * 0.3, height * 0.4, width * 0.05, 0, Math.PI * 2);
            ctx.arc(width * 0.7, height * 0.5, width * 0.07, 0, Math.PI * 2);
            ctx.arc(width * 0.5, height * 0.6, width * 0.06, 0, Math.PI * 2);
            ctx.fill();
            
            // 夸张巨乳
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(width * 0.35, height * 0.4, width * 0.18, 0, Math.PI * 2);
            ctx.arc(width * 0.65, height * 0.4, width * 0.18, 0, Math.PI * 2);
            ctx.fill();
            
            // 奶牛乳头
            ctx.fillStyle = '#ff6666';
            ctx.beginPath();
            ctx.arc(width * 0.35, height * 0.4, width * 0.04, 0, Math.PI * 2);
            ctx.arc(width * 0.65, height * 0.4, width * 0.04, 0, Math.PI * 2);
            ctx.fill();
            
            // 得意笑容
            ctx.font = `${width * 0.15}px Arial`;
            ctx.fillStyle = '#666';
            ctx.fillText('🤣', width * 0.45, height * 0.7);
        }
    }
};

// 脸部贴合函数
function mergeFaceToTemplate(faceImage, cupType, canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 绘制卡通身体
    const template = CUP_TEMPLATES[cupType];
    template.body(ctx, width, height);
    
    // 计算脸部位置和大小（放在身体上方）
    const faceWidth = width * 0.4;
    const faceHeight = faceWidth * 1.2;
    const faceX = (width - faceWidth) / 2;
    const faceY = height * 0.1;
    
    // 绘制用户脸部（圆形裁剪）
    ctx.save();
    ctx.beginPath();
    ctx.arc(faceX + faceWidth/2, faceY + faceHeight/2, faceWidth/2, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(faceImage, faceX, faceY, faceWidth, faceHeight);
    ctx.restore();
    
    // 添加边框
    ctx.strokeStyle = template.color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(faceX + faceWidth/2, faceY + faceHeight/2, faceWidth/2, 0, Math.PI * 2);
    ctx.stroke();
    
    // 添加标题和标语
    ctx.fillStyle = template.color;
    ctx.font = `bold ${width * 0.08}px 'Courier New', monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(template.name, width/2, height * 0.85);
    
    ctx.fillStyle = '#333';
    ctx.font = `${width * 0.06}px 'Courier New', monospace`;
    ctx.fillText(template.slogan, width/2, height * 0.92);
    
    // 添加水印
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.font = `${width * 0.04}px 'Courier New', monospace`;
    ctx.fillText('你什么咖？ © 2026', width/2, height * 0.98);
    
    return canvas;
}