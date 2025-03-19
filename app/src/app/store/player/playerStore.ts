import { makeAutoObservable } from "mobx";
import Plyr from "plyr";
import React from "react";

export default class PlayerStore {
    // Configurações de legendas (valores padrão)
    subtitleSize: string = "3rem";
    subtitleOpacity: string = "100%";
    subtitleColor: string = "yellow";

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
        document.documentElement.style.setProperty("--subtitle-color", color);

        localStorage.setItem("subtitleColor", color);
    }

    setSubtitleSize(size: string) {
        this.subtitleSize = size;
        document.documentElement.style.setProperty("--subtitle-size", size);

        localStorage.setItem("subtitleSize", size);
    }

    setSubtitleOpacity(opacity: string) {
        this.subtitleOpacity = opacity;
        document.documentElement.style.setProperty("--subtitle-opacity", opacity);

        localStorage.setItem("subtitleOpacity", opacity);
    }

    // --------------------------------
    // Resetar tudo
    // --------------------------------
    resetSubtitleSettings() {
        // Volta aos valores padrão (ajuste conforme quiser)
        this.setSubtitleSize("3rem");
        this.setSubtitleColor("yellow");
        this.setSubtitleOpacity("100%");
    }

    // --------------------------------
    // Carrega do localStorage
    // --------------------------------
    private loadSubtitleSettings() {
        const size = localStorage.getItem("subtitleSize");
        const color = localStorage.getItem("subtitleColor");
        const opacity = localStorage.getItem("subtitleOpacity");

        if (size) this.setSubtitleSize(size);
        if (color) this.setSubtitleColor(color);
        if (opacity) this.setSubtitleOpacity(opacity);
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