import * as React from "react";
import { NavLink } from "react-router-dom";

import logo from "./../../assets/img/logo.png";
import adminRoutes from "../../routes/adminRoutes";
import userRoutes from "../../routes/userRoutes";

interface Props {
    location: any
}
interface State {
}

class Sidebar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
        }
    }

    activeRoute(routeName: string) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
    }

    render() {
        return (
            <div id="sidebar" className="sidebar" data-color="black">
                <div className="logo">
                    <a href="/" className="simple-text logo-mini">
                        <div className="logo-img">
                            <img src={logo} alt="logo_image" />
                        </div>
                    </a>
                    <a href="/" className="simple-text logo-normal">
                        Pomodoro
                    </a> 
                </div>
                <div className="sidebar-wrapper">
                    <ul className="nav">
                        {
                            localStorage.getItem("user") == "admin" ?
                            adminRoutes.map((prop, key) => {
                                if (!prop.redirect)
                                    return (
                                        <li className={this.activeRoute(prop.path)} key={key}>
                                            <NavLink id={"sidebar_admin_"+prop.name} to={prop.path} className="nav-link" activeClassName="active">
                                                <i className={prop.icon} />
                                                <p>{prop.name}</p>
                                            </NavLink>
                                        </li>
                                    )
                                return null;
                            }) :
                            userRoutes.map((prop, key) => {
                                if (!prop.redirect)
                                    return (
                                        <li className={this.activeRoute(prop.path)} key={key}>
                                            <NavLink id={"sidebar_user_"+prop.name} to={prop.path} className="nav-link" activeClassName="active">
                                                <i className={prop.icon} />
                                                <p>{prop.name}</p>
                                            </NavLink>
                                        </li>
                                    )
                                return null;
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default Sidebar;
