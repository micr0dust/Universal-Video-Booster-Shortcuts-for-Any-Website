// ==UserScript==
// @name                Universal Video Booster & Shortcuts
// @name:zh-TW          影片聲音放大/降噪/左右鍵快轉
// @namespace           https://github.com/micr0dust
// @version             2025-03-22
// @description         Provides sound amplification (up to 10,000%), noise reduction, and fast forward using left/right arrow keys. Ideal for watching school lecture videos.
// @description:zh-tw   提供聲音放大(最大支持10000%)/降噪/左右鍵快轉，適合用來看學校教學影片。
// @author              Microdust
// @match               *://*/*
// @icon                https://github.com/micr0dust/Universal-Video-Booster-Shortcuts-for-Any-Website/raw/main/icon.png
// @grant               none
// @license             MIT
// ==/UserScript==

(function () {
    'use strict';

    const lang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    const messages = {
        en: {
            play: "▶️",
            pause: "⏸️",
            rewind: "⏪ Rewind 10s",
            forward: "⏩ Forward 10s",
            volumeUp: "🔊 Volume: ",
            volumeDown: "🔉 Volume: ",
            filterFreq: "🎚️ Noise Filter: ",
            filterOn: "🎛️ Noise Filter ON",
            filterOff: "🔈 Noise Filter OFF",
        },
        zh: {
            play: "▶️",
            pause: "⏸️",
            rewind: "⏪ 倒轉 10 秒",
            forward: "⏩ 快轉 10 秒",
            volumeUp: "🔊 音量：",
            volumeDown: "🔉 音量：",
            filterFreq: "🎚️ 降噪頻率：",
            filterOn: "🎛️ 已開啟降噪",
            filterOff: "🔈 已關閉降噪",
        }
    };

    let audioCtx;
    let gainNode;
    let filterNode;
    let noiseThreshold = 3000;
    let isFilterEnabled = false;
    
    function setupVolumeBooster(video) {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioCtx.createMediaElementSource(video);
            gainNode = audioCtx.createGain();
            filterNode = audioCtx.createBiquadFilter();
            filterNode.type = "lowpass";
            filterNode.frequency.value = noiseThreshold; // 預設 5000Hz
    
            source.connect(gainNode);
            if (isFilterEnabled) {
                gainNode.connect(filterNode);
                filterNode.connect(audioCtx.destination);
            } else {
                gainNode.connect(audioCtx.destination);
            }
        }
    }

    function showVideoAction(text, duration = 500) {
        const video = document.querySelector('video');
        if (!video) return;

        let overlay = document.getElementById('video-action-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'video-action-overlay';
            overlay.style.position = 'fixed';
            overlay.style.top = '50%';
            overlay.style.left = '50%';
            overlay.style.transform = 'translate(-50%, -50%)';
            overlay.style.fontSize = '48px';
            overlay.style.color = 'white';
            overlay.style.background = 'rgba(0, 0, 0, 0.6)';
            overlay.style.padding = '10px 20px';
            overlay.style.borderRadius = '10px';
            overlay.style.transition = 'opacity 0.3s ease-in-out';
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
            overlay.style.zIndex = '9999';
            video.parentElement.appendChild(overlay);
        }

        overlay.textContent = text;
        overlay.style.opacity = '1';
        setTimeout(() => {
            overlay.style.opacity = '0';
        }, duration);
    }

    document.addEventListener('keydown', function (event) {
        const video = document.querySelector('video');
        if (!video) return;
        setupVolumeBooster(video);

        let actionText = "";
        switch (event.code) {
            case 'Space':
                event.preventDefault();
                if (video.paused) {
                    video.play();
                    actionText = messages[lang].play;
                } else {
                    video.pause();
                    actionText = messages[lang].pause;
                }
                break;
            case 'ArrowLeft':
                video.currentTime = Math.max(0, video.currentTime - 10);
                actionText = messages[lang].rewind;
                break;
            case 'ArrowRight':
                video.currentTime = Math.min(video.duration, video.currentTime + 10);
                actionText = messages[lang].forward;
                break;
            case 'ArrowUp':
                if (event.ctrlKey) {
                    noiseThreshold = Math.min(6000, noiseThreshold + 100);
                    filterNode.frequency.value = noiseThreshold;
                    actionText = `${messages[lang].filterFreq}${noiseThreshold}Hz`;
                } else {
                    gainNode.gain.value = Math.min(100, gainNode.gain.value + Math.max(10**parseInt(Math.log10(gainNode.gain.value+1)-2), 0.1));
                    actionText = `${messages[lang].volumeUp}${(gainNode.gain.value * 100).toFixed(0)}%`;
                }
                break;
            case 'ArrowDown':
                if (event.ctrlKey) {
                    noiseThreshold = Math.max(500, noiseThreshold - 100);
                    filterNode.frequency.value = noiseThreshold;
                    actionText = `${messages[lang].filterFreq}${noiseThreshold}Hz`;
                } else {
                    gainNode.gain.value = Math.max(0, gainNode.gain.value - Math.max(10**parseInt(Math.log10(gainNode.gain.value+1)-2), 0.1));
                    actionText = `${messages[lang].volumeDown}${(gainNode.gain.value * 100).toFixed(0)}%`;
                }
                break;
            case 'KeyN':
                isFilterEnabled = !isFilterEnabled;
                if (isFilterEnabled) {
                    gainNode.disconnect(audioCtx.destination);
                    gainNode.connect(filterNode);
                    filterNode.connect(audioCtx.destination);
                    actionText = messages[lang].filterOn;
                } else {
                    gainNode.disconnect(filterNode);
                    filterNode.disconnect(audioCtx.destination);
                    gainNode.connect(audioCtx.destination);
                    actionText = messages[lang].filterOff;
                }
                break;
        }
        showVideoAction(actionText, 500);
    });
})();
