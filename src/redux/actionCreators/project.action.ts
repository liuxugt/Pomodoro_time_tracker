import { projectConstants } from '../actionTypes/project.constant';
import { projectService } from '../../services/project.service';
import moment from 'moment';

export const fetchAllProjects = function (userId: number) {
   return async function (dispatch) {
      try {
         let body = {
            from: moment("1960-01-01T03:24:00").format('YYYY-MM-DDTHH:mmZ'),
            to: moment().format('YYYY-MM-DDTHH:mmZ'),
            // from: new Date('1960-01-01T03:24:00'),
            // to: new Date(),
            completedPomo: true,
            hoursWorked: true
         }
         let res: any = await projectService.getUserAllProjects(userId);
         let projectlist = res.data;

         let project_ids = projectlist.map(project => project.id);
         for (const id of project_ids) {
            let p = await projectService.getProjectReport(userId, id, body);
            projectlist.forEach(function (project) {
               if (project.id == id) {
                  project.report = p.data;
               }
            });
         }
         return dispatch(addAllProjects(projectlist));
      } catch (e) {
         console.log(e);
      }
   };
};

export const addAllProjects = (projects: any) => ({
   type: projectConstants.GET_ALL_PROJECTS_SUCCESS,
   payload: projects
});

export const addProject = (userId: number, projectname: string) => async dispatch => {
   try {
      let res = await projectService.addUserProject(userId, projectname);
      res.data.report = {}
      return dispatch(addProjectHelper(res.data));
   } catch (e) {
      console.log(e.message);
      dispatch(addProjectFail(e.message))
   }
};

export const addProjectHelper = project => {
   return {
      type: projectConstants.PROJECT_CREATE_SUCCESS,
      payload: project
   };
};


export const addProjectFail = status => ({
   type: projectConstants.PROJECT_CREATE_FAILED,
   payload: status
});


export const putProject = ({ projectname, userId, projectId }) => dispatch => {
   return projectService
      .putUserProject(userId, projectId, projectname)
      .then((res: any) => {
         dispatch(updateProject(res.data));
      })
      .catch(error => {
         console.log(error.message)
         dispatch(updateProjectFailed(error.message))
      })
}

export const updateProject = project => ({
   type: projectConstants.PROJECT_UPDATE_SUCCESS,
   payload: project
});

export const updateProjectFailed = error => ({
   type: projectConstants.PROJECT_UPDATE_FAILED,
   payload: error
});

export const deleteProject = (userId: number, projectId: number) => async dispatch => {
   try {
      let res = await projectService.deleteUserProject(userId, projectId);
      return dispatch(deleteProjectHelper(res.data));
   } catch (e) {
      console.log(e);
   }
};

export const deleteProjectHelper = project => {
   return {
      type: projectConstants.PROJECT_DELETE_SUCCESS,
      payload: project
   };
};

export const clearErrorMessage = function () {
   return async function (dispatch) {
      try {
         return dispatch({
            type: projectConstants.PROJECT_CLEAR_ERROR_MESSAGE
         });
      } catch (e) {
         console.log(e);
      }
   };
};

export const fetchProjectReport = (userId: number, projectId: number, body: any) => async dispatch => {
   try {
      let res = await projectService.getProjectReport(userId, projectId, body);
      return dispatch(fetchProjectReportHelper(res.data));
   } catch (e) {
      console.log(e);
   }
};

export const fetchProjectReportHelper = sessions => {
   return {
      type: projectConstants.GET_PROJECT_REPORT_SUCCESS,
      payload: sessions
   };
};