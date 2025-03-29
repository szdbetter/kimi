// DOM元素获取
const sceneImage = document.getElementById('scene-image');
const sceneTitle = document.getElementById('scene-title');
const sceneDescription = document.getElementById('scene-description');
const timelineItems = document.querySelectorAll('.timeline-item');
const playPauseBtn = document.getElementById('play-pause-btn');
const volumeSlider = document.getElementById('volume-slider');
const backgroundMusic = document.getElementById('background-music');
const musicTitle = document.getElementById('music-title');
const envelopeContainer = document.getElementById('envelope-container');
const envelope = document.querySelector('.envelope');
const transitionOverlay = document.getElementById('transition-overlay');
const container = document.querySelector('.container');
const finalLetter = document.getElementById('final-letter');
const restartBtn = document.getElementById('restart-btn');

// 音乐播放列表
const musicPlaylist = [

    {
        title: 'Song for Sienna',
        url: 'music/Brian Crain - Song for Sienna.mp3'
    }

];

// 场景描述文本
const sceneDescriptions = [
    '小时候，您总是细心地为我剪指甲，耐心地教我保持整洁。那种温暖的关怀，是我最早的记忆之一。',
    '您陪我在浴缸里玩小黄鸭的时光，欢声笑语中教会了我想象力和快乐。每次洗澡都成了令人期待的游戏时间。',
    '记得您第一次教我骑自行车的日子，您在后面扶着车子，鼓励我勇敢前行。当我终于能独自骑行时，您脸上的骄傲让我难忘。',
    '公园里的那次骑大马，我初次体验到的高度与速度，您在一旁保护着我，让我既感到刺激又无比安全。',
    '我们一起的北欧旅行，让我领略了不同的文化与风景。您教会了我如何欣赏世界的多样性和美丽。',
    '上小学的第一天，您牵着我的手走进校园，为我整理衣领，眼中满是不舍与期待。那一刻，我知道无论多远，您都与我同在。',
    '在医院的那段日子，您日夜守候在我身边，为我讲故事，给我勇气。您的坚强让我明白了爱的力量。',
    '每次接弟弟放学，您总是提前到达，耐心等待。您教会了我家人之间的责任与关爱。',
    '在上海迪士尼过10岁生日的惊喜，是您精心准备的。那一天的欢乐与惊喜至今难忘，让我感受到了被爱的幸福。',
    '记得我们一起去跳蚤市场淘宝，您教我如何辨别价值，如何与人交流。那些生活的小智慧，成为我人生的宝贵财富。'
];

// 当前场景索引
let currentSceneIndex = 0;
let currentMusicIndex = 0;
let isTransitioning = false;

// 加载当前音乐
function loadCurrentMusic() {
    // 保存当前播放状态和音量
    const wasMusicPlaying = !backgroundMusic.paused;
    const volume = backgroundMusic.volume;
    
    // 更新音乐源
    backgroundMusic.src = musicPlaylist[currentMusicIndex].url;
    musicTitle.textContent = musicPlaylist[currentMusicIndex].title;
    
    // 加载新音乐
    backgroundMusic.load();
    
    // 恢复音量
    backgroundMusic.volume = volume;
    
    // 如果之前正在播放，那么加载完毕后继续播放
    if (wasMusicPlaying) {
        backgroundMusic.oncanplaythrough = function() {
            backgroundMusic.play().catch(e => console.log('音乐自动播放受限：', e));
            
            // 更新播放按钮图标
            const icon = playPauseBtn.querySelector('i');
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
            
            // 清除事件监听器，避免多次触发
            backgroundMusic.oncanplaythrough = null;
        };
    }
}

// 初始化页面
function initPage() {
    updateScene(0);
    loadCurrentMusic();
    
    // 设置音量
    backgroundMusic.volume = volumeSlider.value;
    
    // 添加波纹效果到所有按钮
    addRippleEffect();
}

