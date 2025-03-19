import { Icon, Input } from "semantic-ui-react";

interface ProfileFieldProps {
    label: string;
    value: string;
    isDisabled: boolean;
    showPassword?: boolean;
    onEnableEdit: () => void;
    type?: "text" | "password";
    onChange: (value: string) => void;
    onToggleShowPassword?: () => void;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
    label,
    value,
    onChange,
    isDisabled,
    showPassword,
    onEnableEdit,
    type = "text",
    onToggleShowPassword,
}) => {
    return (
        <div className="profile-label">
            <div style={{ marginBottom: "1.5vh", marginLeft: "0.5vw" }}>{label}</div>
            <Input
                disabled={isDisabled}
                className="profile-input"
                onChange={(e) => onChange(e.target.value)}
                value={isDisabled ? (type === "password" ? "*********" : value) : value}
                type={!isDisabled && type === "password" && !showPassword ? "password" : "text"}
                icon={
                    isDisabled ? (
                        <Icon
                            link
                            name="pencil"
                            onClick={onEnableEdit}
                            className="profile-icon"
                            style={{ cursor: "pointer" }}
                        />
                    ) : type === "password" ? (
                        <Icon
                            link
                            className="profile-icon"
                            style={{ cursor: "pointer" }}
                            onClick={onToggleShowPassword}
                            name={showPassword ? "eye slash" : "eye"}
                        />
                    ) : null
                }
            />
        </div>
    );
};

export default ProfileField;