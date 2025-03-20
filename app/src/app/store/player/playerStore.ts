import { makeAutoObservable } from "mobx";
import Plyr from "plyr";
import React from "react";

export default class PlayerStore {
    // Configurações de legendas (valores padrão)
    subtitleOpacity: string = "0";
    subtitleSize: string = "3rem";
    subtitleColor: string = "#FFEE00";
    subtitleFontOpacity: string = "100%";
    subtitleBackground: string = "#000000";
    subtitleColorRGBA: string = "rgba(255, 238, 0, 1)";
    subtitleBackgroundRGBA: string = "rgba(0, 0, 0, 0)";

    // Instância do Plyr e outros controles
    plyrInstance: Plyr | null = null;
    hideControlsTimeout: ReturnType<typeof setTimeout> | null = null;
    playerRef: React.RefObject<HTMLVideoElement> = React.createRef<HTMLVideoElement>();

    constructor() {
        makeAutoObservable(this);

        // Carrega configurações de legendas do localStorage (opcional)
        this.loadSubtitleSettings();
    }

    /**
     * ---------------------------------------
     *     Gerenciamento de progresso
     * ---------------------------------------
     */
    isWatching = (title: string) => {
        const current = this.loadProgress(title);
        const duration = this.getFilmDuration(title);

        // Se faltar mais de 5 minutos (300s) e já tiver passado 8s, considera "em progresso"
        if (duration - current > 300 && current > 8) {
            return true;
        } else {
            localStorage.removeItem("film-progress-" + title);
            localStorage.removeItem("film-duration-" + title);
            return false;
        }
    };

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
    };

    // --------------------------------
    // Métodos de legendas
    // --------------------------------
    setSubtitleColor(color: string) {
        this.subtitleColor = color;
        localStorage.setItem("subtitleColor", color);
    }

    setSubtitleColorRGBA(color: string) {
        this.subtitleColorRGBA = color;
        document.documentElement.style.setProperty("--subtitle-color", color);

        localStorage.setItem("subtitleColorRGBA", color);
    }

    setSubtitleBackground(color: string) {
        this.subtitleBackground = color;
        localStorage.setItem("subtitleBackground", color);
    }

    setSubtitleBackgroundRGBA(color: string) {
        this.subtitleBackgroundRGBA = color;
        document.documentElement.style.setProperty("--subtitle-background", color);

        localStorage.setItem("subtitleBackgroundRGBA", color);
    }

    setSubtitleSize(size: string) {
        this.subtitleSize = size;
        document.documentElement.style.setProperty("--subtitle-size", size);

        localStorage.setItem("subtitleSize", size);
    }

    setSubtitleFontOpacity(opacity: string) {
        this.subtitleFontOpacity = opacity;
        localStorage.setItem("subtitleFontOpacity", opacity);
    }

    setSubtitleOpacity(opacity: string) {
        this.subtitleOpacity = opacity;
        localStorage.setItem("subtitleOpacity", opacity);
    }

    hexToRgba(hex: string, alpha: number, isBackground: boolean): string {
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) {
            hex = hex.split('').map(x => x + x).join('');
        }
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        const color = `rgba(${r}, ${g}, ${b}, ${alpha})`;

        if (isBackground)
            this.setSubtitleBackgroundRGBA(color);
        else
            this.setSubtitleColorRGBA(color)
        return color;
    }

    // --------------------------------
    // Resetar tudo
    // --------------------------------
    resetSubtitleSettings() {
        // Volta aos valores padrão (ajuste conforme quiser)
        this.setSubtitleSize("3rem");
        this.setSubtitleOpacity("0");
        this.setSubtitleColor("#FFEE00");
        this.setSubtitleFontOpacity("100%");
        this.setSubtitleBackground("#000000");
        this.setSubtitleColorRGBA("rgba(255, 230, 0, 1)");
        this.setSubtitleBackgroundRGBA("rgba(0, 0, 0, 0)");
    }

    // --------------------------------
    // Carrega do localStorage
    // --------------------------------
    private loadSubtitleSettings() {
        const size = localStorage.getItem("subtitleSize");
        const color = localStorage.getItem("subtitleColor");
        const opacity = localStorage.getItem("subtitleOpacity");
        const background = localStorage.getItem("subtitleBackground");
        const subtitleColorRGBA = localStorage.getItem("subtitleColorRGBA");
        const backgroundRGBA = localStorage.getItem("subtitleBackgroundRGBA");
        const subtitleFontOpacity = localStorage.getItem("subtitleFontOpacity");

        if (size) this.setSubtitleSize(size);
        if (color) this.setSubtitleColor(color);
        if (opacity) this.setSubtitleOpacity(opacity);
        if (background) this.setSubtitleBackground(background);
        if (backgroundRGBA) this.setSubtitleBackgroundRGBA(backgroundRGBA);
        if (subtitleColorRGBA) this.setSubtitleColorRGBA(subtitleColorRGBA);
        if (subtitleFontOpacity) this.setSubtitleFontOpacity(subtitleFontOpacity);
    }

    /**
     * ---------------------------------------
     *     Inicialização e controle do Plyr
     * ---------------------------------------
     */
    initializePlayer(videoElement: HTMLVideoElement) {
        if (!this.plyrInstance) {
            this.plyrInstance = new Plyr(videoElement, {
                muted: false,
                tooltips: { controls: true, seek: true },
                captions: { active: true, language: "pt" },
                settings: ["captions", "quality", "speed", "pip", "airplay", "playback-rate"],
                controls: [
                    "play-large",
                    "play",
                    "progress",
                    "current-time",
                    "mute",
                    "volume",
                    "captions",
                    "settings",
                    "pip",
                    "airplay",
                    "fullscreen",
                ],
            });
        }
    }

    handleKey(e: KeyboardEvent) {
        if (!this.plyrInstance) return;

        // Sempre que alguma tecla for pressionada, mostramos os controles
        this.plyrInstance.toggleControls(true);

        // Limpa timeout anterior e inicia um novo para ocultar
        if (this.hideControlsTimeout) {
            clearTimeout(this.hideControlsTimeout);
        }
        this.hideControlsTimeout = setTimeout(
            () => this.plyrInstance?.toggleControls(false),
            3000
        );

        switch (e.key) {
            case "ArrowLeft":
                this.plyrInstance.currentTime = Math.max(0, this.plyrInstance.currentTime - 10);
                break;
            case "ArrowRight":
                this.plyrInstance.currentTime = Math.min(
                    this.plyrInstance.duration,
                    this.plyrInstance.currentTime + 10
                );
                break;
            case "m":
                this.plyrInstance.muted = !this.plyrInstance.muted;
                break;
            case "ArrowUp":
                if (this.plyrInstance.volume < 1) {
                    this.plyrInstance.volume += 0.1;
                }
                break;
            case "ArrowDown":
                if (this.plyrInstance.volume > 0) {
                    this.plyrInstance.volume -= 0.1;
                }
                break;
            case " ":
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

    /**
     * ---------------------------------------
     *     Função utilitária
     * ---------------------------------------
     */
    convertToTitleCase(input: string): string {
        return input
            .replace(/%20/g, " ")
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }
}