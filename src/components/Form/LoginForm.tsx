import * as React from "react";
import { Form, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { authenticationActions } from "../../redux/actionCreators/authentication.action";

interface Props {
    type: string
}

interface State {
    username: string
}

class LoginForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        //@ts-ignore
        this.props.dispatch(authenticationActions.logout());

        this.state = {
            username: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e: any) {
        const { name, value } = e.target;
        //@ts-ignore
        this.setState({ [name]: value });
    }

    handleSubmit(e: any) {
        e.preventDefault();

        const { type } = this.props

        const { username } = this.state;
        //@ts-ignore
        const { dispatch } = this.props;
        if (username) {
            dispatch(authenticationActions.login(username, type));
        }
    }

    render() {
        const { username } = this.state;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Form.Group>
                    <Form.Label>{this.props.type == "admin" ? "Admin Name:" : "Email Address:"}</Form.Label>
                    <Form.Control type={this.props.type == "admin" ? "input" : "email"} placeholder={this.props.type == "admin" ? "Enter your admin name" : "Enter your email"} name="username" value={username} onChange={this.handleChange} required />
                </Form.Group>
                <Form.Group>
                    <Form.Check type="checkbox" label="Remember me" />
                </Form.Group>
                <Button variant="primary" type="submit" block>Submit</Button>
            </Form>
        );
    }
}

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return {
        loggingIn
    };
}

export default connect(mapStateToProps)(LoginForm);