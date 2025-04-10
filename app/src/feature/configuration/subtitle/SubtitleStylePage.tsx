import { observer } from "mobx-react-lite";
import React from "react";
import { Header, Segment } from "semantic-ui-react";
import { findTranslation } from "../../../app/common/language/translations";
import { useStore } from "../../../app/store/store";
import { HexColorPicker } from "react-colorful";

const SubtitleStylePage: React.FC = () => {
    const { playerStore, commonStore: { language } } = useStore();

    const bgOpacity = parseInt(playerStore.subtitleOpacity) / 100;
    const colorOpacity = parseInt(playerStore.subtitleFontOpacity) / 100;
    const computedColor = playerStore.hexToRgba(playerStore.subtitleColor, colorOpacity, false);
    const computedBackground = playerStore.hexToRgba(playerStore.subtitleBackground, bgOpacity, true);

    return (
        <Segment className="home-page subtitle-page">
            <Header className="subtitle-title" textAlign="center">{findTranslation("fontStyle", language)}</Header>
            <Header className="subtitle-sub-title" textAlign="center">{findTranslation("fontStyleDesc", language)}</Header>

            <Segment className="form-container">
                <div className="form-grid">
                    <div className="form-row sliders">
                        <div className="slider-item">
                            <label>{findTranslation("size", language)}</label>
                            <input
                                min="2"
                                max="4"
                                step="0.1"
                                type="range"
                                className="form-control-range"
                                value={parseFloat(playerStore.subtitleSize)}
                                onChange={(e) => playerStore.setSubtitleSize(`${e.target.value}rem`)}
                                style={{ width: '100%' }}
                            />
                        </div>

                        <div className="slider-item">
                            <label>{findTranslation("backgroundOpacity", language)}</label>
                            <input
                                min="0"
                                step="1"
                                max="100"
                                type="range"
                                style={{ width: '100%' }}
                                className="form-control-range"
                                value={parseInt(playerStore.subtitleOpacity)}
                                onChange={(e) => playerStore.setSubtitleOpacity(`${e.target.value}%`)}
                            />
                        </div>

                        <div className="slider-item">
                            <label>{findTranslation("fontOpacity", language)}</label>
                            <input
                                min="0"
                                step="1"
                                max="100"
                                type="range"
                                style={{ width: '100%' }}
                                className="form-control-range"
                                value={parseInt(playerStore.subtitleFontOpacity)}
                                onChange={(e) => playerStore.setSubtitleFontOpacity(`${e.target.value}%`)}
                            />
                        </div>
                    </div>
                    <div className="form-row color-picker">
                        <div>
                            <label>{findTranslation("backgroundSubtitle", language)}</label>
                            <HexColorPicker
                                color={playerStore.subtitleBackground}
                                onChange={(novaCor: string) => {
                                    playerStore.setSubtitleBackground(novaCor);
                                }}
                            />
                        </div>
                        <div>
                            <label>{findTranslation("color", language)}</label>
                            <HexColorPicker
                                color={playerStore.subtitleColor}
                                onChange={(novaCor: string) => {
                                    playerStore.setSubtitleColor(novaCor);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Segment>

            <div className="preview-container">
                <div
                    className="preview-text"
                    style={{
                        color: computedColor,
                        background: computedBackground,
                        fontSize: playerStore.subtitleSize,
                    }}
                >
                    {findTranslation("subtitleEx", language)}
                </div>
            </div>
        </Segment>
    );
};

export default observer(SubtitleStylePage);