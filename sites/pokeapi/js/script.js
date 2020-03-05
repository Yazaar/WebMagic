var aerodactylPerks = {
    strong: ['bug', 'fight', 'grass', 'fire', 'flying', 'ice'],
    weak: ['electric', 'ice', 'rock', 'fight', 'grass', 'ground', 'steel', 'water'],
    immune: ['ground']
};

var mainPokemonStats = {};

var score = 0;

function strongWeakImmune(type) {
    for (var i = 0; i < aerodactylPerks.immune.length; i++) {
        if (type === aerodactylPerks.immune[i]) {
            return 'immune';
        }
    }

    for (var i = 0; i < aerodactylPerks.strong.length; i++) {
        if (type === aerodactylPerks.strong[i]) {
            return 'strong';
        }
    }

    for (var i = 0; i < aerodactylPerks.weak.length; i++) {
        if (type === aerodactylPerks.weak[i]) {
            return 'weak';
        }
    }

    return 'neutral';
}

function pokeApiResponse(response){
    score = 0;
    var selectedPokemon = response.sprites.front_default;
    document.querySelector('.right .pokeImage').src = selectedPokemon;

    // compare pokemon types (not perfect since there are a lot of work to compare each and every type)
    var typesElement = document.querySelector('.right .types');
    typesElement.innerHTML = '';
    for (var i = 0; i < response.types.length; i++) {
        var pokeType = document.createElement('p');
        pokeType.innerText = response.types[i].type.name;
        var pokePerk = strongWeakImmune(response.types[i].type.name);
        if (pokePerk === 'immune') {
            pokeType.classList.add('colorGreen');
            score += 25;
        } else if (pokePerk === 'strong') {
            score += 5;
            pokeType.classList.add('colorBlue');
        } else if (pokePerk === 'weak') {
            score -= 5;
            pokeType.classList.add('colorRed');
        }
        typesElement.appendChild(pokeType);
    }
    
    // compare pokemon base XP
    document.querySelector('.right .baseXP').innerText = response.base_experience;
    if (mainPokemonStats.baseXP > response.base_experience) {
        document.querySelector('.right .baseXP').classList.remove('bestStat');
        document.querySelector('.left .baseXP').classList.add('bestStat');
    } else if (mainPokemonStats.baseXP < response.base_experience) {
        document.querySelector('.left .baseXP').classList.remove('bestStat');
        document.querySelector('.right .baseXP').classList.add('bestStat');
    }
    score += mainPokemonStats.baseXP - response.base_experience;

    // compare other stats such as health, speed, attack and defence
    for (var i = 0; i < response.stats.length; i++) {
        if (mainPokemonStats.stats[response.stats[i].stat.name] !== undefined) {
            score += mainPokemonStats.stats[response.stats[i].stat.name] - response.stats[i].base_stat
            if (response.stats[i].stat.name === 'hp') {
                document.querySelector('.left .baseHP').innerText = mainPokemonStats.stats[response.stats[i].stat.name];
                document.querySelector('.right .baseHP').innerText = response.stats[i].base_stat;
                if (mainPokemonStats.stats[response.stats[i].stat.name] > response.stats[i].base_stat) {
                    document.querySelector('.right .baseHP').classList.remove('bestStat');
                    document.querySelector('.left .baseHP').classList.add('bestStat');
                } else if (mainPokemonStats.stats[response.stats[i].stat.name] < response.stats[i].base_stat) {
                    document.querySelector('.left .baseHP').classList.remove('bestStat');
                    document.querySelector('.right .baseHP').classList.add('bestStat');
                }
            } else if (response.stats[i].stat.name === 'speed'){
                document.querySelector('.left .baseS').innerText = mainPokemonStats.stats[response.stats[i].stat.name];
                document.querySelector('.right .baseS').innerText = response.stats[i].base_stat;
                if (mainPokemonStats.stats[response.stats[i].stat.name] > response.stats[i].base_stat) {
                    document.querySelector('.right .baseS').classList.remove('bestStat'); 
                    document.querySelector('.left .baseS').classList.add('bestStat');
                } else if (mainPokemonStats.stats[response.stats[i].stat.name] < response.stats[i].base_stat) {
                    document.querySelector('.left .baseS').classList.remove('bestStat');
                    document.querySelector('.right .baseS').classList.add('bestStat'); 
                }
            } else if (response.stats[i].stat.name === 'special-defense'){
                document.querySelector('.left .baseSD').innerText = mainPokemonStats.stats[response.stats[i].stat.name];
                document.querySelector('.right .baseSD').innerText = response.stats[i].base_stat;
                if (mainPokemonStats.stats[response.stats[i].stat.name] > response.stats[i].base_stat) {
                    document.querySelector('.right .baseSD').classList.remove('bestStat');
                    document.querySelector('.left .baseSD').classList.add('bestStat');
                } else if (mainPokemonStats.stats[response.stats[i].stat.name] < response.stats[i].base_stat) {
                    document.querySelector('.left .baseSD').classList.remove('bestStat');
                    document.querySelector('.right .baseSD').classList.add('bestStat');   
                }
            } else if (response.stats[i].stat.name === 'special-attack'){
                document.querySelector('.left .baseSA').innerText = mainPokemonStats.stats[response.stats[i].stat.name];
                document.querySelector('.right .baseSA').innerText = response.stats[i].base_stat;
                if (mainPokemonStats.stats[response.stats[i].stat.name] > response.stats[i].base_stat) {
                    document.querySelector('.right .baseSA').classList.remove('bestStat');
                    document.querySelector('.left .baseSA').classList.add('bestStat');
                } else if (mainPokemonStats.stats[response.stats[i].stat.name] < response.stats[i].base_stat) {
                    document.querySelector('.left .baseSA').classList.remove('bestStat');
                    document.querySelector('.right .baseSA').classList.add('bestStat');
                }
            } else if (response.stats[i].stat.name === 'defense'){
                document.querySelector('.left .baseD').innerText = mainPokemonStats.stats[response.stats[i].stat.name];
                document.querySelector('.right .baseD').innerText = response.stats[i].base_stat;
                if (mainPokemonStats.stats[response.stats[i].stat.name] > response.stats[i].base_stat) {
                    document.querySelector('.right .baseD').classList.remove('bestStat');
                    document.querySelector('.left .baseD').classList.add('bestStat');
                } else if (mainPokemonStats.stats[response.stats[i].stat.name] < response.stats[i].base_stat) {
                    document.querySelector('.left .baseD').classList.remove('bestStat');
                    document.querySelector('.right .baseD').classList.add('bestStat');
                }
            } else if (response.stats[i].stat.name === 'attack'){
                document.querySelector('.left .baseA').innerText = mainPokemonStats.stats[response.stats[i].stat.name];
                document.querySelector('.right .baseA').innerText = response.stats[i].base_stat;
                if (mainPokemonStats.stats[response.stats[i].stat.name] > response.stats[i].base_stat) {
                    document.querySelector('.right .baseA').classList.remove('bestStat');
                    document.querySelector('.left .baseA').classList.add('bestStat');
                } else if (mainPokemonStats.stats[response.stats[i].stat.name] < response.stats[i].base_stat) {
                    document.querySelector('.left .baseA').classList.remove('bestStat');
                    document.querySelector('.right .baseA').classList.add('bestStat');
                }
            }
        }
    }

    document.querySelector('.scoreResult').innerText = score;
}

