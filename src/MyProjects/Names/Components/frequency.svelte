<script>
  import { fade } from 'svelte/transition';
  import namesData from './names';
  import { language } from '../Stores/misc.js';
  
  // Define the number of rows and squares per row
  const normalRows = 16;
  const squaresPerRow = 7;
  const lastRowSquares = 3;
  
  // Convert names object to array sorted by rank
  const sortedNames = Object.values(namesData)
    .filter(name => name.rank)
    .sort((a, b) => a.rank - b.rank);
  
  // Create grid mapping: start from top-right, go left, then next row
  const gridNames = [];
  let nameIndex = 0;
  
  // First 16 rows with 7 squares each
  for (let row = 0; row < normalRows; row++) {
    const rowNames = [];
    for (let col = 0; col < squaresPerRow; col++) {
      if (nameIndex < sortedNames.length) {
        rowNames.push(sortedNames[nameIndex]);
        nameIndex++;
      }
    }
    // Reverse to make rank 1 appear on the right
    gridNames.push(rowNames.reverse());
  }
  
  // Last row with 3 centered squares
  const lastRow = [];
  for (let col = 0; col < lastRowSquares; col++) {
    if (nameIndex < sortedNames.length) {
      lastRow.push(sortedNames[nameIndex]);
      nameIndex++;
    }
  }
  gridNames.push(lastRow.reverse());
  
  let hoveredSquare = null;
  let showQuranOnly = false;
  let showFrequency = false;
  let isSorted = false;
  
  // Filter only Quran names
  const quranNames = sortedNames.filter(name => name.quran_hadith === 'Quran');
  
  // Separate names with frequency > 1 and frequency = 1
  const quranNamesAbove1 = quranNames.filter(name => (name.frequency || 0) > 1);
  const quranNamesEq1 = quranNames.filter(name => (name.frequency || 0) === 1);
  
  // Create "Others" group
  const othersGroup = {
    id: 'others',
    arabicName: 'أخرى',
    englishName: 'Others',
    frequency: quranNamesEq1.length,
    rank: 999,
    isGroup: true,
    members: quranNamesEq1
  };
  
  // Combine for bar chart - put "Others" at the end (bottom)
  let barChartData = [...quranNamesAbove1, othersGroup];
  
  // Get max frequency for scaling
  const maxFrequency = Math.max(...barChartData.map(n => n.frequency || 0));
  
  function handleMouseEnter(name) {
    // Only allow hover if not in Quran-only mode or if it's a Quran name
    if (!showQuranOnly || name.quran_hadith === 'Quran' || name.isGroup) {
      hoveredSquare = name;
    }
  }
  
  function handleMouseLeave() {
    hoveredSquare = null;
  }
  
  function toggleQuranOnly() {
    showQuranOnly = !showQuranOnly;
    hoveredSquare = null; // Clear any active hover
    if (!showQuranOnly) {
      showFrequency = false; // Reset frequency view when showing all
    }
  }
  
  function toggleFrequency() {
    if (showQuranOnly) {
      showFrequency = !showFrequency;
      hoveredSquare = null;
    }
  }
  
  function toggleSort() {
    isSorted = !isSorted;
    if (isSorted) {
      // Sort by frequency (highest to lowest), keep Others at the end
      const withoutOthers = barChartData.filter(n => !n.isGroup);
      const sorted = [...withoutOthers].sort((a, b) => (b.frequency || 0) - (a.frequency || 0));
      barChartData = [...sorted, othersGroup];
    } else {
      // Reset to original order (by rank)
      barChartData = [...quranNamesAbove1, othersGroup];
    }
  }
  
  function isQuranName(name) {
    return name.quran_hadith === 'Quran';
  }
  
  function getBarWidth(frequency) {
    // Scale to max 600px based on frequency
    const maxWidth = 600;
    return (frequency / maxFrequency) * maxWidth;
  }
  
  // Get grid position for each name
  function getGridPosition(name) {
    let rowIndex = 0;
    let colIndex = 0;
    const gridOffset = 100; // Center the 287px grid in the 800px container

    for (let i = 0; i < gridNames.length; i++) {
      const colIdx = gridNames[i].findIndex(n => n?.id === name.id);
      if (colIdx !== -1) {
        rowIndex = i;
        colIndex = colIdx;
        break;
      }
    }

    // Handle last row centering
    if (rowIndex === normalRows) {
      return {
        top: rowIndex * 41, // 40px + 1px gap
        left: (colIndex + 2) * 41 + gridOffset // Add 2 for spacers + offset
      };
    }

    return {
      top: rowIndex * 41,
      left: colIndex * 41 + gridOffset
    };
  }

  // Get bar chart position - reactive to barChartData changes
  $: getBarPosition = (name) => {
    const barIndex = barChartData.findIndex(n => n.id === name.id);
    return {
      top: barIndex * 41 + 80, // 80px offset for controls and axis
      left: 100 // Left margin for y-axis (centered in 800px container)
    };
  };

  // Get target position for frequency=1 names (they go to "Others" bar)
  $: getTargetPosition = (name) => {
    if (name.frequency === 1) {
      return getBarPosition(othersGroup);
    }
    return getBarPosition(name);
  };
