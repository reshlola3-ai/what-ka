// 卡通形象生成API调用
async function generateCartoonImage(cupType) {
    debugLog(`开始生成 ${cupType}咖 卡通形象...`);
    
    // 显示加载状态
    const cartoonImg = document.getElementById('cartoonImage');
    const saveBtn = document.getElementById('saveCartoonBtn');
    
    if (cartoonImg) {
        cartoonImg.src = '';
        cartoonImg.style.display = 'none';
        cartoonImg.alt = `正在生成${cupType}咖卡通形象...`;
    }
    
    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = '正在生成图片...';
    }
    
    try {
        // 调用本地API
        const response = await fetch('http://localhost:5000/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cup_type: cupType })
        });
        
        if (!response.ok) {
            throw new Error(`API错误: ${response.status}`);
        }
        
        const data = await response.json();
        debugLog(`卡通形象生成成功: ${data.style}`);
        
        // 显示图片
        if (cartoonImg && data.image_url) {
            cartoonImg.src = data.image_url;
            cartoonImg.style.display = 'block';
            cartoonImg.alt = `${cupType}咖卡通形象 - ${data.style}`;
            
            // 启用保存按钮
            if (saveBtn) {
                saveBtn.disabled = false;
                saveBtn.textContent = '💾 保存卡通形象';
                saveBtn.onclick = () => saveCartoonImage(data.image_url, `${cupType}_cartoon.png`);
            }
            
            return data.image_url;
        } else {
            throw new Error('API返回数据格式错误');
        }
        
    } catch (error) {
        debugLog(`卡通形象生成失败: ${error.message}`);
        
        // 显示错误信息
        if (cartoonImg) {
            cartoonImg.alt = `生成失败: ${error.message}`;
            cartoonImg.style.display = 'block';
        }
        
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.textContent = '生成失败';
        }
        
        // 返回一个占位图
        return getPlaceholderImage(cupType);
    }
}

// 获取占位图（如果API失败）
function getPlaceholderImage(cupType) {
    const colors = {
        'A': '#FF69B4', // 粉色
        'B': '#32CD32', // 绿色
        'C': '#1E90FF', // 蓝色
        'D': '#FF8C00'  // 橙色
    };
    
    const color = colors[cupType] || '#666666';
    
    // 创建一个简单的SVG占位图
    return `data:image/svg+xml;base64,${btoa(`
        <svg width="400" height="500" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="500" fill="${color}" opacity="0.2"/>
            <rect x="50" y="50" width="300" height="400" fill="white" stroke="${color}" stroke-width="3"/>
            <text x="200" y="200" text-anchor="middle" font-family="Arial" font-size="60" fill="${color}">${cupType}咖</text>
            <text x="200" y="280" text-anchor="middle" font-family="Arial" font-size="24" fill="#666">API连接中...</text>
            <text x="200" y="320" text-anchor="middle" font-family="Arial" font-size="16" fill="#999">稍后显示真实卡通形象</text>
        </svg>
    `)}`;
}

// 保存图片
function saveCartoonImage(imageUrl, filename) {
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

// 修改showResult函数，添加API调用
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
    debugLog(`调用卡通形象API...`);
    await generateCartoonImage(cupType);
    
    // 显示重新扫描按钮
    document.getElementById('rescanBtn').style.display = 'block';
}