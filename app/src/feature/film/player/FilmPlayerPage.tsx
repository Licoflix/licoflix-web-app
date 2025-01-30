import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../../../app/store/store';

const FilmPlayerPage: React.FC = () => {
    const { playerStore } = useStore();

    const playerRef = useRef<Plyr | null>(null);
    const { title } = useParams<{ title: string }>();
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        playerStore.setFontSize('3.5rem');
        playerStore.setBackground('none');
        playerStore.setSubtitleColor('yellow');

        if (videoRef.current) {
            playerRef.current = new Plyr(videoRef.current, {
                muted: false,
                tooltips: { controls: true, seek: true },
                captions: { active: true, language: 'pt' },
                settings: ['captions', 'quality', 'speed', 'pip', 'airplay', 'playback-rate'],
                controls: ['play-large', 'play', 'current-time', 'progress', 'mute', 'volume', 'settings', 'pip', 'airplay', 'fullscreen'],
            });

            const savedTime = playerStore.loadProgress(title);
            if (savedTime > 0 && videoRef.current) {
                videoRef.current.currentTime = savedTime;
            }

            videoRef.current.addEventListener('timeupdate', () => {
                if (videoRef.current) {
                    playerStore.saveProgress(videoRef.current.currentTime, videoRef.current.duration, title);
                }
            });
        }

        const handleKey = (e: KeyboardEvent) => {
            playerStore.handleKey(e);
        };
        window.addEventListener('keydown', handleKey);

        return () => {
            playerStore.destroyPlayer();
        };
    }, [playerStore, title]);
    return (
        <div style={{ height: '100vh', margin: 0, padding: 0, backgroundColor: 'black' }}>
            <video ref={videoRef} className="plyr-react plyr" crossOrigin="anonymous">
                <source
                    type="video/mp4"
                    src={encodeURI(`http://26.128.44.247:8080/film/${(title || '')}/video`)}
                />

                <track
                    default
                    srcLang="pt"
                    kind="subtitles"
                    label="Português"
                    src={`http://26.128.44.247:8080/film/${(title || '')}/ptbr/subtitle`}
                />

                <track
                    srcLang="en"
                    kind="subtitles"
                    label="Inglês"
                    src={`http://26.128.44.247:8080/film/${(title || '')}/en/subtitle`}
                />
            </video>
        </div>
    );
};

export default FilmPlayerPage;
