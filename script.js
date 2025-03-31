document.addEventListener('DOMContentLoaded', function () {
    let devotionalData = [];
    let currentIndex = 0;

    function formatDate(date) {
        const options = { month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function renderDevotional(index) {
        console.log("Rendering devotional at index:", index);
        const data = devotionalData[index];
        if (!data) {
            console.warn("No data found for index:", index);
            return;
        }

        console.log("Devotional data:", data);

        const content = `
            <div class="devotional-card">
                <div class="devotional-date">${data.Title}</div>
                <div class="day-of-week">${data.Day.toUpperCase()}</div>
                <div class="devotional-content">${data.DevoText.split('\n').map(p => `<p>${p}</p>`).join('')}</div>
                <div class="author">Larry Stockstill</div>
            </div>
            <div class="scripture-card">
                <h2 class="scripture-heading">Scripture Reading</h2>
                <div class="scripture-list">
                    ${['Ot','Nt','Psalm','Prov'].map(label => `
                        <div class="scripture-item">
                            <span class="scripture-label">${label === 'Ot' ? 'Old Testament' : label === 'Nt' ? 'New Testament' : label === 'Prov' ? 'Proverbs' : label}</span>
                            <div class="scripture-reference">${data[label]}</div>
                            <div class="scripture-links">
                                <a class="link-btn" href="https://www.biblegateway.com/passage/?search=${encodeURIComponent(data[label])}&version=NIV" target="_blank">NIV</a>
                                <a class="link-btn" href="https://www.biblegateway.com/passage/?search=${encodeURIComponent(data[label])}&version=NLT" target="_blank">NLT</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="audio-card">
                <h2 class="audio-heading">Listen</h2>
                <div class="audio-player">
                    <audio controls>
                        <source src="${data.AudioFile}" type="audio/mpeg">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            </div>
            <div class="all-passages-card">
                <h2 class="all-passages-heading">Read All of Today's Passages</h2>
                <div class="all-passages-links">
                    <a class="link-btn" href="https://www.biblegateway.com/passage/?search=${encodeURIComponent(data.Ot + '; ' + data.Nt + '; ' + data.Psalm + '; ' + data.Prov)}&version=NIV" target="_blank">NIV</a>
                    <a class="link-btn" href="https://www.biblegateway.com/passage/?search=${encodeURIComponent(data.Ot + '; ' + data.Nt + '; ' + data.Psalm + '; ' + data.Prov)}&version=NLT" target="_blank">NLT</a>
                </div>
            </div>
        `;

        document.getElementById('devotional-content').innerHTML = content;
        document.getElementById('prevDay').disabled = (index === 0);
        document.getElementById('nextDay').disabled = (index === devotionalData.length - 1);
        currentIndex = index;
    }

    function loadToday() {
        const todayStr = formatDate(new Date());
        const found = devotionalData.findIndex(d => d.Title === todayStr);
        console.log("Today's index found:", found);
        renderDevotional(found !== -1 ? found : 0);
    }

    fetch('https://raw.githubusercontent.com/sce28335/OneYearBible/main/reading_ref.json')
        .then(response => {
            console.log("Fetch response status:", response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetched devotional data:", data);
            devotionalData = data;
            loadToday();
        })
        .catch(error => console.error('Error fetching JSON:', error));

    document.getElementById('prevDay').onclick = () => {
        console.log("Previous Day button clicked");
        if (currentIndex > 0) renderDevotional(currentIndex - 1);
    };
    document.getElementById('nextDay').onclick = () => {
        console.log("Next Day button clicked");
        if (currentIndex < devotionalData.length - 1) renderDevotional(currentIndex + 1);
    };
    document.getElementById('todayBtn').onclick = () => {
        console.log("Today button clicked");
        loadToday();
    };
});
