import * as React from "react";
import { Nav, Navbar, Container } from "react-bootstrap";

import HeaderLinks from "./HeaderLinks";

interface Props {
    location: any
}
interface State {}

class Header extends React.Component<Props, State> {
    constructor(props: Props){
        super(props);
        this.state = {
        }
    }
    render() {
        var title = "";
        switch(this.props.location.pathname){
            case "/dashboard":
                if(localStorage.getItem("user") == "admin"){
                    title = "users";
                }
                else{
                    title = "projects"
                }
                break;
            case "/report":
                title = "report";
                break;
            case "/pomodoro":
                title = "pomodoro";
                break;
            default:
                title = "";
        }
        return (
            <Navbar>
                <Container fluid>
                    <Navbar.Brand>
                        {title}
                    </Navbar.Brand>
                    <Nav>
                        <HeaderLinks />
                    </Nav>
                </Container>
            </Navbar>
        )
    }
}

export default Header;

