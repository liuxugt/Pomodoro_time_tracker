import * as React from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import Card from '../components/Card/Card';

import { connect } from 'react-redux';
import moment from 'moment';
import { fetchAllProjects, clearErrorMessage } from '../redux/actionCreators/project.action';

import { sessionService } from '../services/session.service';

import OptionList from '../components/List/OptionList';

import working1 from './../assets/img/working1.svg';
import working2 from './../assets/img/working2.svg';
import chill1 from './../assets/img/chill1.svg';
import chill2 from './../assets/img/chill2.svg';

const imgs = [working1, working2, chill1, chill2];

const mapStateToProps = (state: any) => {
    return {
        projectlist: state.project.list,
        projectErrMess: state.project.errMess
    };
};

const mapDispatchToProps = dispatch => ({
    fetchAllProjects: userId => {
        dispatch(fetchAllProjects(userId));
    },
    clearErrorMessage: () => {
        dispatch(clearErrorMessage());
    }
});

interface Props {
    projectlist: any,
    projectErrMess: any,
    fetchAllProjects: any,
    clearErrorMessage: any
};

interface State {
    minutes: number,
    seconds: number,
    hours: number,
    total_seconds: number,
    associated_id: number,
    active_session_id: number,
    /*
    set_minutes: number,
    set_seconds: number,
    set_hours: number,

    break_minutes: number,
    break_seconds: number,
    break_hours: number,
    */

    start_time: string,
    end_time: string,
    //total_hours: number,

    create_show: boolean,
    continue_show: boolean,
    stop_show: boolean,
    ask_show: boolean,
    active: boolean,
    counter: number,
    is_break: boolean,

    error_message: any
};

class Pomodoro extends React.Component<Props, State>{
    private curImg: React.RefObject<HTMLImageElement>;
    //-----------------------------------
    //Three functions for modals to create new pomodoro
    CreateModal() {
        return <Modal id="create_modal" show={this.state.create_show} onHide={this.CreateModalClose}>
            <Modal.Header closeButton>
                <Modal.Title>Set Time for Pomodoro</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <Button id="create_hour_minus_one" variant="outline-primary" onClick={() => { this.MinusButton(2); }}>-1 </Button>
                        <input
                            id="create_hours"
                            className="time-input"
                            value={this.state.hours}
                            onChange={(e: any) => {
                                this.setState({ hours: e.target.value % 24 });
                            }}
                        />
                        <Button id="create_hour_plus_one" variant="outline-primary" onClick={() => { this.PlusButton(2); }}>+1 </Button>
                    </Col>
                    <Col>
                        <span>hour(s)</span>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button id="create_minute_minus_ten" variant="outline-primary" onClick={() => { this.MinusButton(1); }}>-10</Button>
                        <input
                            id="create_minutes"
                            className="time-input"
                            value={this.state.minutes}
                            onChange={(e: any) => {
                                this.setState({ minutes: e.target.value % 60 });
                            }}
                        />
                        <Button id="create_minute_plus_ten" variant="outline-primary" onClick={() => { this.PlusButton(1); }}>+10</Button>
                    </Col>
                    <Col>
                        <span>minute(s)</span>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button id="create_second_minus_ten" variant="outline-primary" onClick={() => { this.MinusButton(0); }}>-10</Button>
                        <input
                            id="create_second"
                            className="time-input"
                            value={this.state.seconds}
                            onChange={(e: any) => {
                                this.setState({ seconds: e.target.value % 60 });
                            }}
                        />
                        <Button id="create_second_plus_ten" variant="outline-primary" onClick={() => { this.PlusButton(0); }}>+10</Button>
                    </Col>
                    <Col>
                        <span>second(s)</span>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <select id="project_select_box" value={this.state.associated_id} onChange={this.ChangeSelect} >
                            <option value={-1}>No association</option>
                            {this.props.projectlist.map((project: any, index: number) => {
                                return (
                                    <OptionList project={project} key={index} />
                                );
                            })}
                        </select>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button id="create_cancel_button" variant="secondary" onClick={this.CreateCancel}>
                    Cancel
                </Button>
                <Button id="create_confirm_button" variant="primary" onClick={this.CreateSubmit}
                    disabled={this.state.hours == 0 && this.state.minutes == 0 && this.state.seconds == 0}>
                    Start
                </Button>
            </Modal.Footer>
        </Modal>
    }

    CreateModalShow() {
        this.setState({
            create_show: true
        });
    }

