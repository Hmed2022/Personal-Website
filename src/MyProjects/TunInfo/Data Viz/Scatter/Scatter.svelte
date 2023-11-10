<script>
    import Graph from "./Graph.svelte"
</script>


<div class="containerAll">
    <div class="containerImg">
        <Graph/>             
      </div>
 
    <div class="containerText">
        <p>
            In the days of gold, the rule was simple: bigger pieces, bigger value. With the switch to banknotes, it's the numbers printed on paper that count, not the size. For a while, Tunisian currency seemed to ignore this old rule—the largest bill was actually the 10 TND, despite higher denominations like 20, 30, and 50 TND existing, and the smallest was the 5 TND, with 1 TND and 0.5 TND notes also in circulation.
            However, the post-Bourguiba (Modern Era) era brought back a touch of the gold standard logic to banknotes: size started to reflect value once more. A quick glance at the scatter plot now shows a clear trend: larger notes carry greater value. This isn't just a visual aid; it also offers tactile information about the bill's worth, making currency more accessible and easier to differentiate.            
        </p>
        
    </div>

   
</div>
 

<style>

      p{
          font-family: Quicksand;
          /* font-size: 0.75em */
      }
  
      .containerAll {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;
    }
  
    .containerText, .containerImg {
      flex: 1; /* This will make both containers take up equal width */
      padding: 10px; /* Add some spacing around the content */
    }
  
    .containerImg {
      /* Additional styles for image container if needed */
      text-align: left; /* Aligns the image to the right side */
    }
  
  

</style>