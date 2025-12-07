<script>
    let audio;
    let isPlaying = false;
    let currentTime = 0;
    let duration = 0;
    let selectedSong = '../../../../src/MyProjects/Names/Assests/Names1.mp3';
    let showDropdown = false;
    let isDragging = false;
    let progressBar;
    import {language, nameId } from '../Stores/misc';
    import namesData from './names.js';

    $:songs = [
        { value: '../../../../src/MyProjects/Names/Assests/Names1.mp3', label: $language === 'English' ? 'Lotfi Bouchnek - Asmaa Allah Al Hosna' : 'لطفي بوشناق - أسماء اللّه الحسنى' },
        { value: '../../../../src/MyProjects/Names/Assests/Names2.mp3', label: $language === 'English' ? 'Sami Yusuf - The 99 Names' : 'سامي يوسف - أسماء الله الحسنى' },
        { value: '../../../../src/MyProjects/Names/Assests/Names3.mp3', label: $language === 'English' ? 'Hisham Abbas - Asmaa Allah Al Hosna'  : 'هشام عبّاس - أسماء اللّه الحسنى'}
    ];

    function togglePlay() {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        isPlaying = !isPlaying;
    }

    function handleTimeUpdate() {
        if (!isDragging) {
            currentTime = audio.currentTime;
            updateNameIdBasedOnTime();
        }
    }

    function updateNameIdBasedOnTime() {
        // Find the name whose timestamp1 matches the current time
        for (const [id, nameData] of Object.entries(namesData)) {
            if (nameData.timestamp1 !== null &&
                Math.abs(currentTime - nameData.timestamp1) < 0.5) {
                nameId.set(parseInt(id));
                break;
            }
        }
    }

    function handleLoadedMetadata() {
        duration = audio.duration;
    }

    function handleSeek(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const percentage = x / rect.width;
        audio.currentTime = percentage * duration;
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
        }
    }

    function updateProgressFromMouse(event) {
        if (!progressBar) return;
        const rect = progressBar.getBoundingClientRect();
        const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
        const percentage = x / rect.width;
        currentTime = percentage * duration;
    }
    
    function selectSong(song) {
        const wasPlaying = isPlaying;
        if (isPlaying) {
            audio.pause();
        }
        selectedSong = song;
        showDropdown = false;
        
        // Wait for audio element to update, then play if it was playing before
        setTimeout(() => {
            if (wasPlaying) {
                audio.play();
                isPlaying = true;
            }
        }, 100);
    }
    
    function toggleDropdown() {
        showDropdown = !showDropdown;
    }
    
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    $: progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    $: selectedLabel = songs.find(s => s.value === selectedSong)?.label || 'Select Song';
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
        <div class="dropdown-container">
          {#if $language === 'English'}
            <button class="dropdown-button-en" on:click={toggleDropdown}>
                <span>{selectedLabel}</span>
                <svg class="arrow" class:open={showDropdown} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10l5 5 5-5z"/>
                </svg>
            </button>

            {#if showDropdown}
                <div class="dropdown-menu">
                    {#each songs as song}
                        <button 
                            class="dropdown-item-en"
                            class:active={selectedSong === song.value}
                            on:click={() => selectSong(song.value)}
                        >
                            {song.label}
                        </button>
                    {/each}
                </div>
             {/if}
        {:else}
            <button class="dropdown-button-ar" on:click={toggleDropdown}>
                <span>{selectedLabel}</span>
                <svg class="arrow" class:open={showDropdown} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10l5 5 5-5z"/>
                </svg>
            </button>
              {#if showDropdown}
                <div class="dropdown-menu">
                    {#each songs as song}
                               <button 
                            class="dropdown-item-ar"
                            class:active={selectedSong === song.value}
                            on:click={() => selectSong(song.value)}
                        >
                            {song.label}
                        </button>
                    {/each}
                </div>
            {/if}
        {/if}
            
        </div>
        
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
        on:ended={() => isPlaying = false}
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
        gap: 2rem;
        padding: 2rem;
        background-color: #f5f5f5;
        max-width: 1200px;
        /* margin: 2rem auto; */
    }
    
    .play-button {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background-color: #603D25;
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
        width: 36px;
        height: 36px;
        color: white;
    }
    
    .controls {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .dropdown-container {
        position: relative;
    }
    
     .dropdown-button-ar {
        width: 100%;
        padding: 1rem 1.5rem;
        background-color: white;
        border: 2px solid #603D25;
        cursor: pointer;
        font-family: 'NotoKufiArabic', sans-serif;
        font-size: 1vw;
        direction: rtl;
        font-weight: 700;
        color: #603D25;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color 0.2s;
    }

    .dropdown-button-en {
        width: 100%;
       padding: 1rem 1.5rem 0rem 1.5rem;  
        background-color: white;
        border: 2px solid #603D25;
        cursor: pointer;
        font-family: 'JawiKufi', sans-serif;
        font-size: 3vw;
        color: #603D25;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background-color 0.2s;
    }
    .dropdown-button-en:hover {
        background-color: #f9f9f9;
    }

      .dropdown-button-ar:hover {
        background-color: #f9f9f9;
    }
    
    .dropdown-button-en .arrow {
        width: 24px;
        height: 24px;
        transition: transform 0.3s;
    }

      .dropdown-button-ar .arrow {
        width: 24px;
        height: 24px;
        transition: transform 0.3s;
    }
    
    .dropdown-button-ar .arrow.open {
        transform: rotate(180deg);
    }
      .dropdown-button-en .arrow.open {
        transform: rotate(180deg);
    }
    
    .dropdown-menu {
        position: absolute;
        bottom: 100%; /* Changed from top: 100% */
        left: 0;
        right: 0;
        background-color: white;
        border: 2px solid #603D25;
        border-bottom: none; /* Changed from border-top: none */
        z-index: 1000;
    }
    
    .dropdown-item-en {
        width: 100%;
        padding: 1rem 1.5rem;
        background-color: white;
        font-family: 'JawiKufi', sans-serif;
        font-size: 2vw;
        margin-bottom: -1vw;
        border: none;
        border-bottom: 1px solid #e0e0e0;
        cursor: pointer;
        color: #603D25;
        text-align: left;
        transition: background-color 0.2s;
    }

     .dropdown-item-ar {
        width: 100%;
        padding: 1rem 1.5rem;
        background-color: white;
        border: none;
        font-family: 'NotoKufiArabic', sans-serif;
        font-weight: 700;
        border-bottom: 1px solid #e0e0e0;
        cursor: pointer;
        direction: rtl;
        font-size: 1rem;
        color: #603D25;
        text-align: left;
        transition: background-color 0.2s;
    }
    
    .dropdown-item-ar:last-child {
        border-bottom: none;
    }
    
    .dropdown-item-ar:hover {
        background-color: #f0f0f0;
    }
    
    .dropdown-item-ar.active {
        background-color: #603D25;
        color: white;
    }

     .dropdown-item-en:last-child {
        border-bottom: none;
    }
    
    .dropdown-item-en:hover {
        background-color: #f0f0f0;
    }
    
    .dropdown-item-en.active {
        background-color: #603D25;
        color: white;
    }
    
    .progress-container {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .time-display {
        font-family: 'JawiKufi', sans-serif;
        font-size: 2vw;
        color: #603D25;
        font-weight: 500;
        min-width: 45px;
        margin-bottom: -1vw;
        text-align: center;
    }
    
    .progress-bar {
        position: relative;
        flex: 1;
        height: 12px;
        background-color: #d0d0d0;
        border-radius: 6px;
        cursor: pointer;
        overflow: hidden;
    }
    
    .progress-fill {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-color: #AB8A7E;
        border-radius: 6px;
        transition: width 0.1s linear;
    }
    
    .progress-handle {
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        background-color: #603D25;
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