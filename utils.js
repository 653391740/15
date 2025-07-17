const BASE_URL = 'http://43.138.15.137:7000/api/private/v1'
function request(option) {
    // 参数默认值处理
    const defaultOptions = {
        method: 'GET',
        url: '',
        async: true,
        data: null,
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 5000,
        success: () => { },
        error: () => { }
    }
    option = { ...defaultOptions, ...option }
    option.url = BASE_URL + option.url

    const xhr = new XMLHttpRequest()

    // 设置超时
    if (option.timeout > 0) {
        xhr.timeout = option.timeout
    }
    if (option.data && option.method === 'GET') {
        option.url += '?' + new URLSearchParams(option.data)
    }

    // 设置请求头
    xhr.open(option.method, option.url, option.async)
    // 设置请求头
    for (const key in option.headers) {
        xhr.setRequestHeader(key, option.headers[key])
    }

    // 处理请求状态变化
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) { // 请求成功
                let response = xhr.responseText
                response = response && JSON.parse(response)
                option.success(response)
            } else { // 请求失败
                option.error(xhr.status, xhr.statusText)
            }
        }
    }

    // 发送请求
    xhr.send(option.method === 'GET' ? null : JSON.stringify(option.data))
}
export { request, BASE_URL }
