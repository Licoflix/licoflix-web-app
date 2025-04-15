import { throttle } from 'lodash';
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
        }, 1500, { leading: true, trailing: false }),
        [saveProgressImmediately]
    );

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
        const handlePause = () => saveProgressThrottled();
        const handleSeeked = () => saveProgressThrottled();
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                saveProgressThrottled();
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
            saveProgressImmediately();
        };
    }, [title, playerStore, saveProgressImmediately]);

    return (
        <div style={{ height: '100vh', margin: 0, padding: 0, backgroundColor: 'black' }}>
            <video
                autoPlay
                playsInline
                ref={videoRef}
                crossOrigin="anonymous"
                webkit-playsinline="true"
                className="plyr-react plyr"
                style={{ height: '100vh', margin: 0, padding: 0, backgroundColor: 'black' }}
            >
                <source
                    type="video/mp4"
                    src={encodeURI(`http://localhost:8080/film/${title || ''}/video`)}
                />
                <track
                    default
                    srcLang="pt"
                    kind="subtitles"
                    label="Português"
                    src={`http://localhost:8080/film/${title || ''}/ptbr/subtitle`}
                />
                <track
                    srcLang="en"
                    kind="subtitles"
                    label="Inglês"
                    src={`http://localhost:8080/film/${title || ''}/en/subtitle`}
                />
            </video>
        </div>
    );
};

export default FilmPlayerPage;