// 添加波纹点击效果
function addRippleEffect() {
    const buttons = document.querySelectorAll('.ripple-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// 打开信封
function openEnvelope() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    // 播放开信动画
    envelope.classList.add('envelope-opening');
    
    // 淡出信封
    setTimeout(() => {
        envelopeContainer.classList.add('fade-out');
        
        // 显示过渡动画 - 白色淡入
        transitionOverlay.classList.add('active');
        
        setTimeout(() => {
            // 隐藏信封
            envelopeContainer.style.display = 'none';
            
            // 显示主内容
            container.style.display = 'block';
            
            // 添加背景淡入效果
            document.querySelector('.background').classList.add('background-fade-in');
            
            // 结束过渡动画 - 白色淡出
            transitionOverlay.classList.remove('active');
            transitionOverlay.classList.add('fade-out');
            
            // 等待过渡完成后才能交互
            setTimeout(() => {
                transitionOverlay.classList.remove('fade-out');
                isTransitioning = false;
                
                // 开始播放背景音乐
                if (backgroundMusic.paused) {
                    backgroundMusic.play().then(() => {
                        // 更新播放按钮图标
                        const icon = playPauseBtn.querySelector('i');
                        icon.classList.remove('fa-play');
                        icon.classList.add('fa-pause');
                    }).catch(error => {
                        console.error('自动播放受限：', error);
                        // 显示播放按钮提示用户手动点击
                        const icon = playPauseBtn.querySelector('i');
                        icon.classList.add('fa-play');
                        icon.classList.remove('fa-pause');
                    });
                }
            }, 500);
        }, 600);
    }, 800);
}

// 更新场景内容
function updateSceneContent(index) {
    // 保存旧索引用于动画
    const oldIndex = currentSceneIndex;
    currentSceneIndex = index;
    
    // 保存音乐播放状态，确保场景切换时不影响音乐
    const wasMusicPlaying = !backgroundMusic.paused;
    const currentVolume = backgroundMusic.volume;
    const currentTime = backgroundMusic.currentTime;
    const currentMusicSrc = backgroundMusic.src;
    
    // 更新时间轴选中状态
    timelineItems.forEach((item, i) => {
        if (i === currentSceneIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // 如果是最后一个场景（信件），仍然在场景容器中显示，但切换内容
    if (currentSceneIndex === timelineItems.length - 1) {
        // 显示场景容器，隐藏独立的信件区域
        document.querySelector('.scene-container').style.display = 'flex';
        finalLetter.style.display = 'none';
        
        // 在场景容器中添加信件内容
        sceneTitle.textContent = timelineItems[currentSceneIndex].getAttribute('data-title');
        
        // 替换场景图片为信件背景
        sceneImage.src = 'images/0.背景图片.png';
        
        // 添加信件内容到场景描述区域
        const letterContent = document.querySelector('.letter-content').cloneNode(true);
        
        // 清空原有描述
        sceneDescription.innerHTML = '';
        
        // 插入信件内容的副本
        sceneDescription.appendChild(letterContent);
        
        // 为信件内容添加特殊样式
        sceneDescription.classList.add('letter-display-in-scene');
        
        // 添加重新开始按钮
        const restartButtonClone = restartBtn.cloneNode(true);
        restartButtonClone.id = 'restart-btn-clone';
        sceneDescription.appendChild(restartButtonClone);
        
        // 为克隆的重启按钮添加事件监听
        restartButtonClone.addEventListener('click', () => {
            // 创建按钮点击特效
            createButtonClickEffect(restartButtonClone);
            
            // 创建滑动特效（从左向右）
            createSwipeEffect('right');
            
            // 更新场景到第一个
            updateScene(0);
        });
    } else {
        // 正常场景显示
        document.querySelector('.scene-container').style.display = 'flex';
        finalLetter.style.display = 'none';
        
        // 更新场景图片
        sceneImage.src = `images/${currentSceneIndex + 1}.场景${currentSceneIndex + 1}_${timelineItems[currentSceneIndex].getAttribute('data-title')}.png`;
        
        // 恢复正常样式
        sceneDescription.classList.remove('letter-display-in-scene');
        
        // 更新标题和描述文本
        sceneTitle.textContent = timelineItems[currentSceneIndex].getAttribute('data-title');
        sceneDescription.textContent = sceneDescriptions[currentSceneIndex];
    }
    
    // 滚动时间轴，使当前项目居中
    const timelineContainer = document.querySelector('.timeline-container');
    const activeItem = document.querySelector('.timeline-item.active');
    if (activeItem) {
        timelineContainer.scrollLeft = activeItem.offsetLeft - timelineContainer.offsetWidth / 2 + activeItem.offsetWidth / 2;
    }
    
    // 恢复音乐状态，确保音乐不会中断
    if (wasMusicPlaying) {
        backgroundMusic.currentTime = currentTime;
        backgroundMusic.volume = currentVolume;
        backgroundMusic.play().catch(error => {
            console.error('恢复音乐播放失败:', error);
        });
        
        // 更新播放按钮图标
        const icon = playPauseBtn.querySelector('i');
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    }
    
    // 根据场景切换音乐（每隔几个场景切换），但不中断当前播放
    if (index % 3 === 0 && index !== oldIndex && musicPlaylist.length > 1) {
        // 保存当前音乐播放状态和时间
        const wasMusicPlaying = !backgroundMusic.paused;
        const currentVolume = backgroundMusic.volume;
        
        // 准备加载下一首音乐，但确保不中断当前播放
        const nextMusicIndex = (currentMusicIndex + 1) % musicPlaylist.length;
        
        // 预加载下一首音乐但不立即切换
        const nextMusic = new Audio();
        nextMusic.src = musicPlaylist[nextMusicIndex].url;
        nextMusic.volume = currentVolume;
        
        nextMusic.addEventListener('canplaythrough', function() {
            // 仅在用户显式请求切换音乐时才切换，保持当前音乐继续播放
            if (musicTitle) {
                musicTitle.textContent = musicPlaylist[nextMusicIndex].title;
            }
            
            // 更新当前音乐索引，但不中断当前播放
            currentMusicIndex = nextMusicIndex;
            
            // 清除事件监听器
            nextMusic.removeEventListener('canplaythrough', arguments.callee);
        });
        
        // 加载但不播放
        nextMusic.load();
    }
    
    // 重置过渡状态
    isTransitioning = false;
}

// 更新场景（不使用过渡效果）
function updateScene(index) {
    if (isTransitioning) return;
    
    // 直接更新场景内容，无需过渡动画
    updateSceneContent(index);
    
    // 添加场景切换的特效（爱心或粒子）
    createSwitchEffect();
}

// 创建场景切换特效
function createSwitchEffect() {
    // 随机选择特效类型：爱心或粒子
    const effectType = Math.random() > 0.5 ? 'hearts' : 'particles';
    
    if (effectType === 'hearts') {
        createHeartEffect();
    } else {
        createParticleEffect();
    }
}

// 创建爱心特效
function createHeartEffect() {
    const container = document.querySelector('.container');
    const heartCount = 15; // 爱心数量
    
    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart-effect');
        
        // 随机位置
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // 随机大小
        const size = 20 + Math.random() * 30;
        
        // 随机颜色
        const colors = ['#ff6b6b', '#ff8e8e', '#ffaaaa', '#d46a6a', '#cc5151'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // 设置样式
        heart.style.cssText = `
            position: absolute;
            left: ${posX}%;
            top: ${posY}%;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            opacity: 0.8;
            transform: rotate(45deg) scale(0);
            z-index: 1000;
            pointer-events: none;
            animation: heartBeat 1.5s forwards;
        `;
        
        // 创建爱心形状（使用伪元素）
        const afterStyle = document.createElement('style');
        afterStyle.textContent = `
            .heart-effect:before, .heart-effect:after {
                content: '';
                position: absolute;
                width: 100%;
                height: 100%;
                background-color: inherit;
                border-radius: 50%;
            }
            
            .heart-effect:before {
                left: -50%;
                top: 0;
            }
            
            .heart-effect:after {
                top: -50%;
                left: 0;
            }
            
            @keyframes heartBeat {
                0% { transform: rotate(45deg) scale(0); }
                25% { transform: rotate(45deg) scale(1); }
                50% { transform: rotate(45deg) scale(0.8); }
                75% { transform: rotate(45deg) scale(1); }
                100% { transform: rotate(45deg) scale(0); opacity: 0; }
            }
        `;
        
        document.head.appendChild(afterStyle);
        container.appendChild(heart);
        
        // 移除爱心元素
        setTimeout(() => {
            heart.remove();
        }, 1500);
    }
}

// 创建粒子特效
function createParticleEffect() {
    const container = document.querySelector('.container');
    const particleCount = 30; // 粒子数量
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle-effect');
        
        // 随机位置（从中心向四周扩散）
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 100;
        const posX = 50 + Math.cos(angle) * distance;
        const posY = 50 + Math.sin(angle) * distance;
        
        // 随机大小
        const size = 2 + Math.random() * 6;
        
        // 随机颜色（科幻风格）
        const colors = ['#3498db', '#2ecc71', '#9b59b6', '#1abc9c', '#e74c3c', '#f39c12'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // 设置样式
        particle.style.cssText = `
            position: absolute;
            left: ${posX}%;
            top: ${posY}%;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border-radius: 50%;
            box-shadow: 0 0 ${size*2}px ${color};
            z-index: 1000;
            pointer-events: none;
            animation: particleFade 1.2s forwards;
        `;
        
        // 创建粒子动画
        const particleStyle = document.createElement('style');
        particleStyle.textContent = `
            @keyframes particleFade {
                0% { transform: scale(0); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.8; }
                100% { transform: scale(0); opacity: 0; }
            }
        `;
        
        document.head.appendChild(particleStyle);
        container.appendChild(particle);
        
        // 移除粒子元素
        setTimeout(() => {
            particle.remove();
        }, 1200);
    }
}

// 重新开始
function restart() {
    // 创建滑动特效（从右向左）
    createSwipeEffect('right');
    
    // 直接更新到第一个场景
    updateScene(0);
}

// 事件监听器

// 信封点击事件
envelope.addEventListener('click', openEnvelope);

// 时间轴项目点击事件
timelineItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        if (index !== currentSceneIndex && !isTransitioning) {
            updateScene(index);
        }
    });
});

