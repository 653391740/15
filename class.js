class customAlert {
    constructor(type, msg) {
        this.type = type
        this.msg = msg
        this.time = null
        this.wyfAlert = document.querySelector('.my-alert')
        this.init()
    }
    init() {
        this.wyfAlert.classList.add(this.type, 'my-alert-show')
        this.wyfAlert.innerHTML = this.msg
        this.time = setTimeout(() => {
            this.wyfAlert.classList.remove(this.type, 'my-alert-show')
            this.wyfAlert.innerHTML = ''
        }, 2000)
    }
}

class name {
    constructor(dom, min, max) {
        this.dom = document.querySelector(dom)
        this.min = min
        this.max = max
        this.isflag = false
        this.event()
    }
    event() {
        this.dom.addEventListener('blur', (e) => {
            this.length(this.dom)
        })
    }
    length(e) {
        const target = e.value
        const input = e.closest('.input-group')
        const help = input.nextElementSibling
        if (!target.length) {
            input.style.border = `1px solid #F56C6C`
            help.style.opacity = 1
            help.innerHTML = this.aler()
            this.isflag = false
        } else if (this.yj()) {
            help.innerHTML = this.err()
            input.style.border = `1px solid #F56C6C`
            help.style.opacity = 1
            this.isflag = false
        } else {
            help.innerHTML = this.aler()
            input.style.border = `1px solid #DCDFE6`
            help.style.opacity = 0
            this.isflag = true
        }
    }
    yj() {
        return this.dom.value.length < this.min || this.dom.value.length > this.max
    }
    aler() {
        return '请输入用户名'
    }
    err() {
        return `长度在 ${this.min} 到 ${this.max} 个字符`
    }
    init() {
        this.dom.value = ''
        this.isflag = false
    }
}
class pass extends name {
    constructor(dom, min, max) {
        super(dom, min, max)
    }
    aler() {
        return '请输入密码'
    }
}
class addname extends name {
    constructor(dom, min, max) {
        super(dom, min, max)
    }
    aler() {
        return '请输入用户名'
    }
}
class addpass extends name {
    constructor(dom, min, max) {
        super(dom, min, max)
    }
    aler() {
        return '请输入密码'
    }
}
class addemail extends name {
    constructor(dom) {
        super(dom)
    }
    yj() {
        return !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.dom.value)
    }
    aler() {
        return '请输入邮箱'
    }
    err() {
        return '邮箱地址不正确'
    }
}
class addphone extends name {
    constructor(dom) {
        super(dom)
    }
    yj() {
        return !/^1[3-9]\d{9}$/.test(this.dom.value)
    }
    aler() {
        return '请输入手机号'
    }
    err() {
        return '手机号格式不正确'
    }
}
export { addemail, addphone, addname, addpass, pass, name, customAlert }