    CreateModalClose() {
        this.setState({
            create_show: false,
        });
    }

    //-----------------------------------
    //Three functions representing the action of user on create modal
    CreateSubmit() {
        var time = moment().format('YYYY-MM-DDTHH:mmZ');
        this.setState({
            start_time: time,
            end_time: time
        })
        if (this.state.associated_id != -1) {
            this.CreateSession(time);
        }
        this.CreatePomodoro();
        this.CreateModalClose();
    }
    CreateCancel() {
        this.TimeClear();
        this.CreateModalClose();
    }
    ChangeSelect(e: any) {
        this.setState({
            associated_id: e.target.value
        })
    }
    //-----------------------------------
    //Confirm the mode for next step, keep working or working or taking a break
    AskModal() {
        return (
            <Modal id="ask_modal" show={this.state.ask_show}>
                <Modal.Header>
                    <Modal.Title>Select Next Activity</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col><strong># of pomodoro completed:</strong></Col>
                        <Col>{this.state.counter}</Col>
                    </Row>
                    <Row>
                        <Col><strong>Session Start time:</strong></Col>
                        <Col>{moment(this.state.start_time).format('YYYY-MM-DD HH:mm')}</Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button id="decide_work" variant="primary" onClick={() => {
                        this.ContinueModalShow();
                        this.AskModalClose();
                    }}>
                        Start a new pomodoro
                    </Button>
                    <Button id="decide_break" variant="success" onClick={() => {
                        this.setState({
                            is_break: true,
                        });
                        this.ContinueModalShow();
                        this.AskModalClose();
                    }}>
                        Take a break
                    </Button>
                    <Button id="decide_stop" variant="danger" onClick={() => {
                        this.ContinueOver();
                        this.AskModalClose();
                    }}>
                        Stop the session
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    AskModalShow() {
        this.setState({
            ask_show: true,
        });
    }

    AskModalClose() {
        this.setState({
            ask_show: false,
        });
    }

    //-----------------------------------
    //Four functions to continues create new pomodoros when one is completed
    ContinueModal() {
        return (
            <Modal id="continue_modal" show={this.state.continue_show} onHide={this.ContinueOver}>
                <Modal.Header closeButton>
                    <Modal.Title>Set Time for {this.state.is_break ? "Break" : "Pomodoro"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Button id="continue_hour_minus_one" variant="outline-primary" onClick={() => { this.MinusButton(2) }}>-1 </Button>
                            <input
                                id="continue_hours"
                                className="time-input"
                                value={this.state.hours}
                                onChange={(e: any) => {
                                    this.setState({ hours: e.target.value % 100 });
                                }}
                            />
                            <Button id="continue_hour_plus_one" variant="outline-primary" onClick={() => { this.PlusButton(2); }}>+1 </Button>
                        </Col>
                        <Col>
                            <span>hour(s)</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button id="continue_minute_minus_ten" variant="outline-primary" onClick={() => { this.MinusButton(1); }}>-10</Button>
                            <input
                                id="continue_minutes"
                                className="time-input"
                                value={this.state.minutes}
                                onChange={(e: any) => {
                                    this.setState({ minutes: e.target.value % 100 });
                                }}
                            />
                            <Button id="continue_minute_plus_ten" variant="outline-primary" onClick={() => { this.PlusButton(1); }}>+10</Button>
                        </Col>
                        <Col>
                            <span>minute(s)</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button id="continue_second_minus_ten" variant="outline-primary" onClick={() => { this.MinusButton(0); }}>-10</Button>
                            <input
                                id="continue_second"
                                className="time-input"
                                value={this.state.seconds}
                                onChange={(e: any) => {
                                    this.setState({ seconds: e.target.value % 100 });
                                }}
                            />
                            <Button id="continue_second_plus_ten" variant="outline-primary" onClick={() => { this.PlusButton(0); }}>+10</Button>
                        </Col>
                        <Col>
                            <span>second(s)</span>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button id="continue_cancel_button" variant="secondary" onClick={(this.ContinueOver)}>
                        Cancel
                    </Button>
                    <Button id="continue_confirm_button" variant="primary" onClick={this.Continue} disabled={this.state.hours == 0 && this.state.minutes == 0 && this.state.seconds == 0}>
                        Start
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
    ContinueModalShow() {
        this.setState({
            continue_show: true
        });
    }

    ContinueModalClose() {
        this.setState({
            continue_show: false
        })
    }

    //-----------------------------------
    //two functions representing two actions user chooses
    Continue() {
        this.ContinueModalClose();
        this.CreatePomodoro();
    }

    ContinueOver() {
        this.ContinueModalClose();
        if (this.state.associated_id != -1) {
            this.UpdateSession();
        }
        this.TimeClear();
        this.StopSession();
        //console.log(this.state.associated_id);
    }

    //--------------------------------
    //Three functions to control the stop modalx
    StopModal() {
        return (
            <Modal id="stop_modal" show={this.state.stop_show} onHide={this.StopModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>End Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col><strong># of pomodoro completed: </strong></Col>
                        <Col>{this.state.counter}</Col>
                    </Row>
                    <Row>
                        <Col><strong>Session Start time: </strong></Col>
                        <Col>{moment(this.state.start_time).format('YYYY-MM-DD HH:mm')}</Col>
                    </Row>
                    <div className="confirm-msg">
                        <p style={{ color: 'red' }}>
                            You can going to end the session.
                        </p>
                        <p>Are you going to include the runtime of current incomplete pomodoro?</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        id="stop_cancel_button"
                        onClick={this.StopCancel}
                        variant="secondary">
                        No
                    </Button>
                    <Button
                        id="stop_confirm_button"
                        onClick={this.StopConfirm}
                        variant="primary">
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
    StopModalShow() {
        this.setState({
            stop_show: true
        })
    }

    StopModalClose() {
        this.setState({
            stop_show: false
        })
    }


    //-----------------------------------
    //Two functions representing different action of user in StopModal
    StopCancel() {
        this.StopModalClose();
        if (this.state.associated_id != -1) {
            this.UpdateSession();
        }
        this.TimeClear();
        //@ts-ignore
        clearInterval(this.interval);
        this.StopSession();
    }

    StopConfirm() {
        this.StopModalClose();
        var time = moment().format('YYYY-MM-DDTHH:mmZ');
        this.setState({
            end_time: time,
            counter: this.state.counter + 1
        }, () => {
            if (this.state.associated_id != -1) {
                this.UpdateSession();
            }
            this.TimeClear();
            //@ts-ignore
            clearInterval(this.interval);
            this.StopSession();
        });
    }
    //-----------------------------------
    //Functions for the action of buttons beside each text field
    MinusButton(mode: number) {
        var temp_seconds = this.state.seconds;
        var temp_minutes = this.state.minutes;
        var temp_hours = this.state.hours;
        switch (mode) {
            case 0:
                if (temp_seconds <= 10) {
                    temp_seconds = 0;
                }
                else {
                    temp_seconds -= 10;
                }
                break;
            case 1:
                if (temp_minutes <= 10) {
                    temp_minutes = 0;
                }
                else {
                    temp_minutes -= 10;
                }
                break;
            case 2:
                if (temp_hours != 0) {
                    temp_hours -= 1;
                }
                break;
            default:
                break;
        }
        this.setState({
            seconds: temp_seconds,
            minutes: temp_minutes,
            hours: temp_hours,
        });
    }

    PlusButton(mode: number) {
        var temp_seconds = this.state.seconds;
        var temp_minutes = this.state.minutes;
        var temp_hours = this.state.hours;
        switch (mode) {
            case 0:
                if (temp_seconds >= 50) {
                    temp_seconds -= 50;
                    temp_minutes += 1;
                    if (temp_minutes >= 60) {
                        temp_minutes -= 60;
                        temp_hours = (temp_hours == 99) ? 99 : temp_hours + 1;
                    }
                }
                else {
                    temp_seconds += 10;
                }
                break;
            case 1:
                if (temp_minutes >= 50) {
                    temp_minutes -= 50;
                    temp_hours = (temp_hours == 99) ? 99 : temp_hours + 1;
                }
                else {
                    temp_minutes += 10;
                }
                break;
            case 2:
                if (temp_hours != 99) {
                    temp_hours += 1;
                }
                break;
            default:
                break;
        }
        this.setState({
            seconds: temp_seconds,
            minutes: temp_minutes,
            hours: temp_hours,
        });
    }

    //-----------------------------------
    //functions for the modal to represent the error in HTTP Request
    ProjectErrorModal() {
        return (
            <Modal show={this.props.projectErrMess != null} onHide={this.ProjectErrorModalClose}>
                <Modal.Header>
                    Error happened in fetching all projects
                </Modal.Header>
                <Modal.Body>
                    {this.props.projectErrMess}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        id="project_error_button"
                        variant="primary"
                        onClick={this.ProjectErrorModalClose}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    ProjectErrorModalClose() {
        this.props.clearErrorMessage();
    }

    PomodoroErrorModal() {
        return (
            <Modal show={this.state.error_message != null} onHide={this.PomodoroErrorModalClose}>
                <Modal.Header>
                    There is an error in pomodoro part
                </Modal.Header>

                <Modal.Body>
                    {this.state.error_message}
                </Modal.Body>

                <Modal.Footer>
                    <Button id="pomodoro_error_button" onClick={this.PomodoroErrorModalClose} variant="primary">
                        Ok
                    </Button>
                </Modal.Footer>

            </Modal>
        )
    }

    PomodoroErrorModalClose() {
        this.setState({
            error_message: null
        })
    }

    //-----------------------------------
    //Three functions for tracking time
    TimeClear() {
        this.setState({
            hours: 0,
            minutes: 0,
            seconds: 0,

            total_seconds: 0,
        });
    }

    StopSession() {
        this.setState({
            active: false,
            is_break: false,
            counter: 0,
            start_time: "",
            end_time: ""
        })
    }

    CreatePomodoro() {
        var temp_seconds = this.state.seconds;
        var temp_minutes = this.state.minutes;
        var temp_hours = this.state.hours;
        if (temp_seconds >= 60) {
            temp_seconds -= 60;
            temp_minutes += 1;
        }
        if (temp_minutes >= 60) {
            temp_minutes -= 60;
            temp_hours += 1;
        }
        this.setState({
            active: true,
            total_seconds: temp_hours * 3600 + temp_minutes * 60 + temp_seconds,
            hours: temp_hours,
            minutes: temp_minutes,
            seconds: temp_seconds,
        });

        //@ts-ignore
        this.interval = setInterval(this.Countdown, 1000);
    }

    Countdown() {
        if (this.state.active) {
            var seconds = this.state.seconds;
            var minutes = this.state.minutes;
            var hours = this.state.hours;
            var total_seconds = this.state.total_seconds;
            seconds--;
            total_seconds--;
            //console.log("here");
            if (seconds < 0) {
                seconds += 60;
                minutes -= 1;
            }
            if (minutes < 0) {
                minutes += 60;
                hours -= 1;
            }
            this.setState({
                seconds: seconds,
                hours: hours,
                minutes: minutes,
                total_seconds: total_seconds
            });
            if (total_seconds <= 0) {
                //@ts-ignore
                clearInterval(this.interval);
                var time = moment().format('YYYY-MM-DDTHH:mmZ');
                if (this.state.is_break) {
                    this.setState({
                        end_time: time,
                        active: false,
                        is_break: false,
                    })
                }
                else {
                    this.setState({
                        end_time: time,
                        counter: this.state.counter + 1,
                        active: false,
                        is_break: false
                    });
                }
                this.AskModalShow();
            }
        }
    }

    //Two actions that will deal with API
    CreateSession(time: any) {
        sessionService.addUserProjectSession(Number(localStorage.getItem('id')), this.state.associated_id, time).then((res) => {
            this.setState({
                active_session_id: res.data.id,
                counter: 0
            });
        })
            .catch((error) => {
                console.log(error.message)
                this.setState({
                    error_message: error.message
                })
            })
    }

    UpdateSession() {
        sessionService.updateUserProjectSession(Number(localStorage.getItem('id')), this.state.associated_id, this.state.active_session_id, this.state.start_time, this.state.end_time, this.state.counter)
            .then((res) => {
                console.log(res.data);
            })
            .catch((error) => {
                console.log(error.message)
                this.setState({
                    error_message: error.message
                })
            });
    }

    dance() {
        if (this.curImg.current) {
            let paths = this.curImg.current.src.split('/');
            let image = paths[paths.length - 1];
            if (image === imgs[0].split('/')[imgs[0].split('/').length - 1])
                this.curImg.current.src = imgs[1]
            if (image === imgs[1].split('/')[imgs[1].split('/').length - 1])
                this.curImg.current.src = imgs[0]
            if (image === imgs[2].split('/')[imgs[2].split('/').length - 1])
                this.curImg.current.src = imgs[3]
            if (image === imgs[3].split('/')[imgs[3].split('/').length - 1])
                this.curImg.current.src = imgs[2]
        }
    }

    constructor(props: Props) {
        super(props);
        this.CreateModal = this.CreateModal.bind(this);
        this.CreateModalClose = this.CreateModalClose.bind(this);
        this.CreateModalShow = this.CreateModalShow.bind(this);
        this.ChangeSelect = this.ChangeSelect.bind(this);
        this.CreateSubmit = this.CreateSubmit.bind(this);
        this.CreateCancel = this.CreateCancel.bind(this);

        this.ContinueModal = this.ContinueModal.bind(this);
        this.ContinueModalShow = this.ContinueModalShow.bind(this);
        this.ContinueModalClose = this.ContinueModalClose.bind(this);

        this.Continue = this.Continue.bind(this);
        this.ContinueOver = this.ContinueOver.bind(this);
        this.AskModal = this.AskModal.bind(this);
        this.AskModalShow = this.AskModalShow.bind(this);
        this.AskModalClose = this.AskModalClose.bind(this);

        this.StopModal = this.StopModal.bind(this);
        this.StopModalShow = this.StopModalShow.bind(this);
        this.StopModalClose = this.StopModalClose.bind(this);

        this.StopConfirm = this.StopConfirm.bind(this);
        this.StopCancel = this.StopCancel.bind(this);

        this.UpdateSession = this.UpdateSession.bind(this);
        this.CreateSession = this.CreateSession.bind(this);

        this.PlusButton = this.PlusButton.bind(this);
        this.MinusButton = this.MinusButton.bind(this);

        this.TimeClear = this.TimeClear.bind(this);
        this.CreatePomodoro = this.CreatePomodoro.bind(this);
        this.Countdown = this.Countdown.bind(this);
        this.StopSession = this.StopSession.bind(this);

        this.ProjectErrorModal = this.ProjectErrorModal.bind(this);
        this.ProjectErrorModalClose = this.ProjectErrorModalClose.bind(this);
        this.PomodoroErrorModal = this.PomodoroErrorModal.bind(this);
        this.PomodoroErrorModalClose = this.PomodoroErrorModalClose.bind(this);

        this.dance = this.dance.bind(this)

        this.state = {
            seconds: 0,
            minutes: 0,
            hours: 0,
            total_seconds: 0,
            associated_id: -1,
            active_session_id: -1,
            start_time: "",
            end_time: "",
            //total_hours: 0,

            create_show: false,
            continue_show: false,
            stop_show: false,
            ask_show: false,
            active: false,
            counter: 0,
            is_break: false,

            error_message: null
        };
        //@ts-ignore
        this.interval;

        this.curImg = React.createRef();

    }

    componentDidMount() {
        this.props.fetchAllProjects(Number(localStorage.getItem('id')));
        setInterval(this.dance, 1000)
    }

    render() {
        return (
            <div className="content">
                <Container fluid>
                    <Card
                        title="Pomodoro Timer"
                        icon="pe-7s-stopwatch"
                        hCenter={true}
                        ctTableFullWidth
                        ctTableResponsive
                        content={
                            <div className="card-content flex">
                                <div className="button-row">
                                    <div className="btn-container col-md-4">
                                        <Button
                                            id="create_pomodoro_button"
                                            variant="primary"
                                            onClick={this.CreateModalShow}
                                            disabled={this.state.active}
                                            className="col">
                                            Start new pomodoro session
                                                </Button>
                                    </div>
                                    <div className="btn-container col-md-4">
                                        <Button
                                            id="stop_pomodoro_button"
                                            onClick={this.StopModalShow}
                                            variant="danger"
                                            disabled={!this.state.active}
                                            className="col">
                                            End pomodoro and session
                                                </Button>
                                    </div>
                                </div>
                                <div className="img-container">
                                    {
                                        !this.state.active || this.state.active && !this.state.is_break ?
                                            <img src={imgs[0]} ref={this.curImg} /> :
                                            <img src={imgs[2]} ref={this.curImg} />
                                    }
                                </div>
                                <div className="timer-container">
                                    <div style={{ fontSize: "64px", textAlign: "center" }}>
                                        {("0" + this.state.hours.toString()).slice(-2)} : {("0" + this.state.minutes.toString()).slice(-2)} : {("0" + this.state.seconds.toString()).slice(-2)}
                                        {this.state.active}
                                    </div>
                                </div>
                            </div>
                        }
                    />
                </Container>
                <this.CreateModal></this.CreateModal>
                <this.AskModal></this.AskModal>
                <this.ContinueModal></this.ContinueModal>
                <this.StopModal></this.StopModal>
                <this.ProjectErrorModal></this.ProjectErrorModal>
                <this.PomodoroErrorModal></this.PomodoroErrorModal>
            </div>
        )
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Pomodoro);