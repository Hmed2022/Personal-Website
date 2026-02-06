<script>
    import { nameId, filterQuran, filterDerived, filterHadith, showDisputed, seekToTime } from '../Stores/misc';
    import  names  from './names.js';

    const BASE   = '#266F8C';
    const HOVER  = '#5AADBF';
    const ACTIVE = '#AC8B7E';
    const QURAN_FILTER = '#3E8BA9';     // Teal blue
    const DERIVED_FILTER = '#047857';   // Emerald green (paradise)
    const HADITH_FILTER = '#C2452D';    // Terracotta/rust (North African)
    const QURAN_HOVER = '#6AAFC7';      // Lighter teal blue
    const DERIVED_HOVER = '#4FB397';    // Lighter emerald green
    const HADITH_HOVER = '#D4796A';     // Lighter terracotta
        
    export let lineGap = 100;   // distance between first line and second line
    export let lineGap2 = 60;  
    export let lineGap3 = 478;  // distance between first line and second line
    
    $: activeGroup = $nameId;
    let hoverGroup = null;

    // Initialize all fills and strokes
    let fills = Array(107).fill(BASE);
    let strokes = Array(107).fill('none');
    let strokeWidths = Array(107).fill(0);

    function updateFills() {
        for (let i = 0; i < 107; i++) {
            const id = i + 1;
            const name = names[id];

            // Determine base color based on active/hover state
            let baseColor = BASE;

            // Handle active state (clicked name)
            if (activeGroup === id) {
                baseColor = ACTIVE;
            }
            // Handle hover state with filter awareness
            else if (hoverGroup === id) {
                // If a filter is active and this name matches, use filter's hover color
                if (name) {
                    if ($filterQuran && name.quran_hadith === 'Quran') {
                        baseColor = QURAN_HOVER;
                    } else if ($filterDerived && name.quran_hadith === 'Derived') {
                        baseColor = DERIVED_HOVER;
                    } else if ($filterHadith && name.quran_hadith === 'Hadith') {
                        baseColor = HADITH_HOVER;
                    } else {
                        baseColor = HOVER;
                    }
                } else {
                    baseColor = HOVER;
                }
            }
            // Apply filter colors when not hovering or active
            else if (name) {
                if ($filterQuran && name.quran_hadith === 'Quran') {
                    baseColor = QURAN_FILTER;
                } else if ($filterDerived && name.quran_hadith === 'Derived') {
                    baseColor = DERIVED_FILTER;
                } else if ($filterHadith && name.quran_hadith === 'Hadith') {
                    baseColor = HADITH_FILTER;
                }
            }

            fills[i] = baseColor;

            // Apply disputed stroke if showDisputed is true
            if ($showDisputed && name && name.disputed === 'Yes') {
                strokes[i] = '#B86F65';
                strokeWidths[i] = 3;
            } else {
                strokes[i] = 'none';
                strokeWidths[i] = 0;
            }
        }
    }

    // Reactively update fills whenever any relevant state changes
    $: if (activeGroup !== undefined || hoverGroup !== undefined || $filterQuran !== undefined || $filterDerived !== undefined || $filterHadith !== undefined || $showDisputed !== undefined) {
        updateFills();
    }

    function handleClick(id) {
        console.log('Group clicked:', id);
        activeGroup = id;

        // 1. Update the store with the clicked id
        nameId.set(id);

        // 2. Seek to the name's timestamp in the audio player
        const name = names[id];
        if (name && name.timestamp1 !== undefined && name.timestamp1 !== null) {
            seekToTime.set(name.timestamp1);
        }

        // 3. The name display will automatically update through the reactive statement
        updateFills();
    }

    function handleHover(id) {
        hoverGroup = id;
        updateFills();
    }

    function handleLeave() {
        hoverGroup = null;
        updateFills();
    }

    function handleKey(id, event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick(id);
        }
    }


    
    // Reactive statement: automatically updates when $nameId changes
    $: currentName = $nameId && names[$nameId] ? names[$nameId] : null;
