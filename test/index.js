let currentTrackIndex = 0;
let loopMode = 'none';  // 'none', 'track', 'playlist'

// 음악 추가 기능
document.getElementById('addMusicButton').addEventListener('click', function() {
    const fileInput = document.getElementById('fileInput');
    const playlist = document.getElementById('playlist');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const url = URL.createObjectURL(file);
        
        const listItem = document.createElement('li');
        const audioElement = document.createElement('audio');
        audioElement.controls = true;
        audioElement.src = url;
        audioElement.className = 'styled-audio';

        const showVideoButton = document.createElement('button');
        showVideoButton.textContent = 'Show Video';
        showVideoButton.className = 'show-video';
        showVideoButton.setAttribute('data-title', file.name);
        showVideoButton.setAttribute('data-description', `Description for ${file.name}`);

        showVideoButton.addEventListener('click', function() {
            updateMainContent(url, file.name, `Description for ${file.name}`);
            currentTrackIndex = Array.from(playlist.children).indexOf(listItem);
        });

        listItem.appendChild(audioElement);
        listItem.appendChild(showVideoButton);
        playlist.appendChild(listItem);

        fileInput.value = '';
    } else {
        alert('ㅎㅇ.');
    }
});

function updateMainContent(videoUrl, title, description) {
    const mainVideo = document.getElementById('mainVideo');
    const musicTitle = document.getElementById('musicTitle');
    const musicDescription = document.getElementById('musicDescription');

    mainVideo.src = videoUrl;
    mainVideo.play();

    musicTitle.textContent = title;
    musicDescription.textContent = description;

    mainVideo.onended = function() {
        playNextTrack();
    };
}

// 다음 트랙 재생 함수
function playNextTrack() {
    const playlist = document.getElementById('playlist');
    const tracks = playlist.getElementsByTagName('li');

    if (loopMode === 'track') {
        // 같은 트랙 반복
        const currentTrackButton = tracks[currentTrackIndex].querySelector('.show-video');
        currentTrackButton.click();
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;

        if (currentTrackIndex === 0 && loopMode === 'none') return;  // 루프 모드가 아니면 중지

        const nextTrackButton = tracks[currentTrackIndex].querySelector('.show-video');
        nextTrackButton.click();
    }
}

// 루프 모드 버튼 이벤트 리스너 추가
document.getElementById('loopPlaylist').addEventListener('click', function() {
    loopMode = 'playlist';
    alert('Loop Playlist mode enabled');
});

document.getElementById('loopTrack').addEventListener('click', function() {
    loopMode = 'track';
    alert('Repeat Track mode enabled');
});

// 기존 음악 목록의 버튼에 이벤트 리스너 추가
document.querySelectorAll('.show-video').forEach((button, index) => {
    button.addEventListener('click', function() {
        const title = this.getAttribute('data-title');
        const description = this.getAttribute('data-description');
        const audioSrc = this.previousElementSibling.src;
        currentTrackIndex = index;
        updateMainContent(audioSrc, title, description);
    });
});