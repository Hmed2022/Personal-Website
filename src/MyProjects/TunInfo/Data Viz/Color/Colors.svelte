<script>
    let showModern = false;
  </script>
  <div style="text-align:center">
    <button on:click={() => showModern = !showModern}>
      {showModern ? 'Show All Banknotes' : 'Show Modern Banknotes'}
    </button>
  </div>
 
  {#if !showModern}
  <h1> 0.5 TND </h1>
  <h3> All Banknotes </h3>
  <div class="rectangle10"></div>
  
  <h1> 1 TND </h1>
  <h3> All Banknotes </h3>
  <div class="rectangle9"></div>
  {/if}
  <h1> 5 TND </h1>
  {#if showModern}
    <h3> Post Bourguiba Era </h3>
    <div class="rectangle"></div>
  {:else}
    <h3> All Banknotes </h3>
    <div class="rectangle2"></div>
  {/if}
  
  <h1> 10 TND </h1>
  {#if showModern}
    <h3> Post Bourguiba Era </h3>
    <div class="rectangle5"></div>
  {:else}
    <h3> All Banknotes </h3>
    <div class="rectangle6"></div>
  {/if}
  
  <h1> 20 TND </h1>
  {#if showModern}
    <h3> Post Bourguiba Era </h3>
    <div class="rectangle4"></div>
  {:else}
    <h3> All Banknotes </h3>
    <div class="rectangle3"></div>
  {/if}
  
  
  {#if showModern}
      <h1> 30 TND </h1>
    <h3> Post Bourguiba Era </h3>
    <div class="rectangle7"></div>
  {/if}
  
  
  {#if showModern}
      <h1> 50 TND </h1>
    <h3> Post Bourguiba Era </h3>
    <div class="rectangle8"></div>
  {/if}
  <style>
    .rectangle {
        width: 300px;
      height: 60px;
      background: linear-gradient(
        to right,
        #c0f0a8 0%, #c0f0a8 25.8%, 
        #90d878 25.8%, #90d878 38.3%, 
        #d8f0d8 38.3%, #d8f0d8 50.2%, 
        #789060 50.2%, #789060 58.1%, 
        #f0f0f0 58.1%, #f0f0f0 61.0%, 
        #f0fff0 61.0%, #f0fff0 65.6%, 
        #a8f048 65.6%, #a8f048 70.5%, 
        #f0ffff 70.5%, #f0ffff 73.1%, 
        #487830 73.1%, #487830 77.3%, 
        #489048 77.3%, #489048 78.0%, 
        #609078 78.0%, #609078 80.6%, 
        #d8ffc0 80.6%, #d8ffc0 82.7%, 
        #c0ff78 82.7%, #c0ff78 82.8%, 
        #487860 82.8%, #487860 84.7%, 
        #90d818 84.7%, #90d818 84.9%, 
        #d8ff90 84.9%, #d8ff90 86.0%, 
        #f0d878 86.0%, #f0d878 87.7%, 
        #306018 87.7%, #306018 89.3%, 
        #ffffff 89.3%, #ffffff 89.9%, 
        #a8ff30 89.9%, #a8ff30 100%
      );
    }
  
      .rectangle2 {
        width: 300px;
      height: 60px;
      background: linear-gradient(
        to right,
        #c0c0a8 0%, #c0c0a8 18.9%, 
        #a8a890 18.9%, #a8a890 35.9%, 
        #d8c0c0 35.9%, #d8c0c0 51.4%, 
        #786060 51.4%, #786060 59.2%, 
        #909078 59.2%, #909078 69.1%, 
        #f0f0f0 69.1%, #f0f0f0 77.1%, 
        #787878 77.1%, #787878 82.3%, 
        #607890 82.3%, #607890 87.0%, 
        #604848 87.0%, #604848 91.0%, 
        #7890a8 91.0%, #7890a8 93.3%, 
        #c0c060 93.3%, #c0c060 94.4%, 
        #ffffff 94.4%, #ffffff 95.4%, 
        #f0f0ff 95.4%, #f0f0ff 96.4%, 
        #f0ffff 96.4%, #f0ffff 97.1%, 
        #fffff0 97.1%, #fffff0 97.8%, 
        #fff0f0 97.8%, #fff0f0 98.0%, 
        #789030 98.0%, #789030 98.1%, 
        #f0fff0 98.1%, #f0fff0 98.2%, 
        #c0a830 98.2%, #c0a830 98.3%, 
        #f0d848 98.3%, #f0d848 100%
      );
    }
   .rectangle3 {
    width: 300px;
      height: 60px;
      background: linear-gradient(
        to right,
        #f0d8c0 0%, #f0d8c0 16.8%, 
        #f0c0a8 16.8%, #f0c0a8 31.5%, 
        #c0c0c0 31.5%, #c0c0c0 40.4%, 
        #606078 40.4%, #606078 47.2%, 
        #f0f0f0 47.2%, #f0f0f0 54.6%, 
        #d8a890 54.6%, #d8a890 59.5%, 
        #90a8a8 59.5%, #90a8a8 64.6%, 
        #789090 64.6%, #789090 71.7%, 
        #a890a8 71.7%, #a890a8 76.7%, 
        #a8c0d8 76.7%, #a8c0d8 81.7%, 
        #d89078 81.7%, #d89078 87.9%, 
        #c0a8a8 87.9%, #c0a8a8 91.1%, 
        #c06060 91.1%, #c06060 94.3%, 
        #907878 94.3%, #907878 95.9%, 
        #fffff0 95.9%, #fffff0 97.1%, 
        #c04848 97.1%, #c04848 98.3%, 
        #ffffff 98.3%, #ffffff 99.0%, 
        #a83030 99.0%, #a83030 99.6%, 
        #304860 99.6%, #304860 99.9%, 
        #f0fff0 99.9%, #f0fff0 100%
      );
    }
  
      .rectangle4 {
        width: 300px;
      height: 60px;
      background: linear-gradient(
        to right,
        #f0c0a8 0%, #f0c0a8 26.7%, 
        #f0d8c0 26.7%, #f0d8c0 48.3%, 
        #d8a890 48.3%, #d8a890 58.4%, 
        #d87878 58.4%, #d87878 66.6%, 
        #a890a8 66.6%, #a890a8 73.6%, 
        #c0a8a8 73.6%, #c0a8a8 80.4%, 
        #c06060 80.4%, #c06060 84.6%, 
        #f0f0f0 84.6%, #f0f0f0 88.1%, 
        #606078 88.1%, #606078 91.4%, 
        #c04848 91.4%, #c04848 93.7%, 
        #787890 93.7%, #787890 95.9%, 
        #a83030 95.9%, #a83030 96.9%, 
        #304860 96.9%, #304860 97.9%, 
        #906078 97.9%, #906078 98.7%, 
        #f03030 98.7%, #f03030 99.0%, 
        #f04848 99.0%, #f04848 99.4%, 
        #786030 99.4%, #786030 99.6%, 
        #487848 99.6%, #487848 99.8%, 
        #904818 99.8%, #904818 99.9%, 
        #609060 99.9%, #609060 100%
      );
    }
   .rectangle5 {
    width: 300px;
      height: 60px;
      background: linear-gradient(
        to right,
        #a8c0d8 0%, #a8c0d8 22.5%, 
        #d8f0f0 22.5%, #d8f0f0 43.7%, 
        #c0d8d8 43.7%, #c0d8d8 58.6%, 
        #90a8c0 58.6%, #90a8c0 67.8%, 
        #787890 67.8%, #787890 72.3%, 
        #9090a8 72.3%, #9090a8 77.9%, 
        #a89090 77.9%, #a89090 81.3%, 
        #907860 81.3%, #907860 85.0%, 
        #a8a8a8 85.0%, #a8a8a8 87.7%, 
        #d8c0a8 87.7%, #d8c0a8 89.8%, 
        #606078 89.8%, #606078 92.3%, 
        #786048 92.3%, #786048 94.3%, 
        #484860 94.3%, #484860 95.8%, 
        #c0a890 95.8%, #c0a890 96.8%, 
        #604830 96.8%, #604830 97.3%, 
        #1860a8 97.3%, #1860a8 97.5%, 
        #c06060 97.5%, #c06060 97.7%, 
        #1878c0 97.7%, #1878c0 97.9%, 
        #303048 97.9%, #303048 98.1%, 
        #304830 98.1%, #304830 98.2%
      );
    }
  
  
   .rectangle6 {
    width: 300px;
      height: 60px;
      background: linear-gradient(
        to right,
        #c0c0c0 0%, #c0c0c0 18.1%, 
        #a8a890 18.1%, #a8a890 35.5%, 
        #c0d8d8 35.5%, #c0d8d8 52.1%, 
        #f0f0f0 52.1%, #f0f0f0 66.7%, 
        #a8c0d8 66.7%, #a8c0d8 76.2%, 
        #90a8c0 76.2%, #90a8c0 85.4%, 
        #7890a8 85.4%, #7890a8 90.0%, 
        #786060 90.0%, #786060 93.5%, 
        #787890 93.5%, #787890 96.3%, 
        #ffffff 96.3%, #ffffff 98.5%, 
        #6078a8 98.5%, #6078a8 99.2%, 
        #606078 99.2%, #606078 99.9%, 
        #304860 99.9%, #304860 99.91%, 
        #f0f0ff 99.91%, #f0f0ff 99.92%, 
        #1878a8 99.92%, #1878a8 99.93%, 
        #f0ffff 99.93%, #f0ffff 99.94%, 
        #f0fff0 99.94%, #f0fff0 99.95%, 
        #fffff0 99.95%, #fffff0 99.96%, 
        #604830 99.96%, #604830 100%
      );
    }
  
  
  .rectangle7 {
    width: 300px;
      height: 60px;
      background: linear-gradient(
        to right,
        #909060 0%, #909060 12.6%, 
        #f0f0f0 12.6%, #f0f0f0 25%, 
        #d8c090 25%, #d8c090 33.4%, 
        #a8c0c0 33.4%, #a8c0c0 44%, 
        #907878 44%, #907878 53.7%, 
        #a8a878 53.7%, #a8a878 63.2%, 
        #d8d8c0 63.2%, #d8d8c0 71.5%, 
        #909090 71.5%, #909090 77.3%, 
        #c09030 77.3%, #c09030 82.6%, 
        #ffffff 82.6%, #ffffff 87.9%, 
        #786060 87.9%, #786060 90.9%, 
        #d8a860 90.9%, #d8a860 93.2%, 
        #606048 93.2%, #606048 94.6%, 
        #7890c0 94.6%, #7890c0 95.9%, 
        #484830 95.9%, #484830 97.1%, 
        #f0fff0 97.1%, #f0fff0 98%, 
        #fffff0 98%, #fffff0 98.5%, 
        #fff0f0 98.5%, #fff0f0 98.6%, 
        #603018 98.6%, #603018 98.7%, 
        #fff0ff 98.7%, #fff0ff 100%
      );
    }
  
  .rectangle8 {
    width: 300px;
      height: 60px;
      background: linear-gradient(
        to right,
        #d8f0d8 0%, #d8f0d8 10.9%, 
        #f0f0f0 10.9%, #f0f0f0 21.5%, 
        #d8c0a8 21.5%, #d8c0a8 31.7%, 
        #c0d8d8 31.7%, #c0d8d8 41.5%, 
        #c0f0c0 41.5%, #c0f0c0 48.6%, 
        #a8f0a8 48.6%, #a8f0a8 55.6%, 
        #c0a890 55.6%, #c0a890 62.1%, 
        #a89078 62.1%, #a89078 67.8%, 
        #a8c0c0 67.8%, #a8c0c0 72.8%, 
        #f0d8c0 72.8%, #f0d8c0 76.8%, 
        #604848 76.8%, #604848 80.8%, 
        #789090 80.8%, #789090 84%, 
        #9090c0 84%, #9090c0 86.5%, 
        #786060 86.5%, #786060 88.8%, 
        #60c060 88.8%, #60c060 91%, 
        #60f060 91%, #60f060 93%, 
        #90a8a8 93%, #90a8a8 94.6%, 
        #78d878 94.6%, #78d878 96.1%, 
        #90d890 96.1%, #90d890 97.4%, 
        #30d830 97.4%, #30d830 100%
      );
    }
    .rectangle9 {
        width: 300px;
      height: 60px;
      background: linear-gradient(
        to right,
        #c0c0c0 0%, #c0c0c0 18.22%, 
        #909090 18.22%, #909090 34.31%, 
        #787878 34.31%, #787878 48.5%, 
        #d8d8d8 48.5%, #d8d8d8 60.4%, 
        #a8a8a8 60.4%, #a8a8a8 69.5%, 
        #f0f0f0 69.5%, #f0f0f0 78.78%, 
        #606078 78.78%, #606078 84.44%, 
        #607860 84.44%, #607860 90.13%, 
        #306048 90.13%, #306048 95.65%, 
        #ffffff 95.65%, #ffffff 97.12%, 
        #304830 97.12%, #304830 98.04%, 
        #f0fff0 98.04%, #f0fff0 98.5%, 
        #fff0f0 98.5%, #fff0f0 98.96%, 
        #d8c060 98.96%, #d8c060 99.42%, 
        #f0f0ff 99.42%, #f0f0ff 99.71%, 
        #fffff0 99.71%, #fffff0 100%
      );
    }
    .rectangle10 {
      width: 300px;
      height: 60px;
      background: linear-gradient(
        to right,
        #f0f0f0 0%, #f0f0f0 16%, 
        #d8c0a8 16%, #d8c0a8 28.1%, 
        #787860 28.1%, #787860 40.9%, 
        #c0a890 40.9%, #c0a890 52%, 
        #909090 52%, #909090 65%, 
        #d8d8d8 65%, #d8d8d8 75.1%, 
        #a8a8a8 75.1%, #a8a8a8 83.7%, 
        #c0c0c0 83.7%, #c0c0c0 92.3%, 
        #606048 92.3%, #606048 98.1%, 
        #90a8c0 98.1%, #90a8c0 99.7%, 
        #7890a8 99.7%, #7890a8 100%
      );
    }
      h1, h3{
          margin: 0;
          font-family: Quicksand;
          font-size:medium
      }

      button{
        font-family: Quicksand;
        font-size: large;
        font-weight: bold;
        color:#2088A6;
        background-color:#C8E5ED;
        border:none;
        border-radius: 5px;
       
      }
  </style>