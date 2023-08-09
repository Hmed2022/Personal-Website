<script>
    import { afterUpdate } from 'svelte';
  
    afterUpdate(() => {
      setTimeout(() => {
        const nbaImage = document.querySelector('.nba');
        nbaImage.style.filter = 'sepia(1)';
        nbaImage.style.opacity = '0.6';
      }, 6000);
    });
  </script>
  
  <body>
    <img class="nba" src="../src/MyProjects/All-Star/Assets/nba.svg" alt="nba">
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
  