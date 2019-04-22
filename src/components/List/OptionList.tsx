import * as React from 'react';

function OptionList(props: any){
    return (<option value={props.project.id}> {props.project.projectname} </option>)
}

export default OptionList;