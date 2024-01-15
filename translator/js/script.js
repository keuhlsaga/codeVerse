let translateFrom = 'en';
let translateTo = ''

const translate = (words, translateFrom, translateTo) => {
    fetch(`https://api.mymemory.translated.net/get?q=${words}&langpair=${translateFrom}|${translateTo}`)
        .then(response => response.json())
        .then(data => {
            const translatedText = document.getElementById('translated-text')
            translatedText.innerText = data.responseData.translatedText
            console.log(data)
        })
        .catch(error => {
            console.log(error)
        })
}

fetch('csv/language-codes_csv.csv')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.text()
    })
    .then(csvData => {
        // Parse CSV data
        const rows = csvData.split('\n').map(row => row.split(','))
        rows.shift()
        rows.sort((a, b) => {
            if (a[1].replaceAll('"', '') > b[1].replaceAll('"', '')) {
                return true
            }
        })
        console.log('CSV Data:', rows)

        const [dropdown1, dropdown2] = document.querySelectorAll('.dropdown')

        rows.forEach((row, i) => {
            const item = document.createElement('li')
            item.className = 'language-options'
            item.setAttribute('data-value', row[0])
            const name = row[1].replaceAll('"', '')
            item.innerHTML = name
            const clone = item.cloneNode(true)
            dropdown1.appendChild(item)
            dropdown2.appendChild(clone)
        })

        dropdown1.addEventListener('mousedown', (e) => {
            translateFrom = e.target.getAttribute('data-value')
        })

        dropdown2.addEventListener('mousedown', (e) => {
            translateTo = e.target.getAttribute('data-value')
        })
    })
    .catch(error => console.error('Error fetching CSV:', error))

document.getElementById('from-select').addEventListener('click', (e) => {
    e.preventDefault()
})

document.getElementById('to-select').addEventListener('click', (e) => {
    e.preventDefault()
})

document.getElementById('translate-btn').addEventListener('click', (e) => {
    const words = document.getElementById('translate-text').value
    console.log('word: ', words, ' | ', translateFrom, ' --- ', translateTo)
    translate(words, translateFrom, translateTo)
})

document.getElementById('switch-language').addEventListener('click', (e) => {
    e.preventDefault()
    const temp = translateFrom
    translateFrom = translateTo
    translateTo = temp
})

document.getElementById('from-copy').addEventListener('click', (e) => {
    copy(document.getElementById('translate-text'))
})

document.getElementById('to-copy').addEventListener('click', (e) => {
    copy(document.getElementById('translated-text'))
})

const copy = (textarea) => {
    textarea.select();
    textarea.setSelectionRange(0, 99999); /* For mobile devices */

    // Copy the selected text to the clipboard
    document.execCommand("copy");

    // Deselect the textarea
    textarea.setSelectionRange(0, 0);
}