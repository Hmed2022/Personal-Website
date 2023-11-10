<script>
    import Colors from "./Colors.svelte";
</script>


<div class="containerAll">
 
    <div class="containerText">
        <p>
            Ever tried the 'Guess That Bill by Color' game? It would have been a challenge in the Bourguiba era, where banknote hues were muted, arbitrary, and often lacked a clear dominant color. Describing a bill by its portrait was a dead end too—they all starred Bourguiba. Imagine this: a single shade of blue could represent 0.5, 1, 5, 10, or 20 TND!
Fast forward to the modern era, there’s been a strategic shift. Each denomination has been given its own distinct color identity; a green note signals 5 TND, blue is for 10 TND, red for 20 TND, a brown/blue/yellow mix for for 30 TND, and light green for 50 TND — which later transitioned to brown to prevent confusion with the 5 TND note after the 30 TND was discontinued. This color coordination brought a welcomed clarity to Tunisia's currency similar to the neighbor's Euro. It’s a rainbow revamp that would make your bill-guessing game a whole lot easier!

        </p>
        
    </div>

    <div class="containerImg">
      <Colors/>             
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
      text-align: right; /* Aligns the image to the right side */
    }
  
  

</style>