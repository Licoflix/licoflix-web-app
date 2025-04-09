import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import { Form, useNavigate } from "react-router-dom";
import { Button, Container, FormField, Header, Input } from "semantic-ui-react";
import * as Yup from "yup";
import { findTranslation } from "../../app/common/language/translations";
import { UserFormValues } from "../../app/model/UserResponse";
import { useStore } from "../../app/store/store";

export default observer(function RegisterForm() {
    const navigate = useNavigate();
    const { userStore: { register } } = useStore();
    const { commonStore: { language } } = useStore();

    return (
        <>
            <div>
                <Container className="authBody">
                    <div className="authForm">
                        <Header as="h3" textAlign="center" style={{ marginBottom: 30, color: "white", marginTop: 50 }}>
                            <div className="auth-title">
                                {findTranslation("newAccount", language)}
                            </div>
                        </Header>
                        <Formik
                            onSubmit={(values: UserFormValues) => register(values, true)}
                            initialValues={{ name: "", nickname: "", email: "", password: "", avatar: null }}
                            validationSchema={Yup.object({
                                name: Yup.string().required(),
                                nickname: Yup.string().required(),
                                email: Yup.string().required().email(),
                                password: Yup.string().required(),
                            })}
                        >
                            {({ handleSubmit, isSubmitting, setFieldValue }) => (
                                <Form className="ui form error" id="form-register" onSubmit={handleSubmit} autoComplete="off">
                                    <FormField style={{ width: "75%", margin: "0 auto", marginBottom: "1vh" }}>
                                        <Input
                                            size="big"
                                            icon="user"
                                            name="nickname"
                                            className="login-input"
                                            placeholder={findTranslation("nickname", language)}
                                            onChange={(_, { value }) => setFieldValue('nickname', value)}
                                        />
                                    </FormField>

                                    <FormField style={{ width: "75%", margin: "0 auto", marginBottom: "1vh" }}>
                                        <Input
                                            size="big"
                                            name="name"
                                            className="login-input"
                                            icon="address card outline"
                                            placeholder={findTranslation("name", language)}
                                            onChange={(_, { value }) => setFieldValue('name', value)}
                                        />
                                    </FormField>

                                    <FormField style={{ width: "75%", margin: "0 auto", marginBottom: "1vh" }}>
                                        <Input
                                            size="big"
                                            icon="mail"
                                            name="email"
                                            className="login-input"
                                            placeholder={findTranslation("Email", language)}
                                            onChange={(_, { value }) => setFieldValue('email', value)}
                                        />
                                    </FormField>

                                    <FormField style={{ width: "75%", margin: "0 auto" }}>
                                        <Input
                                            size="big"
                                            icon="lock"
                                            name="password"
                                            type="password"
                                            className="login-input"
                                            placeholder={findTranslation("password", language)}
                                            onChange={(_, { value }) => setFieldValue('password', value)}
                                        />
                                    </FormField>

                                    <Header textAlign="center" style={{ margin: 9, marginTop: 20 }}>
                                        <Button
                                            size="big"
                                            type="submit"
                                            loading={isSubmitting}
                                            className="register-button"
                                            style={{ marginTop: "3vh", width: 400 }}
                                            content={findTranslation("register", language)}
                                        />
                                    </Header>

                                    <p className="auth-register" onClick={() => navigate("/login")}>
                                        {findTranslation('haveAccount', language)}
                                        <p className="register-to">Login</p>
                                    </p>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </Container>
            </div>
        </>
    );
});