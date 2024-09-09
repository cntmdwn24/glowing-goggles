let player;
const apiKey = 'YOUR_YOUTUBE_API_KEY'; // 자신의 API 키로 교체하세요
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');
const playlist = document.getElementById('playlist');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const playerContainer = document.getElementById('playerContainer');
let currentTrackIndex = 0;
let loopMode = 'none'; // 'none', 'track', 'playlist'

searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
        searchYouTube(query);
    }
});

function searchYouTube(query) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=10&q=${encodeURIComponent(query)}&key=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayResults(data.items);
        })
        .catch(error => console.error('Error fetching YouTube data:', error));
}

function displayResults(results) {
    resultsContainer.innerHTML = '';
    results.forEach(result => {
        const { id, snippet } = result;
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';

        const thumbnail = document.createElement('img');
        thumbnail.src = snippet.thumbnails.medium.url;
        thumbnail.alt = snippet.title;

        const title = document.createElement('h4');
        title.innerText = snippet.title;

        const addButton = document.createElement('button');
        addButton.className = 'add-to-playlist-button';
        addButton.innerText = 'Add to Playlist';
        addButton.onclick = () => addToPlaylist(id.videoId, snippet.thumbnails.medium.url, snippet.title, snippet.channelTitle);

        resultItem.appendChild(thumbnail);
        resultItem.appendChild(title);
        resultItem.appendChild(addButton);
        resultsContainer.appendChild(resultItem);
    });
}

function addToPlaylist(videoId, imageUrl, title, artist) {
    const playlistItem = document.createElement('li');
    playlistItem.innerHTML = `
        <img src="${imageUrl}" alt="${title}" class="track-image">
        <div class="track-info">
            <h2>${title}</h2>
            <p>${artist}</p>
        </div>
    `;

    playlistItem.onclick = () => playTrack(videoId, imageUrl, title, artist);
    playlist.appendChild(playlistItem);
}

function playTrack(videoId, imageUrl, title, artist) {
    if (!player) {
        player = new YT.Player('playerContainer', {
            height: '315',
            width: '560',
            videoId: videoId,
            playerVars: { 'autoplay': 1, 'controls': 1 },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    } else {
        player.loadVideoById(videoId);
    }

    trackTitle.innerText = title;
    trackArtist.innerText = artist;
}

function onPlayerReady(event) {
    event.target.playVideo();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        playNextTrack();
    }
}

function playNextTrack() {
    const tracks = playlist.getElementsByTagName('li');
    if (loopMode === 'track') {
        const currentTrackButton = tracks[currentTrackIndex];
        currentTrackButton.click();
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        if (currentTrackIndex === 0 && loopMode === 'none') return;
        const nextTrackButton = tracks[currentTrackIndex];
        nextTrackButton.click();
    }
}

// Additional controls for play, pause, next, and previous
document.getElementById('prevTrack').addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.children.length) % playlist.children.length;
    playNextTrack();
});

document.getElementById('playPause').addEventListener('click', () => {
    if (player) {
        if (player.getPlayerState() === YT.PlayerState.PLAYING) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    }
});

document.getElementById('nextTrack').addEventListener('click', () => {
    playNextTrack();
});

document.getElementById('loopPlaylist').addEventListener('click', () => {
    loopMode = 'playlist';
    showCustomMessage('Loop Playlist mode enabled');
});

document.getElementById('loopTrack').addEventListener('click', () => {
    loopMode = 'track';
    showCustomMessage('Repeat Track mode enabled');
});

// Create a callback function for when the API is ready
function onYouTubeIframeAPIReady() {
    console.log('YouTube IFrame API is ready');
}

function showCustomMessage(message) {
    const messageContainer = document.createElement('div');
    messageContainer.className = 'custom-message';
    messageContainer.innerText = message;
    document.body.appendChild(messageContainer);
    setTimeout(() => {
        document.body.removeChild(messageContainer);
    }, 3000);
}