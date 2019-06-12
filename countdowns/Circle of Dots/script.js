let precision
let start = new Date()
let stop = new Date(start.getTime())
let params = new URLSearchParams(window.location.search)
let detailcolor = ''
let radius

document.querySelector('p').style.fontSize = '20vw'

if (params.get('hours') !== null && isNaN(parseFloat(params.get('hours'))) === false){
    stop.setHours(stop.getHours()+parseFloat(params.get('hours')))
}
if (params.get('minutes') !== null && isNaN(parseFloat(params.get('minutes'))) === false){
    stop.setMinutes(stop.getMinutes()+parseFloat(params.get('minutes')))
}
if (params.get('seconds') !== null && isNaN(parseFloat(params.get('seconds'))) === false){
    stop.setSeconds(stop.getSeconds()+parseFloat(params.get('seconds')))
}

if (start-stop == 0){
    stop.setSeconds(stop.getSeconds() + 10)
}

if (params.get('precision') !== null && isNaN(parseFloat(params.get('precision'))) === false){
    precision = parseFloat(params.get('precision'))
} else {
    precision = 60
}

if (params.get('background') !== null){
    document.querySelector('body').style.background = '#' + params.get('background')
}

if (params.get('detailcolor') !== null){
    detailcolor = '#' + params.get('detailcolor')
    document.querySelector('p').style.color = detailcolor
}

for (let i=0; i < precision; i++){
    document.querySelector('body').innerHTML = '<div class="dot"></div>' + document.querySelector('body').innerHTML
}

const dots = document.querySelectorAll('div.dot')

function positionElements(){
    let deg_steps = (Math.PI * 2)/dots.length
    let viewmin

    if (document.querySelector('body').offsetHeight > document.querySelector('body').offsetWidth){
        viewmin = document.querySelector('body').offsetWidth
    } else {
        viewmin = document.querySelector('body').offsetHeight
    }

    let center = {'x':document.querySelector('body').offsetWidth/2, 'y':document.querySelector('body').offsetHeight/2}
    radius = viewmin * 0.4

    let dx = Math.cos(deg_steps*0)*radius - Math.cos(deg_steps*1)*radius
    let dy = Math.sin(deg_steps*0)*radius - Math.sin(deg_steps*1)*radius

    let circle_radius = Math.sqrt(dx**2 + dy**2)

    dots.forEach((item, i) => {
        let index = (i * -1) + (dots.length/4)
        item.style.bottom = center.y + (Math.sin(deg_steps*index)*radius) + 'px'
        item.style.left = center.x + (Math.cos(deg_steps*index)*radius) + 'px'
        item.style.width = circle_radius*0.9 + 'px'
        item.style.height = circle_radius*0.9 + 'px'
        item.style.background = detailcolor
    })
}
positionElements()
window.addEventListener('resize', positionElements)

function colorDots(){
    let colored_dots = Math.floor(dots.length*((new Date-start)/(stop-start)))

    for (let i=0; i < dots.length; i++){
        if (i <= colored_dots) {
            dots[i].style.opacity = '1'
        } else {
            dots[i].style.opacity = '0'
        }
    }
    let time_left = Math.floor(((stop-start)-(new Date()-start))/1000)
    let times = {'hours':'', 'minutes':'', 'seconds':''}
    times.seconds = time_left
    if(times.seconds > 59){
        times.minutes = Math.floor(times.seconds/60)
        times.seconds = times.seconds % 60
    }
    if (times.seconds < 0){
        times.seconds = 0
    }
    if(times.minutes > 59){
        times.hours = Math.floor(times.minutes/60)
        times.minutes = times.minutes % 60
    }

    if (times.hours === ''){
        document.getElementById('h').innerText = ''
    } else {
        if (new String(times.hours).length === 1){
            document.getElementById('h').innerText = '0' + times.hours + ':'
        } else {
            document.getElementById('h').innerText = times.hours + ':'
        }
    }
    if (times.minutes === ''){
        document.getElementById('m').innerText = ''
    } else if(times.minutes === 0) {
        document.getElementById('m').innerText = '00:'
    } else {
        if (new String(times.minutes).length === 1){
            document.getElementById('m').innerText = '0' + times.minutes + ':'
        } else {
            document.getElementById('m').innerText = times.minutes + ':'
        }
    }
    if (times.seconds === ''){
        document.getElementById('s').innerText = ''
    } else if(times.seconds === 0) {
        document.getElementById('s').innerText = '00'
    } else {
        if (new String(times.seconds).length === 1){
            document.getElementById('s').innerText = '0' + times.seconds
        } else {
            document.getElementById('s').innerText = times.seconds
        }
    }

    if (document.querySelector('p').offsetWidth > ((dots[Math.floor(dots.length/4)].offsetLeft) - (dots[Math.floor(dots.length/4*3)].offsetLeft+radius)*0.8)){
        document.querySelector('p').style.fontSize = parseFloat(document.querySelector('p').style.fontSize)*0.95 + 'vw'
    } else if(document.querySelector('p').offsetWidth < ((dots[dots.length/4].offsetLeft) - (dots[dots.length/4*3].offsetLeft+radius))){
        document.querySelector('p').style.fontSize = parseFloat(document.querySelector('p').style.fontSize)*1.05 + 'vw'
    }
    if (dots[dots.length-1].style.opacity === '1'){
        clearInterval(MainLoop)
        MainLoop = 'Disabled'
    }
}

colorDots()

let MainLoop = setInterval(colorDots, 100)