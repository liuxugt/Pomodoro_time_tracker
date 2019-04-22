import * as React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import Header from "./../components/Header/Header";
import Footer from "./../components/Footer/Footer";
import Sidebar from "./../components/Sidebar/Sidebar";

import userRoutes from "../routes/userRoutes";
import adminRoutes from "../routes/adminRoutes";

interface Props {
    location: any
}

interface State {}

class IndexPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <div className="wrapper">
                <Sidebar {...this.props} />
                <div id="main-panel" className="main-panel" ref="mainPanel">
                    <Header {...this.props} />
                    <Switch>
                        {
                            localStorage.getItem("user") == "admin" ? 
                            adminRoutes.map((prop, key) => {
                                if (prop.redirect)
                                    return <Redirect from={prop.path} to={prop.to} key={key} />;
                                return (
                                    <Route path={prop.path} component={prop.component} key={key} />
                                );
                            }) :
                            userRoutes.map((prop, key) => {
                                if (prop.redirect)
                                    return <Redirect from={prop.path} to={prop.to} key={key} />;
                                return (
                                    <Route path={prop.path} component={prop.component} key={key} />
                                );
                            })
                        }
                    </Switch>
                    <Footer />
                </div>
            </div>
        );
    }
}

export default IndexPage;