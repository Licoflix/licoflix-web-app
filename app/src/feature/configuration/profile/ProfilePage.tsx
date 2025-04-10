import { observer } from "mobx-react-lite";
import { Grid, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/store/store";
import ProfileFieldsSection from "./section/ProfileFieldsSection";
import ProfileImageUpload from "./section/ProfileImageUpload";

const ProfilePage: React.FC = () => {
    const { profileStore: { setAvatar, enableImageEdit, avatar } } = useStore();

    const handleImageChange = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Avatar = reader.result as string;
            const pureBase64 = base64Avatar.split(",")[1];
            setAvatar(pureBase64);
            enableImageEdit();
        };

        reader.readAsDataURL(file);
    };

    return (
        <Segment style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent" }}>
            <Grid textAlign="center" style={{ width: "100%" }}>
                <Grid.Row>
                    <Grid.Column>
                        <ProfileImageUpload
                            avatar={avatar}
                            onImageChange={handleImageChange}
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row className="profile-filds-section">
                    <Grid.Column width={8}>
                        <ProfileFieldsSection />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
    );
};

export default observer(ProfilePage);
