import axios from 'axios';

const serverUrl = 'http://10.0.2.2:4000/api/v1';
export const login = (email, password) => async dispatch => {
  try {
    dispatch({type: 'loginRequest'});

    const config = {header: {'Content-Type': 'application/json'}};

    const {data} = await axios.post(`${serverUrl}/login`, {email, password}, config);

    dispatch({type: 'loginSuccess', payload: data});
  } catch (error) {
    dispatch({type: 'loginFailure', payload: error.response.data.message});
  }
};

export const loadUser = () => async dispatch => {
  try {
    dispatch({type: 'loadUserRequest'});

    const {data} = await axios.get(`${serverUrl}/me`);

    dispatch({type: 'loadUserSuccess', payload: data});
  } catch (error) {
    dispatch({type: 'loadUserFailure', payload: error.response.data.message});
  }
};

export const addTask = (title, description) => async dispatch => {
  try {
    dispatch({type: 'addTaskRequest'});

    const config = {header: {'Content-Type': 'application/json'}};

    const {data} = await axios.post(
      `${serverUrl}/newtask`,
      {title, description},
      config,
    );

    dispatch({type: 'addTaskSuccess', payload: data.message});
  } catch (error) {
    dispatch({type: 'addTaskFailure', payload: error.response.data.message});
  }
};

export const updateTask = taskId => async dispatch => {
  try {
    dispatch({type: 'updateTaskRequest'});

    const {data} = await axios.get(`${serverUrl}/task/${taskId}`);

    dispatch({type: 'updateTaskSuccess', payload: data.message});
  } catch (error) {
    dispatch({type: 'updateTaskFailure', payload: error.response.data.message});
  }
};

export const deleteTask = taskId => async dispatch => {
  try {
    dispatch({type: 'deleteTaskRequest'});

    const {data} = await axios.delete(`${serverUrl}/task/${taskId}`);

    dispatch({type: 'deleteTaskSuccess', payload: data.message});
  } catch (error) {
    dispatch({type: 'deleteTaskFailure', payload: error.response.data.message});
  }
};

export const updateProfile = formData => async dispatch => {
  try {
    dispatch({type: 'updateProfileRequest'});

    const config = {headers: {'Content-Type': 'multipart/form-data'}};

    const {data} = await axios.put(`${serverUrl}/updateprofile`, formData, config);

    dispatch({type: 'updateProfileSuccess', payload: data.message});
  } catch (error) {
    dispatch({
      type: 'updateProfileFailure',
      payload: error.response.data.message,
    });
  }
};

export const logout = () => async dispatch => {
  try {
    dispatch({type: 'logoutRequest'});

    await axios.get(`${serverUrl}/logout`);

    dispatch({type: 'logoutSuccess'});
  } catch (error) {
    dispatch({type: 'logoutFailure', payload: error.response.data.message});
  }
};

export const register = formData => async dispatch => {
  try {
    dispatch({type: 'registerRequest'});
   
    const config = {headers: {'Content-Type': 'multipart/form-data'}};
   
    const {data} = await axios.post(`${serverUrl}/register`, formData, config);
   
    dispatch({type: 'registerSuccess', payload: data});
  } catch (error) {
    dispatch({
      type: 'registerFailure',
      payload: error.response.data.message,
    });
  }
};

export const updatePassword =
  (oldPassword, newPassword, confirmPassword) => async dispatch => {
    try {
      dispatch({type: 'updatePasswordRequest'});

      const config = {headers: {'Content-Type': 'application/json'}};

      const {data} = await axios.put(
        `${serverUrl}/updatepassword`,
        {oldPassword, newPassword, confirmPassword},
        config,
      );

      dispatch({type: 'updatePasswordSuccess', payload: data.message});
    } catch (error) {
      dispatch({
        type: 'updatePasswordFailure',
        payload: error.response.data.message,
      });
    }
  };

export const verify = otp => async dispatch => {
  try {
    dispatch({type: 'verificationRequest'});
    const config = {headers: {'Content-Type': 'application/json'}};

    const {data} = await axios.post(`${serverUrl}/verify`, {otp}, config);

    dispatch({type: 'verificationSuccess', payload: data.message});
  } catch (error) {
    dispatch({
      type: 'verificationFailure',
      payload: error.response.data.message,
    });
  }
};

export const forgetPassword = email => async dispatch => {
  try {
    dispatch({type: 'forgetPasswordRequest'});

    const config = {headers: {'Content-Type': 'application/json'}};

    const {data} = await axios.post(`${serverUrl}/forgetpassword`, {email}, config);

    dispatch({type: 'forgetPasswordSuccess', payload: data.message});
  } catch (error) {
    dispatch({
      type: 'forgetPasswordFailure',
      payload: error.response.data.message,
    });
  }
};

export const resetPassword =
  (otp, newPassword, confirmPassword) => async dispatch => {
    try {
      dispatch({type: 'resetPasswordRequest'});

      const config = {headers: {'Content-Type': 'application/json'}};

      const {data} = await axios.put(
        `${serverUrl}/resetpassword`,
        {otp, newPassword, confirmPassword},
        config,
      );

      dispatch({type: 'resetPasswordSuccess', payload: data.message});
    } catch (error) {
      dispatch({
        type: 'resetPasswordFailure',
        payload: error.response.data.message,
      });
    }
  };
