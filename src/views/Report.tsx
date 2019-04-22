import * as React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Form, Button, Table, Modal, Alert } from 'react-bootstrap';
import Card from '../components/Card/Card';
import { fetchAllProjects, fetchProjectReport } from '../redux/actionCreators/project.action';
import OptionList from '../components/List/OptionList';
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment';
import DateTimePicker from 'react-widgets/lib/DateTimePicker';
import "react-widgets/dist/css/react-widgets.css"
import { start } from 'repl';
moment.locale('en')
momentLocalizer()

const mapStateToProps = (state: any) => {
   return {
      projectlist: state.project.list,
      report: state.project.report
   };
};

const mapDispatchToProps = dispatch => ({
   fetchAllProjects: userId => {
      dispatch(fetchAllProjects(userId));
   },

   fetchProjectReport: (userId: number, projectId: number, body: any) => {
      dispatch(fetchProjectReport(userId, projectId, body))
   }
});

interface Props {
   projectlist: any
   fetchAllProjects: any;
   fetchProjectReport: any;
   report: any;
};

interface State {
   from: any,
   to: any,
   selected_projectId: number,
   userId: number
   includeCP: boolean,
   includeHW: boolean,
   showModal: boolean,
   showWarning: boolean
};

class Report extends React.Component<Props, State>{
   constructor(props: any) {
      super(props);
      this.ChangeSelect = this.ChangeSelect.bind(this);
      this.ReportModal = this.ReportModal.bind(this);
      this.state = {
         from: new Date(),
         to: new Date(),
         selected_projectId: -1,
         userId: Number(localStorage.getItem('id')),
         includeCP: true,
         includeHW: true,
         showModal: false,
         showWarning: false
      };

   }
   componentDidMount() {
      this.props.fetchAllProjects(Number(localStorage.getItem('id')));
   }
   ChangeSelect(e: any) {
      this.setState({
         selected_projectId: e.target.value
      })
   }

   ReportModal() {
      if (Object.keys(this.props.report).length > 0) {
         return (
            <Modal id="report_modal" show={this.state.showModal}
               onHide={() => this.setState({ showModal: !this.state.showModal })}
               size="lg">
               <Modal.Header closeButton>
                  <Modal.Title>Report</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  {this.state.includeCP && this.props.report.sessions.length > 0
                     ? <p><strong>Total Pomodoros Completed</strong>: {this.props.report.completedPomodoros}</p>
                     : null
                  }

                  {this.state.includeHW && this.props.report.sessions.length > 0

                     ? <p><strong>Total Hours Worked</strong>: {this.props.report.totalHoursWorkedOnProject.toFixed(5)}</p>
                     : null
                  }
                  {this.props.report.sessions.length > 0
                     ?
                     <Table striped>
                        <thead>
                           <tr>
                              <th>No.</th>
                              <th>Start Time</th>
                              <th>End Time</th>
                              <th>Hours Worked</th>
                           </tr>
                        </thead>
                        <tbody>

                           {this.props.report.sessions.map((r: any, index: number) => {
                              return (
                                 <tr key={index + 1}>
                                    <td>{index + 1}</td>
                                    <td>{moment(r.startingTime).format('YYYY-MM-DD HH:mm')}</td>
                                    <td>{moment(r.endingTime).format('YYYY-MM-DD HH:mm')}</td>
                                    <td>{r.hoursWorked.toFixed(5)}</td>
                                 </tr>
                              );
                           })}
                        </tbody>
                     </Table>
                     : <p><strong>No sessions found for the project in the provided timeframe. Please try a different time range.</strong></p>}
               </Modal.Body>
               <Modal.Footer>
                  <Button variant="primary" onClick={() => this.setState({ showModal: !this.state.showModal })}>
                     Ok
                  </Button>
               </Modal.Footer>
            </Modal>

         );
      } else {
         return <div />;
      }

   }

   getReport() {
      let body = {
         from: moment(this.state.from).format("YYYY-MM-DDTHH:mmZ"),
         to: moment(this.state.to).format("YYYY-MM-DDTHH:mmZ"),
         completedPomo: this.state.includeCP,
         hoursWorked: this.state.includeHW
      }
      if (this.state.selected_projectId != -1) {
         this.props.fetchProjectReport(this.state.userId, this.state.selected_projectId, body);
         this.setState({ showModal: true })
         this.setState({ showWarning: false })
      } else {
         this.setState({ showWarning: true })
      }

   }

   render() {
      return (
         <div className="content">
            <Container fluid>
               <Card
                  title="Get Report"
                  icon="pe-7s-display1"
                  hCenter={true}
                  ctTableFullWidth
                  ctTableResponsive
                  content={
                     <div className="card-content">
                        <div className="report-title">
                           <h4>Please fill out the report details below.</h4>
                        </div>
                        <div className="form-container">
                           <Form>
                              <Form.Row>
                                 <Form.Group as={Col} controlId="from_date">
                                    <Form.Label>From</Form.Label>
                                    <DateTimePicker
                                       value={this.state.from}
                                       max={new Date()}
                                       onChange={value => {
                                          this.setState({ from: value })
                                       }}
                                    />
                                 </Form.Group>
                                 <Form.Group as={Col} controlId="to_date">
                                    <Form.Label>To</Form.Label>
                                    <DateTimePicker
                                       value={this.state.to}
                                       max={new Date()}
                                       min={this.state.from}
                                       onChange={value => this.setState({ to: value })}
                                    />
                                 </Form.Group>
                              </Form.Row>
                              <Form.Group>
                                 <Form.Label>Select Project</Form.Label>
                                 <Form.Control id="select_project" as="select" onChange={this.ChangeSelect}>
                                    <option value={-1}>Select Project</option>
                                    {this.props.projectlist.map((project: any, index: number) => {
                                       return (
                                          <OptionList key={index} project={project} />
                                       );
                                    })}
                                 </Form.Control>
                              </Form.Group>
                              <Form.Group as={Col} controlId="hourswoked">
                                 <Form.Check type="checkbox" label="Included total hours worked" checked={this.state.includeHW}
                                    onChange={() => this.setState({ includeHW: !this.state.includeHW })} />
                              </Form.Group>
                              <Form.Group as={Col} controlId="completedpomo">
                                 <Form.Check type="checkbox" label="Included completed pomodoros" checked={this.state.includeCP}
                                    onChange={() => {
                                       this.setState({ includeCP: !this.state.includeCP })
                                    }} />
                              </Form.Group>
                              <Form.Row className="btn-container">
                                 <Button id="get_report" variant="primary" onClick={() => this.getReport()}>
                                    Get Report
                                       </Button>
                              </Form.Row>
                           </Form>
                           <br></br>
                           <Alert variant="warning" show={this.state.showWarning} onClose={() => this.setState({ showWarning: !this.state.showWarning })}>
                              You need to select a project to view report!
                                 </Alert>
                        </div>
                     </div>
                  }
               />
            </Container>

            < this.ReportModal />
         </div>

      )
   }
}

export default connect(
   mapStateToProps,
   mapDispatchToProps
)(Report);