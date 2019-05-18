let last = {
    "s": ["0", "0"],
    "m": ["0", "0"],
    "h": ["0", "0"]
}

let URLParams = new URLSearchParams(window.location.search)

if (URLParams.get("image") !== null){
    document.querySelector("body").style.background = 'url("' + URLParams.get("image") + '")'
    document.querySelector("body").style.backgroundSize = 'cover'
} else if(URLParams.get("color") !== null){
    document.querySelector("body").style.background = "#" + URLParams.get("color")
}

let particles = []

for (let i=0; i < 100; i++){
    particles.push(createParticle())
}

function offScreen(x,y,r) {
    if (x !== null){
        if (x <= r*-1){
            return true
        }
        if (x >= window.innerWidth-r*-1){
            return true
        }
    }

    if (y !== null){
        if (y <= r*-1){
            return true
        }
        if (y >= window.innerHeight-r*-1){
            return true
        }
    }
    return false
}

function resetParticle(){
    let radius = Math.floor(Math.random()*window.innerWidth*0.05)
    let x = Math.floor(Math.random()*window.innerWidth)
    let y = Math.floor(Math.random()*window.innerHeight)
    
    while (offScreen(x,null,radius)){
        let x = Math.floor(Math.random()*window.innerWidth)
    }
    
    while (offScreen(null,y,radius)){
        let y = Math.floor(Math.random()*window.innerHeight)
    }
    return {"x":x, "y":y, "r":radius}
}

function createParticle(){
    let radius = Math.floor(Math.random()*window.innerWidth*0.05)
    let x = Math.floor(Math.random()*window.innerWidth)
    let y = Math.floor(Math.random()*window.innerHeight)
    
    while (offScreen(x,null,radius)){
        let x = Math.floor(Math.random()*window.innerWidth)
    }
    
    while (offScreen(null,y,radius)){
        let y = Math.floor(Math.random()*window.innerHeight)
    }
    let element = document.createElement("div")
    element.style.width = radius + "px"
    element.style.height = radius + "px"
    element.style.left = x + "px"
    element.style.top = y + "px"
    document.querySelector("body").appendChild(element)
}

function formatNumber(number) {
    NumString = String(number)
    if (NumString.length === 1) {
        return "0" + NumString
    } else {
        return NumString
    }
}

function changeTime() {
    let current = new Date()
    return {
        "s": formatNumber(current.getSeconds()),
        "m": formatNumber(current.getMinutes()),
        "h": formatNumber(current.getHours())
    }
}

function triggerAnimation(id) {
    document.getElementById(id).style.animation = "boink 250ms ease-in-out"
    setTimeout(function () {
        document.getElementById(id).style.animation = ""
    }, 500)
}

function ClockLoop() {
    let res = changeTime()
    if (res.s[0] !== last.s[0]) {
        last.s[0] = res.s[0]
        document.getElementById("s1").innerHTML = res.s[0]
        triggerAnimation("s1")
    }
    if (res.s[1] !== last.s[1]) {
        last.s[1] = res.s[1]
        document.getElementById("s2").innerHTML = res.s[1]
        triggerAnimation("s2")
    }

    if (res.m[0] !== last.m[0]) {
        last.m[0] = res.m[0]
        document.getElementById("m1").innerHTML = res.m[0]
        triggerAnimation("m1")
    }
    if (res.m[1] !== last.m[1]) {
        last.m[1] = res.m[1]
        document.getElementById("m2").innerHTML = res.m[1]
        triggerAnimation("m2")
    }

    if (res.h[0] !== last.h[0]) {
        last.h[0] = res.h[0]
        document.getElementById("h1").innerHTML = res.h[0]
        triggerAnimation("h1")
    }
    if (res.h[1] !== last.h[1]) {
        last.h[1] = res.h[1]
        document.getElementById("h2").innerHTML = res.h[1]
        triggerAnimation("h2")
    }
}

function ParticleLoop(){
    let divs = document.querySelectorAll("div")
    for (let i of divs){
        let div_r = parseInt(i.style.width.replace("px", ""))
        let div_x = i.offsetLeft
        let div_y = i.offsetTop
        if (offScreen(div_x, div_y, div_r)){
            i.style.opacity = "0"
            let resetData = resetParticle()
            i.style.left = resetData.x + "px"
            i.style.top = resetData.y + "px"
            i.style.width = "0"
            i.style.height = "0"
        } else {
            let distance = Math.random()*window.innerWidth*0.1
            let angle = Math.random()*Math.PI*2
            let new_x = distance * Math.sin(angle)
            let new_y = distance * Math.cos(angle)
            let new_r = Math.floor(Math.random()*window.innerWidth*0.05)
            i.style.left = (div_x + new_x) + "px"
            i.style.top = (div_y + new_y) + "px"
            i.style.height = new_r + "px"
            i.style.width = new_r + "px"
            i.style.opacity = "1"
        }
    }
}

setInterval(ClockLoop, 100)

ParticleLoop()
setInterval(ParticleLoop, 2000)