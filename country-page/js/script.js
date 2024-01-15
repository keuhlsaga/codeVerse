let countries = {}
let regionFilters = []
let statusFilters = []
const resultCount = document.getElementById('result-count')

fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {
        countries = data.sort((a, b) => {
            if (a.population === b.population)
                if (a.name.common > b.name.common)
                    return b.population - a.population
            return a.population - b.population
        })
        updateTable(countries)
        resultCount.innerHTML = data.length
    })
    .catch(error => {
        console.log(error)
    })

const trClickListener = (event, countryName) => {
    if (event.target.closest(`[name="${countryName}"]`))
        window.location.href = `country.html?country=${countryName}`
}

const sortBy = document.getElementById('sort-by')

sortBy.onchange = () => {
    const filter = sortBy.value
    updateTable(sort(filter))
}

const sort = (filter) => {
    let filteredCountries = filterCountries()

    if (filter === 'alphabetical') {
        filteredCountries.sort((a, b) => {
            if (a.name.common > b.name.common)
                return 1
        })
    } else if (filter === 'population') {
        filteredCountries.sort((a, b) => {
            if (a.population === b.population)
                if (a.name.common > b.name.common)
                    return b.population - a.population
            return a.population - b.population
        })
    } else if (filter === 'area') {
        filteredCountries.sort((a, b) => {
            return a.area - b.area
        })
    }
    resultCount.innerHTML = filteredCountries.length
    return filteredCountries
}

const selectedRegion = document.querySelectorAll('.region-cb-label')
selectedRegion.forEach(region => {
    region.addEventListener('click', (e) => {
        if (!regionFilters.includes(e.target.htmlFor))
            regionFilters.push(e.target.htmlFor)
        else
            regionFilters.splice(regionFilters.indexOf(e.target.htmlFor), 1)
        updateTable(sort(sortBy.value))
    })
})

const selectedStatus = document.querySelectorAll('.status-cb')
selectedStatus.forEach(status => {
    status.addEventListener('change', (e) => {
        if (!statusFilters.includes(e.target.value))
            statusFilters.push(e.target.value)
        else
            statusFilters.splice(statusFilters.indexOf(e.target.value), 1)
        updateTable(sort(sortBy.value))
    })
})

const filterCountries = () => {
    const regionCount = regionFilters.length
    const statusCount = statusFilters.length
    let filteredCountries = countries
    if (regionCount > 0 && statusCount > 0) {
        filteredCountries = countries.filter((country) => {
            if (regionFilters.includes(country.region.toLowerCase()) && statusFilters.includes('unmember') && country.unMember || regionFilters.includes(country.region.toLowerCase()) && statusFilters.includes('independent') && country.independent)
                return country
        })
    } else if (regionCount > 0 && statusCount === 0) {
        filteredCountries = countries.filter((country) => {
            if (regionFilters.includes(country.region.toLowerCase()))
                return country
        })
    } else if (statusCount > 0) {
        if (statusCount === 2) {
            filteredCountries = countries.filter((country) => {
                if (country.unMember || country.independent)
                    return country
            })
        }
        else if (statusCount === 1 && statusFilters.includes('independent')) {
            filteredCountries = countries.filter((country) => {
                if (country.independent)
                    return country
            })
        }
        else if (statusCount === 1 && statusFilters.includes('unmember')) {
            filteredCountries = countries.filter((country) => {
                if (country.unMember)
                    return country
            })
        }
    }
    return filteredCountries
}

const updateTable = (countries) => {
    const table = document.getElementById('country-table')
    document.querySelector('#country-table').removeChild(document.querySelector('#country-table>tbody'))
    const newTable = document.createElement('tbody')
    countries.forEach((country, i) => {
        const row = newTable.insertRow(i)
        row.setAttribute('name', country.name.common)
        row.addEventListener("click", (e) => {
            trClickListener(e, row.getAttribute('name'))
        })
        let c1 = row.insertCell(0)
        let c2 = row.insertCell(1)
        let c3 = row.insertCell(2)
        let c4 = row.insertCell(3)
        let c5 = row.insertCell(4)
        c1.innerHTML = country.flag
        c2.innerHTML = country.name.common
        c3.innerHTML = country.population.toLocaleString("en-US")
        c4.innerHTML = country.area.toLocaleString("en-US")
        c5.innerHTML = country.region
    })
    table.appendChild(newTable)
}

const searchText = document.getElementById('search-text')
searchText.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        search(searchText.value)
        searchText.value = ''
    }
})

const search = (searchText) => {
    const searchedCountry = countries.filter(country => {
        if (country.name.common.toLowerCase().includes(searchText) || country.region.toLowerCase().includes(searchText) || country.subregion && country.subregion.toLowerCase().includes(searchText)) {
            return country
        }
    })
    updateTable(searchedCountry)
}