function pokeApiRequest(endpoint, callback) {
    var xml = new XMLHttpRequest();
    xml.open('GET', 'https://pokeapi.co/api/v2/' + endpoint);
    xml.onload = function(){
        try {
            var response = JSON.parse(this.response);
        } catch(e) {
            var response = {};
        }
        callback(response);
    }
    xml.send();
}


// 142 = Aerodactyl
pokeApiRequest('pokemon/142', function(response){
    var AerodactylImage = response.sprites.front_default;
    document.querySelector('.left .pokeImage').src = AerodactylImage;
    document.querySelector('header img').src = AerodactylImage;
    document.querySelector('footer img').src = AerodactylImage;
    var typesElement = document.querySelector('.left .types');
    for (var i = 0; i < response.types.length; i++) {
        var pokeType = document.createElement('p');
        pokeType.innerText = response.types[i].type.name;
        typesElement.appendChild(pokeType);
    }
    document.querySelector('.left .baseXP').innerText = response.base_experience;
    mainPokemonStats.baseXP = response.base_experience;
    mainPokemonStats.stats = {};
    for (var i = 0; i < response.stats.length; i++) {
        mainPokemonStats.stats[response.stats[i].stat.name] = response.stats[i].base_stat;
        if (response.stats[i].stat.name === 'hp') {
            document.querySelector('.left .baseHP').innerText = response.stats[i].base_stat
        } else if (response.stats[i].stat.name === 'speed'){
            document.querySelector('.left .baseS').innerText = response.stats[i].base_stat
        } else if (response.stats[i].stat.name === 'special-defense'){
            document.querySelector('.left .baseSD').innerText = response.stats[i].base_stat
        } else if (response.stats[i].stat.name === 'special-attack'){
            document.querySelector('.left .baseSA').innerText = response.stats[i].base_stat
        } else if (response.stats[i].stat.name === 'defense'){
            document.querySelector('.left .baseD').innerText = response.stats[i].base_stat
        } else if (response.stats[i].stat.name === 'attack'){
            document.querySelector('.left .baseA').innerText = response.stats[i].base_stat
        }
    }
});

pokeApiRequest('pokemon/?limit=1000', function(response){
    var pokeSelect = document.querySelector('#pokeSelect');
    for (var i = 0; i < response.count; i++) {
        var pokeOption = document.createElement('option');
        pokeOption.value = response.results[i].name;
        pokeOption.innerText = response.results[i].name;
        pokeSelect.appendChild(pokeOption);
    }
});

document.querySelector('#pokeSelect').addEventListener('input', function(){
    pokeApiRequest('pokemon/' + this.value, pokeApiResponse);
});

function calcBG() {
    var windowHeight = window.innerHeight;
    var windowWidth = window.innerWidth;
    var imageHeight = 900;
    var imageWidth = 1350;
    var heightScale = windowHeight / imageHeight;
    var scroll = (window.pageYOffset) / (document.body.clientHeight - windowHeight);
    var pushDistance = -scroll * (windowHeight/5);
    if (windowWidth > imageWidth * heightScale) {
        document.body.style.background = 'url("img/mountains.jpg") 0px ' + pushDistance + 'px / 100vw 120vh no-repeat fixed';
    } else {
        document.body.style.background = 'url("img/mountains.jpg") 0px ' + pushDistance + 'px / auto 120vh no-repeat fixed';
    }
}

window.addEventListener('scroll', calcBG);
window.addEventListener('resize', calcBG);
calcBG();