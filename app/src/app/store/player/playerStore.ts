import { makeAutoObservable } from "mobx";
import Plyr from "plyr";
import React from "react";

export default class PlayerStore {
    subtitleSize: string = '3rem';
    subtitleColor: string = 'yellow';
    plyrInstance: Plyr | null = null;
    subtitleBackground: string = 'none';
    hideControlsTimeout: ReturnType<typeof setTimeout> | null = null;
    playerRef: React.RefObject<HTMLVideoElement> = React.createRef<HTMLVideoElement>();

    constructor() {
        makeAutoObservable(this);
    }

    isWatching = (title: string) => {
        const current = this.loadProgress(title);
        const duration = this.getFilmDuration(title);

        if ((duration - current) > 300 && current > 8) {
            return true;
        } else {
            localStorage.removeItem("film-progress-" + title);
            localStorage.removeItem("film-duration-" + title);
            return false;
        }
    }

    saveProgress = (current: number, duration: number, title: string | undefined) => {
        if (title) {
            localStorage.setItem("film-progress-" + title, current.toString());
            localStorage.setItem("film-duration-" + title, duration.toString());
        }
    };

    loadProgress = (title: string | undefined): number => {
        const savedTime = localStorage.getItem("film-progress-" + title);
        return savedTime ? parseFloat(savedTime) : 0;
    };

    getFilmDuration = (title: string | undefined): number => {
        const durationTime = localStorage.getItem("film-duration-" + title);
        return durationTime ? parseFloat(durationTime) : 0;
    };

    resetFilmProgress = (title: string) => {
        localStorage.setItem("film-progress-" + title, "0");
    }

    setSubtitleColor(color: string) {
        this.subtitleColor = color;
        document.documentElement.style.setProperty('--subtitle-color', color);
    }

    setFontSize(size: string) {
        this.subtitleSize = size;
        document.documentElement.style.setProperty('--subtitle-size', size);
    }

    setBackground(background: string) {
        this.subtitleBackground = background;
        document.documentElement.style.setProperty('--subtitle-background', background);
    }

    initializePlayer(videoElement: HTMLVideoElement) {
        if (!this.plyrInstance) {
            this.plyrInstance = new Plyr(videoElement, {
                muted: false,
                tooltips: { controls: true, seek: true },
                captions: { active: true, language: 'pt' },
                settings: ['captions', 'quality', 'speed', 'pip', 'airplay', 'playback-rate'],
                controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
            });
        }
    }

    handleKey(e: KeyboardEvent) {
        if (!this.plyrInstance) return;

        this.plyrInstance.toggleControls(true);

        if (this.hideControlsTimeout) {
            clearTimeout(this.hideControlsTimeout);
        }

        this.hideControlsTimeout = setTimeout(() => this.plyrInstance?.toggleControls(false), 3000);

        switch (e.key) {
            case 'ArrowLeft':
                this.plyrInstance.currentTime = Math.max(0, this.plyrInstance.currentTime - 10);
                break;
            case 'ArrowRight':
                this.plyrInstance.currentTime = Math.min(this.plyrInstance.duration, this.plyrInstance.currentTime + 10);
                break;
            case 'm':
                this.plyrInstance.muted = !this.plyrInstance.muted;
                break;
            case 'ArrowUp':
                if (this.plyrInstance.volume < 1) {
                    this.plyrInstance.volume += 0.1;
                }
                break;
            case 'ArrowDown':
                if (this.plyrInstance.volume > 0) {
                    this.plyrInstance.volume -= 0.1;
                }
                break;
            case ' ':
                if (this.plyrInstance.paused) {
                    this.plyrInstance.play();
                } else {
                    this.plyrInstance.pause();
                }
                break;
            default:
                break;
        }
    }

    destroyPlayer() {
        if (this.plyrInstance) {
            this.plyrInstance.destroy();
            this.plyrInstance = null;
        }

        if (this.hideControlsTimeout) {
            clearTimeout(this.hideControlsTimeout);
        }
    }

    convertToTitleCase(input: string): string {
        return input
            .replace(/%20/g, ' ') // Substitui %20 por espaço
            .split(' ')           // Divide pelas palavras
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza cada palavra
            .join(' ');           // Recombina em uma string
    }

}
