import {throttle} from 'lodash';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useStore} from '../../app/store/store';

const FilmPlayerPage: React.FC = () => {
    const BASE_URL_FILM = import.meta.env.VITE_BASE_URL_FILM;

    const {playerStore} = useStore();
    const {title} = useParams<{ title: string }>();
    const [showHiddenItems, setShowHiddenItems] = useState(true);
    const playerRef = useRef<Plyr | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const saveProgressImmediately = useCallback(async () => {
        if (videoRef.current && title) {
            await playerStore.saveProgress(
                videoRef.current.currentTime,
                videoRef.current.duration,
                title
            );
        }
    }, [title, playerStore]);

    const saveProgressThrottled = useCallback(
        throttle(async () => {
            await saveProgressImmediately();
        }, 1500, {leading: true, trailing: false}),
        [saveProgressImmediately]
    );

    useEffect(() => {
        if (!videoRef.current || !title) return;

        // Inicializa o player
        playerRef.current = new Plyr(videoRef.current, {
            muted: false,
            tooltips: {controls: true, seek: true},
            keyboard: {focused: true, global: true},
            captions: {active: true, language: 'pt'},
            settings: ['captions', 'quality', 'speed', 'pip', 'airplay', 'playback-rate'],
            controls: ['play-large', 'play', 'current-time', 'progress', 'mute', 'volume', 'settings', 'pip', 'airplay', 'fullscreen'],
        });

        const player = playerRef.current;

        // Aguarda a inicialização completa do player
        player.on('ready', () => {
            const plyrContainer = player.elements.container;

            if (plyrContainer) {
                // Cria elementos para fullscreen usando as mesmas classes do CSS
                const titleEl = document.createElement('div');
                titleEl.textContent = title.replace(/\(\d{4}\)/g, "").trim();
                titleEl.className = 'film-player-title';
                titleEl.style.opacity = showHiddenItems ? '1' : '0';
                titleEl.style.transition = 'opacity 0.3s ease';

                const closeBtn = document.createElement('div');
                closeBtn.innerHTML = '&times;';
                closeBtn.className = 'close-button';
                closeBtn.style.opacity = showHiddenItems ? '1' : '0';
                closeBtn.style.transition = 'opacity 0.3s ease';
                closeBtn.onclick = () => history.back();

                // Adiciona ao container do Plyr
                plyrContainer.appendChild(titleEl);
                plyrContainer.appendChild(closeBtn);

                // Função para atualizar visibilidade
                const updateVisibility = () => {
                    const isPaused = player.paused;
                    const opacity = isPaused ? '1' : '0';
                    titleEl.style.opacity = opacity;
                    closeBtn.style.opacity = opacity;
                    setShowHiddenItems(isPaused);
                };

                // Event listeners do player
                player.on('pause', updateVisibility);
                player.on('play', updateVisibility);
                player.on('seeked', saveProgressThrottled);
            }
        });

        // Controle de visibilidade do botão
        const updateButtonVisibility = () => {
            setShowHiddenItems(playerRef.current?.paused || false);
        };

        // Carrega o progresso salvo
        const savedTime = playerStore.loadProgress(title);
        if (savedTime > 0) {
            videoRef.current.currentTime = savedTime;
        }

        // Configura os event listeners
        const handleSeeked = () => saveProgressThrottled();
        const handlePause = () => {
            saveProgressThrottled().then();
            updateButtonVisibility()
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                saveProgressThrottled().then();
            }
        };

        // Adiciona os listeners
        window.addEventListener('keyup', handleKeyUp);
        videoRef.current.addEventListener('pause', handlePause);
        videoRef.current.addEventListener('seeked', handleSeeked);
        videoRef.current.addEventListener('play', updateButtonVisibility);

        // Função de cleanup
        return () => {
            window.removeEventListener('keyup', handleKeyUp);
            videoRef.current?.removeEventListener('pause', handlePause);
            videoRef.current?.removeEventListener('seeked', handleSeeked);
            videoRef.current?.removeEventListener('play', updateButtonVisibility);

            playerRef.current?.destroy();
            saveProgressImmediately().then();
        };
    }, [title, playerStore, saveProgressImmediately]);

    return (
        <div style={{height: '100vh', margin: 0, padding: 0, backgroundColor: 'black'}}>
            <video
                playsInline
                ref={videoRef}
                crossOrigin="anonymous"
                webkit-playsinline="true"
                className="plyr-react plyr"
                style={{height: '100vh', margin: 0, padding: 0, backgroundColor: 'black'}}
            >
                <source
                    type="video/mp4"
                    src={encodeURI(`${BASE_URL_FILM}/film/${title || ''}/video`)}
                />
                <track
                    default
                    srcLang="pt"
                    kind="subtitles"
                    label="Português"
                    src={`${BASE_URL_FILM}/film/${title || ''}/ptbr/subtitle`}
                />
                <track
                    srcLang="en"
                    kind="subtitles"
                    label="Inglês"
                    src={`${BASE_URL_FILM}/film/${title || ''}/en/subtitle`}
                />
            </video>
        </div>
    );
};

export default FilmPlayerPage;