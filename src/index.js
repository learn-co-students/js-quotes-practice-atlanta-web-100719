const QUOTES_URL = 'http://localhost:3000/quotes';
const LIKES_URL = 'http://localhost:3000/likes';
window.addEventListener('DOMContentLoaded', () => {

    form = document.querySelector('#new-quote-form');
    form.addEventListener('submit', newQuote)

    fetchQuotes();

    function fetchQuotes() {
        fetch(QUOTES_URL + '?_embed=likes')
            .then(res => res.json())
            .then(showQuotes)
    }

    function showQuotes(quotes) {
        quotes.forEach(addQuote)
    }

    function addQuote(quote) {
        const ul = document.querySelector('#quote-list');

        const li = document.createElement('li');
        li.className = 'quote-card';

        const blockquote = document.createElement('blockquote');
        blockquote.className = 'blockquote'

        const p = document.createElement('p');
        p.className = 'mb-0';
        p.innerText = quote.quote;
        blockquote.appendChild(p);

        const footer = document.createElement('footer');
        footer.className = 'blockquote-footer';
        footer.innerText = quote.author;
        blockquote.appendChild(footer);

        const br = document.createElement('br');
        blockquote.appendChild(br);

        const span = document.createElement('span');
        span.innerText = quote.likes ? quote.likes.length : 0

        const button1 = document.createElement('button');
        button1.className = 'btn-success';
        button1.innerText = 'Likes: ';
        button1.appendChild(span);
        blockquote.appendChild(button1);
        button1.addEventListener('click', (event) => {
            addLike(event, quote);
        })

        const button2 = document.createElement('button');
        button2.className = 'btn-danger';
        button2.innerText = 'Delete';
        blockquote.appendChild(button2);
        button2.addEventListener('click', (event) => {
            deleteQuote(event, quote);
        })

        li.appendChild(blockquote)
        ul.appendChild(li);
    }

    function newQuote(event) {
        event.preventDefault()
        const newQuote = form.querySelector('#new-quote').value;
        const author = form.querySelector('#author').value;

        fetch(QUOTES_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quote: newQuote,
                author: author
            })
        })
            .then(res => res.json())
            .then(addQuote)
    }

    function deleteQuote(event, quote) {
        fetch(QUOTES_URL + '/' + quote.id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            })
        })
            .then(res => res.json())
            .then(quote => {
                event.target.parentNode.parentNode.remove();
            })
    }

    function addLike(event, quote) {
        fetch(LIKES_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quoteId: quote.id,
                createdAt: Math.floor(Date.now() / 1000)
            })
        })
            .then(res => res.json())
            .then(like => {
                const span = event.target.parentNode.querySelector('.btn-success span')
                span.innerText = 1 + Number.parseInt(span.innerText)
            })
    }
})