import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Button } from "semantic-ui-react";
import { findTranslation } from "../../../../app/common/language/translations";
import { useStore } from "../../../../app/store/store";
import ProfileField from "./ProfileField";

const ProfileFieldsSection: React.FC = () => {
    const { userStore: { entity }, commonStore: { language }, profileStore } = useStore();

    useEffect(() => {
        if (entity) {
            profileStore.setAvatar(entity.avatar);
            profileStore.setName(entity.name || "");
            profileStore.setOldAvatar(entity.avatar);
            profileStore.setEmail(entity.email || "");
            profileStore.setNickname(entity.nickname || "");
        }
    }, [entity, profileStore]);

    return (
        entity && (
            <div>
                <ProfileField
                    value={profileStore.nickname}
                    onChange={profileStore.setNickname}
                    isDisabled={profileStore.isNicknameDisabled}
                    onEnableEdit={profileStore.enableNicknameEdit}
                    label={findTranslation("nicknameLabel", language)}
                />
                <ProfileField
                    value={profileStore.name}
                    onChange={profileStore.setName}
                    isDisabled={profileStore.isNameDisabled}
                    onEnableEdit={profileStore.enableNameEdit}
                    label={findTranslation("nameLabel", language)}
                />
                <ProfileField
                    value={profileStore.email}
                    onChange={profileStore.setEmail}
                    isDisabled={profileStore.isEmailDisabled}
                    onEnableEdit={profileStore.enableEmailEdit}
                    label={findTranslation("emailLabel", language)}
                />
                <ProfileField
                    type="password"
                    value={profileStore.password}
                    onChange={profileStore.setPassword}
                    showPassword={profileStore.showPassword}
                    isDisabled={profileStore.isPasswordDisabled}
                    onEnableEdit={profileStore.enablePasswordEdit}
                    label={findTranslation("passwordLable", language)}
                    onToggleShowPassword={profileStore.toggleShowPassword}
                />

                {profileStore.enableActionButtons() && (
                    <div className="buttons-profile-section">
                        <Button
                            size="large"
                            color="grey"
                            type="button"
                            onClick={() => profileStore.setAllDisabled(true)}
                        >
                            {findTranslation("cancel", language)}
                        </Button>
                        <Button className="profile-save-button" color="purple" onClick={profileStore.handleSave}>
                            {findTranslation("Save", language)}
                        </Button>
                    </div>
                )}
            </div>
        )
    );
};

export default observer(ProfileFieldsSection);