<script>
    export let items2 = [];
    export let activeTabValue = 1;
  
    const handleClick = tabValue => () => (activeTabValue = tabValue);
  </script>
  
  <div class="tabTitles">
    <ul>
      {#each items2 as item}
          <li class={activeTabValue === item.value ? 'active' : ''}>
              <span on:click={handleClick(item.value)}>{item.label}</span>
          </li>
      {/each}
      </ul>
  </div>
  
  {#each items2 as item}
      {#if activeTabValue == item.value}
      <div class="box">
          <svelte:component this={item.component}/>
      </div>
      {/if}
  {/each}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Jost:wght@800&display=swap');

    .tabTitles{
      display: flex;
    justify-content: center;
    text-align: center;
    }
      .box {
          margin-bottom: 10px;
          padding: 40px;
          border: 2px solid #eaded3;
          border-radius: 0 0 .5rem .5rem;
          /* border-top: 0; */
      }
    ul {
      display: flex;
      flex-wrap: wrap;
      /* padding-left: 13%;
      padding-right: 13%; */
      margin-bottom: 0;
      list-style: none;
      border-bottom: 2px solid #eaded3;
    }
      li {
          margin-bottom: -1px;
      }
  
    span {
      border: 1px solid transparent;
      border-top-left-radius: 0.25rem;
      border-top-right-radius: 0.25rem;
      display: block;
      color: #403F3E;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-family: 'Jost', sans-serif;
      font-weight: 800;
    }
  
    span:hover {
      border-color: #eaded3 #eaded3 #b8a79a;
      
    }
  
    li.active > span {
      color: #495057;
      background-color: #eaded3;
      border-color: #eaded3 #eaded3 #b8a79a;
    }
  </style>