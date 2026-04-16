#!/usr/bin/env python3
"""
"你什么咖"卡通形象生成API
根据咖位（A/B/C/D）调用Stable Diffusion生成搞笑卡通图片
"""

import os
import sys
import json
import base64
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io

# 添加Hermes环境
sys.path.insert(0, os.path.expanduser('~/.hermes/hermes-agent'))
os.environ['PYTHONPATH'] = os.path.expanduser('~/.hermes/hermes-agent')

app = Flask(__name__)
CORS(app)  # 允许跨域

# 咖位对应的提示词模板
CUP_PROMPTS = {
    'A': {
        'prompt': "flat chest anime girl, embarrassed expression, wearing oversized t-shirt, holding a sign saying 'I'm proud to be flat', chibi style, cute, funny, pastel colors, simple background, anime art style, kawaii, 2d illustration",
        'negative': "ugly, deformed, blurry, low quality, realistic, photo, 3d, nsfw, adult, sexual",
        'style': "可爱委屈风"
    },
    'B': {
        'prompt': "anime girl with medium chest, smug expression, wearing stylish outfit, holding measuring tape, text 'Schrodinger's chest', kawaii style, playful, vibrant colors, anime art style, 2d illustration, cute",
        'negative': "ugly, deformed, blurry, low quality, realistic, photo, 3d, nsfw, adult, sexual, flat chest, large chest",
        'style': "傲娇熊猫风"
    },
    'C': {
        'prompt': "anime girl with perfect curves, confident smile, wearing elegant dress, text 'C位出道', professional anime art style, glamorous, cinematic lighting, beautiful, attractive, 2d illustration",
        'negative': "ugly, deformed, blurry, low quality, realistic, photo, 3d, nsfw, adult, sexual, flat chest",
        'style': "自信御姐风"
    },
    'D': {
        'prompt': "anime girl with exaggerated large chest, laughing expression, wearing superhero costume, text '胸怀天下', comic book style, over-the-top, dynamic pose, dramatic lighting, funny, humorous, 2d illustration",
        'negative': "ugly, deformed, blurry, low quality, realistic, photo, 3d, nsfw, adult, sexual, flat chest, small chest",
        'style': "夸张奶牛风"
    }
}

@app.route('/health', methods=['GET'])
def health():
    """健康检查"""
    return jsonify({
        'status': 'ok',
        'service': 'what-cup-cartoon-api',
        'version': '1.0.0'
    })

@app.route('/generate', methods=['POST'])
def generate_cartoon():
    """生成卡通形象"""
    try:
        data = request.json
        if not data or 'cup_type' not in data:
            return jsonify({'error': '缺少cup_type参数'}), 400
        
        cup_type = data['cup_type'].upper()
        if cup_type not in CUP_PROMPTS:
            return jsonify({'error': f'无效的咖位类型: {cup_type}'}), 400
        
        prompt_config = CUP_PROMPTS[cup_type]
        
        # 这里应该调用Stable Diffusion API
        # 暂时返回一个模拟的base64图片
        return generate_mock_image(cup_type, prompt_config)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_mock_image(cup_type, config):
    """生成模拟图片（实际应该调用Stable Diffusion）"""
    # 创建一个简单的彩色图片作为模拟
    from PIL import Image, ImageDraw, ImageFont
    import random
    
    # 创建400x500的图片
    img = Image.new('RGB', (400, 500), color=get_bg_color(cup_type))
    draw = ImageDraw.Draw(img)
    
    # 添加文字
    try:
        # 尝试使用系统字体
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 40)
    except:
        font = ImageFont.load_default()
    
    # 绘制咖位文字
    draw.text((150, 150), f"{cup_type}咖", fill=get_text_color(cup_type), font=font)
    draw.text((100, 220), config['style'], fill=get_text_color(cup_type), font=ImageFont.load_default().font_variant(size=20))
    
    # 保存到临时文件
    with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
        img.save(tmp.name, 'PNG')
        tmp_path = tmp.name
    
    # 读取为base64
    with open(tmp_path, 'rb') as f:
        img_bytes = f.read()
    
    # 清理临时文件
    os.unlink(tmp_path)
    
    return jsonify({
        'success': True,
        'cup_type': cup_type,
        'prompt': config['prompt'],
        'style': config['style'],
        'image_base64': base64.b64encode(img_bytes).decode('utf-8'),
        'image_url': f'data:image/png;base64,{base64.b64encode(img_bytes).decode("utf-8")}',
        'note': '这是模拟图片，实际会调用Stable Diffusion生成'
    })

def get_bg_color(cup_type):
    """根据咖位返回背景色"""
    colors = {
        'A': (255, 240, 245),  # 浅粉色
        'B': (240, 255, 240),  # 浅绿色
        'C': (240, 248, 255),  # 浅蓝色
        'D': (255, 250, 240)   # 浅橙色
    }
    return colors.get(cup_type, (255, 255, 255))

def get_text_color(cup_type):
    """根据咖位返回文字颜色"""
    colors = {
        'A': (255, 105, 180),  # 热粉色
        'B': (50, 205, 50),    # 石灰绿
        'C': (30, 144, 255),   # 道奇蓝
        'D': (255, 140, 0)     # 深橙色
    }
    return colors.get(cup_type, (0, 0, 0))

if __name__ == '__main__':
    print("启动'你什么咖'卡通形象生成API...")
    print("访问 http://localhost:5000/health 检查状态")
    print("POST http://localhost:5000/generate 生成图片")
    app.run(host='0.0.0.0', port=5000, debug=True)