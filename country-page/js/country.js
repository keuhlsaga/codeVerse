fetch('https://restcountries.com/v3.1/all')
.then(response => response.json())
.then(data => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    data.filter(country => {
        if (country.name.common === urlParams.get('country')) {
            document.getElementById('country-flag').innerHTML = country.flag
            document.getElementById('country-name').innerHTML = country.name.common
            document.getElementById('country-official-name').innerHTML = country.name.official
            document.getElementById('population').innerHTML = country.population.toLocaleString('en-us')
            document.getElementById('area').innerHTML = country.area.toLocaleString('en-us')
            document.getElementById('capital').innerHTML = country.capital || 'None'
            document.getElementById('subregion').innerHTML = country.subregion || 'None'
            let languages = []
            for (const key in country.languages) {
                languages.push(country.languages[key])
            }
            document.getElementById('language').innerHTML = languages.join(', ') || 'None'
            let currencies = []
            for (const key in country.currencies) {
                currencies.push(country.currencies[key].name)
            }
            document.getElementById('currencies').innerHTML = currencies.join(', ') || 'None'
            document.getElementById('continents').innerHTML = country.continents
            const neighbors = document.getElementById('neighboring-countries')
            data.filter(country2 => {
                if (country.borders.includes(country2.cca3)) {
                    const card = document.createElement('div')
                    card.className = 'country-card'
                    const flag = document.createElement('img')
                    flag.className = 'neighboring-country-flag'
                    flag.src = country2.flags.svg
                    card.appendChild(flag)
                    const name = document.createElement('p')
                    card.appendChild(name)
                    name.innerHTML = country2.name.common
                    neighbors.appendChild(card)
                }
            })
        }
    })
    
})
.catch(error => {
    console.log(error)
})