</script>

<div class="wrapper">
  <div class="controls">
    <button class="toggle-btn" on:click={toggleQuranOnly}>
      {#if $language === 'Arabic'}
        {showQuranOnly ? 'إظهار جميع الأسماء' : 'إظهار أسماء القرآن فقط'}
      {:else}
        {showQuranOnly ? 'Show All Names' : 'Show Quran Only'}
      {/if}
    </button>

    <button
      class="toggle-btn"
      class:disabled={!showQuranOnly}
      on:click={toggleFrequency}
      disabled={!showQuranOnly}
    >
      {#if $language === 'Arabic'}
        التكرار
      {:else}
        Frequency
      {/if}
    </button>
  </div>

  <div class="visualization-area">
    <div class="content-wrapper">
      <div class="grid-container">
      {#if showFrequency}
        <!-- Sort button on top of Y-axis -->
        <button class="sort-btn" on:click={toggleSort} transition:fade>
          {isSorted ? 'Reset' : 'Sort'}
        </button>

        <!-- Y-axis spanning whole chart -->
        <div class="y-axis" transition:fade style="height: {barChartData.length * 41 + 20}px; left: 75px;">
        </div>

        <!-- X-axis at bottom of chart -->
        <div class="x-axis" transition:fade style="top: {barChartData.length * 41 + 100}px; left: 100px; width: 600px;">
          {#each [0, Math.floor(maxFrequency * 0.25), Math.floor(maxFrequency * 0.5), Math.floor(maxFrequency * 0.75), maxFrequency] as tick}
            <div class="x-tick" style="left: {(tick / maxFrequency) * 600}px;">{tick}</div>
          {/each}
        </div>

        <!-- "Others" bar with label -->
        <div
          class="bar-name-label"
          style="top: {getBarPosition(othersGroup).top}px; left: 20px;"
        >
          {othersGroup.arabicName}
        </div>
        <div
          class="animated-square is-bar"
          class:active={hoveredSquare?.id === 'others'}
          style="
            --bar-top: {getBarPosition(othersGroup).top}px;
            --bar-left: {getBarPosition(othersGroup).left}px;
            --bar-width: {getBarWidth(othersGroup.frequency)}px;
            top: var(--bar-top);
            left: var(--bar-left);
            width: var(--bar-width);
          "
          on:mouseenter={() => handleMouseEnter(othersGroup)}
          on:mouseleave={handleMouseLeave}
          role="button"
          tabindex="0"
        >
          <span class="bar-value">{othersGroup.frequency}</span>
        </div>
      {/if}

      <!-- Animated squares/bars -->
      {#each gridNames as row, i}
        {#each row as name, j}
          {@const isQuran = isQuranName(name)}
          {@const gridPos = getGridPosition(name)}
          {@const targetPos = getTargetPosition(name)}
          {@const shouldShow = !showQuranOnly || isQuran}
          {@const hideInFreq = showFrequency && name.frequency === 1}

          {#if shouldShow && !hideInFreq}
            {#if showFrequency && name.frequency > 1}
              <!-- Name label to the left of the bar -->
              <div
                class="bar-name-label"
                style="top: {targetPos.top}px; left: 20px;"
              >
                {name.arabicName}
              </div>
            {/if}

            <div
              class="animated-square"
              class:is-bar={showFrequency && name.frequency > 1}
              class:active={hoveredSquare?.id === name?.id}
              class:disabled={showQuranOnly && !isQuran && !showFrequency}
              style="
                --grid-top: {gridPos.top}px;
                --grid-left: {gridPos.left}px;
                --bar-top: {targetPos.top}px;
                --bar-left: {targetPos.left}px;
                --bar-width: {getBarWidth(name.frequency || 0)}px;
              "
              on:mouseenter={() => handleMouseEnter(name)}
              on:mouseleave={handleMouseLeave}
              role="button"
              tabindex="0"
            >
              {#if showFrequency && name.frequency > 1}
                <span class="bar-value">{name.frequency || 0}</span>
              {:else if hoveredSquare?.id === name?.id}
                <p class="name-text">{name.arabicName}</p>
              {/if}
            </div>
          {/if}
        {/each}
      {/each}
    </div>

    <!-- Description text on the right side of the grid -->
    <div class="description-text">
      {#if !showQuranOnly}
        {#if $language === 'Arabic'}
          <p>هذا نص عربي يتغير عندما تضغط على زر إظهار أسماء القرآن فقط</p>
        {:else}
          <p>This is placeholder text that will change when you click Show Quran Only</p>
        {/if}
      {:else if showQuranOnly && !showFrequency}
        {#if $language === 'Arabic'}
          <p>هذا نص مختلف يظهر عند اختيار أسماء القرآن فقط</p>
        {:else}
          <p>This is different text shown when Quran Only is selected</p>
        {/if}
      {/if}
    </div>
    </div>
  </div>
</div>

<style>
  @font-face {
    font-family: 'NotoKufiArabic';
    src: url('../../Assests/NotoKufiArabic-Regular.ttf') format('truetype');
    font-weight: 400;
  }

  @font-face {
    font-family: 'NotoKufiArabic';
    src: url('../../Assests/NotoKufiArabic-Bold.ttf') format('truetype');
    font-weight: 700;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
    padding: 20px;
  }
  
  .controls {
    display: flex;
    gap: 10px;
    z-index: 100;
  }

  .description-text {
    width: 400px;
    padding: 20px;
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .description-text p {
    font-family: 'NotoKufiArabic', sans-serif;
    font-size: 18px;
    color: #266F8C;
    margin: 0;
    line-height: 1.8;
    text-align: left;
  }
  
  .toggle-btn {
    padding: 10px 20px;
    background-color: #266F8C;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .toggle-btn:hover:not(.disabled) {
    background-color: #AB8A7E;
  }
  
  .toggle-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .visualization-area {
    position: relative;
    width: 100%;
    max-width: 1400px;
    min-height: 800px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
  }

  .content-wrapper {
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }

  .grid-container {
    position: relative;
    width: 20vw;
    flex-shrink: 0;
  }
  
  .animated-square {
    position: absolute;
    width: 40px;
    height: 40px;
    background-color: #266F8C;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    box-sizing: border-box;

    /* Default grid position */
    top: var(--grid-top);
    left: var(--grid-left);

    /* Smooth transition */
    transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .animated-square.is-bar {
    /* Transform to bar position */
    top: var(--bar-top);
    left: var(--bar-left);
    width: var(--bar-width);
    min-width: 40px;
  }
  
  .animated-square.disabled {
    background-color: white;
    cursor: not-allowed;
  }
  
  .animated-square:hover,
  .animated-square.active {
    background-color: #AB8A7E;
    z-index: 10;
  }
  
  .animated-square.disabled:hover {
    background-color: white;
  }
  
  .name-text {
    position: absolute;
    background-color: #AB8A7E;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
    font-size: 14px;
    margin: 0;
    z-index: 10;
    pointer-events: none;
    left: 50%;
    transform: translateX(-50%);
    direction: rtl;
    font-family: 'NotoKufiArabic', sans-serif;
  }
  
  .bar-name-label {
    position: absolute;
    color: #333;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
    display: flex;
    align-items: center;
    height: 40px;
    z-index: 5;
    text-align: right;
    font-family: 'NotoKufiArabic', sans-serif;
  }
  
  .bar-value {
    color: white;
    font-size: 12px;
    font-weight: 600;
    margin-left: auto;
    margin-right: 10px;
    flex-shrink: 0;
  }
  
  .sort-btn {
    position: absolute;
    left: 10px;
    top: 40px;
    padding: 8px 16px;
    background-color: #266F8C;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s;
    z-index: 100;
  }
  
  .sort-btn:hover {
    background-color: #AB8A7E;
  }
  
  .y-axis {
    position: absolute;
    top: 80px;
    width: 2px;
    background-color: #333;
    z-index: 50;
  }
  
  .y-tick {
    font-size: 12px;
    color: #333;
    text-align: right;
    font-weight: 500;
    width: 60px;
  }
  
  .x-axis {
    position: absolute;
    height: 40px;
    border-top: 2px solid #333;
    z-index: 50;
  }
  
  .x-tick {
    position: absolute;
    top: 5px;
    transform: translateX(-50%);
    font-size: 12px;
    color: #333;
    font-weight: 500;
  }
</style>