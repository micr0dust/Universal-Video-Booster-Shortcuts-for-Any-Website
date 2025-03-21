// ==UserScript==
// @name         Universal Video Booster & Shortcuts
// @namespace    https://github.com/micr0dust
// @version      2025-03-20
// @description  🇬🇧 Enhance video playback with shortcuts and volume boost (up to 10000%)! Perfect for online lectures and streaming. 🇹🇼 提供影片快轉/倒轉快捷鍵、聲音放大功能(最大支持10000%)！適合用來看學校教學影片。
// @author       Microdust
// @match        *://*/*
// @icon         https://github.com/micr0dust/Universal-Video-Booster-Shortcuts-for-Any-Website/raw/main/icon.png
// @grant        none
// @license      MIT
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
            volumeDown: "🔉 Volume: "
        },
        zh: {
            play: "▶️",
            pause: "⏸️",
            rewind: "⏪ 倒轉 10 秒",
            forward: "⏩ 快轉 10 秒",
            volumeUp: "🔊 音量：",
            volumeDown: "🔉 音量："
        }
    };

    let audioCtx;
    let gainNode;

    function setupVolumeBooster(video) {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioCtx.createMediaElementSource(video);
            gainNode = audioCtx.createGain();
            source.connect(gainNode);
            gainNode.connect(audioCtx.destination);
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
                gainNode.gain.value = Math.min(100, gainNode.gain.value + 0.1);
                actionText = `${messages[lang].volumeUp}${(gainNode.gain.value * 100).toFixed(0)}%`;
                break;
            case 'ArrowDown':
                gainNode.gain.value = Math.max(0, gainNode.gain.value - 0.1);
                actionText = `${messages[lang].volumeDown}${(gainNode.gain.value * 100).toFixed(0)}%`;
                break;
        }
        showVideoAction(actionText, 500);
    });
})();
