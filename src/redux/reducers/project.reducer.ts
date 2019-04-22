import { projectConstants } from '../actionTypes/project.constant';
import _ from 'lodash';

export const project = (
  state = {
    isLoading: false,
    errMess: null,
    list: [],
    report: {}
  },
  action: any
) => {
  switch (action.type) {
    case projectConstants.GET_ALL_PROJECTS_SUCCESS: {
      return { ...state, list: action.payload };
    }

    case projectConstants.PROJECT_CREATE_SUCCESS: {
      let project = action.payload;
      return { ...state, list: state.list.concat(project) };
    }

    case projectConstants.PROJECT_CREATE_FAILED: {
      return { ...state, errMess: action.payload }
    }

    case projectConstants.PROJECT_UPDATE_SUCCESS: {
      let updated_list = _.map(state.list, (u) => {
        if (u.id == action.payload.id) {
          u.projectname = action.payload.projectname;
        }
        return u
      })
      return { ...state, list: updated_list }

    }

    case projectConstants.PROJECT_UPDATE_FAILED: {
      return { ...state, errMess: action.payload }
    }

    case projectConstants.PROJECT_DELETE_SUCCESS: {
      let updated_list = _.filter(state.list, function (p) {
        return p.id != action.payload.id;
      });
      return { ...state, list: updated_list };
    }

    case projectConstants.PROJECT_CLEAR_ERROR_MESSAGE: {
      return { ...state, errMess: null }
    }

    case projectConstants.GET_PROJECT_REPORT_SUCCESS: {
      return { ...state, report: action.payload }
    }

    default:
      return state;
  }
};