// 重新开始按钮点击事件
restartBtn.addEventListener('click', restart);

// 播放/暂停按钮点击事件
playPauseBtn.addEventListener('click', () => {
    const icon = playPauseBtn.querySelector('i');
    
    if (backgroundMusic.paused) {
        backgroundMusic.play()
            .then(() => {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            })
            .catch(error => {
                console.error('播放失败：', error);
                alert('音乐播放受浏览器限制，请点击页面后再次尝试播放。');
            });
    } else {
        backgroundMusic.pause();
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }
});

// 音量滑块改变事件
volumeSlider.addEventListener('input', () => {
    backgroundMusic.volume = volumeSlider.value;
    
    // 更新音量图标
    const volumeIcon = document.querySelector('.volume-icon');
    if (volumeSlider.value === '0') {
        volumeIcon.classList.remove('fa-volume-up', 'fa-volume-down');
        volumeIcon.classList.add('fa-volume-mute');
    } else if (volumeSlider.value < 0.5) {
        volumeIcon.classList.remove('fa-volume-up', 'fa-volume-mute');
        volumeIcon.classList.add('fa-volume-down');
    } else {
        volumeIcon.classList.remove('fa-volume-down', 'fa-volume-mute');
        volumeIcon.classList.add('fa-volume-up');
    }
});

