document.getElementById('GoFastBoi').addEventListener('input', (e) => {
    document.querySelector('h1').innerText = e.target.value + 'ms'
    document.getElementById('a').style.animation = 'GoFastBoi ' + e.target.value + 'ms infinite linear'
})