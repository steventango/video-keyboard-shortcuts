// ==UserScript==
// @name         VideoKeyboardShortcuts
// @namespace    https://github.com/steventango/video-keyboard-shortcuts
// @author       Steven Tang
// @description  Video Keyboard Shortcuts for any HTML video element.
// @version      1.8.0
// @updateURL    https://github.com/steventango/video-keyboard-shortcuts/raw/master/VideoKeyboardShortcuts.user.js
// @downloadURL  https://github.com/steventango/video-keyboard-shortcuts/raw/master/VideoKeyboardShortcuts.user.js
// @match        https://www.youtube.com/*
// @match        https://meet.google.com/*
// @match        https://courses.edx.org/*
// @match        file:///*.mp4
// @match        http*://*/*.mp4
// @match        https://youtube.googleapis.com/embed/*
// @match        https://eclass.srv.ualberta.ca/*
// @match        https://*.zoom.us/*
// @match        https://www.twitch.tv/*
// @match        https://ualberta.yuja.com/*
// @match        https://www.instagram.com/*
// @match        https://twitter.com/*
// ==/UserScript==

var VideoKeyboardShortcuts = {
    elements: [],
    initated: false,
    pip_state: false,
    pip_interval: null,
    init() {
        if (!VideoKeyboardShortcuts.initated) {
            document.addEventListener('keydown', VideoKeyboardShortcuts.keydown);
            VideoKeyboardShortcuts.initated = true;
        }
    },
    getElements() {
        VideoKeyboardShortcuts.elements = Array.from(document.querySelectorAll('video')).sort((a, b) => a.paused - b.paused === 0 ? b.clientWidth - a.clientWidth : a.paused - b.paused);
    },
    pip() {
        if (VideoKeyboardShortcuts.pip_state) {
            VideoKeyboardShortcuts.getElements();
            let element = VideoKeyboardShortcuts.elements[0];
            if (element !== document.pictureInPictureElement) {
                element.requestPictureInPicture();
                if (document.domain !== 'meet.google.com') {
                    element.addEventListener('leavepictureinpicture', _ => VideoKeyboardShortcuts.pip_state = false);
                }
            }
        }
    },
    keydown(event) {
        if (["INPUT", "TEXTAREA", "SELECT", "BUTTON"].indexOf(event.target.tagName) < 0) {
            VideoKeyboardShortcuts.getElements();
            if (['www.youtube.com', 'youtube.googleapis.com'].indexOf(document.domain) < 0) {
                switch (event.key) {
                    case 'j':
                        VideoKeyboardShortcuts.elements.map(element => {
                            element.currentTime -= 10;
                        });
                        break;
                    case 'k':
                        VideoKeyboardShortcuts.elements.map(element => {
                            if (element.paused) {
                                element.play();
                            } else {
                                element.pause();
                            }
                        });
                        break;
                    case 'l':
                        VideoKeyboardShortcuts.elements.map(element => {
                            element.currentTime += 10;
                        });
                        break;
                    case 'ArrowLeft':
                        VideoKeyboardShortcuts.elements.map(element => {
                            element.currentTime -= 5;
                        });
                        break;
                    case 'ArrowRight':
                        VideoKeyboardShortcuts.elements.map(element => {
                            element.currentTime += 5;
                        });
                        break;
                    default:
                        var number = Number.parseInt(event.key);
                        if (!isNaN(number)) {
                            let percent = number / 10;
                            VideoKeyboardShortcuts.elements.map(element => {
                                element.currentTime = percent * element.duration;
                            });
                        }
                        break;
                }
            }
            switch (event.key) {
                case 'p':
                    VideoKeyboardShortcuts.pip_state = !VideoKeyboardShortcuts.pip_state;
                    if (VideoKeyboardShortcuts.pip_state) {
                        VideoKeyboardShortcuts.pip();
                        VideoKeyboardShortcuts.pip_interval = window.setInterval(VideoKeyboardShortcuts.pip, 100);
                    } else {
                        window.clearInterval(VideoKeyboardShortcuts.pip_interval);
                        if (document.pictureInPictureElement) {
                            document.exitPictureInPicture();
                        }
                    }
                    break;
                case '>':
                    if (event.shiftKey && event.ctrlKey) {
                        const velocity = prompt('Video Playback Rate:') || 1;
                        VideoKeyboardShortcuts.elements.map(element => {
                            element.playbackRate = Math.min(16, Math.max(0.0625, velocity));
                        });
                    }
                    break;
                case 't':
                    VideoKeyboardShortcuts.elements.map(element => {
                        const time = prompt('Time HH:MM:SS').split(':').map((v, i, a) => v * 60 ** (a.length - i - 1)).reduce((a, b) => a + b);
                        element.currentTime = time;
                    });
                    break;
            }
        }
    }
};
VideoKeyboardShortcuts.init();