</script>



    
    <svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="0 0 740.2 1200"
    
    >
    
         <g
        style="fill: {fills[0]}; stroke: {strokes[0]}; stroke-width: {strokeWidths[0]};"
      >
          <path d="M699.7,40.7h.2v12.4h-12.4v-26.3h-40.4v40.2h26.5v12.7h-26.5v13.9h40.4v-26.6h12.4v12.7h-.2v13.9h40.4V26.8h-40.4v13.9ZM661.1,53.1v-12.4h12.6v12.4h-12.6ZM726.2,79.7h-12.4v-12.7h12.4v12.7ZM726.2,53.1h-12.4v-12.4h12.4v12.4Z" />
        </g>

        <g
        style="fill: {fills[1]}; stroke: {strokes[1]}; stroke-width: {strokeWidths[1]}; cursor: pointer;"
        on:mouseenter={() => handleHover(2)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(2)}
        on:keydown={(e) => handleKey(2, e)}
        tabindex="0"
        role="button"
      >
          <rect x="647.2" y=".6" width="93" height="13.9" />
          <path d="M619.4,79.7h-12.3V.6h-13.9v79.1h-13.7V.6h-41.5v39.9h13.9V14.5h13.7v38.7h-27.6v40.4h0c0,0,93,0,93,0h0c0,0,2.3,0,2.3,0V.6h-13.9v79.1ZM551.9,67h13.7v12.7h-13.7v-12.7Z" />
        </g>
    
          <g
        style="fill: {fills[2]}; stroke: {strokes[2]}; stroke-width: {strokeWidths[2]};"
      >
          <rect x="458.2" y="26.8" width="13.9" height="13.9" />
          <rect x="512.1" y=".6" width="13.9" height="93" />
          <polygon points="377.2 26.8 377 26.8 377 67 377 67 377 67.2 405.3 67.2 405.3 79.7 365.2 79.7 365.2 14.5 419.2 14.5 419.2 .6 365.2 .6 351.3 .6 351.3 14.5 351.3 79.7 351.3 93.5 351.3 93.6 419.2 93.6 419.2 93.4 419.2 79.7 419.2 67.2 419.3 67.2 419.3 53.3 419.2 53.3 419.2 53.2 405.3 53.2 405.3 53.3 390.9 53.3 390.9 40.7 419.5 40.7 419.5 26.8 390.9 26.8 377.2 26.8" />
          <polygon points="486.2 .6 458.2 .6 458.2 14.5 486.2 14.5 486.2 79.7 472.3 79.7 472.3 67 472.3 53.1 458.4 53.1 445 53.1 445 .6 431.1 .6 431.1 53.1 431.1 67 445 67 458.4 67 458.4 79.7 431.6 79.7 431.6 93.6 500.1 93.6 500.1 93.5 500.1 79.7 500.1 .6 499.4 .6 486.2 .6" /> 
        </g>
    
          <g
        style="fill: {fills[3]}; stroke: {strokes[3]}; stroke-width: {strokeWidths[3]};"
      >
          <path d="M323.8,40.5h13.5V.3h-13.9v26.3h-12.9V.3h-13.9v40.2h13.3v12.7h-13.1v40.5h40.5v-.3h.3v-40.2h-13.8v-12.7ZM310.6,67h13.1v12.7h-13.1v-12.7Z" />
        </g>
    
          <g
        style="fill: {fills[4]}; stroke: {strokes[4]}; stroke-width: {strokeWidths[4]};"
      >
          <rect x="269.8" y=".6" width="13.9" height="93" />
          <path d="M242.8,79.7h-13.1V0h-40.9v40.5h13.9V13.9h13.1v39.4h-27v40.3h0c0,0,64.7,0,64.7,0h0c0,0,3.3,0,3.3,0V.6h-13.9v79.1ZM202.6,67.2h13.1v12.5h-13.1v-12.5Z" />
        </g>
    
          <g
        style="fill: {fills[5]}; stroke: {strokes[5]}; stroke-width: {strokeWidths[5]};"
      >
          <rect x="161.7" y=".5" width="13.9" height="93" />
          <path d="M134.8,40.5h13.5V.3h-13.9v26.3h-12.9V.3h-.6v-.3H.6v13.9h106.9v26.6h13.3v12.7h-13.1v40.5h40.5v-.3h.3v-40.2h-13.8v-12.7ZM121.6,67h13.1v12.7h-13.1v-12.7Z" />
        </g>
    
          <g
        style="fill: {fills[6]}; stroke: {strokes[6]}; stroke-width: {strokeWidths[6]};"
      >
          <path d="M94.4,26.6h-40.2v.4h-.3v26.2h-13v-26.6H.6v.4h-.6v40.3h13.9c0-.1,13-.1,13-.1v12.7H.6v13.9h40.2v-26.6h13v26.6h40.8V26.9h-.3v-.4ZM13.9,53.1v-12.7h13v12.7h-13ZM80.8,79.7h-13v-12.7h13v12.7ZM67.8,53.1v-12.7h13v12.7h-13Z" />
        </g>
    
      <!-- SECOND LINE: REUSE THE SAME GROUPS, MOVED DOWN -->
      <!-- you can give them different colors if you want -->
      <g transform={`translate(0, ${lineGap})`}>
            
         <g
        style="fill: {fills[7]}; stroke: {strokes[7]}; stroke-width: {strokeWidths[7]}; cursor: pointer;"
        on:mouseenter={() => handleHover(8)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(8)}
        on:keydown={(e) => handleKey(8, e)}
        tabindex="0"
        role="button"
      >
        <rect x="508.2" y="0" width="7.7" height="52.7"/>
        <path d="M493,.2h-5.9c0-.1-7.7-.1-7.7-.1h0v22.2h7.7V7.9h5.9v22h-13.5v.5h0v14.7h-7.7V0h-7.7v45h-7.6v-14.9h-30.1v-7.2h29.2v-7.7h-36.9v22.6h0s30.1,0,30.1,0v7.2h-30.2v7.7h82.1v-.5h.1V0h-7.7ZM487.1,37.6h5.9v7.5h-5.9v-7.5Z"/>
      </g>
        <g
        style="fill: {fills[8]}; stroke: {strokes[8]}; stroke-width: {strokeWidths[8]}; cursor: pointer;"
        on:mouseenter={() => handleHover(9)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(9)}
        on:keydown={(e) => handleKey(9, e)}
        tabindex="0"
        role="button"
      >
        <rect x="14.7" y="16" width="7.7" height="7.7"/>
        <path d="M134.8,0H44.9v7.7h89.9v22.1h-7v-13.7h-.4s-22.3,0-22.3,0h0s-.3,0-.3,0v13.7h-7.2v-13.8h-23.8c0,0,0,0,0,0v21.4h16.2v7.6H0v7.7h97.6v-15.3h44.9V0h-7.7ZM81.4,29.8v-6.1h8.5v6.1h-8.5ZM112.5,23.8h7.6v6h-7.6v-6Z"/>
        <rect x="105.1" y="45.1" width="37.4" height="7.7"/>
        <path d="M67.1,36.1v-20h-.6c0-.1-21.6-.1-21.6-.1h0v13.9h-7.8v-13.9h-7.7v13.9H7.7V7.7h29.6V0H0v37.6h67.1v-1.5ZM52.6,23.7h6.8v6.2h-6.8v-6.2Z"/>
      </g>
        <g
        style="fill: {fills[9]}; stroke: {strokes[9]}; stroke-width: {strokeWidths[9]}; cursor: pointer;"
        on:mouseenter={() => handleHover(10)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(10)}
        on:keydown={(e) => handleKey(10, e)}
        tabindex="0"
        role="button"
      >
        <rect x="269.2" y=".2" width="67.8" height="7.7"/>
        <path d="M253.2,29.2h-5.6v-13.6h-7.7v13.6h0v7.7h0v8.2h-7.8V15.6h-7.7v29.5h-7.9V15.6h-7.7v13.5h-14.1v-6.9h8.1V7.7h44.6V0h-51.2s-1.1,0-1.1,0v14.5h-8.2V0h-7.7v22.2h7.8v6.9h-.1v-.2h-7.7v23.8h0c0,.1,23.6.1,23.6.1h0v-16h6v16h7.7s31.1,0,31.1,0h0v-15.9h13.3V0h-7.7v29.2ZM195.1,45.1h-8.2v-8.3h8.2v8.3Z"/>
        <path d="M150,0v52.8h7.7s13.7,0,13.7,0h0v-23.9h-7.7v16.2h-6v-21.3h6s7.7,0,7.7,0h0V0h0s-21.4,0-21.4,0h0ZM163.7,16.1h-6V7.7h6v8.4Z"/>
      </g>
       <g
        style="fill: {fills[10]}; stroke: {strokes[10]}; stroke-width: {strokeWidths[10]}; cursor: pointer;"
        on:mouseenter={() => handleHover(11)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(11)}
        on:keydown={(e) => handleKey(11, e)}
        tabindex="0"
        role="button"
      >
        <path d="M404,45.1h-7.7V15.7h-.1v-.8h-22.3v15h0v7.7h14.7v7.5h-22.4V.1h-22.3v37.8h7.7V7.8h6.9v37.3h-14.6v7.7h67.7v-.5h0V0h-7.7v45ZM381.6,29.9v-7.3h7v7.3h-7Z"/>
        <rect x="418.6" y=".1" width="36.9" height="7.7"/>
        <rect x="388.6" y=".2" width="7.7" height="7.7"/>
        <rect x="373.6" y="0" width="7.7" height="7.7"/>
        <path d="M329.3,15.7h-16.7v21.9h16.7v7.5h-44.9v7.7h52.6V15.7h-7.7ZM320.3,29.9v-6.5h9v6.5h-9Z"/>
        <polygon points="307.7 37.6 307.7 37.5 307.7 29.9 307.7 15.6 300 15.6 300 29.9 292.2 29.9 292.2 15.3 284.5 15.3 284.5 29.9 276.5 29.9 276.5 15.6 268.8 15.6 268.8 45.1 252.6 45.1 252.6 52.8 276.5 52.8 276.5 52.7 276.5 45.1 276.5 37.6 307.7 37.6"/>
      </g>
        <g
        style="fill: {fills[11]}; stroke: {strokes[11]}; stroke-width: {strokeWidths[11]}; cursor: pointer;"
        on:mouseenter={() => handleHover(12)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(12)}
        on:keydown={(e) => handleKey(12, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="597.9 45.1 591.1 45.1 591.1 30.2 583.4 30.2 583.4 45.1 553 45.1 553 52.8 583.4 52.8 591.1 52.8 605.6 52.8 605.6 52.3 605.6 45.1 605.6 0 597.9 0 597.9 45.1"/>
        <path d="M576.3,37.5h0v-14.8h14.8V0h-7.7c0,0-14.8,0-14.8,0v7.7h14.8v7.1h-14.8v14.8h-8.1V0h-7.7v15.2h-7.7V0h-7.7s-5.7,0-5.7,0h0s-7.7,0-7.7,0h0v52.6h7.7v-29.7h21.1v14.4h.2c0,.1,23.3.1,23.3.1ZM531.7,7.8h5.7v7.5h-5.7v-7.5Z"/>
        <rect x="537.4" y="30.2" width="7.7" height="7.7"/>
        <rect x="537.4" y="45.1" width="7.7" height="7.7"/>
        <polygon points="613.2 .2 613.2 7.9 658.1 7.9 658.1 23.5 665.8 23.5 665.8 7.9 665.8 3.3 665.8 .2 613.2 .2"/>
      </g>
        <g
        style="fill: {fills[12]}; stroke: {strokes[12]}; stroke-width: {strokeWidths[12]}; cursor: pointer;"
        on:mouseenter={() => handleHover(13)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(13)}
        on:keydown={(e) => handleKey(13, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="731.8 0 731.8 44.9 717.9 44.9 717.9 52.6 739.5 52.6 739.5 52.3 739.5 44.9 739.5 0 731.8 0"/>
        <rect x="628.5" y="30.2" width="7.7" height="7.7"/>
        <path d="M695.2,37h0s.5,0,.5,0V0h-7.7s-7.3,0-7.3,0h0s-7.7,0-7.7,0h0v23.4h7.7V7.8h7.3v21.5h-7.2s-7.7,0-7.7,0h0s-7.5,0-7.5,0h0s-7.7,0-7.7,0h0s-7.5,0-7.5,0v-13.8h-7.7v29.5h-21.8v-22h15.3v-7.7h-23v37.4h37.2v-15.7h7.5v7.9h0v7.7h22.9v-15.6h14.4ZM673.1,44.9h-7.5v-7.9h7.5v7.9Z"/>
        <polygon points="724.1 37.9 724.1 37.9 725.6 37.9 725.6 .4 725.6 .4 725.6 0 702.4 0 702.4 7.8 717.9 7.8 717.9 30.2 710.1 30.2 710.1 15.5 702.4 15.5 702.4 44.9 686.9 44.9 686.9 52.6 702.4 52.6 702.4 52.7 710.1 52.7 710.1 37.9 724.1 37.9"/>
      </g>
    
              <g transform={`translate(0, ${lineGap2})`}>
    
         <g
        style="fill: {fills[13]}; stroke: {strokes[13]}; stroke-width: {strokeWidths[13]}; cursor: pointer;"
        on:mouseenter={() => handleHover(14)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(14)}
        on:keydown={(e) => handleKey(14, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="373.9 44.5 358.5 44.5 358.5 52.2 373.9 52.2 380 52.2 381.6 52.2 381.6 13.8 373.9 13.8 373.9 44.5"/>
        <polygon points="448.6 0 426.3 0 426.3 7.7 448.6 7.7 448.6 29.9 440.9 29.9 440.9 21.5 440.9 13.8 433.2 13.8 426.2 13.8 418.5 13.8 418.5 21.5 418.5 36.9 426.2 36.9 426.2 21.5 433.2 21.5 433.2 44.5 411.6 44.5 411.6 13.8 404 13.8 404 29.2 397 29.2 397 7.7 418.7 7.7 418.7 0 397 0 390.2 0 389.3 0 389.3 29.2 389.3 36.9 397 36.9 404 36.9 404 52.2 404.7 52.2 411.6 52.2 433.2 52.2 436.5 52.2 440.9 52.2 440.9 37.5 448.6 37.5 455.4 37.5 456.3 37.5 456.3 0 451.2 0 448.6 0"/>
        <polygon points="500.8 0 470.1 0 462.4 0 462.4 7.7 462.4 38.4 470.1 38.4 470.1 7.7 500.8 7.7 500.8 0"/>
        <rect x="448.6" y="44.5" width="7.7" height="7.7"/>
        <rect x="389.3" y="44.5" width="7.7" height="7.7"/>
      </g>
        <g
        style="fill: {fills[14]}; stroke: {strokes[14]}; stroke-width: {strokeWidths[14]}; cursor: pointer;"
        on:mouseenter={() => handleHover(15)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(15)}
        on:keydown={(e) => handleKey(15, e)}
        tabindex="0"
        role="button"
      >
        <path d="M343,29.3h-13.7v15.2h-7.4v-15.4h-7.7v15.4h-7.4V13.8h-14.7v-6.1h44.8V0h-52.5v21.5h14.7v23h-7.1v-15.4h-15.7v-14.8h-7.7v14.8h-8v-15.4h-7.7v30.7h-13.6v7.7h21.3v-15.4h23.6v15.4h66.2V0h-7.7v29.3ZM343,44.5h-6v-7.5h6v7.5Z"/>
        <polygon points="381.6 0 366.2 0 358.5 0 358.5 7.7 358.5 38.4 366.2 38.4 366.2 7.7 381.6 7.7 381.6 0"/>
        <rect x="329.3" y="13.8" width="7.7" height="7.7"/>
        <rect x="314.3" y="13.8" width="7.7" height="7.7"/>
        <rect x="268.8" y="44.5" width="7.7" height="7.7"/>
      </g>
        <g
        style="fill: {fills[15]}; stroke: {strokes[15]}; stroke-width: {strokeWidths[15]}; cursor: pointer;"
        on:mouseenter={() => handleHover(16)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(16)}
        on:keydown={(e) => handleKey(16, e)}
        tabindex="0"
        role="button"
      >
        <path d="M163.7,44.5h-6.8V14.6h-22.7v22.6h15v7.3h-22.3V13.8h-7.7v38.4h52.1V0h-7.7v44.5ZM141.9,29.5v-7.3h7.3v7.3h-7.3Z"/>
        <polygon points="224.4 0 208.9 0 208.9 7.7 224.4 7.7 224.4 44.5 216.5 44.5 216.5 36.9 216.5 29.2 208.9 29.2 202.7 29.2 202.7 13.8 195.1 13.8 195.1 29.2 195.1 36.9 202.7 36.9 208.9 36.9 208.9 44.5 186.9 44.5 186.9 7.7 202.7 7.7 202.7 0 186.9 0 179.5 0 179.2 0 179.2 52.2 183 52.2 186.9 52.2 208.9 52.2 216.5 52.2 224.4 52.2 227.7 52.2 232.1 52.2 232.1 0 231.6 0 224.4 0"/>
        <polygon points="276.5 0 247.6 0 239.9 0 239.9 7.7 239.9 37 247.6 37 247.6 7.7 276.5 7.7 276.5 0"/>
        <rect x="208.9" y="14.7" width="7.7" height="7.7"/>
        <rect x="149.2" width="7.7" height="7.7"/>
        <rect x="134.3" width="7.7" height="7.7"/>
      </g>
        <g
        style="fill: {fills[16]}; stroke: {strokes[16]}; stroke-width: {strokeWidths[16]}; cursor: pointer;"
        on:mouseenter={() => handleHover(17)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(17)}
        on:keydown={(e) => handleKey(17, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="45 44.5 0 44.5 0 52.2 45 52.2 48.3 52.2 52.6 52.2 52.6 15.3 45 15.3 45 44.5"/>
        <polygon points="127.4 0 104.7 0 104.7 5.4 104.7 7.7 104.7 52.7 112.4 52.7 112.4 7.7 127.4 7.7 127.4 0"/>
        <polygon points="74 7.7 90.2 7.7 90.2 29.5 81.6 29.5 81.6 15.3 74 15.3 74 44.5 67.1 44.5 67.1 7.7 67.1 0 67.1 0 45 0 45 7.7 59.5 7.7 59.5 44.5 59.5 52.1 59.5 52.2 81.6 52.2 81.6 52.1 81.6 44.5 81.6 37.2 90.2 37.2 97.1 37.2 97.9 37.2 97.9 7.7 97.9 1 97.9 0 74 0 74 7.7"/>
        <polygon points="35.6 37.5 37.4 37.5 37.4 21.5 37.4 14.5 37.4 13.8 22.5 13.8 22.5 7.7 37.4 7.7 37.4 0 14.8 0 14.8 0 14.8 7.7 14.8 13.8 14.8 21.5 22.5 21.5 29.7 21.5 29.7 29.8 7.7 29.8 7.7 0 0 0 0 29.8 0 37.1 0 37.5 29.7 37.5 35.6 37.5"/>
        <rect x="90.2" y="44.5" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[17]}; stroke: {strokes[17]}; stroke-width: {strokeWidths[17]}; cursor: pointer;"
        on:mouseenter={() => handleHover(18)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(18)}
        on:keydown={(e) => handleKey(18, e)}
        tabindex="0"
        role="button"
      >
        <rect x="731.8" width="7.7" height="52.2"/>
        <rect x="613.4" y="44.5" width="7.7" height="7.7"/>
        <path d="M717.9,0h-30.2v7.7h30.2v36.9h-7.8V13.8h-22.1v30.7h-7.3V0h-22.6v7.7h15v6.1h-15v30.7h-7.7V13.8h-7.7v15.4h-8v-15.4h-21.3v15.4h-7.8v-15.4h-7.7v30.7h-21.6v-23h13.9v-7.7h-21.6v38.4h37v-15.4h37.1v15.4h53v-15.4h6.7v15.4h23.2V0h-7.7ZM621.1,29.2v-7.7h6v7.7h-6ZM673.1,21.5v7.7h-7.3v-7.7h7.3ZM665.8,44.5v-7.7h7.3v7.7h-7.3ZM695.7,29.2v-7.7h6.7v7.7h-6.7Z"/>
        <rect x="627" y="44.5" width="7.7" height="7.7"/>
        <rect x="583.3" y="29.9" width="7.7" height="7.7"/>
      </g>
         <g
        style="fill: {fills[18]}; stroke: {strokes[18]}; stroke-width: {strokeWidths[18]}; cursor: pointer;"
        on:mouseenter={() => handleHover(19)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(19)}
        on:keydown={(e) => handleKey(19, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="493 29.2 486.8 29.2 479.7 29.2 479.2 29.2 479.2 44.5 462.4 44.5 462.4 52.2 479.2 52.2 483 52.2 486.8 52.2 486.8 36.9 493 36.9 500.2 36.9 500.6 36.9 500.6 13.8 493 13.8 493 29.2"/>
        <rect x="568.6" width="81.8" height="7.7"/>
        <rect x="522.8" y="44.5" width="7.7" height="7.7"/>
        <rect x="492.6" y="44.5" width="7.7" height="7.7"/>
        <rect x="478.5" y="14.6" width="7.7" height="7.7"/>
        <rect x="508.2" width="7.7" height="7.7"/>
        <path d="M552.8,44.5h-7.7v-15.7h-6.7v-5.5h6.7V0h-22.3v23.4h7.9v5.8h-14.8v-15.4h-7.7v38.4h7.7v-15.4h21.5v15.4h23.1V0h-7.7v44.5ZM530.5,15.7V7.7h6.9v8h-6.9Z"/>
      </g>
    
      <g transform={`translate(0, ${lineGap2})`}>
            
       <g
        style="fill: {fills[19]}; stroke: {strokes[19]}; stroke-width: {strokeWidths[19]}; cursor: pointer;"
        on:mouseenter={() => handleHover(20)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(20)}
        on:keydown={(e) => handleKey(20, e)}
        tabindex="0"
        role="button"
      >
        <rect x="732.2" y="418.9" width="7.7" height="51.4"/>
        <polygon points="673.5 449.4 665.9 449.4 665.9 440.8 665.9 433.7 665.9 433.1 650.5 433.1 643.7 433.1 642.9 433.1 642.9 470.3 643.7 470.3 650.5 470.3 681.1 470.3 681.1 462.7 650.5 462.7 650.5 440.8 658.2 440.8 658.2 456.9 658.2 456.9 658.2 457 681.1 457 681.1 456.9 681.1 449.4 681.1 418.9 673.5 418.9 673.5 449.4"/>
        <path d="M687.9,426.3h30.9v23.1h-7.6v-15.7h-7.7s-8,0-8,0h0s-7.7,0-7.7,0v23.3h15.7v5.6h-15.7v7.7h23.4v-13.3h7.6v13.3h7.7v-51.7h-38.6v7.7ZM695.6,449.4v-8h8v8h-8Z"/>
      </g>
       <g
        style="fill: {fills[20]}; stroke: {strokes[20]}; stroke-width: {strokeWidths[20]}; cursor: pointer;"
        on:mouseenter={() => handleHover(21)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(21)}
        on:keydown={(e) => handleKey(21, e)}
        tabindex="0"
        role="button"
      >
        <path d="M508.6,433.7h-15.6v7.7h15.6v6.8h-15.6v14.5h-5.7v-28.9h-23.3v23.2h7.7v-15.5h8v21.3h-23.7v-29.5h-36.8v29.5h-8v-45.2h-21.5v45.2h-7.5v-45.2h-7.7v45.2h0v7.7h22.9v-45.2h6.2v45.2h23.3v-13.7h8.3v13.7h81.3v-36.6h-7.7ZM442.6,462.7v-13.7h-15.9v-8.1h21.5v21.8h-5.5ZM500.6,462.7v-6.8h7.9v6.8h-7.9Z"/>
        <polygon points="426.7 418.6 426.7 403.5 419 403.5 419 426.3 420 426.3 426.7 426.3 516.2 426.3 516.2 418.6 426.7 418.6"/>
      </g>
        <g
        style="fill: {fills[21]}; stroke: {strokes[21]}; stroke-width: {strokeWidths[21]}; cursor: pointer;"
        on:mouseenter={() => handleHover(22)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(22)}
        on:keydown={(e) => handleKey(22, e)}
        tabindex="0"
        role="button"
      >
        <path d="M105.1,417.4v45.2h-7.4v-29.5h-22.7v29.5h-7.2v-29.5h-22.3v23.5h7.7v-15.9h6.9v21.8h-22.3v-29.5H14.7v29.5h-6.9v-29.6H.1v37.3h22.3v-29.5h7.7v21.8h0v7.7h52.7v-14.2h7.4v14.2h22.8v-52.9h-7.7ZM82.7,448.5v-7.6h7.4v7.6h-7.4Z"/>
        <rect x=".1" y="418.5" width="97.2" height="7.7"/>
      </g>
        <g
        style="fill: {fills[22]}; stroke: {strokes[22]}; stroke-width: {strokeWidths[22]}; cursor: pointer;"
        on:mouseenter={() => handleHover(23)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(23)}
        on:keydown={(e) => handleKey(23, e)}
        tabindex="0"
        role="button"
      >
        <path d="M209.4,299v30.2h-7.1v-15.1h-22.7v22.8h15v7.2h-15.3v7.7h23v-14.9h7.1v15.1h7.7v-53h-7.7ZM187.2,329.2v-7.4h7.4v7.4h-7.4Z"/>
        <rect x="90.5" y="299" width="112" height="7.7"/>
        <polygon points="150.3 314.1 150.3 321.8 150.3 337.5 158 337.5 158 321.8 164.5 321.8 164.5 344.1 150.1 344.1 150.1 351.8 164.5 351.8 172.2 351.8 172.2 344.1 172.2 321.8 172.2 314.7 172.2 314.1 158 314.1 150.3 314.1"/>
        <path d="M119.7,314.2v22.7h15.6v7.5h-15.8v7.7h23.5v-37.9h-23.3ZM135.2,329.2h-7.9v-7.4h7.9v7.4Z"/>
        <polygon points="90.2 321.8 90.2 321.8 90.2 337.7 97.9 337.7 97.9 321.8 105.1 321.8 105.1 344.1 90.2 344.1 90.2 351.8 105.1 351.8 111.9 351.8 112.8 351.8 112.8 321.8 112.8 314.5 112.8 314.1 90.2 314.1 90.2 321.8"/>
      </g>
        <g
        style="fill: {fills[23]}; stroke: {strokes[23]}; stroke-width: {strokeWidths[23]}; cursor: pointer;"
        on:mouseenter={() => handleHover(24)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(24)}
        on:keydown={(e) => handleKey(24, e)}
        tabindex="0"
        role="button"
      >
        <path d="M403.4,344.1h-6.2v-29.7h-7.7v29.7h-7.5v-29.7h-7.7v14.1h-15v-6.9h7.7v-22.7h-23v22.7h7.7v6.5h-7.7v23.5h22.4v-7.7h-14.7v-7.7h22.7v15.6h7.7s7.5,0,7.5,0h0s7.7,0,7.7,0h0s6.2,0,6.2,0h0s7.7,0,7.7,0h0v-37.4h-7.7v29.7ZM351.6,306.6h7.7v7.4h-7.7v-7.4Z"/>
        <polygon points="501.4 299.4 479.5 299.4 479.5 299.5 479.5 307.1 479.5 352.5 487.2 352.5 487.2 307.1 501.4 307.1 501.4 299.4"/>
        <polygon points="419 299.6 404 299.6 404 307.3 419 307.3 419 351.8 426.7 351.8 426.7 299.6 425.7 299.6 419 299.6"/>
        <path d="M433.7,299.6v7.7h30.2v21.2h-8.1v-14.1h-22.2v21.7h14.5v8.5h-13.6v7.7h21.3v-16.1h8.1v16.2h7.7v-52.8h-37.9ZM441.4,328.5v-6.4h6.8v6.4h-6.8Z"/>
      </g>
        <g
        style="fill: {fills[24]}; stroke: {strokes[24]}; stroke-width: {strokeWidths[24]}; cursor: pointer;"
        on:mouseenter={() => handleHover(25)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(25)}
        on:keydown={(e) => handleKey(25, e)}
        tabindex="0"
        role="button"
      >
        <rect x="374.3" y="120.5" width="7.7" height="52.3"/>
        <path d="M359.1,165.3h-7.5v-30.6h-21.9v7.7h0v14.6h7.7v-14.6h6.5v22.9h-21.9v-7.7h0v-7.7h0v-15.2h-29.6v-6.9h59.7v-7.7h-67.3v22.3h29.6v7.5h-37.4v-29.8h-22.9v52.8h39.8v-7.7h-32.1v-22.9h7.6v15.1h.3c0,0,44.8,0,44.8,0v15.1h0v.3h52.5v-52.5h-7.7v44.9ZM261.7,134.8v-6.9h7.6v6.9h-7.6Z"/>
      </g>
       <g
        style="fill: {fills[25]}; stroke: {strokes[25]}; stroke-width: {strokeWidths[25]}; cursor: pointer;"
        on:mouseenter={() => handleHover(26)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(26)}
        on:keydown={(e) => handleKey(26, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="149.5 179.6 142.5 179.6 142.5 164.9 134.8 164.9 134.8 187.3 142.5 187.3 142.5 187.3 157.2 187.3 157.2 186.7 157.2 179.6 157.2 134.7 149.5 134.7 149.5 179.6"/>
        <rect x="239.6" y="120.1" width="7.7" height="66.6"/>
        <path d="M224.7,179.6h-7.5v-14.8h-7.4v-7.3h7.5v-22.5h0v-.6h-22.7v23.1h7.5v7.3h-6.7v14.8h-8.2v-45.2h-23.1v38.6h7.7v-30.9h7.7v37.6h-15.4v7.7h38.9v-15.4h6.4v15.4h0s15.1,0,15.1,0h7.7v-83h-7.7v75.3ZM209.6,142.1v7.4h-7.3v-7.4h7.3Z"/>
      </g>
       <g
        style="fill: {fills[26]}; stroke: {strokes[26]}; stroke-width: {strokeWidths[26]}; cursor: pointer;"
        on:mouseenter={() => handleHover(27)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(27)}
        on:keydown={(e) => handleKey(27, e)}
        tabindex="0"
        role="button"
      >
        <path d="M732.2,0v31.1h-6.2s-7.7,0-7.7,0v13.4h-7.4V15.6h-7.7s-22.1,0-22.1,0h0s-7.7,0-7.7,0v15.6h-7.3v-15.6h-7.7v15.6h-8.1v-7.9h.2v-7.7h-.2s-7.7,0-7.7,0h0s-6.7,0-6.7,0h0s-7.7,0-7.7,0v23.3h14.4v5.7h-14.4v7.7h22.1v-13.4h52.9v13.4h36.6V0h-7.7ZM636,31.1v-7.9h6.7v7.9h-6.7ZM681.1,31.1v-7.9h22.1v7.9h-22.1ZM732.2,44.5h-6.2v-5.7h6.2v5.7Z"/>
        <polygon points="718.4 23.4 726.1 23.4 726.1 0 720.6 0 718.4 0 613.8 0 613.8 7.7 718.4 7.7 718.4 23.4"/>
        <polygon points="613.8 44.5 598.7 44.5 598.7 52.2 613.8 52.2 619.8 52.2 621.4 52.2 621.4 15.6 613.8 15.6 613.8 44.5"/>
      </g>
       <g
        style="fill: {fills[27]}; stroke: {strokes[27]}; stroke-width: {strokeWidths[27]}; cursor: pointer;"
        on:mouseenter={() => handleHover(28)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(28)}
        on:keydown={(e) => handleKey(28, e)}
        tabindex="0"
        role="button"
      >
        <rect x="628.3" y="60" width="7.7" height="52.3"/>
        <path d="M613.8,104.6h-7.7v-29.2h-23.4v21.4h15.7v7.8h-22.2v-44.6h-38.4v7.7h30.7v44.6h52.9v-52.3h-7.7v44.6ZM590.4,89.2v-6h8v6h-8Z"/>
        <path d="M553.2,90.1h-7.7v-14.6h-.2v-.2h-29v-7.6h-7.7v37.9h-7.9v-9.1h-7.7v16.8h23.3v-15.5h7.9v15.5h21.3v-15.5h15.3v-.3h0v-21.9h-7.7v14.6ZM531.9,105.6v-14.6h0v-.9h-15.6v-7.1h21.6v22.6h-5.9Z"/>
        <rect x="598.2" y="60" width="7.7" height="7.7"/>
        <rect x="582.7" y="60" width="7.7" height="7.7"/>
        <rect x="553.2" y="104.6" width="7.7" height="7.7"/>
        <rect x="524.4" y="60.5" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[28]}; stroke: {strokes[28]}; stroke-width: {strokeWidths[28]}; cursor: pointer;"
        on:mouseenter={() => handleHover(29)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(29)}
        on:keydown={(e) => handleKey(29, e)}
        tabindex="0"
        role="button"
      >
        <rect x="492.9" y="59.9" width="7.7" height="31.1"/>
        <polygon points="479.4 60 463.9 60 463.9 67.7 479.4 67.7 479.4 90.1 471.6 90.1 471.6 75.7 463.9 75.7 463.9 104.6 456.6 104.6 456.6 59.9 449 59.9 449 104.6 449 112.3 456.6 112.3 463.9 112.3 469.1 112.3 471.6 112.3 471.6 97.7 479.4 97.7 487.1 97.7 487.1 90.1 487.1 60 484.1 60 479.4 60"/>
        <path d="M359.1,75.7v29.6h-15.2v7.7h98.4v-.3h0v-22.5h-7.7v15.1h-8v-15.1h-7.7v15.1h-8v-15.1h-7.7v15.1h-6.3v-14.8h-30.2v-7.1h75.6v-7.7h-83.3ZM389.4,98.1v7.1h-22.6v-7.1h22.6Z"/>
        <rect x="479.4" y="104.6" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[29]}; stroke: {strokes[29]}; stroke-width: {strokeWidths[29]}; cursor: pointer;"
        on:mouseenter={() => handleHover(30)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(30)}
        on:keydown={(e) => handleKey(30, e)}
        tabindex="0"
        role="button"
      >
        <rect x="486.2" y="254.4" width="7.7" height="37.4"/>
        <path d="M471.6,239.2v30.1h-15.4v14.2h-8.1v-29.1h0s-21.5,0-21.5,0h0v23.6h13.8v5.5h-21.8v-29.1h-7.7v14.9h-7.5v-14.9h-7.7v29.1h-36.9v-21.4h31v-7.7h-38.7v36.8h52.3v-14.2h7.5v14.2h68.2v-44.2h6.1v-7.7h-13.8ZM434.4,270.3v-8.2h6.1v8.2h-6.1ZM463.9,283.5v-6.5h7.7v6.5h-7.7Z"/>
        <rect x="456.2" y="239.7" width="7.7" height="7.7"/>
        <rect x="456.2" y="255" width="7.7" height="7.7"/>
        <rect x="382" y="268.9" width="7.7" height="7.7"/>
        <rect x="366.6" y="268.9" width="7.7" height="7.7"/>
        <rect x="374.3" y="298.9" width="7.7" height="7.7"/>
        <rect x="389.5" y="298.9" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[30]}; stroke: {strokes[30]}; stroke-width: {strokeWidths[30]}; cursor: pointer;"
        on:mouseenter={() => handleHover(31)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(31)}
        on:keydown={(e) => handleKey(31, e)}
        tabindex="0"
        role="button"
      >
        <path d="M329.7,359.9h-7.7v-31.4h-22.4v7.7h14.7v7.9h-21.9v-14.8h0c0-.1-15.4-.1-15.4-.1v-7.6h45v-7.7h-52.6v23h15.4v7.2h-23.1v-44.5h-7.7v14.9h-6.4v-15.2h-23v52.5h7.7v-29.6h21.6v29.6h60.3v15.8h23v-53.3h-7.7v45.6ZM232.3,307h7.6v7.5h-7.6v-7.5Z"/>
        <rect x="269.2" y="298.9" width="68.1" height="7.7"/>
        <rect x="239.9" y="329.2" width="7.7" height="7.7"/>
        <rect x="239.9" y="344.1" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[31]}; stroke: {strokes[31]}; stroke-width: {strokeWidths[31]}; cursor: pointer;"
        on:mouseenter={() => handleHover(32)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(32)}
        on:keydown={(e) => handleKey(32, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="269.3 448.9 261.7 448.9 261.7 440.8 276.9 440.8 276.9 433.1 254 433.1 254 433.6 254 440.8 254 448.9 254 456.2 254 456.6 269.3 456.6 269.3 462.7 247.5 462.7 247.5 433.1 239.8 433.1 239.8 470.3 239.9 470.3 247.5 470.3 269.3 470.3 277 470.3 277 462.7 277 448.9 276.9 448.9 269.3 448.9"/>
        <path d="M329.7,433.7v7.7h29.4v21.3h-7v-14.5h-22.4v14.5h-7.7v-29.5h-7.7v16.3h-7.2v-16.3h-22.4v7.7h14.7v8.6h-14.6v7.7h29.5v13.2h52.5v-36.6h-37.1ZM337.3,462.7v-6.8h7v6.8h-7Z"/>
        <rect x="239.9" y="417.7" width="126.9" height="7.7"/>
        <rect x="299.4" y="462.7" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[32]}; stroke: {strokes[32]}; stroke-width: {strokeWidths[32]}; cursor: pointer;"
        on:mouseenter={() => handleHover(33)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(33)}
        on:keydown={(e) => handleKey(33, e)}
        tabindex="0"
        role="button"
      >
        <rect x="359.3" y="359.2" width="7.7" height="52.9"/>
        <path d="M343.9,389.2h-6.6v-16h-23v23.6h15.4v7.7h-29.7v7.7h37.4v-15.4h6.6v15.3h7.7v-52.9h-7.7v30ZM322,389.2v-8.3h7.7v8.3h-7.7Z"/>
        <polygon points="307.1 396.8 307.1 396.4 307.1 389.2 307.1 382.1 307.1 374.4 307.1 374.4 299.4 374.4 299.4 374.4 292.4 374.4 292.4 366.9 307.1 366.9 307.1 359.2 292.4 359.2 284.8 359.2 284.7 359.2 284.7 374.4 284.7 381.7 284.7 382.1 299.4 382.1 299.4 389.2 277 389.2 277 374.4 269.3 374.4 269.3 389.2 261.7 389.2 261.7 366.9 278.1 366.9 278.1 359.2 261.7 359.2 256.4 359.2 254 359.2 254 404.5 247 404.5 247 373 239.3 373 239.3 404.5 239.3 410.9 239.3 412.2 261.7 412.2 261.7 411.6 261.7 404.5 261.7 396.8 307.1 396.8"/>
        <rect x="284.9" y="404.6" width="7.7" height="7.7"/>
        <rect x="269.3" y="404.5" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[33]}; stroke: {strokes[33]}; stroke-width: {strokeWidths[33]}; cursor: pointer;"
        on:mouseenter={() => handleHover(34)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(34)}
        on:keydown={(e) => handleKey(34, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="187.4 269.3 179.9 269.3 179.9 246.5 179.9 239.7 179.9 238.8 164.8 238.8 157.2 238.8 157.1 238.8 157.1 246.5 157.2 246.5 157.2 277 164.8 277 164.8 246.5 172.2 246.5 172.2 284.1 150.8 284.1 150.8 238.8 143.1 238.8 143.1 254.8 135 254.8 135 238.8 127.3 238.8 127.3 254.8 120.2 254.8 120.2 239.6 112.5 239.6 112.5 284.1 98 284.1 98 291.8 119.8 291.8 119.8 291.8 120.2 291.8 120.2 262.5 143.1 262.5 143.1 284.1 143.1 291 143.1 291.8 172.2 291.8 179.2 291.8 179.9 291.8 179.9 277 194.5 277 194.5 277 195.1 277 195.1 238.8 187.4 238.8 187.4 269.3"/>
        <rect x="202.6" y="239.2" width="52.1" height="7.7"/>
        <rect x="187.4" y="283.5" width="7.7" height="7.7"/>
        <rect x="127.3" y="269.3" width="7.7" height="7.7"/>
        <rect x="127.3" y="283.5" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[34]}; stroke: {strokes[34]}; stroke-width: {strokeWidths[34]}; cursor: pointer;"
        on:mouseenter={() => handleHover(35)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(35)}
        on:keydown={(e) => handleKey(35, e)}
        tabindex="0"
        role="button"
      >
        <rect x="15.6" y="214.5" width="7.7" height="7.7"/>
        <rect x="90.2" y="164.9" width="7.7" height="53"/>
        <path d="M75,179.6h-14.6v7.7h14.6v36.8h-14.8v-7h7.6v-22.5h0s-7.7,0-7.7,0h0s-7.3,0-7.3,0h0s-7.7,0-7.7,0h0v22.5h7.4v7h-14.8v-36.8h16v-7.7h-23.7v15h-6.9v-15H.1v52.1H.1s15,0,15,0v-7.7h-7.3v-36.8h7.7v15h14.5v29.5h2.9s49.7,0,49.7,0h0v-52.1h-7.7ZM60.2,202.3v7h-7.3v-7h7.3Z"/>
        <rect x="15.6" y="204" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[35]}; stroke: {strokes[35]}; stroke-width: {strokeWidths[35]}; cursor: pointer;"
        on:mouseenter={() => handleHover(36)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(36)}
        on:keydown={(e) => handleKey(36, e)}
        tabindex="0"
        role="button"
      >
        <rect x="74.9" y="299.1" width="7.7" height="68.6"/>
        <path d="M60.1,328.5h-14.7v15.9h-7.7v-15.9H14.6v7.7h15.4v8.2H7.7v-37.6h6.9v15.1h7.7v-15.1h7.7v15.1h22.6v-7.7h-14.9v-7.4h14.9v-7.7H0v53H0s65,0,65,0h0s2.7,0,2.7,0v-52.9h-7.7v29.4ZM53,336.2h7v8.2h-7v-8.2Z"/>
        <rect x="0" y="360" width="7.7" height="7.7"/>
        <rect x="15.5" y="360" width="7.7" height="7.7"/>
        <rect x="30" y="360" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[36]}; stroke: {strokes[36]}; stroke-width: {strokeWidths[36]}; cursor: pointer;"
        on:mouseenter={() => handleHover(37)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(37)}
        on:keydown={(e) => handleKey(37, e)}
        tabindex="0"
        role="button"
      >
        <path d="M209.4,404h-6.9v-30.7h-22.3c0,.1-.3.1-.3.1v23.4h14.9v7.1h-22.2v-30.7h-22.4c0,.1-.2.1-.2.1v22.9h14.9v7.7h-14.9v7.7h66.9s.3,0,.3,0v-52.9h-7.7v45.3ZM187.5,389.1v-8.2h7.3v8.2h-7.3ZM157.6,388.6v-7.7h7.3v7.7h-7.3Z"/>
        <polygon points="247.6 359.2 232.3 359.2 224.7 359.2 224.7 366.9 224.7 412.1 232.3 412.1 232.3 366.9 247.6 366.9 247.6 359.2"/>
        <polygon points="119.7 373.4 119.7 380.9 119.7 396.3 119.8 396.3 127.3 396.3 135.2 396.3 135.2 404 74.9 404 74.9 411.6 142.7 411.6 142.7 411.6 142.9 411.6 142.9 388.6 141.5 388.6 135.2 388.6 127.3 388.6 127.3 380.9 142.9 380.9 142.9 373.3 119.7 373.3 119.7 373.4"/>
        <rect x="194.8" y="358.7" width="7.7" height="7.7"/>
        <rect x="179.8" y="358.7" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[37]}; stroke: {strokes[37]}; stroke-width: {strokeWidths[37]}; cursor: pointer;"
        on:mouseenter={() => handleHover(38)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(38)}
        on:keydown={(e) => handleKey(38, e)}
        tabindex="0"
        role="button"
      >
        <path d="M224.2,417.4v45.2h-7v-29.5h-22.4v29.5h-14.9v-6h7.4v-23.1h-14.7c0,0-7.7,0-7.7,0v23.5h7.3v5.5h-14.2v-29.6h-7.7v16.4h-7.4v-16h-23.2v7.7h15.5v8.3h-15.5v7.7h30.6v13.2h52.1v-13.2h7v13.2h22.4v-52.9h-7.7ZM179.6,441.3v5.5h-7v-5.5h7ZM202.4,449.4v-8.6h7v8.6h-7Z"/>
        <rect x="119.8" y="417.4" width="97.2" height="7.7"/>
        <rect x="135.2" y="462.7" width="7.7" height="7.7"/>
        <rect x="119.8" y="462.7" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[38]}; stroke: {strokes[38]}; stroke-width: {strokeWidths[38]}; cursor: pointer;"
        on:mouseenter={() => handleHover(39)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(39)}
        on:keydown={(e) => handleKey(39, e)}
        tabindex="0"
        role="button"
      >
        <path d="M105,359.8h-14.9v7.7h14.9v22h-7.4v-16.1h0c0-.1-22.7-.1-22.7-.1h0v16.2h-7.2v-16.1h-7.7v16.1h-7.3v-16.1h-7.7v16.1h-7.3v-16.2h-7.7v30.7H7.7v-23h14.1v-7.7H0v30.7h0v7.7h37.6v-1.1h0v-13.4h75v-37.3h-7.7ZM82.6,380.9h7.4v8.5h-7.4v-8.5Z"/>
        <rect x="119.3" y="358.7" width="52.8" height="7.7"/>
        <rect x="45.4" y="360" width="7.7" height="7.7"/>
        <rect x="60.1" y="360" width="7.7" height="7.7"/>
        <rect x="60" y="404" width="7.7" height="7.7"/>
        <rect x="45.3" y="404" width="7.7" height="7.7"/>
        <rect x="14.6" y="388.1" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[39]}; stroke: {strokes[39]}; stroke-width: {strokeWidths[39]}; cursor: pointer;"
        on:mouseenter={() => handleHover(40)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(40)}
        on:keydown={(e) => handleKey(40, e)}
        tabindex="0"
        role="button"
      >
        <path d="M7.8,262.5h28.9s1.1,0,1.1,0v-23.7h-7.7v16h-6.9v-16.1H.1v38.5h15v-7.7h-7.3v-7ZM7.8,246.4h7.7v8.5h-7.7v-8.5Z"/>
        <rect x="97.9" y="239.6" width="7.7" height="38.2"/>
        <polygon points="49.6 239.2 45.1 239.2 45.1 262.5 45.9 262.5 45.9 262.5 67.5 262.5 67.5 284.1 60.3 284.1 60.3 269.3 52.6 269.3 52.6 269.3 45.5 269.3 45.5 269.3 37.8 269.3 37.8 284.2 15.4 284.2 15.4 291.9 45.5 291.9 45.5 291.8 45.5 284.2 45.5 277 52.6 277 52.6 291.8 52.8 291.8 52.8 291.8 67.5 291.8 75.1 291.8 82.8 291.8 89.7 291.8 90.5 291.8 90.5 253.7 82.8 253.7 82.8 284.1 75.1 284.1 75.1 254.8 75 254.8 67.5 254.8 52.8 254.8 52.8 246.9 90.5 246.9 90.5 239.2 52.8 239.2 49.6 239.2"/>
        <rect x="22.4" y="269.3" width="7.7" height="7.7"/>
        <rect x=".1" y="284.2" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[40]}; stroke: {strokes[40]}; stroke-width: {strokeWidths[40]}; cursor: pointer;"
        on:mouseenter={() => handleHover(41)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(41)}
        on:keydown={(e) => handleKey(41, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="337.3 239.2 261.9 239.2 261.9 246.9 337.3 246.9 337.3 283.5 329.7 283.5 329.7 254.4 328.2 254.4 328.2 254.4 306.5 254.4 306.5 254.4 306.5 262.1 306.5 277 314.2 277 314.2 262.1 322 262.1 322 283.5 300.3 283.5 300.3 254.4 292.6 254.4 292.6 283.5 284.8 283.5 284.8 254.4 277.1 254.4 277.1 283.5 269.3 283.5 269.3 254.4 261.7 254.4 261.7 283.5 254.6 283.5 254.6 277 254.6 269.3 254.6 254.4 247 254.4 247 269.3 239.8 269.3 239.8 253.6 232.1 253.6 232.1 269.3 210.3 269.3 210.3 261.3 224.9 261.3 224.9 253.6 202.6 253.6 202.6 254.4 202.6 261.3 202.6 269.3 202.6 277 202.6 277 247 277 247 283.5 247 291.1 254.6 291.1 261.7 291.1 269.3 291.1 277.1 291.1 284.8 291.1 292.6 291.1 300.3 291.1 322 291.1 329.7 291.1 337.3 291.1 344.3 291.1 345 291.1 345 246.9 345 246.9 345 239.2 345 239.2 337.3 239.2"/>
        <rect x="351.3" y="239.2" width="97.1" height="7.7"/>
        <rect x="217.1" y="283.5" width="7.7" height="7.7"/>
        <rect x="232.3" y="283.5" width="7.7" height="7.7"/>
        <rect x="202.6" y="283.5" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[41]}; stroke: {strokes[41]}; stroke-width: {strokeWidths[41]}; cursor: pointer;"
        on:mouseenter={() => handleHover(42)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(42)}
        on:keydown={(e) => handleKey(42, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="269.2 224.8 253.6 224.8 253.6 232.5 276.9 232.5 276.9 231.8 276.9 224.8 276.9 179.2 269.2 179.2 269.2 224.8"/>
        <rect x="388.2" y="179.8" width="38.6" height="7.7"/>
        <path d="M374.3,179.6h-16v7.7h16v36.7h-15v-6.9h7.5v-23h-22.9v23h7.7v6.9h-14.2v-44.4h-23v14.8h0v7.7h15.4v21.9h-7.7v-14.1h-15.4v-30.3h-21.7v22.7h14v22.5h-6.3v-15.5h-7.7v15.5h0v7.7h21.7v-.7h0v-14.2h7.7v14.1h67.7v-52.1h-7.7ZM359.1,201.8v6.7h-7.5v-6.7h7.5ZM322,194.5v-7.1h7.7v7.1h-7.7ZM292.6,194.6v-7.3h6.3v7.3h-6.3Z"/>
        <rect x="298.9" y="164.9" width="7.7" height="7.7"/>
        <rect x="344.3" y="179.6" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[42]}; stroke: {strokes[42]}; stroke-width: {strokeWidths[42]}; cursor: pointer;"
        on:mouseenter={() => handleHover(43)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(43)}
        on:keydown={(e) => handleKey(43, e)}
        tabindex="0"
        role="button"
      >
        <path d="M492.9,120.2v29.2h-6.4v-13.5h-7.7v29h-36.5v-7.8h29.2v-22.3h-36.9v14.6h-8v-14.2h-7.7v14.2h-8v-14.6h-7.7v14.6h-6.3v-14.6h-7.7v37.9h7.7v-15.7h37.7v15.4h51.9v-15.4h14.1v-36.9h-7.7ZM442.4,142.5h21.5v7h-21.5v-7Z"/>
        <rect x="389.4" y="120.2" width="97.8" height="7.7"/>
        <rect x="419" y="164.9" width="7.7" height="7.7"/>
        <rect x="403.4" y="164.9" width="7.7" height="7.7"/>
        <rect x="492.9" y="164.9" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[43]}; stroke: {strokes[43]}; stroke-width: {strokeWidths[43]}; cursor: pointer;"
        on:mouseenter={() => handleHover(44)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(44)}
        on:keydown={(e) => handleKey(44, e)}
        tabindex="0"
        role="button"
      >
        <path d="M516.2,179.8h-36.9v7.7h29.3v51.8h-7.9v-15.2h-6.7v-6.4h7.7v-23.4h-23v23.1h7.7v7.5h-14.6v-30.6h-30.1v-6.8h15.1v-7.7h-22.8v30.2h-7.1v-15.3h-7.7v15.3h-8v-15.7h-22.8v38.3h24v-7.7h-16.3v-7.2h38s7.7,0,7.7,0h0s7.4,0,7.4,0v14.9h44.1v14.4h23.3v-66.7h0v-.4ZM395.9,201.9h7.5v8h-7.5v-8ZM486.2,201.9h7.7v7.6h-7.7v-7.6ZM456.6,217.6v-7.7h-15v-8h22.4v22.9h-7.4v-7.2Z"/>
        <polygon points="531.6 239.5 531.6 180.2 523.9 180.2 523.9 247.2 525.1 247.2 531.6 247.2 545.3 247.2 545.3 239.5 531.6 239.5"/>
        <rect x="433.8" y="224.8" width="7.7" height="7.7"/>
        <rect x="419" y="224.8" width="7.7" height="7.7"/>
        <rect x="463.9" y="179.8" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[44]}; stroke: {strokes[44]}; stroke-width: {strokeWidths[44]}; cursor: pointer;"
        on:mouseenter={() => handleHover(45)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(45)}
        on:keydown={(e) => handleKey(45, e)}
        tabindex="0"
        role="button"
      >
        <path d="M627.5,120.2v45.2h-6.1v-31.5h-7.7v31.5h-7.7v-31.5h-7.7v31.5h-8v-31.5h-7.7v15.6h-6.5v-14.6h-23v14.6h-7.7v-14.9h-7.7v14.9h-13.9v-7.6h7.7v-21.7h-23v21.7h7.7v7.5h-7.7v23.5h36.9v-7.7h-29.3v-8.1h66.5v15.9h52.5v-52.8h-7.7ZM516.2,127.9h7.7v6.7h-7.7v-6.7ZM560.8,149.4v-7h7.7v7h-7.7Z"/>
        <rect x="537.8" y="120.2" width="83.8" height="7.7"/>
        <rect x="553.2" y="164.9" width="7.7" height="7.7"/>
        <rect x="569.2" y="165.3" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[45]}; stroke: {strokes[45]}; stroke-width: {strokeWidths[45]}; cursor: pointer;"
        on:mouseenter={() => handleHover(46)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(46)}
        on:keydown={(e) => handleKey(46, e)}
        tabindex="0"
        role="button"
      >
        <path d="M702.7,141.5h29.5v23.4h-6.2v-15.5h-7.7s-7.9,0-7.9,0h0s-7.7,0-7.7,0h0v15.5h-7.3v-30.1h-22.1v23.1h7.7v-15.4h6.7v22.4h-14.4v7.7h66.4v-38.7h-37.2v7.7ZM710.5,164.9v-7.8h7.9v7.8h-7.9Z"/>
        <polygon points="642.9 127.9 658.2 127.9 658.2 165.3 650.5 165.3 650.5 133.8 642.9 133.8 642.9 172.7 642.9 172.7 642.9 173 658.2 173 665.7 173 665.9 173 665.9 127.9 665.9 120.7 665.9 120.2 642.9 120.2 642.9 127.9"/>
        <rect x="695.6" y="120.7" width="44.3" height="7.7"/>
        <rect x="673.5" y="120.2" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[46]}; stroke: {strokes[46]}; stroke-width: {strokeWidths[46]}; cursor: pointer;"
        on:mouseenter={() => handleHover(47)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(47)}
        on:keydown={(e) => handleKey(47, e)}
        tabindex="0"
        role="button"
      >
        <rect x="732.2" y="180.3" width="7.7" height="52.2"/>
        <polygon points="702.5 187.9 718.4 187.9 718.4 224.8 710.5 224.8 710.5 194.3 710.3 194.3 710.3 194.2 687.5 194.2 687.5 201.9 702.8 201.9 702.8 209.9 681.1 209.9 681.1 194.4 673.5 194.4 673.5 209.9 665.9 209.9 665.9 194.2 658.2 194.2 658.2 209.9 650.5 209.9 650.5 194.2 642.9 194.2 642.9 209.9 642.9 217.6 642.9 224.8 612.8 224.8 612.8 232.5 642.9 232.5 642.9 232.5 650.5 232.5 650.5 217.6 702.8 217.6 702.8 232.5 710.5 232.5 710.5 232.5 726.1 232.5 726.1 231.7 726.1 224.8 726.1 187.9 726.1 180.3 726.1 180.2 702.5 180.2 702.5 187.9"/>
        <rect x="687.9" y="180.2" width="7.7" height="7.7"/>
        <rect x="687.9" y="224.8" width="7.7" height="7.7"/>
        <rect x="673.5" y="224.8" width="7.7" height="7.7"/>
        <rect x="658.2" y="224.8" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[47]}; stroke: {strokes[47]}; stroke-width: {strokeWidths[47]}; cursor: pointer;"
        on:mouseenter={() => handleHover(48)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(48)}
        on:keydown={(e) => handleKey(48, e)}
        tabindex="0"
        role="button"
      >
        <rect x="628.4" y="238.9" width="37.8" height="7.7"/>
        <path d="M621.1,238.9h-52.6v7.7h45v37.6h-7.4v-29.8h0s-22.6,0-22.6,0v22.6h7.7v-14.9h7.3v22.1h-22.2v-29.8h0s-23,0-23,0v22.5h15.4v7.3h-23v-14.1h-7.7v14.1h-6.2v-14.8h0c0,0-23.3,0-23.3,0v-7.3h7.9v-7.7h-14.8s-.8,0-.8,0v37.4h120.6v-52.9h0ZM560.8,269.2v-7.2h7.7v7.2h-7.7ZM508.3,277h15.6v7.2h-15.6v-7.2Z"/>
        <rect x="553.2" y="239.7" width="7.7" height="7.7"/>
        <rect x="523.9" y="255" width="7.7" height="7.7"/>
        <rect x="523.9" y="299.6" width="7.7" height="7.7"/>
        <rect x="538.1" y="299.6" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[48]}; stroke: {strokes[48]}; stroke-width: {strokeWidths[48]}; cursor: pointer;"
        on:mouseenter={() => handleHover(49)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(49)}
        on:keydown={(e) => handleKey(49, e)}
        tabindex="0"
        role="button"
      >
        <path d="M598.4,298.9v29.6h-14.5v15.8h-23v-8.2h16v-21.6h-24.6v7.7h16.9v6.2h-23.7v-14.1h-7.7v14.1h-5.9v-14.1h-7.7v14.1h-23.6v-5.7h16.9v-7.7h-24.6v21h60.2v8.2h0v7.7h52.9v-53.1h-7.7ZM598.4,344.3h-6.9v-8.2h6.9v8.2Z"/>
        <polygon points="583.9 321.6 591.6 321.6 591.6 299.6 591.1 299.6 583.9 299.6 552.3 299.6 552.3 307.3 583.9 307.3 583.9 321.6"/>
        <rect x="492.9" y="344.3" width="7.7" height="7.7"/>
        <rect x="508.6" y="344.3" width="7.7" height="7.7"/>
        <rect x="523.9" y="344.3" width="7.7" height="7.7"/>
        <rect x="537.8" y="344.3" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[49]}; stroke: {strokes[49]}; stroke-width: {strokeWidths[49]}; cursor: pointer;"
        on:mouseenter={() => handleHover(50)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(50)}
        on:keydown={(e) => handleKey(50, e)}
        tabindex="0"
        role="button"
      >
        <rect x="732.2" y="239.7" width="7.7" height="51.4"/>
        <polygon points="717.7 284.2 710.5 284.2 710.5 262.1 710.5 254.4 702.8 254.4 681.1 254.4 681.1 246.6 711.2 246.6 711.2 238.9 681.1 238.9 673.5 238.9 673.5 246.6 673.5 254.4 673.5 261.9 673.5 262.1 702.8 262.1 702.8 284.2 695.6 284.2 695.6 277.5 695.6 269.9 687.9 269.9 665.9 269.9 665.9 254.4 658.2 254.4 658.2 269.9 650.5 269.9 650.5 254.4 642.9 254.4 642.9 269.9 636 269.9 636 254.4 628.3 254.4 628.3 299.6 613.5 299.6 613.5 307.3 628.3 307.3 636 307.3 636 299.6 636 277.5 687.9 277.5 687.9 284.2 687.9 291.9 695.6 291.9 702.8 291.9 710.5 291.9 725.4 291.9 725.4 291.1 725.4 284.2 725.4 239.7 717.7 239.7 717.7 284.2"/>
        <rect x="642.9" y="284.2" width="7.7" height="7.7"/>
        <rect x="657.4" y="284.2" width="7.7" height="7.7"/>
        <rect x="673.5" y="284.2" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[50]}; stroke: {strokes[50]}; stroke-width: {strokeWidths[50]}; cursor: pointer;"
        on:mouseenter={() => handleHover(51)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(51)}
        on:keydown={(e) => handleKey(51, e)}
        tabindex="0"
        role="button"
      >
        <rect x="732.2" y="359.9" width="7.7" height="51.4"/>
        <polygon points="702.9 366.9 718.4 366.9 718.4 388.4 711.2 388.4 711.2 374 703.6 374 703.6 403.6 695.6 403.6 695.6 359.2 687.9 359.2 687.9 411.2 688 411.2 688 411.3 703.6 411.3 710 411.3 711.2 411.3 711.2 396 718.4 396 726.1 396 726.1 388.4 726.1 366.9 726.1 359.9 726.1 359.2 702.9 359.2 702.9 366.9"/>
        <polygon points="673.5 373.2 665.8 373.2 658.2 373.2 658.1 373.2 658.1 403.6 650.5 403.6 650.5 373.2 642.9 373.2 642.9 403.6 606.2 403.6 606.2 380.9 620.9 380.9 620.9 373.2 606.2 373.2 598.9 373.2 598.6 373.2 598.6 403.6 598.5 403.6 598.5 411.3 681.1 411.3 681.1 403.6 665.8 403.6 665.8 380.9 673.5 380.9 673.5 396.5 681.1 396.5 681.1 373.2 680.2 373.2 673.5 373.2"/>
        <rect x="718.4" y="403.6" width="7.7" height="7.7"/>
        <rect x="628.3" y="373.9" width="7.7" height="7.7"/>
        <rect x="628.3" y="388.4" width="7.7" height="7.7"/>
        <rect x="614.1" y="388.4" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[51]}; stroke: {strokes[51]}; stroke-width: {strokeWidths[51]}; cursor: pointer;"
        on:mouseenter={() => handleHover(52)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(52)}
        on:keydown={(e) => handleKey(52, e)}
        tabindex="0"
        role="button"
      >
        <path d="M582.3,404.6h-6.1v-16.2h-7.7v16.2h-7.7v-16.2h-7.7v16.2h-7.7v-16.2h-7.7v16.2h-6.2v-31.4h-23v15.2h-7.9v-15.6h-7.7v15.6h-5.7v-14.5h-24.3v7.7h16.7v6.8h-16.7v7.7h45.7v16.2h81.4v-53.1h-7.7v45.4ZM516.2,380.9h7.7v7.5h-7.7v-7.5ZM516.2,396h7.7v8.6h-7.7v-8.6Z"/>
        <rect x="598.4" y="359.2" width="82.1" height="7.7"/>
        <rect x="568.5" y="373.9" width="7.7" height="7.7"/>
        <rect x="553.2" y="373.9" width="7.7" height="7.7"/>
        <rect x="537.8" y="373.9" width="7.7" height="7.7"/>
        <rect x="492.9" y="404.6" width="7.7" height="7.7"/>
        <rect x="479.5" y="404.6" width="7.7" height="7.7"/>
      </g>
       <g
        style="fill: {fills[52]}; stroke: {strokes[52]}; stroke-width: {strokeWidths[52]}; cursor: pointer;"
        on:mouseenter={() => handleHover(53)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(53)}
        on:keydown={(e) => handleKey(53, e)}
        tabindex="0"
        role="button"
      >
        <path d="M448.2,404.6h-5.5v-45.9h-23.5v25.1h7.7v-17.5h8.1v22.8h-23.9v-16h-22.2v23.6h14.5v7.7h-21.4v-45.4h-7.7v53.1h36.7v-15.4h23.9v15.4h20.9v-53.6h-7.7v45.9ZM396.5,389.2v-8.3h6.8v8.3h-6.8Z"/>
        <rect x="462.9" y="359.2" width="114.4" height="7.7"/>
        <rect x="403.4" y="359.2" width="7.7" height="7.7"/>
        <rect x="388.8" y="359.2" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[53]}; stroke: {strokes[53]}; stroke-width: {strokeWidths[53]}; cursor: pointer;"
        on:mouseenter={() => handleHover(54)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(54)}
        on:keydown={(e) => handleKey(54, e)}
        tabindex="0"
        role="button"
      >
        <path d="M628.3,462.7h-7.1v-29.5h-22.8v23.7h7.7v-16h7.4v21.8h-22v-29.5h-23v29.5h-7.7v-29.5h-7.7v15.8h-7.7v-15.2h-22.2v7.7h14.6v7.5h-14.6v7.7h29.9v13.7h23v-13.7h7.7v13.7h52.1v-37.2h-7.7v29.5ZM576.2,448.9v-8.1h7.7v8.1h-7.7Z"/>
        <rect x="523.3" y="418.6" width="142.6" height="7.7"/>
        <rect x="537.8" y="462.7" width="7.7" height="7.7"/>
        <rect x="523.3" y="462.7" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[54]}; stroke: {strokes[54]}; stroke-width: {strokeWidths[54]}; cursor: pointer;"
        on:mouseenter={() => handleHover(55)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(55)}
        on:keydown={(e) => handleKey(55, e)}
        tabindex="0"
        role="button"
      >
        <rect x="732.2" y="299.6" width="7.7" height="52.7"/>
        <polygon points="702.7 307.1 718.4 307.1 718.4 328.5 711.2 328.5 711.2 314.7 703.6 314.7 703.6 344.7 687.8 344.7 687.8 352.4 703.6 352.4 710.3 352.4 711.2 352.4 711.2 336.1 718.4 336.1 718.4 352.4 726.1 352.4 726.1 307.1 726.1 299.6 726.1 299.4 702.7 299.4 702.7 307.1"/>
        <path d="M687.9,336.1h7.7v-36.8h-22.1v15.2h0v7.7h14.4v6.2h-22v-13.5h-7.7v13.5h-7.7v-13.4h-7.7v29.6h-6.9v-15.4h-14.8v-7h14.6v-7.7h-22.3v22.4h14.8v15.4h22.2v-16.2h37.4ZM681.1,314.6v-7.5h6.7v7.5h-6.7Z"/>
        <rect x="658.2" y="299.6" width="7.7" height="7.7"/>
        <rect x="642.9" y="299.6" width="7.7" height="7.7"/>
        <rect x="673.5" y="344.7" width="7.7" height="7.7"/>
        <rect x="658.2" y="344.7" width="7.7" height="7.7"/>
        <rect x="613.5" y="344.7" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[55]}; stroke: {strokes[55]}; stroke-width: {strokeWidths[55]}; cursor: pointer;"
        on:mouseenter={() => handleHover(56)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(56)}
        on:keydown={(e) => handleKey(56, e)}
        tabindex="0"
        role="button"
      >
        <path d="M635.8,180.2h-23.3v7.7h15.8v22.1h-7.9v-15.6h0c0-.1-22-.1-22-.1v7.7h14.4v8h-14.4v14.9h-8v-36.9h15.2v-7.7h-22.8v14h-6.5v-13.9h-7.7v13.9h-7.7v-13.9h-23v51.4h39v-7.7h-31.3v-22.1h37.2v30.5h7.7s8,0,8,0h0s7.7,0,7.7,0h0v-14.9h29.9v-37.3h-.2ZM545.5,194.2v-6.2h7.7v6.2h-7.7Z"/>
        <rect x="642.9" y="180.2" width="38.5" height="7.7"/>
        <rect x="568.5" y="209.9" width="7.7" height="7.7"/>
        <rect x="553.2" y="209.9" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[56]}; stroke: {strokes[56]}; stroke-width: {strokeWidths[56]}; cursor: pointer;"
        on:mouseenter={() => handleHover(57)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(57)}
        on:keydown={(e) => handleKey(57, e)}
        tabindex="0"
        role="button"
      >
        <path d="M284.7,60h-16.2v23.3h16.2v21.9h-8.6v-15.5h-14.5v-14h-36.7v14.7h-7.7v-14.9h-7.7v45.5h-22.3v-16.6h-7.7v24.3h37.6v-30.6h23.1v14.9h21.4v-15.5h6.8v15.5h23.9v-52.9h-7.7ZM248,105.2v-14.9h-15.4v-7h21.4v21.9h-6ZM276.1,75.7v-8h8.6v8h-8.6Z"/>
        <polygon points="329.7 60 329.7 67.7 343.9 67.7 343.9 89.7 337.4 89.7 337.4 82.8 337.4 75.3 337.4 75.1 314.3 75.1 314.3 82.8 314.3 82.8 314.3 97.7 322 97.7 322 82.8 329.7 82.8 329.7 105.5 306.6 105.5 306.6 59.9 298.9 59.9 298.9 105.5 298.9 113 298.9 113.2 337.4 113.2 337.4 113 337.4 105.5 337.4 97.4 343.9 97.4 351.6 97.4 351.6 89.7 351.6 67.7 351.6 60 343.9 60 329.7 60"/>
        <rect x="359.1" y="60" width="83.3" height="7.7"/>
        <rect x="314.3" y="60.5" width="7.7" height="7.7"/>
        <rect x="254" y="60" width="7.7" height="7.7"/>
        <rect x="239.8" y="60" width="7.7" height="7.7"/>
      </g>
     <g
        style="fill: {fills[57]}; stroke: {strokes[57]}; stroke-width: {strokeWidths[57]}; cursor: pointer;"
        on:mouseenter={() => handleHover(58)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(58)}
        on:keydown={(e) => handleKey(58, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="366.9 0 351.6 0 343.9 0 343.9 7.7 343.9 37 351.6 37 351.6 7.7 366.9 7.7 366.9 0"/>
        <path d="M298.9,0v7.7h30.7v37.2h-7.7V15.7h-22v23.1h14.4v6.1h-14.4v7.7h37.4V0h-38.4ZM307.6,31.1v-7.8h6.7v7.8h-6.7Z"/>
        <polygon points="240.3 44.9 208.3 44.9 208.3 52.6 240.3 52.6 243.6 52.6 248 52.6 248 30.1 240.3 30.1 240.3 44.9"/>
        <path d="M254.8,0v52.6h37.6v-29.6h0v-7.7h-22.9v29.6h-7V7.7h30.5V0h-38.2ZM277.1,23h7.6v7h-7.6v-7ZM277.1,37.7h7.6v7.2h-7.6v-7.2Z"/>
        <rect x="224.7" y="60" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[58]}; stroke: {strokes[58]}; stroke-width: {strokeWidths[58]}; cursor: pointer;"
        on:mouseenter={() => handleHover(59)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(59)}
        on:keydown={(e) => handleKey(59, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="150.4 97.4 158.1 97.4 158.1 60 157.7 60 150.4 60 134.6 60 134.6 67.7 150.4 67.7 150.4 97.4"/>
        <polygon points="179.6 60.2 164.1 60.2 164.1 67.9 179.6 67.9 179.6 90.3 171.8 90.3 171.8 75.4 164.1 75.4 164.1 90.3 164.1 98 164.1 105.2 148.7 105.2 148.7 112.9 164.1 112.9 171.8 112.9 171.8 105.2 171.8 98 187.2 98 187.2 97.7 187.2 97.7 187.2 60.2 187.2 60.2 179.6 60.2"/>
        <path d="M120.1,75.2h-.4v22.7h15.6v7.5h-22.4v-15.5h-7.5v-7h7.5v-22.9h-22.6v22.8h7.5v7.2h-8v38.4h38.1v-7.7h-30.5v-23h7.8v15.5h.9s33.3,0,33.3,0h0s3.6,0,3.6,0v-37.9h-22.9ZM97.9,67.7h7.2v7.4h-7.2v-7.4ZM135.2,82.9v7.4h-7.9v-7.4h7.9Z"/>
        <polygon points="217.2 60 202.7 60 196.6 60 195 60 195 112.5 202.7 112.5 202.7 67.7 217.2 67.7 217.2 60"/>
        <rect x="119.7" y="60.2" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[59]}; stroke: {strokes[59]}; stroke-width: {strokeWidths[59]}; cursor: pointer;"
        on:mouseenter={() => handleHover(60)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(60)}
        on:keydown={(e) => handleKey(60, e)}
        tabindex="0"
        role="button"
      >
        <rect x="15.1" y="105.2" width="67.2" height="7.7"/>
        <path d="M74.5,97.9h7.7v-37.6h-37.4v7.7h29.7v22.3h-6.5v-14.8h-.1v-.2h-22.5v15h-14.8v-7.1h7.7v-22.8H15.1v.6h0v22h0v.2h7.7v7.1H7.8v-14.8H.1v37.7h7.7v-15.2h66.7ZM22.8,75.4v-7.5h7.7v7.5h-7.7ZM53,82.9h7.3v7.3h-7.3v-7.3Z"/>
        <rect x=".1" y="60.6" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[60]}; stroke: {strokes[60]}; stroke-width: {strokeWidths[60]}; cursor: pointer;"
        on:mouseenter={() => handleHover(61)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(61)}
        on:keydown={(e) => handleKey(61, e)}
        tabindex="0"
        role="button"
      >
        <path d="M119.7,179.6h-6.9v-45.2h-7.7v15.6h-7.2v-15.6h-29.9v-6.5h16.1v-7.7h-23.8v29.8h-7.3v-14.3h-7.7v29.7h-7.6v-30.3H15.6v22.6h14.5v7.7H7.8v-37.5h8v-7.7H.1v52.8H.1s51.9,0,51.9,0h0s1,0,1,0v-15.3h52.1v29.7h22.2v-52.6h-7.7v44.9ZM23.2,150v-7.2h6.9v7.2h-6.9ZM68,142.1h22.2v7.9h-22.2v-7.9Z"/>
        <polygon points="171.8 120.2 134.8 120.2 134.8 120.2 134.8 127.9 134.8 157.6 142.5 157.6 142.5 127.9 171.8 127.9 171.8 120.2"/>
        <rect x="30.1" y="120.2" width="7.7" height="7.7"/>
        <rect x="60.3" y="164.9" width="7.7" height="7.7"/>
        <rect x="75" y="165.3" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[61]}; stroke: {strokes[61]}; stroke-width: {strokeWidths[61]}; cursor: pointer;"
        on:mouseenter={() => handleHover(62)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(62)}
        on:keydown={(e) => handleKey(62, e)}
        tabindex="0"
        role="button"
      >
        <path d="M239.7,224.5h-7.3v-15.9h-7.7v15.9h-7.3v-15.2h-7.7v15.2h-6.5v-15.2h-7.7v15.2h-8.2v-14.3h-29.2v-7.9h29.4v-7.7h-29.4s-7.7,0-7.7,0h0v23.3h29.2v6.6h-36.6v-29.8h-23.3v23.3h15.6v6.6h-15.8v7.7h127.8v-.4h0v-37.1h-7.7v29.8ZM127.3,210.2v-7.9h7.9v7.9h-7.9Z"/>
        <rect x="254" y="179.2" width="7.7" height="37.5"/>
        <polygon points="105.1 224.1 90.5 224.1 90.5 231.8 112.3 231.8 112.3 231.8 112.8 231.8 112.8 194.6 105.1 194.6 105.1 224.1"/>
        <rect x="195" y="194.6" width="7.7" height="7.7"/>
        <rect x="209.5" y="194.6" width="7.7" height="7.7"/>
        <rect x="224.7" y="194.6" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[62]}; stroke: {strokes[62]}; stroke-width: {strokeWidths[62]}; cursor: pointer;"
        on:mouseenter={() => handleHover(63)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(63)}
        on:keydown={(e) => handleKey(63, e)}
        tabindex="0"
        role="button"
      >
        <path d="M732.2,104.6h-13.6v-6.9h7.4v-22.3h-23.2v22.3h8.1v6.9h-15.8v-60.1h-37.2v7.7h29.6v23.3h-6.3v-15.5h-7.7v15.5h-7.6v-15.5h-23v52.3h38.5v-7.7h-30.8v-21.5h36.9v29.2h52.4v-36.8h-7.7v29.2ZM710.5,90.1v-6.9h7.9v6.9h-7.9ZM650.5,75.5v-7.8h7.6v7.8h-7.6Z"/>
        <rect x="703" y="60" width="36.9" height="7.7"/>
        <rect x="658.5" y="90.1" width="7.7" height="7.7"/>
        <rect x="673.5" y="90.1" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[63]}; stroke: {strokes[63]}; stroke-width: {strokeWidths[63]}; cursor: pointer;"
        on:mouseenter={() => handleHover(64)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(64)}
        on:keydown={(e) => handleKey(64, e)}
        tabindex="0"
        role="button"
      >
        <path d="M569,0v7.7h13.7v36.9h-14.2v-5.7h7.7V15.6h-23v23.2h7.7v5.7h-15.4V15.6h0s-7.7,0-7.7,0h0s-6.9,0-6.9,0h-7.7v22.2h14.6v6.8h-21.6V7.7h15.4V0h-23v58.6h7.7v-6.3h74.1V0h-21.4ZM560.8,23.2h7.7v7.9h-7.7v-7.9ZM530.9,30.1v-6.8h6.9v6.8h-6.9Z"/>
        <polygon points="492.9 44.8 478.9 44.8 478.9 52.5 500.6 52.5 500.6 52.2 500.6 44.8 500.6 15.3 492.9 15.3 492.9 44.8"/>
        <rect x="598.2" width="7.7" height="38.8"/>
        <rect x="553.2" width="7.7" height="7.7"/>
        <rect x="537.8" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[64]}; stroke: {strokes[64]}; stroke-width: {strokeWidths[64]}; cursor: pointer;"
        on:mouseenter={() => handleHover(65)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(65)}
        on:keydown={(e) => handleKey(65, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="501.9 0 486.6 0 478.9 0 478.9 7.7 478.9 37 486.6 37 486.6 7.7 501.9 7.7 501.9 0"/>
        <path d="M434.7,0v7.7h29.2v36.9h-7.3V15.6h-21.9v23.2h14.3v5.7h-22.3v-13.4h-15.7v-15.6h-21.3v7.7h13.6v7.9h-13.6v13.4h-7.7V7.7h29V0h-36.7v52.2h97.3V0h-36.9ZM442.4,31.1v-7.9h6.6v7.9h-6.6ZM397.4,44.5v-5.7h6v5.7h-6ZM411,44.5v-5.7h8v5.7h-8Z"/>
        <polygon points="359.1 44.9 343.9 44.9 343.9 52.6 366.8 52.6 366.8 52.3 366.8 44.9 366.8 15.4 359.1 15.4 359.1 44.9"/>
        <rect x="419" width="7.7" height="7.7"/>
        <rect x="419" y="15.6" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[65]}; stroke: {strokes[65]}; stroke-width: {strokeWidths[65]}; cursor: pointer;"
        on:mouseenter={() => handleHover(66)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(66)}
        on:keydown={(e) => handleKey(66, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="247.5 0 239.8 0 232.6 0 224.9 0 224.9 7.7 224.9 37.4 232.6 37.4 232.6 7.7 239.8 7.7 239.8 22.8 247.5 22.8 247.5 0 247.5 0"/>
        <polygon points="209.5 0 194.9 0 194.9 7.7 209.5 7.7 209.5 30.6 203.1 30.6 203.1 14.8 195.4 14.8 195.4 52.7 203.1 52.7 203.1 38.3 217.2 38.3 217.2 38.1 217.2 30.6 217.2 0 216.7 0 209.5 0"/>
        <polygon points="179.6 45.1 164.1 45.1 164.1 52.8 179.6 52.8 185.9 52.8 187.2 52.8 187.2 14.8 179.6 14.8 179.6 45.1"/>
        <rect x="164.1" width="7.7" height="37.9"/>
        <path d="M150.8,15.2h-15.6v23.1h15.6v6.7h-23.5V14.5h-7.7v38.2h7.7c0,0,23.5,0,23.5,0h0c0,0,7.7,0,7.7,0V15.2h-7.7ZM142.9,30.6v-7.7h7.9v7.7h-7.9Z"/>
        <rect x="179.6" width="7.7" height="7.7"/>
        <rect x="150.4" width="7.7" height="7.7"/>
        <rect x="135.2" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[66]}; stroke: {strokes[66]}; stroke-width: {strokeWidths[66]}; cursor: pointer;"
        on:mouseenter={() => handleHover(67)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(67)}
        on:keydown={(e) => handleKey(67, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="127.8 0 112.8 0 107.8 0 105.1 0 105.1 52.7 112.8 52.7 112.8 7.7 127.8 7.7 127.8 0"/>
        <polygon points="15.1 0 .1 0 .1 7.7 15.1 7.7 15.1 15.2 7.8 15.2 .1 15.2 .1 22.9 .1 44.9 .1 52.6 7.8 52.6 21.9 52.6 21.9 52.4 22.8 52.4 22.8 30.6 15.1 30.6 15.1 44.9 7.8 44.9 7.8 22.9 21.9 22.9 21.9 22.7 22.8 22.7 22.8 7.7 22.8 7.7 22.8 0 22.8 0 15.1 0"/>
        <path d="M90.6,0h-16.1v7.7h16.1v37.5h-8.4V15.2h-22.2v23.1h14.6v6.9h-21.5v-14.6h-7.7v14.6h-7.6V0h-7.7v52.8h67.7v-.3h.4V0h-7.7ZM67.6,30.6v-7.7h6.9v7.7h-6.9Z"/>
        <rect x="60.3" width="7.7" height="7.7"/>
        <rect x="45.4" width="7.7" height="7.7"/>
        <rect x="45.4" y="15.6" width="7.7" height="7.7"/>
      </g>
     <g transform={`translate(0, ${lineGap3})`}>
   <g
        style="fill: {fills[67]}; stroke: {strokes[67]}; stroke-width: {strokeWidths[67]}; cursor: pointer;"
        on:mouseenter={() => handleHover(68)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(68)}
        on:keydown={(e) => handleKey(68, e)}
        tabindex="0"
        role="button"
      >
        <rect x="613.8" y=".2" width="7.7" height="52.9"/>
        <polygon points="597.8 45.3 591.6 45.3 591.6 .6 590.9 .6 583.9 .6 568.3 .6 568.3 .9 568.3 8.3 568.3 37.9 576 37.9 576 8.3 583.9 8.3 583.9 45.3 560.8 45.3 560.8 23.5 560.8 15.9 560.8 15.9 537.8 15.9 537.8 15.9 537.8 23.5 537.8 44.8 530.9 44.8 530.9 8.3 561.4 8.3 561.4 .6 530.9 .6 523.3 .6 523.3 .6 523.3 8.3 523.3 8.3 523.3 44.8 523.3 44.8 523.3 52.4 523.3 52.4 530.9 52.4 537.8 52.4 545.5 52.4 545.5 44.8 545.5 23.5 553.2 23.5 553.2 52.9 558.6 52.9 558.6 53 600.6 53 600.6 52.9 605.4 52.9 605.4 0 597.8 0 597.8 45.3"/>
      </g>
      <g
        style="fill: {fills[68]}; stroke: {strokes[68]}; stroke-width: {strokeWidths[68]}; cursor: pointer;"
        on:mouseenter={() => handleHover(69)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(69)}
        on:keydown={(e) => handleKey(69, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="127.4 60.3 97.9 60.3 94.1 60.3 90.2 60.3 90.2 112.7 97.9 112.7 97.9 67.9 127.4 67.9 127.4 60.3"/>
        <polygon points="15.3 106 7.7 106 7.7 90 0 90 0 106 0 112.2 0 113.7 15.3 113.7 22 113.7 23 113.7 23 60.3 15.3 60.3 15.3 106"/>
        <path d="M83.1,60.3h-7.7v14.5h-7.2v-14.5H28.9v7.7h31.6v14.5h0s7.1,0,7.1,0v8.2h-7.7v22.9h23.1v-22.9h-7.7v-8.2h7.8v-7.7h0v-14.5ZM75.4,106h-7.8v-7.6h7.8v7.6Z"/>
        <path d="M44.4,75.7h-15.5v22.9h15.5v7.4h-15.5v7.7h23.1v-38h-7.7ZM44.4,90.9h-7.8v-7.6h7.8v7.6Z"/>
      </g>
      <g
        style="fill: {fills[69]}; stroke: {strokes[69]}; stroke-width: {strokeWidths[69]}; cursor: pointer;"
        on:mouseenter={() => handleHover(70)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(70)}
        on:keydown={(e) => handleKey(70, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="53.1 37.4 53.5 37.4 53.5 .6 52.4 .6 45.8 .6 38.2 .6 30.6 .6 30.6 8.3 30.6 23.9 38.2 23.9 38.2 8.3 45.8 8.3 45.8 29.7 38.2 29.7 38.2 29.7 30.6 29.7 30.6 29.7 30.6 37.4 30.6 45.4 23 45.4 23 .6 22.7 .6 15.3 .6 7.7 .6 .1 .6 0 .6 0 23.9 7.7 23.9 7.7 8.3 15.3 8.3 15.3 29.7 .1 29.7 .1 37.4 15.3 37.4 15.3 45.4 15.3 53 23 53 37.7 53 37.7 53 38.2 53 38.2 37.4 45.8 37.4 53.1 37.4"/>
        <path d="M105.1.6h-30.4v7.7h30.4v21.4h-7.2v-14.3h-23.1v22.9h15.5v7.1h-45.2v7.7h52.9v-15.7h7.2v15.7h7.7v-15.7h0v-7.7h0V8.3h0V.6h-7.7ZM90.2,29.7h0v.9h-7.8v-7.6h7.8v6.7Z"/>
        <rect x="120.2" y=".6" width="7.7" height="52.4"/>
        <rect x="59.2" y=".6" width="7.7" height="36.8"/>
      </g>
      <g
        style="fill: {fills[70]}; stroke: {strokes[70]}; stroke-width: {strokeWidths[70]}; cursor: pointer;"
        on:mouseenter={() => handleHover(71)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(71)}
        on:keydown={(e) => handleKey(71, e)}
        tabindex="0"
        role="button"
      >
        <rect x="732.2" y="61.2" width="7.7" height="52.4"/>
        <path d="M718.8,61.2h-30.8v7.7h30.8v37.1h-7.8v-30.7h-29.9v-6.4h-7.7v37.1h-6.7v-30.5h-23.1v30.5h-7.7v-29.9h0v-.8h-22.6v22.6h7.7v-15h7.3v23h-14.9v7.7h38v-15.2h7.8v15.2h36v-16h8.2v16h23.1v-52.4h-7.7ZM651.3,90.7v-7.6h7.8v7.6h-7.8ZM687.5,90v1.3h0v14.7h-6.3v-23h22.2v7.1h-15.8Z"/>
      </g>
      <g
        style="fill: {fills[71]}; stroke: {strokes[71]}; stroke-width: {strokeWidths[71]}; cursor: pointer;"
        on:mouseenter={() => handleHover(72)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(72)}
        on:keydown={(e) => handleKey(72, e)}
        tabindex="0"
        role="button"
      >
        <path d="M381.7,187.2v-7.7h-52v37.7h37.3v-22.9h-23.1v15.3h-6.5v-22.3h44.3ZM351.5,201.9h7.8v7.6h-7.8v-7.6Z"/>
        <polygon points="313.9 224.2 307.1 224.2 307.1 209.6 299.4 209.6 299.4 209.6 284.9 209.6 284.9 203 307.9 203 307.9 195.4 284.9 195.4 280.1 195.4 277.2 195.4 277.2 217.2 278.7 217.2 278.7 217.3 299.4 217.3 299.4 224.2 277.2 224.2 277.2 231.9 321.6 231.9 321.6 231.7 321.6 231.7 321.6 179.2 313.9 179.2 313.9 224.2"/>
        <path d="M262.3,209h-7.8v-29.8h-7.7v45h-7.2v-45h-7.7v45h-7.1v-14.7h-22.2v-6.9h21.8v-7.7h-29.5v22.3h22.2v7h-22.2v7.7h51.8s7.7,0,7.7,0h15.5v-22.9h-7.7ZM254.5,224.3v-7.6h7.8v7.6h-7.8Z"/>
        <polygon points="261.7 202.4 269.4 202.4 269.4 186.9 306.5 186.9 306.5 179.2 261.7 179.2 261.7 186.9 261.7 186.9 261.7 202.4"/>
      </g>
     <g
        style="fill: {fills[72]}; stroke: {strokes[72]}; stroke-width: {strokeWidths[72]}; cursor: pointer;"
        on:mouseenter={() => handleHover(73)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(73)}
        on:keydown={(e) => handleKey(73, e)}
        tabindex="0"
        role="button"
      >
        <rect x="403.6" y="119.6" width="37.2" height="7.7"/>
        <path d="M358.7,127.1h30.7v22.9h-7.3v-15.3h-23.1v22.9h15.5v7.2h-15.5v7.7h23.1v-14.9h7.3v14.8h7.7v-53h-38.4v7.7ZM366.6,150v-7.6h7.8v7.6h-7.8Z"/>
        <rect x="343.9" y="119.4" width="7.7" height="52.4"/>
        <polygon points="329.1 150.4 321.8 150.4 321.8 120.1 321.4 120.1 314.1 120.1 306.9 120.1 300.1 120.1 299.2 120.1 299.2 172.6 300.1 172.6 306.9 172.6 336.8 172.6 336.8 164.9 306.9 164.9 306.9 127.8 314.1 127.8 314.1 158.1 315.4 158.1 321.8 158.1 329.1 158.1 336.8 158.1 336.8 150.4 336.8 120.6 329.1 120.6 329.1 150.4"/>
      </g>
      <g
        style="fill: {fills[73]}; stroke: {strokes[73]}; stroke-width: {strokeWidths[73]}; cursor: pointer;"
        on:mouseenter={() => handleHover(74)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(74)}
        on:keydown={(e) => handleKey(74, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="313.9 313.4 291.1 313.4 291.1 314.1 291.1 321.1 291.1 336.5 298.8 336.5 298.8 321.1 306.2 321.1 306.2 344.1 291.1 344.1 291.1 351.8 306.2 351.8 313.9 351.8 313.9 313.9 313.9 313.9 313.9 313.4"/>
        <polygon points="420.4 299.3 395.9 299.3 395.9 307 395.9 335.9 403.6 335.9 403.6 307 420.4 307 420.4 299.3"/>
        <path d="M389.5,299.3h-7.7v44.8h-7.2v-15.3h-16.4v-14.7h-23.1v7.7h15.5v7.1h-15.5v15.3h-5.8v-37.1h37.5v14.8h7.7v-22.4h-52.9v52.4h67.9v-7.7h-.1v-44.8ZM342.8,344.1v-7.6h7.8v7.6h-7.8ZM359.2,344.1v-7.6h7.8v7.6h-7.8Z"/>
        <polygon points="247.8 299.3 246.9 299.3 246.9 344.1 246.9 351.8 254.6 351.8 277.2 351.8 284.9 351.8 284.9 344.1 284.9 329.4 277.2 329.4 277.2 329.4 269.4 329.4 269.4 321.1 284.7 321.1 284.7 313.4 261.7 313.4 261.7 321.1 261.7 321.1 261.7 329.4 261.7 329.4 261.7 337.1 277.2 337.1 277.2 344.1 254.6 344.1 254.6 307 313.9 307 313.9 299.3 254.6 299.3 247.8 299.3"/>
      </g>
      <g
        style="fill: {fills[74]}; stroke: {strokes[74]}; stroke-width: {strokeWidths[74]}; cursor: pointer;"
        on:mouseenter={() => handleHover(75)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(75)}
        on:keydown={(e) => handleKey(75, e)}
        tabindex="0"
        role="button"
      >
        <rect x="613.1" y="119.6" width="68" height="7.7"/>
        <path d="M568.6,134.1h-15.5v15.1h0v.8h-7.6v-15.3h-7.7v30.2h-29.4v7.7h37.1v-14.9h7.6v14.4h23.1v-15.1h0v-22.9h-7.7ZM568.6,141.7v7.4h-7.8v-7.4h7.8ZM560.8,164.4v-6.7h7.8v6.7h-7.8Z"/>
        <path d="M642.7,134.1h-14.9s0,7.7,0,7.7h14.9v23h-6.7v-14.9h-29.9v-29.7h-7.7v44.6h-7.3v-44.8h-7.7v52.4h66.9v-38.4h0s-7.7,0-7.7,0h0ZM606.1,157.5h22.2v7.3h-22.2v-7.3Z"/>
        <rect x="613.4" y="134.1" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[75]}; stroke: {strokes[75]}; stroke-width: {strokeWidths[75]}; cursor: pointer;"
        on:mouseenter={() => handleHover(76)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(76)}
        on:keydown={(e) => handleKey(76, e)}
        tabindex="0"
        role="button"
      >
        <path d="M568.5,179.5h-30.5v7.7h30.5v37.5h-14.5v-7.5h7.7v-22.9h-23.1v22.9h7.7v7.5h-31.3v-7.5h16.3v-37.7h-23.1v22.9h15.5v7.1h-21.9v-15.3h-23.1v22.9h15.5v7.4h-15.5v7.7h23.1v-15.1h5.6v15.1h68.9v-52.8h-7.7ZM546.3,209.5v-7.6h7.8v7.6h-7.8ZM515.8,194.8v-7.6h7.8v7.6h-7.8ZM486.3,209.5v-7.6h7.8v7.6h-7.8Z"/>
        <rect x="583.9" y="179.5" width="7.7" height="52.4"/>
        <rect x="493.6" y="179.2" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[76]}; stroke: {strokes[76]}; stroke-width: {strokeWidths[76]}; cursor: pointer;"
        on:mouseenter={() => handleHover(77)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(77)}
        on:keydown={(e) => handleKey(77, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="508.9 127.3 523.8 127.3 523.8 150.6 516.5 150.6 516.5 135.3 508.8 135.3 508.8 150.6 501.5 150.6 501.5 120.1 493.8 120.1 493.8 150.6 493.8 157.9 493.8 158.3 531.5 158.3 531.5 157.9 531.5 150.6 531.5 127.3 531.5 120.1 531.5 119.6 508.9 119.6 508.9 127.3"/>
        <rect x="537.6" y="120.1" width="38.8" height="7.7"/>
        <path d="M453.4,120.1h-5.3v29.9h-6v-15.3h-7.7v30.2h-23.2v-22.5h15.3v-7.7h-23v37.8h0c0,.1,38.6.1,38.6.1h0q0-.1,0-.1v-14.8h21.3v14.2h23.4v-37.2h-31v-6.9h34.8v-7.7h-37.2ZM479.1,142.3v21.8h-8v-14.2h-15.3v-7.7h23.3Z"/>
        <rect x="493.6" y="164.2" width="7.7" height="7.7"/>
        <rect x="419" y="150" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[77]}; stroke: {strokes[77]}; stroke-width: {strokeWidths[77]}; cursor: pointer;"
        on:mouseenter={() => handleHover(78)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(78)}
        on:keydown={(e) => handleKey(78, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="411.2 344.1 396.1 344.1 396.1 351.8 418.7 351.8 418.7 350.5 418.9 350.5 418.9 314.1 411.2 314.1 411.2 344.1"/>
        <path d="M472.7,344.4h-8.7v-7.8h0v-7.7h0v-13.9h-7.7v13.9h-7.3v-29.8h-.2s-22.6,0-22.6,0h0v22.4h0s15.1,0,15.1,0v22.5h-7.4v-14.9h-7.7v22.4h0c0,.1,22.6.1,22.6.1h0c0-.1.2-.1.2-.1v-14.9h7.3v15.4h24.1v-52.9h-7.7v45.3ZM433.9,313.9v-7.1h7.4v7.1h-7.4Z"/>
        <rect x="486.6" y="299.1" width="7.7" height="52.4"/>
        <rect x="456.3" y="299.2" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[78]}; stroke: {strokes[78]}; stroke-width: {strokeWidths[78]}; cursor: pointer;"
        on:mouseenter={() => handleHover(79)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(79)}
        on:keydown={(e) => handleKey(79, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="486.6 389 441.4 389 441.4 373.4 433.7 373.4 433.7 389 433.7 395.9 433.7 396.7 486.6 396.7 486.6 389"/>
        <rect x="568.7" y="358.9" width="7.7" height="52.4"/>
        <path d="M553.3,358.9h-28.8v7.7h28.8v22.5h-6.3v-15.3h-23.1v22.9h15.5v7h-14.9v7.7h14.9c0,.1,7.7.1,7.7.1h0v-14.8h6.3v14.6h7.7v-52.4h-7.7ZM538,389h-6.5v-7.6h7.8v7.6h-1.3Z"/>
        <polygon points="508.8 358.9 492.5 358.9 492.5 366.6 508.8 366.6 508.8 411.3 516.5 411.3 516.5 358.9 515 358.9 508.8 358.9"/>
        <polygon points="493.8 403.7 433.7 403.7 433.7 411.3 501.3 411.3 501.3 410.9 501.5 410.9 501.5 373.8 493.8 373.8 493.8 403.7"/>
        <rect x="463.7" y="373.8" width="7.7" height="7.7"/>
        <rect x="448.2" y="373.8" width="7.7" height="7.7"/>
        <rect x="478.9" y="373.8" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[79]}; stroke: {strokes[79]}; stroke-width: {strokeWidths[79]}; cursor: pointer;"
        on:mouseenter={() => handleHover(80)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(80)}
        on:keydown={(e) => handleKey(80, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="636.4 299.1 621.6 299.1 613.9 299.1 613.9 306.8 613.9 335.5 621.6 335.5 621.6 306.8 636.4 306.8 636.4 299.1"/>
        <path d="M560.9,313.9h-23.1v22.9h15.5v7.3h-21.5v-14.8h-7.7c0,0-3.8,0-3.8,0v-7.9h7s4.2,0,4.2,0v-22.4h-30.2v22.4h3.4s7.9,0,7.9,0v7.9h-3.7c0,0-7.7,0-7.7,0v22.4h15.9v-7.7h-8.2v-7h15.1v14.7h36.7v-.2h.2v-22.4h0v-15.3ZM523.8,306.8v7.1h-14.8v-7.1h14.8ZM545.4,329.1v-7.6h7.8v7.6h-7.8Z"/>
        <polygon points="598.3 299.1 583.4 299.1 583.4 306.8 598.3 306.8 598.3 358.5 591.1 358.5 591.1 329.1 583.4 329.1 583.4 345 576 345 576 299.1 574.9 299.1 568.3 299.1 552.4 299.1 552.4 306.8 568.3 306.8 568.3 345 568.3 351.5 568.3 352.7 583.4 352.7 583.4 358.5 583.4 358.5 583.4 366.2 605.9 366.2 605.9 364.9 605.9 358.5 605.9 306.8 606 306.8 606 299.1 605.9 299.1 598.3 299.1"/>
        <rect x="583.4" y="313.9" width="7.7" height="7.7"/>
        <rect x="537.8" y="299.1" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[80]}; stroke: {strokes[80]}; stroke-width: {strokeWidths[80]}; cursor: pointer;"
        on:mouseenter={() => handleHover(81)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(81)}
        on:keydown={(e) => handleKey(81, e)}
        tabindex="0"
        role="button"
      >
        <rect x="433.1" y="239.6" width="143.1" height="7.7"/>
        <path d="M359.3,253.7h-15.5v15.3h-14.4v-7h7.7v-22.9h-23.1v22.9h7.8v7h-7.8v23h0c0,.1,52.9.1,52.9.1v-7.7h-45.2v-7.8h45.4v-22.9h-7.7ZM321.6,254.3v-7.6h7.8v7.6h-7.7s-.1,0-.1,0ZM351.5,269v-7.6h7.8v7.6h-7.8Z"/>
        <polygon points="426.6 240.2 418.9 240.2 418.9 269 411.2 269 411.2 240.2 411.2 240.2 411.2 239.6 389.6 239.6 389.6 239.8 389.6 247.3 389.6 262.2 397.3 262.2 397.3 247.3 403.6 247.3 403.6 269 389.6 269 389.6 269.3 389.6 276.7 389.6 284.4 382.1 284.4 382.1 239.5 381.4 239.5 374.4 239.5 343.8 239.5 343.8 247.2 374.4 247.2 374.4 292 374.7 292 374.7 292.1 397.3 292.1 397.3 291.7 397.3 284.4 397.3 276.7 403.6 276.7 411.2 276.7 418.9 276.7 426.6 276.7 426.7 276.7 426.7 269 426.6 269 426.6 240.2"/>
        <rect x="403.6" y="284.4" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[81]}; stroke: {strokes[81]}; stroke-width: {strokeWidths[81]}; cursor: pointer;"
        on:mouseenter={() => handleHover(82)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(82)}
        on:keydown={(e) => handleKey(82, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="374.2 396.2 374.2 396.2 381.8 396.2 381.8 396.2 388.4 396.2 388.4 396.2 396.1 396.2 396.1 388.6 396.1 373.8 388.4 373.8 388.4 388.6 381.8 388.6 381.8 373.8 374.2 373.8 374.2 388.6 367 388.6 367 373.4 359.3 373.4 359.3 403.7 350.6 403.7 350.6 389.4 350.6 389.4 350.6 381.8 350.6 381.8 350.6 358.9 342.9 358.9 342.9 381.8 336.1 381.8 336.1 358.9 335.9 358.9 328.4 358.9 321 358.9 313.3 358.9 313.3 366.6 313.3 381.4 321 381.4 321 366.6 328.4 366.6 328.4 389.4 313.3 389.4 313.3 397.1 335.9 397.1 335.9 396.8 336.1 396.8 336.1 389.4 342.9 389.4 342.9 411.3 344.7 411.3 350.6 411.3 359.3 411.3 366.7 411.3 367 411.3 367 396.2 374.2 396.2"/>
        <rect x="433.7" y="358.9" width="52.9" height="7.7"/>
        <polygon points="426.3 358.9 418.6 358.9 418.6 358.9 403.8 358.9 403.8 366.6 418.6 366.6 418.6 389 411.2 389 411.2 373.4 403.6 373.4 403.6 403.7 374.2 403.7 374.2 411.3 403.6 411.3 411.2 411.3 411.2 411.3 411.2 396.7 418.6 396.7 418.6 411.3 426.3 411.3 426.3 396.7 426.3 389 426.3 366.6 426.4 366.6 426.4 358.9 426.3 358.9 426.3 358.9"/>
        <rect x="388.4" y="358.9" width="7.7" height="7.7"/>
        <rect x="374.2" y="358.9" width="7.7" height="7.7"/>
        <rect x="359.3" y="358.9" width="7.7" height="7.7"/>
        <rect x="328.4" y="403.7" width="7.7" height="7.7"/>
        <rect x="313.9" y="403.7" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[82]}; stroke: {strokes[82]}; stroke-width: {strokeWidths[82]}; cursor: pointer;"
        on:mouseenter={() => handleHover(83)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(83)}
        on:keydown={(e) => handleKey(83, e)}
        tabindex="0"
        role="button"
      >
        <rect x="179.8" y="359" width="110.9" height="7.7"/>
        <polygon points="179.2 403.7 162.6 403.7 162.6 411.3 179.2 411.3 185.4 411.3 186.9 411.3 186.9 373.4 179.2 373.4 179.2 403.7"/>
        <path d="M298.7,358.9v44.8h-21.5v-7h13.6v-22.3h-29s-7.7,0-7.7,0h0v14.6h-8.3v-15.6h-7.7v30.2h-6.7v-30.2h-7.7v15h-6.7v-15.3h-23.1v22.9h15.5v7.5h-16.6v7.7h24.2v-15.2h6.7v15.2h22v-14.6h23.7v14.6h36.9v-52.4h-7.7ZM209,388.5h-7.5v-7.6h7.8v7.6h-.3ZM261.7,382.1h21.4v7h-21.4v-7Z"/>
        <rect x="254" y="403.7" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[83]}; stroke: {strokes[83]}; stroke-width: {strokeWidths[83]}; cursor: pointer;"
        on:mouseenter={() => handleHover(84)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(84)}
        on:keydown={(e) => handleKey(84, e)}
        tabindex="0"
        role="button"
      >
        <path d="M268.6,247.2h16.3v37.2h-15.5v-7.2h7.7v-22.9h-23.1v22.9h7.7v7.2h-14.5v-30.5h-22.7v30.5h-7.3v-37.2h15v-7.7h-22.7v52.4h.7c0,.1,21.9.1,21.9.1v-.3h.1v-30.2h7.3v30.2h.1v.3h52.9v-52.6h-24v7.7ZM261.7,269.6v-7.6h7.8v7.6h-7.8Z"/>
        <rect x="299.4" y="239.5" width="7.7" height="52.4"/>
        <rect x="254.5" y="239.5" width="7.7" height="7.7"/>
        <rect x="239.4" y="239.5" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[84]}; stroke: {strokes[84]}; stroke-width: {strokeWidths[84]}; cursor: pointer;"
        on:mouseenter={() => handleHover(85)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(85)}
        on:keydown={(e) => handleKey(85, e)}
        tabindex="0"
        role="button"
      >
        <rect x="598.3" y="239.5" width="7.7" height="52.4"/>
        <path d="M583.4,284.3h-7.2v-15.3h-23.1v15.3h-7.6v-30h-23.1v22.9h15.5v7.1h-21.3v-15h-7.7v15h-7.3s0-15,0-15h-7.7v15h-7v-15h-7.7v15h-7.8v-15h-30.5v-7.2h72.7v-7.7h-80.4v29.8h-14.5v7.7h172.5v-52.4h-7.7v44.8ZM530,269.6v-7.6h7.8v7.6h-7.8ZM560.8,276.7h7.8v7.6h-7.8v-7.6ZM440.8,277h22.9v7.3h-22.9v-7.3Z"/>
        <rect x="553.1" y="254.3" width="7.7" height="7.7"/>
        <rect x="568.6" y="254.3" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[85]}; stroke: {strokes[85]}; stroke-width: {strokeWidths[85]}; cursor: pointer;"
        on:mouseenter={() => handleHover(86)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(86)}
        on:keydown={(e) => handleKey(86, e)}
        tabindex="0"
        role="button"
      >
        <rect x="732.2" y="179.5" width="7.7" height="52.4"/>
        <path d="M718.8,179.5h-45.6v7.7h45.6v37.1h-7.8v-30h-23.1v15.3h0v14.8h-6.7v-14.8h-7.7v14.8h-7.7v-14.8h-7.7v14.8h-7.6v-30h-23.1v22.9h15.5v7.1h-22.1v-44.8h-23.1v52.4h7.7v-29.5h7.8v29.5h82.5v-14.8h7.8v14.8h23.1v-52.4h-7.7ZM635.1,209.5v-7.6h7.8v7.6h-7.8ZM605.3,194.8v-7.6h7.8v7.6h-7.8ZM695.6,209.5v-7.6h7.8v7.6h-7.8Z"/>
        <rect x="628.3" y="179.5" width="7.7" height="7.7"/>
        <rect x="642.9" y="179.5" width="7.7" height="7.7"/>
        <rect x="659.1" y="179.5" width="7.7" height="7.7"/>
        <rect x="658.1" y="194.3" width="7.7" height="7.7"/>
        <rect x="673.5" y="194.3" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[86]}; stroke: {strokes[86]}; stroke-width: {strokeWidths[86]}; cursor: pointer;"
        on:mouseenter={() => handleHover(87)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(87)}
        on:keydown={(e) => handleKey(87, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="628.3 345.1 613.1 345.1 613.1 352.8 628.3 352.8 635.6 352.8 636 352.8 636 316.4 628.3 316.4 628.3 345.1"/>
        <rect x="732.2" y="300.3" width="7.7" height="52.4"/>
        <path d="M718.6,345.1h-37.8v-8h30.5v-23.2h-38.2v15.6h-7.3v-15.6h-7.7v31.3h-7.7v-38.3h45.5v-7.7h-53.2v52.4h.5v1.2h22.6v-15.7h7.3v15.7h53.2v-52.4h-7.7v44.8ZM680.8,321.5h22.9v7.9h-22.9v-7.9Z"/>
        <rect x="703.6" y="299.6" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[87]}; stroke: {strokes[87]}; stroke-width: {strokeWidths[87]}; cursor: pointer;"
        on:mouseenter={() => handleHover(88)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(88)}
        on:keydown={(e) => handleKey(88, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="531.6 75.3 509.1 75.3 509.1 75.5 508.7 75.5 508.7 97.9 516.4 97.9 516.4 82.9 524.1 82.9 524.1 105.2 508.5 105.2 508.5 112.9 531.1 112.9 531.1 112.9 531.8 112.9 531.8 75.4 531.6 75.4 531.6 75.3"/>
        <polygon points="493.8 105.3 478.6 105.3 478.6 113 493.8 113 501.1 113 501.5 113 501.5 75.4 493.8 75.4 493.8 105.3"/>
        <rect x="598.4" y="60.7" width="7.7" height="52.4"/>
        <path d="M583.5,105.2h-7.3v-29.8h-23.1v22.9h15.5v6.8h-23v-44.8h-22v7.7h14.3v44.8h5.8s42,0,42,0h0s5.6,0,5.6,0v-52.4h-7.7v44.8ZM560.7,90.7v-7.6h7.8v7.6h-7.8Z"/>
        <rect x="568.5" y="60.5" width="7.7" height="7.7"/>
        <rect x="553.2" y="60.5" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[88]}; stroke: {strokes[88]}; stroke-width: {strokeWidths[88]}; cursor: pointer;"
        on:mouseenter={() => handleHover(89)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(89)}
        on:keydown={(e) => handleKey(89, e)}
        tabindex="0"
        role="button"
      >
        <path d="M492.9,44.8h-5.9V15.4h-23.1v22.9h15.5v6.5h-23.5V.6h-7.7v15.3h-6V.6h-23.1v22.9h14.6v7h-14.9v7.7h22.6v-14.7h.9s6,0,6,0v28.9h52.4V.6h-7.7v44.2ZM471.6,30.6v-7.6h7.8v7.6h-7.8ZM426.7,15.9v-7.6h6.9v7.6h-6.9Z"/>
        <rect x="508.7" y=".6" width="7.7" height="68"/>
        <path d="M404.6,15.4h-15.5v37.8h0c0,0,22.6,0,22.6,0v-7.7h-14.9v-7.2h15.5V15.4h-7.7ZM396.8,30.6v-7.6h7.8v7.6h-7.8Z"/>
        <rect x="479.3" y=".6" width="7.7" height="7.7"/>
        <rect x="463.9" y=".6" width="7.7" height="7.7"/>
        <rect x="433.8" y="45.4" width="7.7" height="7.7"/>
        <rect x="418.9" y="45.4" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[89]}; stroke: {strokes[89]}; stroke-width: {strokeWidths[89]}; cursor: pointer;"
        on:mouseenter={() => handleHover(90)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(90)}
        on:keydown={(e) => handleKey(90, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="411 .6 382.3 .6 382.3 .6 374.6 .6 374.6 .6 374.6 8.3 374.6 53 382.3 53 382.3 8.3 411 8.3 411 .6"/>
        <path d="M359.1.6h-30v7.7h30v22.3h-6.7v-15.3h-23.1v22.9h15.5v7.5h-15.5v7.7h23.1v-15.2h6.7v14.8h7.7V.6h-7.7ZM337,30.6v-7.6h7.8v7.6h-7.8Z"/>
        <rect x="314.4" y=".6" width="7.7" height="52.4"/>
        <polygon points="285 .6 285 23.7 292.6 23.7 292.6 8.3 299.8 8.3 299.8 29.7 292.6 29.7 285 29.7 285 45.8 277 45.8 277 .6 276.8 .6 269.3 .6 254.6 .6 254.6 .6 254.6 8.3 254.6 23.7 262.2 23.7 262.2 8.3 269.3 8.3 269.3 29.7 254.6 29.7 254.6 37.4 269.3 37.4 269.3 45.8 269.3 53 269.3 53.4 292.6 53.4 292.6 53 292.6 45.8 292.6 37.4 299.8 37.4 307.5 37.4 307.5 29.7 307.5 8.3 307.5 1.2 307.5 .6 292.6 .6 285 .6"/>
        <rect x="299.8" y="45.4" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[90]}; stroke: {strokes[90]}; stroke-width: {strokeWidths[90]}; cursor: pointer;"
        on:mouseenter={() => handleHover(91)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(91)}
        on:keydown={(e) => handleKey(91, e)}
        tabindex="0"
        role="button"
      >
        <rect x="285" y="120.1" width="7.7" height="52.4"/>
        <path d="M269.5,148.9h-15.5v15.3h-6.8v-13.6h-7.7v13.6h-14.6v-7.1h7.8v-22.9h-23.1v22.9h7.7v23.3h-6.9v-14.2h-7.7v-32h-7.7v38.3h7.7v7.9h0v7.7h22.2v-16.2h52.3v-52.4h-7.7v29.5ZM217.2,141.8h7.8v7.6h-7.8v-7.6ZM262.9,164.2h-1.2v-7.6h7.8v7.6h-6.6Z"/>
        <polygon points="179.8 164.7 172.1 164.7 172.1 149.4 164.4 149.4 164.4 164.7 164.4 171.3 164.4 172.4 187.5 172.4 187.5 171.8 187.5 164.7 187.5 119.4 179.8 119.4 179.8 164.7"/>
        <rect x="254" y="134.7" width="7.7" height="7.7"/>
        <rect x="239.5" y="134.7" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[91]}; stroke: {strokes[91]}; stroke-width: {strokeWidths[91]}; cursor: pointer;"
        on:mouseenter={() => handleHover(92)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(92)}
        on:keydown={(e) => handleKey(92, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="150.6 119.4 150.6 120 150.6 127.1 150.6 172.4 158.3 172.4 158.3 127.1 164.4 127.1 164.4 142.1 172.1 142.1 172.1 127.1 172.1 120.2 172.1 119.4 150.6 119.4"/>
        <polygon points="135.5 119.4 105.1 119.4 105.1 127.1 135.5 127.1 135.5 150.5 127.7 150.5 127.7 134.7 120 134.7 120 150.5 112.8 150.5 112.8 134.5 105.1 134.5 105.1 164.3 89.3 164.3 89.3 172 105.1 172 112 172 112.8 172 112.8 158.2 135.5 158.2 135.5 171.8 143.1 171.8 143.1 119.4 138.7 119.4 135.5 119.4"/>
        <rect x="120" y="164.2" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[92]}; stroke: {strokes[92]}; stroke-width: {strokeWidths[92]}; cursor: pointer;"
        on:mouseenter={() => handleHover(93)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(93)}
        on:keydown={(e) => handleKey(93, e)}
        tabindex="0"
        role="button"
      >
        <path d="M82.5,119.4h-22.7v7.7h15v37.2h-7.4v-29.7h-7.7v15.3h-6.3v-15.3h-23.1v22.9h15.5v6.8h-16.8v7.7h16.8c0,0,7.7,0,7.7,0v-14.5h6.3v14.3h0c0,.1,22.8.1,22.8.1v-7.7h0v-44.9ZM45.2,149.8h-7.2v-7.6h7.8v7.6h-.6Z"/>
        <rect x="18" y="119.7" width="7.7" height="37.4"/>
        <polygon points="7.7 142.2 13.3 142.2 13.3 134.5 7.7 134.5 5.6 134.5 0 134.5 0 164.8 0 172 0 172.5 23 172.5 23 164.8 7.7 164.8 7.7 142.2"/>
        <rect x="90.2" y="119.4" width="7.7" height="37.4"/>
        <rect x="30.3" y="119.4" width="7.7" height="7.7"/>
        <rect y="119.4" width="7.7" height="7.7"/>
        <rect x="45.1" y="119.4" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[93]}; stroke: {strokes[93]}; stroke-width: {strokeWidths[93]}; cursor: pointer;"
        on:mouseenter={() => handleHover(94)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(94)}
        on:keydown={(e) => handleKey(94, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="82.5 239.5 76.1 239.5 74.8 239.5 74.8 261.7 82.5 261.7 82.5 247.2 127.7 247.2 127.7 239.5 82.5 239.5"/>
        <path d="M75.2,269.1h-7.8v-29.5h-7.7v45.2h-6.3v-45.2h-7.7v52.9h37.1s0-.5,0-.5v-22.9h-7.7ZM67.4,277.4v-.7h7.8v7.6h-7.8v-6.9Z"/>
        <path d="M7.7,277h30.3v-21.5h-7.7v13.9h-15v-6.8h7.8v-22.9H0v22.9h7.7v6.8H0v.2h0v22.4h0v.5h38.4v-7.7H7.7v-7.8ZM7.7,247.2h7.8v7.6h-7.8v-7.6Z"/>
        <rect x="30.3" y="239.5" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[94]}; stroke: {strokes[94]}; stroke-width: {strokeWidths[94]}; cursor: pointer;"
        on:mouseenter={() => handleHover(95)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(95)}
        on:keydown={(e) => handleKey(95, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="180 262 187.7 262 187.7 239.5 187.2 239.5 180 239.5 150.6 239.5 150.6 247.2 180 247.2 180 262"/>
        <path d="M195,239.5v44.9h-7.3v-15.4h-23.1v15.3h0c0,.1-14.1.1-14.1.1v-7.2h7.8v-22.9h-23.1v22.9h7.6v7.2h-15v-30.2h-22.6v30.2h-7.3v-30.5h-7.7v37.9h.4v.3h22.3v-30.2h7.3v30.2h82.5q0-.1,0-.1v-52.4h-7.7ZM150.6,262v7.6h-7.8v-7.6h7.8ZM172.2,276.7h7.8v7.6h-7.8v-7.6Z"/>
        <rect x="135.5" y="239.5" width="7.7" height="7.7"/>
        <rect x="164.5" y="254.3" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[95]}; stroke: {strokes[95]}; stroke-width: {strokeWidths[95]}; cursor: pointer;"
        on:mouseenter={() => handleHover(96)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(96)}
        on:keydown={(e) => handleKey(96, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="97.6 299 97.6 306.7 105.7 306.7 105.7 329.2 97.9 329.2 97.9 314 90.2 314 90.2 344.7 82.5 344.7 82.5 306.7 91 306.7 91 299 74.8 299 74.8 299.3 74.8 306.7 74.8 351.8 74.9 351.8 74.9 352.4 97.7 352.4 97.7 351.9 97.9 351.9 97.9 336.9 105.7 336.9 105.7 336.9 113.4 336.9 113.4 329.2 113.4 306.7 113.4 299 105.7 299 97.6 299"/>
        <path d="M59.8,313h-15.5v22.9h15.5v8.8h-21.7v-31.4H15.1v31.4h-7.5v-38.1h29.6v-7.7H0v52.8h0v.6h22.8v-31.4h7.5v31.4h37.1v-39.5h-7.7ZM52,328.2v-7.6h7.8v7.6h-7.8Z"/>
        <rect x="120.1" y="300" width="7.7" height="52.4"/>
        <rect x="105.7" y="344.7" width="7.7" height="7.7"/>
        <rect x="59.8" y="299" width="7.7" height="7.7"/>
        <rect x="44.3" y="299" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[96]}; stroke: {strokes[96]}; stroke-width: {strokeWidths[96]}; cursor: pointer;"
        on:mouseenter={() => handleHover(97)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(97)}
        on:keydown={(e) => handleKey(97, e)}
        tabindex="0"
        role="button"
      >
        <rect x="172.2" y="299.3" width="52.5" height="7.7"/>
        <path d="M142.8,337h37v-22.9h-7.7v15.2h-17.7v-7.5h10.9v-22.4h-29.4v22.4h10.9v7.5h-11.6v7.7h0v22h0v7.7h37.4v-7.7h-29.7v-22ZM143.6,314.1v-7.1h14.1v7.1h-3.2s-7.7,0-7.7,0h0s-3.2,0-3.2,0Z"/>
        <polygon points="232 299.3 232 329.4 224.9 329.4 224.9 314 217.2 314 217.2 329.4 217.2 337.1 217.2 344.7 209.1 344.7 209.1 321.1 209.1 313.4 209.1 313.4 201.4 313.4 201.4 313.4 187.7 313.4 187.7 321.1 187.7 336.5 195.3 336.5 195.3 321.1 201.4 321.1 201.4 344.7 179.8 344.7 179.8 352.4 217.2 352.4 222.7 352.4 224.9 352.4 224.9 337.1 239.6 337.1 239.6 337 239.6 329.4 239.6 299.3 232 299.3"/>
        <rect x="164.9" y="344.4" width="7.7" height="7.7"/>
        <rect x="150.6" y="344.1" width="7.7" height="7.7"/>
        <rect x="232" y="344.1" width="7.7" height="7.7"/>
      </g>
      <g 
        style="fill: {fills[97]}; stroke: {strokes[97]}; stroke-width: {strokeWidths[97]};">
        <rect x="613.4" y="61.2" width="52.8" height="7.7"/>
        <rect x="195" y="119.4" width="66.7" height="7.7"/>
        <rect y="43.2" width="7.7" height="39"/>
        <rect x="178.6" y="179.2" width="16.4" height="7.7"/>
      </g>
      <g
        style="fill: {fills[98]}; stroke: {strokes[98]}; stroke-width: {strokeWidths[98]}; cursor: pointer;"
        on:mouseenter={() => handleHover(99)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(99)}
        on:keydown={(e) => handleKey(99, e)}
        tabindex="0"
        role="button"
      >
        <rect x="329.7" y="61.2" width="7.7" height="36.9"/>
        <path d="M314.7,61.2h-15.5v44.1h-6.6v-30.7h-23.1v22.9h15.5v7.7h-22v-15.4h-22.6v7.7h14.9v7.7h-15.3v7.7h82.4v-22.9h-15.5v-21.1h7.8v15.6h7.7v-23.3h-7.7ZM277.2,89.8v-7.6h7.8v7.6h-7.8ZM314.7,97.7v7.6h-7.8v-7.6h7.8Z"/>
        <path d="M239.8,84.1h23.1v-22.9h-37.9v51.7h7.7v-44.1h7.1v15.3ZM247.5,68.9h7.8v7.6h-7.8v-7.6Z"/>
        <rect x="285" y="61.2" width="7.7" height="7.7"/>
        <rect x="269.5" y="61.2" width="7.7" height="7.7"/>
      </g>
     <g
        style="fill: {fills[99]}; stroke: {strokes[99]}; stroke-width: {strokeWidths[99]}; cursor: pointer;"
        on:mouseenter={() => handleHover(100)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(100)}
        on:keydown={(e) => handleKey(100, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="172.2 .6 165.2 .6 164.5 .6 164.5 23.9 172.2 23.9 172.2 8.3 180.1 8.3 180.1 29.7 164.5 29.7 164.5 29.8 164.5 37.4 164.5 45.4 158.5 45.4 158.5 .6 158 .6 150.8 .6 142.9 .6 135.5 .6 135.2 .6 135.2 23.9 142.9 23.9 142.9 8.3 150.8 8.3 150.8 29.7 135.2 29.7 135.2 37.4 150.8 37.4 150.8 45.4 150.8 53 158.5 53 164.5 53 172.2 53 172.2 45.4 172.2 37.4 180.1 37.4 187.8 37.4 187.8 29.7 187.8 8.3 187.8 .6 180.1 .6 172.2 .6"/>
        <rect x="239.8" y=".6" width="7.7" height="52.4"/>
        <path d="M225,.6h-7.9s-7.7,0-7.7,0v23.1h7.7v-15.4h7.9v21.8h-15.5v15.3h-7.3V.6h-7.7v52.4h38.2V.6h-7.7ZM219.8,45.4h-2.6v-7.6h7.8v7.6h-5.1Z"/>
        <rect x="180.1" y="45.4" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[100]}; stroke: {strokes[100]}; stroke-width: {strokeWidths[100]}; cursor: pointer;"
        on:mouseenter={() => handleHover(101)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(101)}
        on:keydown={(e) => handleKey(101, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="502 61.2 487 61.2 479.4 61.2 479.3 61.2 479.3 98.1 487 98.1 487 68.9 502 68.9 502 61.2"/>
        <path d="M433.4,61.2v7.7h30.9v36.4h-7.6v-29.8h-23.1v29.8h-5.9v-29.8h-23.1v22.9h15.5v6.8h-22.8v-16.3h-7.7v16.3h-7.3v-44.1h-23.2v36.9h7.7v-29.3h7.8v36.4h-15.7v7.7h81.6s.9,0,.9,0v-14.5h7.8v14.5h1.9s21,0,21,0v-51.7h-38.6ZM412.3,90.7v-7.6h7.8v7.6h-7.8ZM441.4,90.7v-7.6h7.8v7.6h-7.8Z"/>
        <polygon points="344.8 105.7 329.6 105.7 329.6 113.4 352.1 113.4 352.1 113.4 352.4 113.4 352.4 60.9 344.8 60.9 344.8 105.7"/>
        <rect x="420.1" y="61.2" width="7.7" height="7.7"/>
        <rect x="404.6" y="61.2" width="7.7" height="7.7"/>
        <rect x="389.6" y="61.2" width="7.7" height="7.7"/>
        <rect x="389.6" y="75.5" width="7.7" height="7.7"/>
      </g>
      <g
        style="fill: {fills[101]}; stroke: {strokes[101]}; stroke-width: {strokeWidths[101]}; cursor: pointer;"
        on:mouseenter={() => handleHover(102)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(102)}
        on:keydown={(e) => handleKey(102, e)}
        tabindex="0"
        role="button"
      >
        <path d="M739.7.6h-81.8v7.7h74.3v21.8h-15.5v15.3h-5.7v-15.3h-23.1v15.3h-6.7v-15.3h-7.7v15.3h-7.6V15.5h-7.7v14.6h-22.2V0h-7.7v37.8h29.9v15.3h15.3v8.2h7.7v-8.2h58.8V.6h-.2ZM695.6,45.4v-7.6h7.8v7.6h-7.8ZM724.4,45.4v-7.6h7.8v7.6h-7.8Z"/>
        <rect x="673.3" y="15.9" width="52.4" height="7.7"/>
        <rect x="642.9" y="45.4" width="7.7" height="7.7"/>
        <rect x="628.3" y="45.4" width="7.7" height="7.7"/>
        <rect x="642.9" y="15.5" width="7.7" height="7.7"/>
        <rect x="642.9" y=".2" width="7.7" height="7.7"/>
      </g>
     <g
        style="fill: {fills[102]}; stroke: {strokes[102]}; stroke-width: {strokeWidths[102]}; cursor: pointer;"
        on:mouseenter={() => handleHover(103)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(103)}
        on:keydown={(e) => handleKey(103, e)}
        tabindex="0"
        role="button"
      >
        <path d="M403.6,209.5v7.7h23.1v-37.7h-23.1v22.9h15.5v7.1h-15.4ZM411.2,194.8v-7.6h7.8v7.6h-7.8Z"/>
        <polygon points="486.6 179.5 471.5 179.5 464.1 179.5 463.8 179.5 463.8 231.9 471.5 231.9 471.5 187.2 486.6 187.2 486.6 179.5"/>
        <path d="M389.6,194.3h-15.5v22.9h15.5v7.4h-59.8v7.7h67.4v-38h-7.7ZM381.8,209.5v-7.6h7.8v7.6h-7.8Z"/>
        <polygon points="448.8 209.5 441.6 209.5 441.6 195.5 433.9 195.5 433.9 209.5 433.9 217.2 433.9 224.6 403.9 224.6 403.9 232.3 441.6 232.3 441.6 232.2 441.6 224.6 441.6 217.2 448.8 217.2 448.8 231.9 456.5 231.9 456.5 217.2 456.5 209.5 456.5 164.4 448.8 164.4 448.8 209.5"/>
        <rect x="389.6" y="179.5" width="7.7" height="7.7"/>
        <polygon points="442.3 186.9 438.5 186.9 438.5 183.5 442.3 183.5 442.3 179.5 434.3 179.5 434.3 186.9 430.7 186.9 430.7 191.1 442.3 191.1 442.3 186.9"/>
      </g>
      <g
        style="fill: {fills[103]}; stroke: {strokes[103]}; stroke-width: {strokeWidths[103]}; cursor: pointer;"
        on:mouseenter={() => handleHover(104)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(104)}
        on:keydown={(e) => handleKey(104, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="143.1 97.5 143.1 97 143.1 89.8 143.1 82.2 143.1 74.9 143.1 74.6 120.4 74.6 120.4 82.2 135.5 82.2 135.5 89.8 112.8 89.8 112.8 75.7 105.1 75.7 105.1 112.7 112.8 112.7 112.8 97.5 143.1 97.5"/>
        <rect x="210.1" y="60.9" width="7.7" height="52.4"/>
        <path d="M195,60.5l-44.8-.3v7.7s44.8.3,44.8.3v22.5h-22.4v-15.3h-23.1v22.9h15.5v6.9l-45.3-.3v7.7s52.9.3,52.9.3h0c0-.1,0-.1,0-.1v-7.6s0,0,0,0v-6.9h7v15.3h23.1v-53.3h-7.7ZM159.1,90.7h-2v-7.6h7.8v7.6h-5.7ZM187.2,106v-7.6h7.8v7.6h-7.8Z"/>
        <rect x="135.5" y="60.3" width="7.7" height="7.7"/>
        <polygon points="189.5 77.2 189.5 73.2 181.4 73.2 181.4 80.5 177.8 80.5 177.8 84.7 189.5 84.7 189.5 80.5 185.6 80.5 185.6 77.2 189.5 77.2"/>
      </g>
      <g
        style="fill: {fills[104]}; stroke: {strokes[104]}; stroke-width: {strokeWidths[104]}; cursor: pointer;"
        on:mouseenter={() => handleHover(105)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(105)}
        on:keydown={(e) => handleKey(105, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="695.2 157.7 695.2 157.1 695.2 150 695.2 142.3 695.2 134.7 687.5 134.7 672.6 134.7 672.6 142.3 687.5 142.3 687.5 150 665.8 150 665.8 134.1 658.1 134.1 658.1 171.8 665.8 171.8 665.8 157.7 695.2 157.7"/>
        <rect x="732.2" y="119.6" width="7.7" height="52.4"/>
        <rect x="687.5" y="119.6" width="7.7" height="7.7"/>
        <path d="M726.5,119.6h-7.7v13.7h-7.2v-13.7h-7.7v21.4h7.1v8.1h-7.7v15.3h-30.1v7.7h53.2v-22.9h-7.7v-8.1h7.8v-7.7h0v-13.7ZM718.8,164.4h-7.8v-7.6h7.8v7.6Z"/>
      </g>
      <g
        style="fill: {fills[105]}; stroke: {strokes[105]}; stroke-width: {strokeWidths[105]}; cursor: pointer;"
        on:mouseenter={() => handleHover(106)}
        on:mouseleave={handleLeave}
        on:click={() => handleClick(106)}
        on:keydown={(e) => handleKey(106, e)}
        tabindex="0"
        role="button"
      >
        <polygon points="172.2 194.1 164.5 194.1 164.5 201.8 164.5 216 172.2 216 172.2 201.8 179.5 201.8 179.5 224.2 135.1 224.2 135.1 231.9 187.2 231.9 187.2 231.6 187.2 224.2 187.2 201.8 187.2 194.1 179.5 194.1 172.2 194.1"/>
        <polygon points="658.4 239.8 658.4 247.3 658.4 254.5 658.4 262.2 658.4 262.2 666.1 262.2 666.1 262.2 687.8 262.2 687.8 284.3 680.1 284.3 680.1 276.7 680.1 269.6 680.1 269.1 657.6 269.1 657.6 269.6 657.6 276.7 657.6 284.3 627 284.3 627 292 657.6 292 665.2 292 665.2 284.3 665.2 276.7 672.5 276.7 672.5 284.3 672.5 292 680.1 292 687.8 292 695 292 695.5 292 695.5 262.2 695.5 255.6 695.5 254.5 666.1 254.5 666.1 247.3 695.5 247.3 695.5 239.6 658.4 239.6 658.4 239.8"/>
        <polygon points="30.3 224 0 224 0 231.7 30.3 231.7 30.3 231.7 38 231.7 38 179.2 30.3 179.2 30.3 224"/>
        <rect x="120" y="179.2" width="7.7" height="52.4"/>
        <path d="M636.2,277.2h.2v-22.9h-23.1v15.3h0v22.4h7.7v-14.8h15.3ZM621,269.6v-7.6h7.8v7.6h-7.8Z"/>
        <polygon points="642.7 276 650.4 276 650.4 247.3 650.4 239.6 650.4 239.5 642.7 239.5 642.7 239.6 613.3 239.6 613.3 247.3 642.7 247.3 642.7 276"/>
        <path d="M105.7,209.2h-7.8v-15h-7.7s-7.8,0-7.8,0h-7.7v21.8h7.7v-14.2h7.8v22.1h-25.2v-15.3h-7.7v-7.8h0v.4h7.7v-.4h0v-7.7h0v-6.4h32.9v-7.7h-40.6v14h-7.2v-14h-7.7v22.2h7.1v7.3h-7.7v22.9h56v-14.8h15.5v-37.6h-7.7v30ZM49.6,224v-7.6h7.8v7.6h-7.8Z"/>
        <path d="M23.1,217.2h0v-38H0v22.9h15.5v7.4H0v7.7h23.1ZM7.7,194.5v-7.6h7.8v7.6h-7.8Z"/>
        <path d="M150.7,216.9h7.7v-37.6h-23.1v22.9h15.5v7h-16s0,7.7,0,7.7h16ZM142.9,194.5v-7.6h7.8v7.6h-7.8Z"/>
        <rect x="732.2" y="239.5" width="7.7" height="52.4"/>
        <rect x="164.5" y="179.2" width="7.7" height="7.7"/>
        <rect x="105.7" y="224" width="7.7" height="7.7"/>
        <path d="M725.6,239.1h-7.7v14.5h-7.2v-14.5h-7.7v22.2h7.1v7.8h-7.7v22.9h23.1v-22.9h-7.7v-7.8h7.8v-7.7h0v-14.5ZM717.9,284.3h-7.8v-7.6h7.8v7.6Z"/>
      </g>
    
    
    </svg>




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

  .name-display {
    display: flex;
    justify-content: space-between; /* pushes items to edges */
    align-items: center;
    width: 100%; /* takes full width */
  }

  .arabic-name {
    font-family: 'NotoKufiArabic', sans-serif;
    font-weight: 700;
    font-size: 2.5vw;
    direction: rtl;
    margin: 0;
    color: #603D25;
    order: 3; /* appears on the right */
  }

  .separator {
    order: 2; /* appears in center */
     font-size: 6vw;
    color: #603D25;
    position: absolute; /* position it absolutely */
    left: 50%; /* center horizontally */
    transform: translateX(-50%); /* adjust for element width */
  }

  .english-name {
    font-family: 'JawiKufi', sans-serif;
     font-size: 5vw;
    color: #603D25;
    margin: 0;
    order: 1; /* appears on the left */
  }

  g[tabindex]:focus {
    outline: none;
  }
  
  g[tabindex]:focus-visible {
    outline: none;
  }
</style>