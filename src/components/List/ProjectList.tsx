import * as React from 'react';
import { Button } from 'react-bootstrap';

function ProjectList(props: any) {
   return (
      <tr>
         <td>{props.index + 1}</td>
         <td>{props.project.projectname}</td>
         <td>{props.project.report.sessions ? props.project.report.sessions.length : 0}</td>
         <td>{props.project.report.completedPomodoros ? props.project.report.completedPomodoros : 0}</td>
         <td>
            <div className="operation-btn" onClick={props.edit_button}>
               <i className="pe-7s-note" />
            </div>
            <div className="operation-btn" onClick={props.delete_button}>
               <i className="pe-7s-trash" />
            </div>
         </td>
      </tr>
   );
}

export default ProjectList;
