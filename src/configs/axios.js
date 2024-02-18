import axios from 'axios';

export const axiosWithoutCredentials = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export const axiosWithCredentials = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});
axiosWithCredentials.defaults.withCredentials = true;

axiosWithCredentials.interceptors.request.use((config) => {
    const access_token = sessionStorage.getItem('p_access_token');
    config.headers.Authorization = access_token ? `Bearer ${access_token}` : '';
    return config;
});

axiosWithCredentials.interceptors.response.use(
    (response) => response,
    (error) => {
        // Reject promise if usual error
        if (error.response.status !== 401) {
            return Promise.reject(error);
        }

        /*
         * When response code is 401, try to refresh the token.
         * Eject the interceptor so it doesn't loop in case
         * token refresh causes the 401 response.
         *
         * Must be re-attached later on or the token refresh will only happen once
         */
        // axiosWithCredentials.interceptors.response.eject(interceptor);

        var cleanAxios = axios.create({
            baseURL: import.meta.env.VITE_API_URL,
            headers: {
                "Content-Type": "application/json"
            }
        });
        return cleanAxios.get("/auth/portal/refresh", { withCredentials: true, params: { token: sessionStorage.getItem('p_refresh_token')} })
            .then((response) => {
                // Retry the initial call, but with the updated token in the headers. 
                // Resolves the promise if successful
                return axios(error.response.config);
            })
            .catch((error2) => {
                //ToDo Navigate with paramter to display session timeout message
                // window.location.href = "/"
                return Promise.reject(error2);
            })
    }
);

export const axiosWithSimpleCredentials = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});
axiosWithSimpleCredentials.defaults.withCredentials = true;