import * as React from "react";
import { Tabs, Tab } from "react-bootstrap";
import LoginForm from "./../components/Form/LoginForm";

interface Props {}
interface State {}

class Login extends React.Component<Props, State> {
    render() {
        return (
            <Tabs defaultActiveKey="admin" id="login">
                <Tab eventKey="admin" title="Admin">
                    <LoginForm type="admin" />
                </Tab>
                <Tab eventKey="user" title="User">
                    <LoginForm type="user" />
                </Tab>
            </Tabs>
        );
    }
}

export default Login;