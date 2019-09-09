function calcMultiply(value, multiplier) {
    let number = parseFloat(value.match(/-?\d*\.?\d*/)[0]) * multiplier
    let numberType = value.match(/-?\d*\.?\d*(.*)/)[1]
    return number + numberType
}

function calcAdd(value1, value2) {
    let number1 = parseFloat(value1.match(/-?\d*\.?\d*/)[0])
    let number2 = parseFloat(value2.match(/-?\d*\.?\d*/)[0])
    let numberType = value1.match(/-?\d*\.?\d*(.*)/)[1]
    let sum = number1 + number2
    return sum + numberType
}

function createBlock(length, width, height, x, y, z) {
    let wrapper = document.createElement('div')
    wrapper.classList.add('block')
    wrapper.classList.add('block-' + document.querySelectorAll('.block').length)
    wrapper.style.position = 'absolute'
    wrapper.style.top = y
    wrapper.style.left = x
    wrapper.style.transform = 'translate3d(0, 0, ' + z + ')'

    let left = document.createElement('div')
    left.classList.add('left')
    left.style.width = width
    left.style.height = height
    left.style.background = 'purple'
    left.style.transform = 'translate3d(0, 0, 0) rotateY(90deg)'
    
    let back = document.createElement('div')
    back.classList.add('back')
    back.style.width = length
    back.style.height = height
    back.style.background = 'green'
    
    let right = document.createElement('div')
    right.classList.add('right')
    right.style.width = width
    right.style.height = height
    right.style.background = 'yellow'
    right.style.transform = 'translate3d(' + length + ', 0, 0) rotateY(90deg)'
  
    let front = document.createElement('div')
    front.classList.add('front')
    front.style.width = length
    front.style.height = height
    front.style.background = 'orange'
    front.style.transform = 'translate3d(0, 0, ' + calcMultiply(width, -1) + ')'
    
    let top = document.createElement('div')
    top.classList.add('top')
    top.style.width = length
    top.style.height = width
    top.style.background = 'wheat'
    top.style.transform = 'translate3d(0, ' + calcMultiply(width, -0.5) + ', ' + calcMultiply(width, -0.5) + ') rotateX(90deg)'
    
    let bottom = document.createElement('div')
    bottom.classList.add('bottom')
    bottom.style.width = length
    bottom.style.height = width
    bottom.style.background = 'blue'
    bottom.style.transform = 'translate3d(0, ' + calcAdd((calcMultiply(width, -0.5)), height) + ', ' + calcMultiply(width, -0.5) + ') rotateX(90deg)'

    wrapper.appendChild(left)
    wrapper.appendChild(back)
    wrapper.appendChild(right)
    wrapper.appendChild(front)
    wrapper.appendChild(top)
    wrapper.appendChild(bottom)
    
    document.querySelector('main').appendChild(wrapper)
}

function rotateXAxis(deg) {
    let current = document.querySelector('main')
    let transform = current.style.transform

    if (transform === ''){
        current.style.transform = 'rotateX(' + deg + 'deg) rotateY(0deg) rotateZ(0deg)'
        return
    }

    let degrees = (parseInt(transform.match(/rotateX\((-?\d+)deg\)/)[1]) + deg) % 360
    current.style.transform = transform.replace(/rotateX[^ ]*/, 'rotateX(' + degrees + 'deg)')
}

function rotateYAxis(deg) {
    let current = document.querySelector('main')
    let transform = current.style.transform

    if (transform === ''){
        current.style.transform = 'rotateX(0deg) rotateY(' + deg + 'deg) rotateZ(0deg)'
        return
    }

    let degrees = (parseInt(transform.match(/rotateY\((-?\d+)deg\)/)[1]) + deg) % 360
    current.style.transform = transform.replace(/rotateY[^ ]*/, 'rotateY(' + degrees + 'deg)')
}

window.addEventListener('keydown', function(e) {
    if(e.key === 'w'){
        rotateXAxis(1)

    } else if(e.key === 'a'){
        rotateYAxis(-1)

    } else if(e.key === 's'){
        rotateXAxis(-1)

    } else if(e.key === 'd'){
        rotateYAxis(1)

    }
})

createBlock('4rem', '1rem', '6rem', 'calc(100% - 10rem)', 'calc(100% - 10rem)', '10rem')
createBlock('1rem', '20rem', '1rem', 'calc(100% - 10rem)', '2rem', '0rem')
createBlock('1rem', '5rem', '5rem', '3rem', 'calc(100% - 10rem)', '2rem')
createBlock('5rem', '5rem', '5rem', '3rem', '25%', '3rem')
createBlock('10rem', '10rem', '10rem', 'calc(50% - 5rem)', 'calc(50% - 5rem)', '1rem')