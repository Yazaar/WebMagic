let baseURL = window.location.href.substring(0, window.location.href.indexOf('/urlbuilder.html'))

function updateURL(){
    let data = {}
    if (document.getElementById('particlecount-checkbox').checked && document.getElementById('particlecount-input').value !== ''){
        data['particlecount'] = document.getElementById('particlecount-input').value
    }
    if (document.getElementById('hex-checkbox').checked && document.getElementById('hex-input').value !== ''){
        data['color'] = document.getElementById('hex-input').value
    }
    if (document.getElementById('opacity-checkbox').checked && document.getElementById('opacity-input').value !== ''){
        data['opacity'] = document.getElementById('opacity-input').value
    }
    if (document.getElementById('url-checkbox').checked && document.getElementById('url-input').value !== ''){
        data['image'] = encodeURIComponent(document.getElementById('url-input').value)
    }
    let keys = Object.keys(data)
    let struct = ''
    for (i of keys){
        if (struct == ''){
            struct += '?' + i + '=' + data[i]
        } else {
            struct += '&' + i + '=' + data[i]
        }
    }
    document.querySelector('#result a').href = baseURL + struct
    document.querySelector('#result a').innerText = baseURL + struct
}

let checkboxes = document.querySelectorAll('input[type="checkbox"]')

for (i of checkboxes){
    i.addEventListener('click', updateURL)
}

document.getElementById('particlecount-input').addEventListener('input', ()=>{
    if (document.getElementById('particlecount-checkbox').checked){
        updateURL()
    }
})

document.getElementById('url-input').addEventListener('input', ()=>{
    if (document.getElementById('url-checkbox').checked){
        updateURL()
    }
})

document.getElementById('hex-input').addEventListener('input', ()=>{
    let value = document.getElementById('hex-input').value
    for (let i of value){
        if(/[a-fA-F0-9]/.test(i) === false){
            if (document.getElementById('hex-checkbox').checked){
                document.getElementById('hex-checkbox').click()
                return
            }
        }
    }
    if (document.getElementById('hex-checkbox').checked){
        updateURL()
    }
})

document.getElementById('opacity-input').addEventListener('input', ()=>{
    let value = parseInt(document.getElementById('opacity-input').value)
    if (value > 100){
        document.getElementById('opacity-input').value = '100'      
    }
    if (value < 0){
        document.getElementById('opacity-input').value = '0'      
    }

    if (document.getElementById('opacity-checkbox').checked){
        updateURL()
    }
})