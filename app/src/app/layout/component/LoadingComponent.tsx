import {observer} from 'mobx-react-lite';

interface Props {
    content?: string;
}

export default observer(function LoadingComponent({content}: Props) {
    return (
        <div className="modern-loading-overlay">
            <div className="modern-loading-container">
                <div className="brand-loading">
                    <span className="brand-text">{content}</span>
                    <span className="skull-icon">☠️</span>
                </div>
            </div>
        </div>
    )
})