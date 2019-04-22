import * as React from 'react';
import { Button } from 'react-bootstrap';

function UserList(props: any) {
  return (
    <tr id={'record' + (props.index + 1)}>
      <td>{props.index + 1}</td>
      <td>{props.user.firstName}</td>
      <td>{props.user.lastName}</td>
      <td>{props.user.email}</td>
      <td>{props.user.related_projects ? props.user.related_projects.length : 0}</td>
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

export default UserList;
