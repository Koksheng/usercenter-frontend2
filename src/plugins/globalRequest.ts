import { message } from 'antd';
import { stringify } from 'querystring';
import {extend} from 'umi-request'

const request = extend({
    credentials: 'include',  //默认请求是否带上cookie
})

/**
 * 所以请求拦截器
 */
request.interceptors.request.use((url,options): any=> {
    console.log(`do request url ${url}`)
    return {
        url,
        options: {
            ...options,
            headers: {

            },
        },
    };
});

/**
 * 所有响应拦截器
 */
 request.interceptors.response.use(async (response, options): Promise<any> => {
    const res = await response.clone().json();
    console.log(`all response`);
    console.log(JSON.stringify(res, null, 2));
    if(res.code === 0){
        return res.data
    }
    if(res.code === 40100){
        message.error('请先登录');
        //@ts-ignore
        history.replace({
            pathname: '/user/login',
            search: stringify({
                redirect: location.pathname,
            }),
        });
    }
    else{
        message.error(res.description)
    }
    return res.data;
});
export default request;