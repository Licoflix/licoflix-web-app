import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Form, useNavigate } from "react-router-dom";
import { Button, Container, FormField, Header, Input } from "semantic-ui-react";
import { findTranslation } from "../../app/common/language/translations";
import { useStore } from "../../app/store/store";

export default observer(function LoginForm() {
    const navigate = useNavigate();
    const { userStore: { login } } = useStore();
    const { commonStore: { language } } = useStore();

    return (
        <>
            <div>
                <Container className="authBody">
                    <div className="authForm">
                        <Header as='h3' textAlign="center" style={{ marginBottom: 30, color: 'white', marginTop: 50 }}>
                            <div className="auth-title">
                                {findTranslation("login", language)}
                            </div>
                        </Header>
                        <Formik
                            onSubmit={(values) => login(values)}
                            initialValues={{ name: '', nickname: '', email: '', password: '', avatar: null }}
                        >
                            {({ handleSubmit, isSubmitting, setFieldValue }) => (
                                <Form className="ui form error" id="form-login" onSubmit={handleSubmit} autoComplete='off'>
                                    <FormField style={{ width: '75%', margin: '0 auto', marginBottom: '1vh' }} >
                                        <Input size="big" className="login-input" name="email" placeholder={findTranslation("email", language)} icon="mail"
                                            onChange={(_, { value }) => setFieldValue('email', value)} />
                                    </FormField>

                                    <FormField style={{ width: '75%', margin: '0 auto' }}>
                                        <Input size="big" className="login-input" name="password" placeholder={findTranslation('password', language)} type='password'
                                            icon="lock" onChange={(_, { value }) => setFieldValue('password', value)} />
                                        <p className="auth-subtitle">{findTranslation('forgotPassword', language)}</p>
                                    </FormField>

                                    <Header textAlign="center" style={{ margin: 9 }}>
                                        <Button
                                            size="big"
                                            type="submit"
                                            loading={isSubmitting}
                                            disabled={isSubmitting}
                                            className='register-button'
                                            style={{ marginTop: '3vh', width: 400 }}
                                            content={findTranslation('login', language)}
                                        />
                                        <p className="auth-register" onClick={() => navigate("/register")}>
                                            {findTranslation('dontHaveAccount', language)}
                                            <p className="register-to">Register</p>
                                        </p>
                                    </Header>
                                </Form>
                            )}
                        </ Formik>
                    </div>
                </Container>
            </div>
        </>
    );
});