// 键盘导航
document.addEventListener('keydown', (e) => {
    if (isTransitioning) return;
    
    if (e.key === 'ArrowLeft' && currentSceneIndex > 0) {
        // 创建滑动特效（从左向右）
        createSwipeEffect('right');
        
        // 更新场景
        updateScene(currentSceneIndex - 1);
    } else if (e.key === 'ArrowRight' && currentSceneIndex < timelineItems.length - 1) {
        // 创建滑动特效（从右向左）
        createSwipeEffect('left');
        
        // 更新场景
        updateScene(currentSceneIndex + 1);
    } else if (e.key === ' ' || e.key === 'Spacebar') {
        // 空格键控制音乐播放/暂停
        playPauseBtn.click();
        e.preventDefault(); // 防止页面滚动
    }
});

// 添加触摸滑动支持
let touchStartX = 0;
let touchEndX = 0;

// 为整个文档添加触摸事件
document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (isTransitioning) {
        console.log('滑动被忽略：正在过渡中');
        return;
    }
    
    const swipeThreshold = 50; // 滑动阈值
    const swipeDistance = touchEndX - touchStartX;
    
    console.log('滑动距离:', swipeDistance);
    
    // 检查是否正在显示信件（最后一个场景）
    const isLetterVisible = finalLetter.style.display === 'block';
    
    if (swipeDistance < -swipeThreshold) {
        // 左滑：下一个场景
        if (currentSceneIndex < timelineItems.length - 1) {
            console.log('左滑：切换到下一个场景');
            
            // 创建滑动特效（从右向左）
            createSwipeEffect('left');
            
            // 更新场景
            updateScene(currentSceneIndex + 1);
        }
    } else if (swipeDistance > swipeThreshold) {
        // 右滑：上一个场景
        if (isLetterVisible) {
            // 如果当前是信件页面，返回到前一个场景
            console.log('右滑：从信件返回到前一个场景');
            
            // 创建滑动特效（从左向右）
            createSwipeEffect('right');
            
            // 更新场景
            updateScene(timelineItems.length - 2);
        } else if (currentSceneIndex > 0) {
            console.log('右滑：切换到上一个场景');
            
            // 创建滑动特效（从左向右）
            createSwipeEffect('right');
            
            // 更新场景
            updateScene(currentSceneIndex - 1);
        }
    }
}

