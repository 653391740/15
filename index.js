import { pass, name, customAlert } from './class.js'
import { request } from './utils.js'
const loginbtn = document.querySelector('#login')
let isanme = new name('input[placeholder="用户名"]', 3, 8);
let ispass = new pass('input[placeholder="密码"]', 6, 15);
isanme.dom.value = 'admin'
ispass.dom.value = '12345'
loginbtn.addEventListener('click', () => {
    const loginParams = {
        username: isanme.dom.value,
        password: ispass.dom.value
    }

    request({
        method: 'post',
        url: '/login',
        data: loginParams,
        success: (res) => {
            console.log('登录成功', res)
            if (res.meta.status === 200) {
                localStorage.setItem('token', res.data.token)
                window.location.href = './home.html?customAlert=true'
            } else {
                new customAlert('alert-danger', res.meta.msg);
            }
        },
        error: (status, statusText) => {
            console.log('请求失败', status, statusText)
        }
    })
})

