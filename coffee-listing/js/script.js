let coffees = {}

fetch('https://raw.githubusercontent.com/devchallenges-io/web-project-ideas/main/front-end-projects/data/simple-coffee-listing-data.json')
    .then(response => response.json())
    .then(data => {
        coffees = data
        populate(data)
        console.log(data)
    })
    .catch(error => {
        console.log(error)
    })

const populate = (data) => {
    const menu = document.querySelector('.menu')
    console.log(menu.childElementCount)
    if (menu.childElementCount > 0)
        menu.replaceChildren()

    data.forEach(coffee => {
        const item = document.createElement('div')
        item.className= 'item'

        const itemHeader = document.createElement('div')
        itemHeader.className = 'item-header'
        if (coffee.popular) {
            const isPopular = document.createElement('span')
            isPopular.className = 'is-popular text-sm'
            isPopular.innerHTML = 'Popular'
            itemHeader.appendChild(isPopular)
        }
        const itemImg = document.createElement('img')
        itemImg.className = 'item-img'
        itemImg.src = coffee.image
        itemHeader.appendChild(itemImg)
        
        const itemBody = document.createElement('div')
        itemBody.className = 'item-body'
        const name = document.createElement('p')
        name.className = 'name'
        name.innerHTML = coffee.name
        const ratingPanel = document.createElement('span')
        ratingPanel.className = 'rating-panel'
        const star = document.createElement('img')
        star.className = 'star'
        const rating = document.createElement('label')
        rating.className = 'rating'
        if (coffee.rating !== null) {
            star.src = 'images/Star_fill.svg'
            rating.innerHTML = coffee.rating
            const votes = document.createElement('label')
            votes.className = 'votes'
            votes.innerHTML = `(${coffee.votes} votes)`
            ratingPanel.appendChild(star)
            ratingPanel.appendChild(rating)
            ratingPanel.appendChild(votes)
        } else {
            star.src = 'images/Star.svg'
            rating.innerHTML = "No ratings"
            ratingPanel.appendChild(star)
            ratingPanel.appendChild(rating)
        }

        const price = document.createElement('span')
        price.className = 'price'
        const priceText = document.createElement('price-text')
        priceText.className = 'price-text'
        priceText.innerHTML = coffee.price
        price.appendChild(priceText)

        itemBody.appendChild(name)
        itemBody.appendChild(ratingPanel)
        itemBody.appendChild(price)

        if (!coffee.available) {
            const soldOut = document.createElement('span')
            soldOut.className = 'sold-out'
            soldOut.innerHTML = 'Sold out'
            itemBody.appendChild(soldOut)
        }
        
        item.appendChild(itemHeader)
        item.appendChild(itemBody)
        menu.appendChild(item)
    })
}

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        Array.from(e.target.parentElement.children).forEach(btn => {
            if (btn.classList.contains('active')) 
                btn.classList.remove('active')
        })
        e.target.classList.add('active')

        let coffeesTemp = coffees
        if (e.target.id === 'available') {
            coffeesTemp = coffees.filter(coffee => {
                if (coffee.available)
                    return true
            })
        }
        populate(coffeesTemp)
    })
})