// 创建滑动特效
function createSwipeEffect(direction) {
    const container = document.querySelector('.container');
    const particleCount = 40; // 粒子数量
    
    // 特效的起始位置和运动方向
    const startX = direction === 'left' ? 80 : 20;
    const moveDirection = direction === 'left' ? -1 : 1;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('swipe-particle');
        
        // 随机位置（沿着滑动方向生成粒子）
        const posY = 10 + Math.random() * 80; // 垂直位置随机分布
        
        // 随机大小
        const size = 2 + Math.random() * 5;
        
        // 随机颜色
        const hue = 180 + Math.random() * 60; // 蓝绿色调
        const color = `hsl(${hue}, 80%, 60%)`;
        
        // 随机速度
        const speed = 0.8 + Math.random() * 1.2;
        
        // 设置样式
        particle.style.cssText = `
            position: absolute;
            left: ${startX}%;
            top: ${posY}%;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border-radius: 50%;
            box-shadow: 0 0 ${size*3}px ${color};
            opacity: 0.8;
            z-index: 1000;
            pointer-events: none;
        `;
        
        container.appendChild(particle);
        
        // 创建动画
        let startTime = null;
        const duration = 800 + Math.random() * 400; // 动画持续时间（毫秒）
        
        function animateParticle(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 计算粒子位置
            const distance = 30 * speed * progress;
            const newX = startX + (moveDirection * distance);
            
            // 更新粒子位置和不透明度
            particle.style.left = `${newX}%`;
            particle.style.opacity = 1 - progress;
            
            // 继续动画或移除粒子
            if (progress < 1) {
                requestAnimationFrame(animateParticle);
            } else {
                particle.remove();
            }
        }
        
        // 启动粒子动画
        requestAnimationFrame(animateParticle);
    }
}

// 创建按钮点击特效
function createButtonClickEffect(button) {
    // 创建一个波纹容器
    const rippleContainer = document.createElement('div');
    rippleContainer.classList.add('button-click-effect');
    
    // 设置波纹容器样式
    rippleContainer.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 50%;
        pointer-events: none;
    `;
    
    // 创建波纹效果
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        transform: scale(0);
        animation: buttonRipple 0.6s linear;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
    `;
    
    // 创建动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes buttonRipple {
            0% {
                transform: scale(0);
                opacity: 0.5;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    
    document.head.appendChild(style);
    rippleContainer.appendChild(ripple);
    button.appendChild(rippleContainer);
    
    // 移除波纹效果
    setTimeout(() => {
        rippleContainer.remove();
    }, 600);
}

// 为信件容器添加专门的触摸事件处理
finalLetter.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

finalLetter.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    
    // 特殊处理信件页面的滑动
    if (!isTransitioning) {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        console.log('信件页面滑动距离:', swipeDistance);
        
        // 右滑：从信件返回到前一个场景
        if (swipeDistance > swipeThreshold) {
            console.log('信件页面右滑：返回到前一个场景');
            
            // 创建滑动特效（从左向右）
            createSwipeEffect('right');
            
            // 更新场景
            updateScene(timelineItems.length - 2);
        }
    }
});

// 窗口加载完成时初始化页面
window.addEventListener('load', initPage);

// 添加可访问性支持 - 预加载图片
window.addEventListener('load', () => {
    // 预加载所有场景图片
    for (let i = 1; i <= timelineItems.length - 1; i++) {
        const img = new Image();
        img.src = `images/${i}.场景${i}_${timelineItems[i-1].getAttribute('data-title')}.png`;
    }
});

// 添加视差滚动效果
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    // 背景视差效果
    document.querySelector('.background').style.transform = `translateY(${scrolled * 0.3}px)`;
    
    // 标题视差效果
    document.querySelector('.header').style.transform = `translateY(${scrolled * 0.1}px)`;
    
    // 检测信件部分是否在视口中，触发动画
    const letterSections = document.querySelectorAll('.letter-section');
    const letterSignature = document.querySelector('.letter-signature');
    
    // 为每个章节添加动画
    letterSections.forEach(section => {
        if (isElementInViewport(section) && !section.classList.contains('animate__fadeIn')) {
            section.classList.add('animate__fadeIn');
            section.style.opacity = '1';
        }
    });
    
    // 为签名添加动画
    if (letterSignature && isElementInViewport(letterSignature) && !letterSignature.classList.contains('animate__fadeIn')) {
        letterSignature.classList.add('animate__fadeIn');
        letterSignature.style.opacity = '1';
    }
});

// 检查元素是否在视口中
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
} 