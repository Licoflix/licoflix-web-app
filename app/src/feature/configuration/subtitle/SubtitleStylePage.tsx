import { observer } from "mobx-react-lite";
import React from "react";
import { HexColorPicker } from 'react-colorful';
import { Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/store/store";

const SubtitleStylePage: React.FC = () => {
    const { playerStore } = useStore();

    return (
        <Segment className="home-page subtitle-page">
            <Header className="subtitle-title" textAlign="center">Estilo da Legenda</Header>
            <Header className="subtitle-sub-title" textAlign="center"> Altere a maneira como as legendas aparecem ao assistir</Header>
            <div className="preview-container">
                <div
                    className="preview-text"
                    style={{
                        color: playerStore.subtitleColor,
                        fontSize: playerStore.subtitleSize,
                        opacity: parseInt(playerStore.subtitleOpacity) / 100,
                    }}
                >
                    Exemplo de Legenda
                </div>
            </div>

            <Segment className="form-container">
                <div className="form-title">Configurações</div>

                <div className="form-grid">
                    <div className="form-row color-picker">
                        <label>Cor</label>
                        <HexColorPicker
                            color={playerStore.subtitleColor}
                            onChange={(novaCor) => {
                                playerStore.setSubtitleColor(novaCor);
                            }}
                        />
                    </div>

                    <div className="form-row sliders">
                        <div className="slider-item">
                            <label>Tamanho</label>
                            <input
                                min="1"
                                max="4"
                                step="0.5"
                                type="range"
                                className="form-control-range"
                                value={parseFloat(playerStore.subtitleSize)}
                                onChange={(e) => playerStore.setSubtitleSize(`${e.target.value}rem`)}
                                style={{ width: '100%' }}
                            />
                        </div>

                        <div className="slider-item">
                            <label>Opacidade</label>
                            <input
                                min="0"
                                step="5"
                                max="100"
                                type="range"
                                className="form-control-range"
                                value={parseInt(playerStore.subtitleOpacity)}
                                onChange={(e) => playerStore.setSubtitleOpacity(`${e.target.value}%`)}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </div>
                </div>
            </Segment>
        </Segment>
    );
};

export default observer(SubtitleStylePage);