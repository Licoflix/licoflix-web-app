import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import React, { useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../../app/store/store';

const FilmPlayerPage: React.FC = () => {
    const { playerStore } = useStore();
    const playerRef = useRef<Plyr | null>(null);
    const { title } = useParams<{ title: string }>();
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const saveProgress = useCallback(async () => {
        if (videoRef.current && title) {
            await playerStore.saveProgress(
                videoRef.current.currentTime,
                videoRef.current.duration,
                title
            );
        }
    }, [title, playerStore]);

    useEffect(() => {
        if (!videoRef.current || !title) return;

        // Inicializa o player
        playerRef.current = new Plyr(videoRef.current, {
            muted: false,
            tooltips: { controls: true, seek: true },
            keyboard: { focused: true, global: true },
            captions: { active: true, language: 'pt' },
            settings: ['captions', 'quality', 'speed', 'pip', 'airplay', 'playback-rate'],
            controls: ['play-large', 'play', 'current-time', 'progress', 'mute', 'volume', 'settings', 'pip', 'airplay', 'fullscreen'],
        });

        // Carrega o progresso salvo
        const savedTime = playerStore.loadProgress(title);
        if (savedTime > 0) {
            videoRef.current.currentTime = savedTime;
        }

        // Configura os event listeners
        const handlePause = () => saveProgress();
        const handleSeeked = () => saveProgress();
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                saveProgress();
            }
        };

        // Adiciona os listeners
        videoRef.current.addEventListener('pause', handlePause);
        videoRef.current.addEventListener('seeked', handleSeeked);
        window.addEventListener('keyup', handleKeyUp);

        // Função de cleanup
        return () => {
            videoRef.current?.removeEventListener('pause', handlePause);
            videoRef.current?.removeEventListener('seeked', handleSeeked);
            window.removeEventListener('keyup', handleKeyUp);

            playerRef.current?.destroy();
            saveProgress();
        };
    }, [title, playerStore, saveProgress]);

    return (
        <div style={{ height: '100vh', margin: 0, padding: 0, backgroundColor: 'black' }}>
            <video
                playsInline
                ref={videoRef}
                crossOrigin="anonymous"
                webkit-playsinline="true"
                className="plyr-react plyr"
                style={{ height: '100vh', margin: 0, padding: 0, backgroundColor: 'black' }}
            >
                <source
                    type="video/mp4"
                    src={encodeURI(`http://192.168.0.4:8080/film/${title || ''}/video`)}
                />
                <track
                    default
                    srcLang="pt"
                    kind="subtitles"
                    label="Português"
                    src={`http://192.168.0.4:8080/film/${title || ''}/ptbr/subtitle`}
                />
                <track
                    srcLang="en"
                    kind="subtitles"
                    label="Inglês"
                    src={`http://192.168.0.4:8080/film/${title || ''}/en/subtitle`}
                />
            </video>
        </div>
    );
};

export default FilmPlayerPage;