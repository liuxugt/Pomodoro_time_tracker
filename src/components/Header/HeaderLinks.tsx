import * as React from "react";
import { Nav } from "react-bootstrap";
import { connect } from "react-redux";
import { authenticationActions } from "../../redux/actionCreators/authentication.action";

class HeaderLinks extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e: any) {
        e.preventDefault();
        //@ts-ignore
        const { dispatch } = this.props;
        dispatch(authenticationActions.logout());
    }

    render() {
        return (
            <div>
                <Nav className="justify-content-end">
                    <Nav.Item>
                        <Nav.Link disabled><span id="username">{localStorage.getItem("user")}</span></Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="#" onClick={this.handleClick}><span id="logout">Logout</span></Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    return {
        loggingIn
    };
}

export default connect(mapStateToProps)(HeaderLinks);