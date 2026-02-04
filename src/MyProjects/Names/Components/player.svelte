<script>
    import audioSrc from '../../../assets/Projects/Names/Names1.mp3';

    let audio;
    let isPlaying = false;
    let currentTime = 0;
    let duration = 0;
    let selectedSong = audioSrc;
    let isDragging = false;
    let progressBar;
    import {language, nameId, audioPlaying, audioCurrentTime, seekToTime } from '../Stores/misc';
    import namesData from './names.js';

    // Subscribe to seekToTime to jump to a specific timestamp when a name is clicked
    $: if ($seekToTime !== null && audio) {
        audio.currentTime = $seekToTime;
        currentTime = $seekToTime;
        audioCurrentTime.set($seekToTime);
        seekToTime.set(null); // Reset after seeking
    }


    function togglePlay() {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        isPlaying = !isPlaying;
        audioPlaying.set(isPlaying);
    }

    function handleTimeUpdate() {
        if (!isDragging) {
            currentTime = audio.currentTime;
            audioCurrentTime.set(currentTime);
            updateNameIdBasedOnTime();
        }
    }

    function updateNameIdBasedOnTime() {
        // Find the most recent name based on current time
        let closestId = null;
        let closestTime = -1;

        for (const [id, nameData] of Object.entries(namesData)) {
            if (nameData.timestamp1 !== null &&
                nameData.timestamp1 <= currentTime &&
                nameData.timestamp1 > closestTime) {
                closestTime = nameData.timestamp1;
                closestId = parseInt(id);
            }
        }

        if (closestId !== null) {
            nameId.set(closestId);
        }
    }

    function handleLoadedMetadata() {
        duration = audio.duration;
        // Initialize nameId when audio loads
        updateNameIdBasedOnTime();
    }

    function handleSeek(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const percentage = x / rect.width;
        audio.currentTime = percentage * duration;
        audioCurrentTime.set(audio.currentTime);
    }

    function handleMouseDown(event) {
        isDragging = true;
        updateProgressFromMouse(event);
    }

    function handleMouseMove(event) {
        if (isDragging) {
            updateProgressFromMouse(event);
        }
    }

    function handleMouseUp(event) {
        if (isDragging) {
            isDragging = false;
            updateProgressFromMouse(event);
            audio.currentTime = currentTime;
            updateNameIdBasedOnTime();
        }
    }

    function updateProgressFromMouse(event) {
        if (!progressBar) return;
        const rect = progressBar.getBoundingClientRect();
        const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
        const percentage = x / rect.width;
        currentTime = percentage * duration;
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    $: progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    $: currentTimeFormatted = formatTime(currentTime);
    $: durationFormatted = formatTime(duration);
</script>

<svelte:window on:mousemove={handleMouseMove} on:mouseup={handleMouseUp} />

<div class="player-container">
    <button class="play-button" on:click={togglePlay}>
        {#if isPlaying}
            <!-- Pause Icon -->
            <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
            </svg>
        {:else}
            <!-- Play Icon -->
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>
        {/if}
    </button>
    
    <div class="controls">
        <div class="progress-container">
            <span class="time-display">{currentTimeFormatted}</span>
            <div
                class="progress-bar"
                bind:this={progressBar}
                on:click={handleSeek}
                on:mousedown={handleMouseDown}
            >
                <div class="progress-fill" style="width: {progress}%"></div>
                <div
                    class="progress-handle"
                    class:dragging={isDragging}
                    style="left: {progress}%"
                ></div>
            </div>
            <span class="time-display">{durationFormatted}</span>
        </div>
    </div>
    
    <audio 
        bind:this={audio}
        src={selectedSong}
        on:timeupdate={handleTimeUpdate}
        on:loadedmetadata={handleLoadedMetadata}
        on:ended={() => {
            isPlaying = false;
            audioPlaying.set(false);
        }}
    />
</div>

<style>
        @font-face {
    font-family: 'NotoKufiArabic';
    src: url('../Assests/NotoKufiArabic-Regular.ttf') format('truetype');
    font-weight: 400;
  }

  @font-face {
    font-family: 'NotoKufiArabic';
    src: url('../Assests/NotoKufiArabic-Bold.ttf') format('truetype');
    font-weight: 700;
  }
    @font-face {
    font-family: 'JawiKufi';
    src: url('../Assests/JawiKufi-nOR1.ttf') format('truetype');
    font-weight: 400;
  }

    .player-container {
        display: flex;
        align-items: center;
        gap: 1.5vw; /* 1.5rem */
        padding: 1vw; /* 1rem */
        background-color: none;
        max-width: 100%;
        width: 100%;
    }

    .play-button {
        width: 3.75vw; /* 60px */
        height: 3.75vw; /* 60px */
        border-radius: 50%;
        background-color: #266F8C;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
        flex-shrink: 0;
    }

    .play-button:hover {
        transform: scale(1.05);
    }

    .play-button svg {
        width: 1.75vw; /* 28px */
        height: 1.75vw; /* 28px */
        color: #FDEDDB;
    }

    .controls {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.5vw; /* 0.5rem */
    }

    .progress-container {
        display: flex;
        align-items: center;
        gap: 1vw; /* 1rem */
    }

    .time-display {
        font-family: 'JawiKufi', sans-serif;
        font-size: 2.5vw; /* increased from 1.8vw */
        color: #266F8C;
        font-weight: 500;
        min-width: 5vw; /* 80px */
        text-align: center;
    }

    .progress-bar {
        position: relative;
        flex: 1;
        height: 0.625vw; /* 10px */
        background-color: #d0d0d0;
        border-radius: 0.3vw; /* 5px */
        cursor: pointer;
    }

    .progress-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-color: #AB8A7E;
        border-radius: 0.3vw; /* 5px */
        transition: width 0.1s linear;
    }

    .progress-handle {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 1.125vw; /* 18px */
        height: 1.125vw; /* 18px */
        background-color: #266F8C;
        border-radius: 50%;
        transition: left 0.1s linear;
        cursor: grab;
    }

    .progress-handle.dragging {
        cursor: grabbing;
        transform: translate(-50%, -50%) scale(1.2);
        transition: transform 0.1s ease;
    }

    .progress-bar {
        user-select: none;
    }
</style>