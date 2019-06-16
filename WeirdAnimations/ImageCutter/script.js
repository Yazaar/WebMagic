let x, y, TempArray
let i2 = false
let item_count = parseInt(document.getElementById('count').value)
let speed = parseFloat(document.getElementById('speed').value)

document.getElementById('count').addEventListener('input', ()=>{
    item_count = parseInt(document.getElementById('count').value)
})
document.getElementById('speed').addEventListener('input', ()=>{
    speed = parseFloat(document.getElementById('speed').value)
})

let img_element = document.createElement('img')
img_element.src = './img.jpg'

function main(){
    let sqrt = Math.round(Math.sqrt(item_count))
    while (sqrt**2 < document.querySelectorAll('img').length){
        document.querySelector('img').remove()
    }
    while (sqrt**2 > document.querySelectorAll('img').length){
        document.querySelector('body').appendChild(img_element.cloneNode(true))
    }

    x = document.querySelector('img').offsetWidth/sqrt
    y = document.querySelector('img').offsetHeight/sqrt
    
    let width = document.querySelector('img').offsetWidth
    let row = 0

    let elements = document.querySelectorAll('img')
    for (let element = 0; element < elements.length; element++){
        let i = ((x*element)%width)
        if (element !== 0 && i === 0){
            row++
        }
        let x1 = i
        let x2 = i+x
        let y1 = (row*y)
        let y2 = (row*y)+y

        elements[element].style.clipPath = `polygon(${x1}px ${y1}px, ${x1}px ${y2}px, ${x2}px ${y2}px, ${x2}px ${y1}px)`
        elements[element].style.top = ((elements[element].offsetHeight/2)-y1) + 'px'
        elements[element].style.left = ((elements[element].offsetWidth/2)-x1) + 'px'
    }

    TempArray = Array.from(document.querySelectorAll('img'))

    setTimeout(() => {
        i2 = setInterval(() => {
            if (TempArray.length === 0){
                setTimeout(main, 2000);
                clearInterval(i2)
                i2 = false
                return
            }
            let rand = Math.floor(Math.random()*TempArray.length) 
            TempArray[rand].style.left = '50%'
            TempArray[rand].style.top = '50%'
            TempArray.splice(rand, 1)
        }, speed);
    }, 1500);

}

for (let i = 0; i < item_count; i++){
    document.querySelector('body').appendChild(img_element.cloneNode(true))
}

let i1 = setInterval(()=>{
    if (document.querySelector('img').offsetHeight !== 0){
        main()
        clearInterval(i1)
    }
}, 100)