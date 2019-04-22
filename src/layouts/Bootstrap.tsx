import * as React from "react";
import ReactCanvasNest from "react-canvas-nest";
import { Alert } from "react-bootstrap";

import { history } from "./../helpers/history";
import { connect } from "react-redux";
import { alertActions } from "../redux/actionCreators/alert.action"

import Login from "./../views/Login";

class Bootstrap extends React.Component {
    constructor(props) {
        super(props);

        //@ts-ignore
        const { dispatch } = this.props;
        history.listen((location, action) => {
            dispatch(alertActions.clear());
        });
    }
    render() {
        //@ts-ignore
        const { alert } = this.props;
        return (
            <div className="login-container">
                <ReactCanvasNest className='canvasNest' config={{ count: 100, pointColor: ' 255, 255, 255 ', lineColor: '0, 0, 0', follow: false }} />
                {alert.message && <Alert className="alert" variant="danger">{alert.message}</Alert>}
                <div className="login-wrapper">
                    <Login />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { alert } = state;
    return {
        alert
    };
}


export default connect(mapStateToProps)(Bootstrap);