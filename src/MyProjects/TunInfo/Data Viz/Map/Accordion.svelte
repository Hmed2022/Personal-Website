<script>
    export let open = false;
      import { slide } from 'svelte/transition';
      const handleClick = () => open = !open
  </script>
  
  <div class="accordion">
      <div class="header">
          <button on:click={handleClick}>
              <slot name="head"> </slot>	
  </button>
          <!-- <h3>{open ? '+' : '-'}</h3> -->
      </div>
      
      {#if open}
      <div class="details" transition:slide>
          <slot name="details">
          </slot>
      </div>
      {/if}
  </div>
  
  <style>
      button{
          background-color: #90B5BB;
          width:100%;
          border: none;
      }
      div.accordion {
          margin: 1rem 0;
      }
      
      div.header {
          display:flex;
          width:100%;
      }
      
      /* div.header .text {
          flex: 1;
          margin-right: 5px;
      }
       */
      div.details {
          background-color: #F5F5F5;
          padding:1rem;
      }
      
  </style>
  