import { Link } from "react-router-dom";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

export default function NotFoundPage() {
    return (
        <Segment className="not-found-page" placeholder>
            <Header as='h2' icon size='huge' style={{ marginBottom: 50, marginTop: 50, color: 'rgba(255, 255, 255)' }}>
                <Icon name='search' />
                <Header.Content>
                    Page Not Found 🥺
                    <Header.Subheader style={{ color: 'rgba(255, 255, 255)', marginTop: 20 }} content="Oops - The page you are looking for does not exist" />
                </Header.Content>
            </Header>
            <Segment.Inline style={{ marginBottom: 50 }} >
                <Button className="register-button" as={Link} to='/' size="large" circular>
                    Back to Dashboard
                </Button>
            </Segment.Inline>
        </Segment>
    )
}