import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../../app/store/store';

const FilmPlayerPage: React.FC = () => {
    const { playerStore } = useStore();
    const playerRef = useRef<Plyr | null>(null);
    const { title } = useParams<{ title: string }>();
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (videoRef.current) {
            playerRef.current = new Plyr(videoRef.current, {
                muted: false,
                tooltips: { controls: true, seek: true },
                keyboard: { focused: true, global: true },
                captions: { active: true, language: 'pt' },
                settings: ['captions', 'quality', 'speed', 'pip', 'airplay', 'playback-rate'],
                controls: ['play-large', 'play', 'current-time', 'progress', 'mute', 'volume', 'settings', 'pip', 'airplay', 'fullscreen'],
            });

            const savedTime = playerStore.loadProgress(title);
            if (savedTime > 0 && videoRef.current) {
                videoRef.current.currentTime = savedTime;
            }

            const handleTimeUpdate = () => {
                if (videoRef.current) {
                    playerStore.saveProgress(videoRef.current.currentTime, videoRef.current.duration, title);
                }
            };

            videoRef.current.addEventListener('timeupdate', handleTimeUpdate);

            const handleKey = (e: KeyboardEvent) => {
                playerStore.handleKey(e);
            };
            window.addEventListener('keydown', handleKey);

            return () => {
                if (videoRef.current) {
                    videoRef.current.removeEventListener('timeupdate', handleTimeUpdate);
                }
                if (playerRef.current) {
                    playerRef.current.destroy();
                }
                window.removeEventListener('keydown', handleKey);
            };
        }
    }, [playerStore, title]);

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