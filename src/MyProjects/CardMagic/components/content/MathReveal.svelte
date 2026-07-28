<script>
    import CardsExpl from "../items/piles4Expl.svelte";
    import KeyboardUp from "../items/KeyboardUp2.svelte";
    </script>
    
    <body>
        <!-- <KeyboardUp/> -->
        <div class='piles'>
            <CardsExpl on:goto/>
        </div>
    </body>
    
    
    <style>
          @import url('https://fonts.googleapis.com/css2?family=Kumbh+Sans:wght@400;700&display=swap');
    
        body{
            height: 100%;
            margin-top: 0;
            background-color: #FDD4D4;
        }
    
        .piles {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>