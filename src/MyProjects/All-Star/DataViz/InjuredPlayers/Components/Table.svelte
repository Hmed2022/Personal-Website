<script>
    import { onMount } from "svelte";
   
      let data = [
    {
          year: "1989",
      nbplayers: "1",
      pervotes: "7.8%",
    },
    {
     year: "2016",
      nbplayers: "2",
      pervotes: "5.58%",
    },
    {
      year: "2009",
      nbplayers: "2",
      pervotes: "3.79%",
    }
  ]
  
    let selectedCols = ["year", "nbplayers", "pervotes"];
  
    const COLUMNS = {
      year: {
        key: "year",
        title: "Year",
        value: v => v.year,
        sortable: false,
      },
      nbplayers: {
        key: "nbplayers",
        title: "#Players",
        value: v => v.nbplayers,
        sortable: false,
      },
          pervotes: {
        key: "pervotes",
        title: "%Votes",
        value: v => v.pervotes,
        sortable: false,
      },
    };
      
   $: cols = selectedCols.map(key => COLUMNS[key]);
  </script>
  
  <div class="container">
    <div class="row">
      <table class="custom-table">
        <thead>
          <tr>
            {#each cols as col}
              <th>{col.title}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
                  {#each data as item}
                   <tr>
              {#each cols as col}
                <td>{col.value(item)}</td>
              {/each}
            </tr>
                  {/each}
        </tbody>
      </table>
    </div>
  </div>
  
  <style>

@import url('https://fonts.googleapis.com/css2?family=Quicksand&display=swap');
  
    /* Custom table styles */
    .custom-table {
      width: 120%;
      border-collapse: collapse;
    }
  
    .custom-table th,
    .custom-table td {
      padding: 6px;
      font-family: 'Quicksand', sans-serif;
      text-align:center;
    }
  
    .custom-table th {
      background-color: #eaded3;
      font-family: 'Quicksand', sans-serif;
    }
  
    .custom-table tr:nth-child(even) {
      background-color: #eaded3;
    }
  
   
    .custom-table tr:hover {
      background-color: #b8a79a;
    }
  
    /* Center the container */
    .container {
      display: flex;
      justify-content: center;
      align-items: center;
   
    }
  </style>
  