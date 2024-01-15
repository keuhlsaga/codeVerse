document.addEventListener('DOMContentLoaded', function (event) {
    const search = document.getElementById('search-bar')
    const searchResult = document.getElementById('search-result')
    const resultImg = document.getElementById('user-img')
    const name = document.getElementById('user-name')
    const bio = document.getElementById('user-bio')
    const repositories = document.querySelector('.repositories')
    const notFound = document.querySelector('.not-found')
    const loader = document.querySelector('.loader')
    let user, repos
    search.value = '';
    search.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const timeout = setTimeout(() => {
                loader.classList.remove('hidden')
            }, 500)
            fetch(`https://api.github.com/users/${search.value}`)
                .then(response => response.json())
                .then(data => {
                    searchResult.classList.remove('hidden')
                    notFound.classList.add('hidden')
                    clearTimeout(timeout)
                    if (!data.message) {
                        loader.classList.add('hidden')
                        user = data;
                        resultImg.src = data.avatar_url;
                        name.textContent = data.name ?? 'No name available';
                        bio.textContent = data.bio ?? 'No bio available';

                        fetch(`https://api.github.com/users/${search.value}/repos`)
                            .then(response => response.json())
                            .then(data => {
                                repos = data;
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    } else {
                        loader.classList.add('hidden')
                        notFound.classList.remove('hidden')
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
    })

    const dateDayDifference = (date => {
        const isoDate = new Date(date)
        const currentDate = new Date()
        return Math.round((currentDate - isoDate) / (1000 * 3600 * 24))
    })

    const populateRepositories = () => {
        repositories.replaceChildren()

        repos.forEach(repo => {
            const div = Object.assign(document.createElement('div'), { className: 'repository' })
            const h2 = Object.assign(document.createElement('h2'), {
                className: 'repository__title',
                textContent: repo.name
            })
            const p = Object.assign(document.createElement('p'), {
                className: 'repository__description',
                textContent: repo.description ?? 'No description available'
            })
            const div2 = Object.assign(document.createElement('div'), { className: 'flex-group' })
            const img1 = Object.assign(document.createElement('img'), { src: 'images/Chield_alt.svg' })
            const p1 = Object.assign(document.createElement('p'), { textContent: '' })
            const img2 = Object.assign(document.createElement('img'), { src: 'images/Nesting.svg' })
            const p2 = Object.assign(document.createElement('p'), { textContent: repo.forks_count })
            const img3 = Object.assign(document.createElement('img'), { src: 'images/Star.svg' })
            const p3 = Object.assign(document.createElement('p'), { textContent: repo.stargazers_count })
            div2.appendChild(img1)
            div2.appendChild(p1)
            div2.appendChild(img2)
            div2.appendChild(p2)
            div2.appendChild(img3)
            div2.appendChild(p3)
            const updatedAt = dateDayDifference(repo.updated_at.toString())
            let day = 'days'
            if (updatedAt === 1) {
                day = 'day'
            }
            if (updatedAt > 0) {
                const p4 = Object.assign(document.createElement('p'), { textContent: `updated ${updatedAt} ${day} ago` })
                div2.appendChild(p4)
            }
            div.appendChild(h2)
            div.appendChild(p)
            div.appendChild(div2)
            repositories.appendChild(div)
        })
    }

    searchResult.addEventListener('click', (e) => {
        const image = document.getElementById('profile-image')
        const follower = document.getElementById('follower')
        const following = document.getElementById('following')
        const location = document.getElementById('location')
        const profileImage = document.getElementById('profile-image')

        const profileName = document.getElementById('profile-name')
        const profileBio = document.getElementById('profile-bio')
        image.src = user.avatar_url
        follower.textContent = user.followers
        following.textContent = user.following
        location.textContent = user.location ?? 'Not stated'
        profileImage.src = user.avatar_url
        profileName.textContent = user.name ?? 'No name available'
        profileBio.textContent = user.bio ?? 'No bio available'

        search.value = '';
        searchResult.classList.add('hidden')

        populateRepositories()
    })
})