/* eslint-env jquery */

(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        $.ajax({
            url:
            `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
            headers: {
                Authorization: 'Client-ID yNBiipQiQhjyBWt-9Yl3ZcbwencwwzdJYc24ieXFvHk'
            }
        }).done(addImage)
        .fail(function (err) {
            requestError(err, 'image')
        });

        function addImage(data){
            let htmlContent = '';

            if (data && data.results && data.results.length > 1) {
                const firstImage = data.results[0];
                htmlContent = `<figure>
                    <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                    <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                </figure>`;
            } else {
                htmlContent = `<div class="error-no-image">No images available</div>`;
            }
            responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
        }


        $.ajax({
            url: `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=b22852oZtg1qS1AfvCBGR8oTqByrvz2W`
        }).done(addArticles)
        .fail(function (err) {
            requestError(err, 'articles')
        });

        function addArticles (data) {
            let htmlContent = '';
            
            if (data.response && data.response.docs && data.response.docs.length > 1) {
                htmlContent = `<ul>` + data.response.docs.map(article => `<li class="article">
                <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                <p>${article.snippet}</p>
                </li>`
                ).join('') + `</ul>`;
            } else {
                htmlContent = `<div class="error-no-articles">No articles available</div>`;
            }
            responseContainer.insertAdjacentHTML('beforeend', htmlContent);
        }
    });
})();
