if (true) {
    let searched = []
    let resultData = {}
    let loading = false
    
    let startSearch = function(username) {
        if (typeof (username) != 'string') {
            loading = false
            return
        }
        if (username.length == 0) {
            loading = false
            return
        }
    
        let xml = new XMLHttpRequest()
        xml.onreadystatechange = function () {
            if (xml.readyState === 4) {
                if (xml.status === 200) {
                    let xmlData = JSON.parse(xml.response).data
                    if(xmlData.length > 0){
                        getBadges(xmlData[0].id, xmlData[0].login)
                    } else {
                        alert(username + ' not found')
                        loading = false
                    }
                } else {
                    console.log('error getting userid...')
                    loading = false
                }
            }
        }
        xml.open('get', 'https://api.twitch.tv/helix/users?login=' + username)
        xml.setRequestHeader('Client-Id', 'y2xo7519lrrijps6yurfnrehdaubry')
        xml.send()
    }
    
    let getBadges = function(userId, username) {
        let xml = new XMLHttpRequest()
        xml.onreadystatechange = function () {
            if (xml.readyState === 4) {
                if (xml.status === 200) {
                    parseBadgeResponse(JSON.parse(xml.response), username)
                } else {
                    loading = false
                    console.log('error getting badges...')
                }
            }
        }
        xml.open('get', 'https://badges.twitch.tv/v1/badges/channels/' + userId + '/display?language=en')
        xml.send()
    }
    
    let parseBadgeResponse = function(badgeData, username) {
        let data = []
        if (badgeData.badge_sets.subscriber === undefined) {
            loading = false
            alert(username + ' does not have any sub badges')
            return
        }
        let sub_badges = badgeData.badge_sets.subscriber.versions
        let sub_badge_keys = Object.keys(badgeData.badge_sets.subscriber.versions)
        for (let i of sub_badge_keys) {
            data.push({
                title: sub_badges[i].title,
                url: sub_badges[i].image_url_4x
            })
        }
        resultData[username] = data
        insertData(data, username)
    }
    
    let insertData = function(data, username) {
        let resultElement = document.querySelector('#results')
    
        let user = document.createElement('h2')
        user.innerText = username
    
        let container = document.createElement('div')
        container.classList.add('subBadgeResult')
    
        for (let i of data) {
    
            let div = document.createElement('div')
            div.classList.add('subBadge')
    
            let img = document.createElement('img')
            img.src = i.url
            div.appendChild(img)
    
            let p = document.createElement('p')
            p.innerText = i.title
            div.appendChild(p)
            container.appendChild(div)
        }
        if (resultElement.children.length === 0) {
            resultElement.appendChild(user)
            resultElement.appendChild(container)
        } else {
            resultElement.insertBefore(container, resultElement.children[0])
            resultElement.insertBefore(user, resultElement.children[0])
        }
        loading = false
    }
    
    document.querySelector('#searchButton').addEventListener('click', function () {
        if (loading === true) {
            return
        }
        
        let username = document.querySelector('#usernameInput').value.replace(/\s/g, '').replace(/&/g, '').toLowerCase()
        
        if (username.length === 0) {
            return
        }
        
        document.querySelector('#usernameInput').value = ''
    
        loading = true
        
        if (Object.keys(resultData).includes(username)){
            console.log(resultData)
            insertData(resultData[username], username)
            return
        }
        
        if (searched.includes(username)){
            loading = false
            return
        }
    
    
        searched = username
        startSearch(username)
    })
    
    window.addEventListener("keypress", (e) => {
        if (e.path[0] == document.querySelector('#usernameInput') && e.key == "Enter") {
            document.querySelector('#searchButton').click()
        }
    })
    
    let params = new URLSearchParams(window.location.search)
    if (params.get("user") !== null) {
        document.querySelector('#usernameInput').value = params.get("user")
        document.querySelector('#searchButton').click()
    }
}