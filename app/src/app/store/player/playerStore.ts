import {makeAutoObservable, runInAction} from "mobx";
import {FilmWatchingList} from "../../model/FilmWatchingList";
import service from "../../service/service";
import {store} from "../store";

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

    continueWatchingList: FilmWatchingList[] = [];

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

    setSubtitleBold(bold: string) {
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

        if (bold) this.setSubtitleBold(bold);
        if (size) this.setSubtitleSize(size);
        if (color) this.setSubtitleColor(color);
        if (opacity) this.setSubtitleOpacity(opacity);
        if (background) this.setSubtitleBackground(background);
        if (backgroundRGBA) this.setSubtitleBackgroundRGBA(backgroundRGBA);
        if (subtitleColorRGBA) this.setSubtitleColorRGBA(subtitleColorRGBA);
        if (subtitleFontOpacity) this.setSubtitleFontOpacity(subtitleFontOpacity);
    }
}