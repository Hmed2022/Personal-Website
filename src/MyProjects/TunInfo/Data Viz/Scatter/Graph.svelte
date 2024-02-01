<script>
    import data from "./Data/data.js";
  
    let width = 300;
    let height = 400;
  
    const margin = { top: 0, right: 100, left: 10, bottom: 30 };
  
    import { scaleLinear } from "d3-scale";
      import {area } from 'd3-shape';
    $: xScale = scaleLinear()
      .domain([70, 99])
      .range([60, width - margin.left - margin.right]);
  
    const yScale = scaleLinear()
      .domain([135, 185])
      .range([height - margin.top - margin.bottom, 20]);
  
    $: xScale2 = scaleLinear()
      .domain([70, 83])
      .range([60, width - margin.left - margin.right]);
  
    const yScale2 = scaleLinear()
      .domain([135, 170])
      .range([height - margin.top - margin.bottom, 20]);
  
    import AxisX from "./AxisX.svelte";
    import AxisY from "./AxisY.svelte";
    import Tooltip from "./Tooltip.svelte";
  
    let hoveredData;
      let hovering = false;
  
      $: filteredData = data.filter(d => d.ObserveInEnglish !== "Habib Bourguiba");
  
      let showModern = false;
  
       function getColor(value) {
      return value === 50 ? "#E0C29E" :
             value === 30 ? "#AB7E56" :
             value === 20 ? "#8C4D3F" :
             value === 10 ? "#BF5630" :
             value === 5  ? "#105D53" :
             value === 1  ? "#135E73" :
             "#2088A6";
    }
  
  </script>
  <div style="text-align:center">
    <button on:click={() => showModern = !showModern}>
      {showModern ? 'Show All Banknotes' : 'Show Modern Banknotes'}
    </button>
  </div>

  
  <div class='chart-container' 
      role="navigation"
    bind:clientWidth={width}
    on:mouseleave={() => {
      hoveredData = null
          hovering = false;
          
    }}>
  <svg {width} {height}>
              {#if !showModern}
    <AxisX {height} {xScale} {margin} option={!showModern} />
    <AxisY {width} {yScale} {margin} option={!showModern}/>
    <g class='circles' transform="translate({margin.left} {margin.top})">
                {#each data as bank}
                    <circle cx={xScale(bank.Height)} 
                          cy={yScale(bank.Width)} 
                          r={hovering && hoveredData == bank ? "20" : "10"}
                          opacity={hovering ?  hoveredData == bank ? "1" : ".3" : "1"}
                          fill={getColor(bank.Value)}
                          stroke="#D9D4CC" 
                                      role="navigation"
                          on:mouseover={() => {
                            hoveredData = bank
                                          hovering = true;
                          }}
                                      on:mouseleave={() => {
                            hovering = false
                          }}
                          on:focus={() => {
                            hoveredData = bank;
                          }}
                          tabIndex="0"
                          />
                {/each}
                       </g>
                      {:else}
      <AxisX {height} xScale={xScale2} {margin} option={!showModern}/>
    <AxisY {width} yScale={yScale2} {margin} option={!showModern}/>
    <g class='circles' transform="translate({margin.left} {margin.top})">
                  {#each filteredData as bank2}
                    <circle cx={xScale2(bank2.Height)} 
                          cy={yScale2(bank2.Width)} 
                          r={hovering && hoveredData == bank2 ? "20" : "10"}
                          opacity={hovering ?  hoveredData == bank2 ? "1" : ".3" : "1"}
                          fill={getColor(bank2.Value)}
                          stroke="#D9D4CC" 
                                      role="navigation"
                          on:mouseover={() => {
                            hoveredData = bank2
                                          hovering = true;
                          }}
                                      on:mouseleave={() => {
                            hovering = false
                          }}
                          on:focus={() => {
                            hoveredData = bank2;
                          }}
                          tabIndex="0"
                          />
                {/each}		
               </g>
                      {/if}
  </svg> 	
  
              {#if !showModern}
                      {#if hovering}
                          <Tooltip data={hoveredData} {xScale} {yScale} />
                      {/if}
              {:else}
                  {#if hovering}
                          <Tooltip data={hoveredData} xScale={xScale2} yScale={yScale2} />
                      {/if}
              {/if}
  </div>
  
  <style>
      button {
          margin-bottom: 5%;
          font-family: Quicksand;
        font-weight: bold;
        font-size: 1rem;
        color:#2088A6;
        background-color:#C8E5ED;
        border:none;
        border-radius: 5px;
      }

  
    circle {
      transition: r 200ms ease, opacity 200ms ease;
      cursor: pointer;
    }
  
    circle:focus {
      outline: none;
    }
  
  </style>