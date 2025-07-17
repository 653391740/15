import { customAlert, addname, addpass, addemail, addphone } from './class.js'
import { request } from './utils.js'
const togglebtn = document.querySelector('.togglew')
const toggleMenu = document.querySelector('.my-menu')
const conatiner = document.querySelector('.conatiner')
const welcomebtn = document.querySelector('#welcome')
const modal = document.querySelector('.modal')
const close = document.querySelector('.clo')
const re = document.querySelector('.re')
const adduser = document.querySelector('.adduser')
const title = document.querySelector('.title h3')
const assignname = document.querySelector('.item-name')
const assignrole = document.querySelector('.item-role')
const assigul = document.querySelector('.item-newrole ul')
const assiginput = document.querySelector('.item-newrole input')

let isanme = new addname('.name', 3, 6)
let ispass = new addpass('.password', 6, 15)
let isemail = new addemail('.email')
let isphone = new addphone('.phone')
// 获取token
let token = localStorage.getItem('token')
if (!token) {
    window.location.href = "./index.html"
}

// 关闭模态框
[re, close] && [re, close].forEach((item) => {
    item.addEventListener('click', () => {
        modal.classList.remove('show')
        isanme.dom.readOnly = false // 取消只读状态，允许聚焦
        isanme.init()
        ispass.init()
        isemail.init()
        isphone.init()
    })
})
let id = null

window.addEventListener('message', (e) => {
    if (e.data.type === 'openModal') {
        modal.classList.add('show', 'adduser')
        modal.classList.remove('edit', 'assign')
        title.innerHTML = '添加用户'
    }
    if (e.data.type === 'alert') {
        new customAlert('alert-success', e.data.message)
    }
    if (e.data.type === 'editUser') {
        modal.classList.add('show', 'edit')
        modal.classList.remove('assign')
        title.innerHTML = '修改用户信息'
        id = e.data.message.id
        isanme.dom.value = e.data.message.username
        isanme.dom.readOnly = true // 设置输入框为只读，禁止聚焦
        isemail.dom.value = e.data.message.email
        isphone.dom.value = e.data.message.mobile
    }
    if (e.data.type === 'assignUser') {
        modal.classList.add('show', 'assign')
        modal.classList.remove('edit', 'adduser')
        title.innerHTML = '分配角色'
        assignname.innerHTML = e.data.message.username
        assignrole.innerHTML = e.data.message.role_name
        const userid = e.data.message.id
        request({
            methods: 'GET',
            url: '/roles',
            headers: {
                "Authorization": token,
                'Content-Type': 'application/json'
            },
            success: (res) => {
                let { meta: { status, msg }, data } = res
                if (status !== 200) return new customAlert('alert-danger', msg)
                new customAlert('alert-success', msg)
                data.forEach(e => {
                    const li = document.createElement('li')
                    li.innerHTML = e.roleName
                    assigul.appendChild(li)
                    li.addEventListener('mousedown', () => {
                        assiginput.value = e.roleName
                        adduser.onclick = () => {
                            request({
                                method: 'PUT',
                                url: '/users/' + userid + '/role',
                                data: {
                                    id: userid,
                                    rid: e.id
                                },
                                headers: {
                                    "Authorization": token,
                                    'Content-Type': 'application/json'
                                },
                                success: (res) => {
                                    let { meta: { status, msg } } = res
                                    if (status !== 200) return new customAlert('alert-danger', msg)
                                    new customAlert('alert-success', msg)
                                }
                            })
                        }
                    })
                });
            }
        })
    }
})
// 添加
adduser.addEventListener('click', () => {
    if (isanme.dom.readOnly === true) {
        request({
            method: 'PUT',
            url: '/users/' + id,
            data: {
                email: isemail.dom.value,
                mobile: isphone.dom.value,
            },
            headers: {
                "Authorization": token,
                'Content-Type': 'application/json'
            },
            success: (res) => {
                let { meta: { status, msg } } = res
                if (status !== 200) return new customAlert('alert-danger', msg)
                new customAlert('alert-success', msg)
            }
        })
        id = null
    } else {
        if (isanme.isflag && ispass.isflag && isemail.isflag && isphone.isflag) {
            request({
                method: 'POST',
                url: '/users',
                data: {
                    username: isanme.dom.value,
                    password: ispass.dom.value,
                    email: isemail.dom.value,
                    mobile: isphone.dom.value,
                },
                headers: {
                    "Authorization": token,
                    'Content-Type': 'application/json'
                },
                success: (res) => {
                    let { meta: { status, msg } } = res
                    if (status !== 201) return new customAlert('alert-danger', msg)
                    new customAlert('alert-success', msg)
                },
                error: (status, statusText) => {
                    console.log('请求失败', status, statusText);
                }
            })
        }
    }
    setTimeout(() => {
        document.querySelector('iframe').contentWindow.postMessage({
            type: 'closeModal',
        }, '*')
    }, 500)
    modal.classList.remove('show')
    isanme.init()
    ispass.init()
    isemail.init()
    isphone.init()
})

togglebtn.addEventListener('click', () => {
    toggleMenu.style.width = toggleMenu.style.width === '200px' ? '60px' : '200px'
})
conatiner.children[0].classList.add('show')
let icon = [
    'glyphicon glyphicon-user',
    'glyphicon glyphicon-book'
]

request({
    method: 'GET',
    url: '/menus',
    headers: {
        "Authorization": token,
    },
    success: (res) => {
        new customAlert('alert-success', res.meta.msg)
        renderMenu(res.data)
    },
    error: (status, statusText) => {
        console.log('请求失败', status, statusText);
    }
})

function renderMenu(arrMenu) {
    let i = 0
    function createMenuElement(arrMenu, i) {
        i++
        let ul = document.createElement('ul')
        arrMenu.forEach((item, inx) => {
            let li = document.createElement('li')
            let a = document.createElement('a')
            li.appendChild(a)
            ul.append(li)
            if (item.children && item.children.length) {
                li.append(createMenuElement(item.children, i))
            }
            const isul = a.nextElementSibling
            let color
            if (isul && isul.tagName === 'UL') {
                a.style.color = color = '#909399'
                isul.className = 'ul'
            } else {
                a.style.color = color = '#409eff'
            }
            a.innerHTML = `<div class="${i !== 1 ? 'glyphicon glyphicon-th-large' : icon[inx]}" style="color: ${color};">&nbsp${item.authName}</div>${isul ? `<i class="arrow glyphicon glyphicon-menu-right"></i>` : ''}`
            a.style.paddingLeft = (i === 1 ? i * 30 : i * 20) + 'px'
            a.addEventListener('click', (e) => {
                e.preventDefault()
                if (isul && isul.tagName === 'UL') {
                    const allui = ul.querySelectorAll('.ul')
                    const allarrow = ul.querySelectorAll('.arrow')
                    if (isul.style.height === '0px') {
                        allui.forEach((item) => {
                            item.style.height = '0px'
                        })
                        allarrow.forEach((item) => {
                            item.classList.remove('toggle')
                        })
                    }
                    isul.style.height = !isul.style.height || isul.style.height === '0px' ? isul.scrollHeight + 'px' : '0px'
                    a.querySelector('.arrow').classList.toggle('toggle')
                } else {
                    path(item.path)
                }
            })
        })
        return ul
    }
    document.querySelector('.my-menu').append(createMenuElement(arrMenu, i))
}

welcomebtn.addEventListener('click', (e) => {
    path(welcomebtn.id)
})
function path(url) {
    conatiner.querySelector('iframe').src = `./${url}.html`
}
