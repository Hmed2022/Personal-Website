<script>
  import { onMount, onDestroy } from 'svelte';
 
  import names from './names.js'
  
  // Import the MP3 file path
  import songFile from '../Assests/Names1.mp3';
  
  // Audio element reference - this should be the DOM element, not the file path
  let audioElement;
  
  // Current lyric to display
  let currentLyric = names[0]?.name || "";
  
  // Current time tracker
  let currentTime = 0;
  
  // Function to find the appropriate lyric based on current timestamp
  function updateLyric(time) {
    // Find the last lyric whose timestamp has been passed
    let foundLyric = names[0];
    
    for (let i = 0; i < names.length; i++) {
      if (time >= names[i].timestamp) {
        foundLyric = names[i];
      } else {
        break;
      }
    }
    
    currentLyric = foundLyric.name;
  }
  
  // Handle time updates from the audio element
  function handleTimeUpdate() {
    if (audioElement) {
      currentTime = audioElement.currentTime;
      updateLyric(currentTime);
    }
  }
  
  onMount(() => {
    // Make sure lyrics are sorted by timestamp
    // @ts-ignore
    names = names.sort((a, b) => a.timestamp - b.timestamp);
  });
</script>

<div class="container">
  <h2>Lyric Sync Player</h2>
  
  <div class="audio-player">
    <audio
      bind:this={audioElement}
      on:timeupdate={handleTimeUpdate}
      controls
      src={songFile}
    >
      Your browser does not support the audio element.
    </audio>
  </div>
  
  <div class="lyric-display">
    <p class="current-lyric">{currentLyric}</p>
    <p class="timestamp">Time: {currentTime.toFixed(2)}s</p>
  </div>
  
  <div class="lyric-list">
    <h3>All Lyrics</h3>
    {#each names as lyric}
      <div class="lyric-item" class:active={currentLyric === lyric.name}>
        <span class="time">{lyric.timestamp}s</span>
        <span class="text">{lyric.name}</span>
      </div>
    {/each}
  </div>
</div>

<!-- ... styles stay the same ... -->

<style>
  .container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  h2 {
    text-align: center;
    color: #333;
  }
  
  .audio-player {
    margin: 20px 0;
  }
  
  audio {
    width: 100%;
  }
  
  .lyric-display {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px 20px;
    border-radius: 10px;
    text-align: center;
    margin: 20px 0;
    min-height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .current-lyric {
    font-size: 24px;
    font-weight: bold;
    margin: 0 0 10px 0;
    transition: all 0.3s ease;
  }
  
  .timestamp {
    font-size: 14px;
    opacity: 0.8;
    margin: 0;
  }
  
  .lyric-list {
    margin-top: 30px;
  }
  
  h3 {
    color: #555;
    margin-bottom: 15px;
  }
  
  .lyric-item {
    display: flex;
    padding: 10px;
    border-left: 3px solid #ddd;
    margin-bottom: 5px;
    transition: all 0.3s ease;
  }
  
  .lyric-item.active {
    border-left-color: #667eea;
    background-color: #f0f4ff;
  }
  
  .lyric-item .time {
    min-width: 60px;
    color: #667eea;
    font-weight: bold;
  }
  
  .lyric-item .text {
    color: #333;
  }
</style>