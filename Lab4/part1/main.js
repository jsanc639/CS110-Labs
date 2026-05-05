
const API_KEY = "1rLe5VJoJdfCwKQC66cGAXEX3udbWvrdUn8oNlww6HtUYmPo";

// Constructs the API endpoint URL using the given sorting and time frame.
function buildApiUrl(sortType, period) {
    return `https://api.nytimes.com/svc/mostpopular/v2/${sortType}/${period}.json?api-key=${API_KEY}`;
}

// Gets the article's image URL, preferring the 'mediumThreeByTwo210' format.
function getImageUrl(article) {
    const mediaItem = article.media[0];
    if (!mediaItem || mediaItem.type !== "image") return null;

    const formats = mediaItem["media-metadata"];
    const preferred = formats.find(f => f.format === "mediumThreeByTwo210");
    return preferred ? preferred.url : formats[formats.length - 1]?.url ?? null;
}

// Formats a date string (YYYY-MM-DD) into a more readable format (e.g., "Apr 19, 2024").
function formatDate(dateStr) {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

// Creates and returns the HTML element for a single article card.
function createArticleCard(article) {
    const imageUrl = getImageUrl(article);

    const card = document.createElement("div");
    card.classList.add("article-card");

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = article.title;

    const content = document.createElement("div");
    content.classList.add("article-content");

    const title = document.createElement("h3");
    const titleLink = document.createElement("a");
    titleLink.href = article.url;
    titleLink.target = "_blank";
    titleLink.rel = "noopener noreferrer";
    titleLink.textContent = article.title;
    title.appendChild(titleLink);

    const abstract = document.createElement("p");
    abstract.textContent = article.abstract;

    content.appendChild(title);
    content.appendChild(abstract);

    const date = document.createElement("span");
    date.classList.add("article-date");
    date.textContent = formatDate(article.published_date);

    card.appendChild(img);
    card.appendChild(content);
    card.appendChild(date);

    return card;
}

// Gets articles and displays the first 5 valid ones, skipping any with errors or missing images.
async function fetchAndRenderArticles(sortType, period) {
    const container = document.getElementById("articles-container");
    container.innerHTML = "<p>Loading articles...</p>";

    const url = buildApiUrl(sortType, period);

    let allArticles;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        allArticles = data.results;
    } catch (err) {
        container.innerHTML = `<p style="color:red;">Failed to load articles. Please check your API key or network connection.<br>${err.message}</p>`;
        console.error("Fetch error:", err);
        return;
    }

    container.innerHTML = "";
    let displayed = 0;

    for (let i = 0; i < allArticles.length && displayed < 5; i++) {
        try {
            const article = allArticles[i];

            const imageUrl = getImageUrl(article);
            if (!imageUrl) throw new Error("No valid image found");
            if (!article.title || !article.abstract || !article.published_date) {
                throw new Error("Missing required article fields");
            }

            const card = createArticleCard(article);
            container.appendChild(card);
            displayed++;
        } catch (err) {
            console.warn(`Skipping article at index ${i}:`, err.message);
        }
    }

    if (displayed === 0) {
        container.innerHTML = "<p>No articles could be loaded at this time.</p>";
    }
}

function updateArticles() {
    const sortType = document.querySelector('input[name="sortType"]:checked').value;
    const timeFrame = document.querySelector('input[name="timeFrame"]:checked').value;
    fetchAndRenderArticles(sortType, timeFrame);
}

function initFilters() {
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.addEventListener("change", updateArticles);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initFilters();
    updateArticles();
});