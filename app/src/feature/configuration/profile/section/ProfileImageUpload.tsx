import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { Icon, Image } from "semantic-ui-react";

interface ProfileImageUploadProps {
    avatar: File | string | null;
    onImageChange: (file: File) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ avatar, onImageChange }) => {
    const [hovered, setHovered] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string>("../../../image/user.png");

    const createPreview = (input: File | string | null) => {
        if (typeof input === "string") {
            return input.startsWith('data:image') ? input : `data:image/jpeg;base64,${input}`;
        } else if (input instanceof Blob) {
            return URL.createObjectURL(input);
        }
        return "../../../image/user.png";
    };

    useEffect(() => {
        setPreview(createPreview(avatar));
    }, [avatar]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPreview(URL.createObjectURL(file));
            onImageChange(file);
        }
    };

    return (
        <div
            className="profile-upload-container"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => fileInputRef.current?.click()}
        >
            <Image
                circular
                centered
                src={preview}
                className={`profile-image ${hovered ? 'image-hovered' : ''}`}
            />

            {hovered && (
                <Icon
                    size="huge"
                    name="upload"
                    className="upload-icon"
                />
            )}

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="file-input"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default observer(ProfileImageUpload);