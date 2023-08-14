<script>
    import { afterUpdate } from 'svelte';
  
    afterUpdate(() => {
      setTimeout(() => {
        const nbaImage = document.querySelector('.nba');
        // @ts-ignore
        nbaImage.style.filter = 'sepia(1)';
        // @ts-ignore
        nbaImage.style.opacity = '0.6';
      }, 6000);
    });

    import NBAUrl from "../../../assets/Projects/AllStar/nba.svg"
  </script>
  
  <body>
    <img class="nba" src="{NBAUrl}" alt="nba">
  </body>
  
  <style>
    .nba {
      margin-top: 10%;
      margin-left: 40%;
      height: 370px;
      width: auto;
      filter: sepia(0);
      opacity: 1;
      animation: sepiaOpacityTransition 6s ease-out forwards;
    }
  
    @keyframes sepiaOpacityTransition {
      0% {
        filter: sepia(0);
        opacity: 1;
      }
      100% {
        filter: sepia(1);
        opacity: 0.6;
      }
    }
  </style>
  