import * as React from "react"; 
import { Container } from "react-bootstrap";

class Footer extends React.Component {
    render() {
        return (
            <footer className="footer">
                <Container fluid>
                    <nav className="pull-left">
                        <ul>
                            <li>
                                <a href="https://docs.google.com/document/d/1a1nhH8shhKjbUBFnWJJCzl0K9QHYmPkOHuvC5aLvtSU/edit">Introduction</a>
                            </li>
                            <li>
                                <a href="https://github.gatech.edu/gt-se-cs6301-spring2019/6301Spring19Web1">Github</a>
                            </li>
                            <li>
                                <a href="#">Email</a>
                            </li>
                        </ul>
                    </nav>
                    <p className="copyright pull-right">
                        &copy; {new Date().getFullYear()}{" "}
                        Web1 CS6301
                    </p>
                </Container>
            </footer>
        )
    }
}

export default Footer;