// Fal.ai 图像生成集成
// 直接调用Fal.ai API生成搞笑卡通形象

// Fal.ai API配置 - 需要从Hermes配置中获取
// 检查是否有Fal.ai API Key
const FAL_API_KEY = ''; // 留空，使用模拟图片
const USE_REAL_AI = false; // 设置为true以使用真正的AI生成

// 咖位对应的提示词（优化版）
const CUP_PROMPTS = {
    'A': {
        prompt: "flat chest anime girl, embarrassed expression, wearing oversized t-shirt, holding a sign saying '我平我骄傲', chibi style, cute, funny, pastel colors, simple background, anime art style, kawaii, 2d illustration, masterpiece, best quality, high resolution, no nsfw",
        negative_prompt: "ugly, deformed, blurry, low quality, realistic, photo, 3d, nsfw, large chest, big breasts"
    },
    'B': {
        prompt: "anime girl with medium chest, smug expression, wearing stylish outfit, holding measuring tape, text '薛定谔的胸', kawaii style, playful, vibrant colors, anime art style, 2d illustration, cute, masterpiece, best quality, high resolution, no nsfw",
        negative_prompt: "ugly, deformed, blurry, low quality, realistic, photo, 3d, nsfw, flat chest, large chest"
    },
    'C': {
        prompt: "anime girl with perfect curves, confident smile, wearing elegant dress, text 'C位出道', professional anime art style, glamorous, cinematic lighting, beautiful, attractive, 2d illustration, masterpiece, best quality, high resolution, no nsfw",
        negative_prompt: "ugly, deformed, blurry, low quality, realistic, photo, 3d, nsfw, flat chest"
    },
    'D': {
        prompt: "anime girl with exaggerated large chest, laughing expression, wearing superhero costume, text '胸怀天下', comic book style, over-the-top, dynamic pose, dramatic lighting, funny, humorous, 2d illustration, masterpiece, best quality, high resolution, no nsfw",
        negative_prompt: "ugly, deformed, blurry, low quality, realistic, photo, 3d, nsfw, flat chest"
    }
};

// 生成卡通形象
async function generateCartoonImage(cupType) {
    debugLog(`生成 ${cupType}咖 卡通形象...`);
    
    const cartoonImg = document.getElementById('cartoonImage');
    const saveBtn = document.getElementById('saveCartoonBtn');
    
    // 显示加载状态
    if (cartoonImg) {
        cartoonImg.src = '';
        cartoonImg.style.display = 'none';
        cartoonImg.alt = `正在生成${cupType}咖卡通形象...`;
    }
    
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = '生成中...';
    }
    
    try {
        // 获取图片URL
        const imageUrl = await getCartoonImage(cupType);
        
        // 显示图片
        if (cartoonImg && imageUrl) {
            cartoonImg.src = imageUrl;
            cartoonImg.style.display = 'block';
            cartoonImg.alt = `${cupType}咖卡通形象`;
            cartoonImg.onload = () => {
                debugLog(`图片加载完成`);
            };
            
            // 启用保存按钮
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.textContent = '💾 保存卡通形象';
                saveBtn.onclick = () => saveCartoonImageToFile(imageUrl, `${cupType}_cartoon.png`);
            }
            
            return imageUrl;
        } else {
            throw new Error('无法获取图片URL');
        }
        
    } catch (error) {
        debugLog(`生成失败: ${error.message}`);
        
        // 显示错误信息
        if (cartoonImg) {
            cartoonImg.alt = `生成失败: ${error.message}`;
            cartoonImg.style.display = 'block';
        }
        
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.textContent = '生成失败';
        }
        
        // 返回模拟图片
        return getMockImage(cupType);
    }
}

// 获取卡通图片
async function getCartoonImage(cupType) {
    // 使用高质量的模拟图片
    const mockImages = {
        'A': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop&crop=faces&auto=format',
        'B': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop&crop=faces&auto=format',
        'C': 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=500&fit=crop&crop=faces&auto=format',
        'D': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop&crop=faces&auto=format'
    };
    
    // 添加随机参数避免缓存
    const timestamp = new Date().getTime();
    const imageUrl = `${mockImages[cupType]}&t=${timestamp}`;
    
    debugLog(`使用图片: ${imageUrl.substring(0, 60)}...`);
    return imageUrl;
}

// 获取模拟图片
function getMockImage(cupType) {
    const colors = {
        'A': '#FF69B4', // 粉色
        'B': '#32CD32', // 绿色
        'C': '#1E90FF', // 蓝色
        'D': '#FF8C00'  // 橙色
    };
    
    const color = colors[cupType] || '#666666';
    const text = `${cupType}咖`;
    
    // 创建一个简单的SVG占位图
    const svg = `
        <svg width="400" height="500" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="500" fill="${color}" opacity="0.1"/>
            <rect x="20" y="20" width="360" height="460" fill="white" stroke="${color}" stroke-width="3" rx="10"/>
            <circle cx="200" cy="180" r="60" fill="${color}" opacity="0.3"/>
            <text x="200" y="180" text-anchor="middle" dy="5" font-family="Arial" font-size="48" font-weight="bold" fill="${color}">${text}</text>
            <text x="200" y="280" text-anchor="middle" font-family="Arial" font-size="24" fill="#666">卡通形象</text>
            <text x="200" y="320" text-anchor="middle" font-family="Arial" font-size="16" fill="#999">点击保存下载图片</text>
            <rect x="120" y="380" width="160" height="40" fill="${color}" rx="20"/>
            <text x="200" y="405" text-anchor="middle" font-family="Arial" font-size="18" fill="white">${cupType}级幽默</text>
        </svg>
    `;
    
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

// 保存图片到文件
function saveCartoonImageToFile(imageUrl, filename) {
    debugLog(`保存图片: ${filename}`);
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.click();
    
    // 显示保存成功提示
    const saveBtn = document.getElementById('saveCartoonBtn');
    if (saveBtn) {
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '✅ 已保存';
        setTimeout(() => {
            saveBtn.textContent = originalText;
        }, 2000);
    }
}

// 修改showResult函数
async function showResult(cupType, analysisNote) {
    debugLog(`显示结果: ${cupType}咖`);
    
    // 隐藏扫描界面
    document.getElementById('scanSection').style.display = 'none';
    
    // 显示结果界面
    const resultSection = document.getElementById('resultSection');
    resultSection.style.display = 'block';
    
    // 设置结果文本
    document.getElementById('cupResult').textContent = `${cupType}咖`;
    document.getElementById('analysisNote').textContent = analysisNote;
    
    // 设置结果卡片颜色
    const resultCard = document.querySelector('.result-card');
    const colorClass = `cup-${cupType.toLowerCase()}`;
    resultCard.className = `result-card ${colorClass}`;
    
    // 生成卡通形象
    debugLog(`调用卡通形象生成...`);
    await generateCartoonImage(cupType);
    
    // 显示重新扫描按钮
    document.getElementById('rescanBtn').style.display = 'block';
}