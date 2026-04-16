        // 6. 显示结果
        function showResult(cupType, analysisNote) {
            const cupInfo = CUP_MAP[cupType];
            stampText.innerText = cupInfo.cup;
            
            // 先创建结果HTML（包含画布）
            resultText.innerHTML = `
                <h3>${cupInfo.cup} - ${cupType.toUpperCase()} Cup</h3>
                <p>${cupInfo.text}</p>
                <p><small>${analysisNote}</small></p>
                <p>⚠️ 本结果基于《面部-胸部能量守恒定律》计算，仅供娱乐。</p>
                <div id="cartoonContainer" style="margin: 20px 0; text-align: center;">
                    <canvas id="cartoonCanvas" width="400" height="500" style="max-width: 100%; border: 3px solid black; border-radius: 12px;"></canvas>
                    <p style="margin-top: 10px; font-size: 0.9em; color: #666;">你的专属卡通形象已生成！</p>
                </div>
            `;
            
            resultCard.style.display = 'block';
            statusText.innerText = "ANALYSIS COMPLETE [█████]";
            isScanning = false;
            
            // 滚动到结果
            resultCard.scrollIntoView({ behavior: 'smooth' });
            
            // 延迟一点时间，确保DOM更新完成后再生成图片
            setTimeout(() => {
                generateCartoonImage(cupType);
            }, 100);
        }
        
        // 生成卡通图片
        async function generateCartoonImage(cupType) {
            try {
                // 获取用户的自拍（从视频中截取）
                const video = document.getElementById('video');
                if (!video || !video.videoWidth) {
                    console.error('Video not ready');
                    return;
                }
                
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0);
                
                // 创建图片对象
                const faceImage = new Image();
                faceImage.crossOrigin = 'anonymous';
                faceImage.src = canvas.toDataURL('image/jpeg', 0.8);
                
                faceImage.onload = () => {
                    // 获取卡通画布
                    const cartoonCanvas = document.getElementById('cartoonCanvas');
                    if (!cartoonCanvas) {
                        console.error('Cartoon canvas not found');
                        return;
                    }
                    
                    // 合并脸部和模板
                    mergeFaceToTemplate(faceImage, cupType, cartoonCanvas);
                    
                    // 更新保存按钮，保存卡通图片
                    saveButton.onclick = async () => {
                        statusText.innerText = "SAVING IMAGE...";
                        try {
                            const link = document.createElement('a');
                            link.download = `你什么咖-${cupType}咖.png`;
                            link.href = cartoonCanvas.toDataURL('image/png');
                            link.click();
                            statusText.innerText = "IMAGE SAVED!";
                        } catch (e) {
                            console.error('Save error:', e);
                            statusText.innerText = "SAVE FAILED";
                        }
                    };
                };
                
                faceImage.onerror = (e) => {
                    console.error('Face image load error:', e);
                };
            } catch (e) {
                console.error('Cartoon generation error:', e);
            }
        }