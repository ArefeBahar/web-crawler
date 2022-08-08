let id = '';

document.getElementById('id').addEventListener('input', e => id = e.target.value);

const fetchData = () => {
    fetch(`./${id}_google_scholar.json`)
        .then(response => response.json()).then(jsondata => {
            if (document.getElementById('error_message').style.display === 'block') {
                document.getElementById('error_message').style.display = 'none';
            }
            
            document.getElementById('Image').src=jsondata.img;
            document.getElementById('head').innerHTML=jsondata.name;
            document.getElementById('inf').innerHTML=jsondata.info;
            document.getElementById('tags').innerHTML=jsondata.tags;

            for (i = 0; i < jsondata.articles.length; i++) {
                const article = jsondata.articles[i];
                document.getElementById('articles').innerHTML += `
                    <div>
                        <p>${article.title}</p>
                        <p>${article.authors}</p>
                        <p>${article.journal}</p>
                        <p>${article.cited_by}</p>
                        <p>${article.year}</p>
                    </div>
                `;
            }

        })
        .catch(() => {
            document.getElementById('error_message').style.display = 'block';
        });
}


