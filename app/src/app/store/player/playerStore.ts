import { makeAutoObservable, runInAction } from "mobx";
import Plyr from "plyr";
import React from "react";
import { FilmWatchingList } from "../../model/FilmWatchingList";
import service from "../../service/service";
import { store } from "../store";

export default class PlayerStore {
    // Configurações de legendas (valores padrão)
    subtitleBold: string = "0";
    subtitleOpacity: string = "0";
    subtitleSize: string = "3rem";
    subtitleColor: string = "#FFEE00";
    subtitleFontOpacity: string = "100%";
    subtitleBackground: string = "#000000";
    subtitleColorRGBA: string = "rgba(255, 238, 0, 1)";
    subtitleBackgroundRGBA: string = "rgba(0, 0, 0, 0)";

    plyrInstance: Plyr | null = null;
    continueWatchingList: FilmWatchingList[] = [];
    hideControlsTimeout: ReturnType<typeof setTimeout> | null = null;
    playerRef: React.RefObject<HTMLVideoElement> = React.createRef<HTMLVideoElement>();

    constructor() {
        makeAutoObservable(this);
        this.loadSubtitleSettings();
    }

    /**
     * ---------------------------------------
     *     Gerenciamento de progresso
     * ---------------------------------------
     */
    loadContinueWatchingList = async () => {
        const response = await service.continueWatching.list();
        runInAction(() => {
            this.continueWatchingList = response.data;
            store.filmStore.continueWatchingList = response.data.map(item => item.film);
        });
    };

    private getFilmData = (title: string) => {
        return this.continueWatchingList.find(item => item.film.title === title);
    };

    isWatching = (title: string) => {
        const filmData = this.getFilmData(title);
        if (!filmData) return false;

        const current = parseFloat(filmData.current);
        const duration = parseFloat(filmData.duration);

        return duration - current > 300 && current > 8;
    };

    saveProgress = async (current: number, duration: number, title: string | undefined) => {
        if (!title) return;

        await service.continueWatching.add(
            title,
            current.toString(),
            duration.toString()
        );

        await this.loadContinueWatchingList();
    };

    loadProgress = (title: string | undefined): number => {
        if (!title) return 0;
        const filmData = this.getFilmData(title);
        return filmData ? parseFloat(filmData.current) : 0;
    };

    getFilmDuration = (title: string | undefined): number => {
        if (!title) return 0;
        const filmData = this.getFilmData(title);
        return filmData ? parseFloat(filmData.duration) : 0;
    };

    resetFilmProgress = async (title: string) => {
        await service.continueWatching.remove(title);
        await this.loadContinueWatchingList();
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

    setSubtitleBold(bold: string){
        this.subtitleBold = bold;
        document.documentElement.style.setProperty("--subtitle-bold", bold);

        localStorage.setItem("subtitleBold", bold);
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
        this.setSubtitleBold("0");
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
        const bold = localStorage.getItem("subtitleBold");
        const size = localStorage.getItem("subtitleSize");
        const color = localStorage.getItem("subtitleColor");
        const opacity = localStorage.getItem("subtitleOpacity");
        const background = localStorage.getItem("subtitleBackground");
        const subtitleColorRGBA = localStorage.getItem("subtitleColorRGBA");
        const backgroundRGBA = localStorage.getItem("subtitleBackgroundRGBA");
        const subtitleFontOpacity = localStorage.getItem("subtitleFontOpacity");

        if(bold) this.setSubtitleBold(bold);
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