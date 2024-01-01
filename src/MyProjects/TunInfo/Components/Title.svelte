<script>
  import Fade from './fade.svelte';
 </script>

 <div class="body">
  <div class="title">
    <h1>
      The Chronicales of Tunisian Baknotes
    </h1>
    <h4>
      Portraits and Landmarks
    </h4>
  </div>
  <div class="portrait">
    <!-- Hannibaal New -->
    <div class="fade-wrapper fade-wrapper-11">
      <Fade img1="https://i.ibb.co/jkBBjDG/svg1.png" img2="https://i.ibb.co/8YVDTM6/real1.png" height=250/>
    </div>

    <!-- Hannibaal Old -->
      <div class="fade-wrapper fade-wrapper-10">
      <Fade img1="https://i.ibb.co/hsYKMsh/svg.png" img2="https://i.ibb.co/fdPMShz/real.png" height=300/>
    </div>

     <!-- Ammami -->
     <div class="fade-wrapper fade-wrapper-3">
      <Fade img1="https://i.ibb.co/Mk8M49s/svg.png" img2="https://i.ibb.co/N2Lv5q4/real.png" height=280/>
    </div>

     <!-- Young Bouguiba -->
     <div class="fade-wrapper fade-wrapper-13">
      <Fade img1="https://i.ibb.co/jG5vqd3/svg.png" img2="https://i.ibb.co/LvwQ2h7/real.png" height=280/>
    </div>
  

    <!-- Abou El Kacem 30tnd -->
  <div class="fade-wrapper fade-wrapper-8"> 
      <Fade img1="https://i.ibb.co/34RYqjS/svg.png" img2="https://i.ibb.co/F5f2bWr/real.png" height=300/>
    </div>

    <!-- Hedi Nouira -->
    <div class="fade-wrapper fade-wrapper-7">
      <Fade img1="https://i.ibb.co/M745qtL/svg.png" img2="https://i.ibb.co/8PhpcnN/real.png" height=270/>
    </div>

    <!-- Tawhida  -->
    <div class="fade-wrapper fade-wrapper-1">
      <Fade img1="https://i.ibb.co/X5C6ZWr/svg.png" img2="https://i.ibb.co/hx5b5D3/real.png" height=250/>
    </div>
  
      <!-- Abou El kacem -->
      <div class="fade-wrapper fade-wrapper-5">
        <Fade img1="https://i.ibb.co/cxP6krb/svg.png" img2="https://i.ibb.co/FmGdh49/real.png" height=240/>
      </div>

     <!-- Ibn Khaldoun -->
     <div class="fade-wrapper fade-wrapper-2">
      <Fade img1="https://i.ibb.co/8bMXktQ/Vector.png" img2="https://i.ibb.co/wCpxsW7/real.png" height=240/>
    </div>

     <!-- Old Bourguiba -->
 <div class="fade-wrapper fade-wrapper-14">
  <Fade img1="https://i.ibb.co/bbr8ChY/svg.png" img2="https://i.ibb.co/wL9xpFV/real.png" height=280/>
</div>


  <!-- Elissa -->
  <div class="fade-wrapper fade-wrapper-9">
    <Fade img1="https://i.ibb.co/S3gzbPH/svg.png" img2="https://i.ibb.co/wJG93W7/real.png" height=220/>

  </div>
    <!-- Farhat Hached -->
    <div class="fade-wrapper fade-wrapper-4">
      <Fade img1="https://i.ibb.co/0q3gThf/svg.png" img2="https://i.ibb.co/L6NHQLB/real.png" height=250/>
    </div>

    <!-- Tounsi 20 -->
       <div class="fade-wrapper fade-wrapper-6">
      <Fade img1="https://i.ibb.co/L1f01nz/svg.png" img2="https://i.ibb.co/YB2w1HL/real.png" height=300/>
    </div>
  

    <!-- Ibn Rashiq -->
     <div class="fade-wrapper fade-wrapper-12">
      <Fade img1="https://i.ibb.co/265kC5r/svg.png" img2="https://i.ibb.co/mCfyjVk/real.png" height=250/>
    </div>
  
 </div>
 </div>
 
 <style>

  h1,h4{
    color: #205363;
    /* font-family: 'Jost', sans-serif; */
    font-family: 'Noto Sans', sans-serif;
  }

  .title {
    position: absolute;
    top: 35%;
    left: 0;
    width: 100%;
    text-align: center;
    z-index: 1; /* Lower z-index to place it behind portraits */
    color: #205363;
    font-family: 'Noto Sans', sans-serif;
    opacity: 0.8; /* Optional: Adjust for desired visibility */
  }

/* .body {
  text-align: center;
  justify-content: center;
} */
.portrait {
  position: relative;
  width: 100vw;  /* 100% of viewport width */
  height: 100vh; /* 100% of viewport height */
  max-width: 1000px;  /* maximum width */
  max-height: 1000px; 
}

.fade-wrapper {
  position: absolute;
}

.fade-wrapper-1 {
  top: 25%; 
  left: 30%;
}

.fade-wrapper-2 {
  top: 40%;
  left: 55%;
}

.fade-wrapper-3 {
  top: 1%;
  left: 94%;
}

.fade-wrapper-4 {
  top: 46%;
  left: 40%;
}

.fade-wrapper-5 {
  top: 20%;
  left: 60%;
}

.fade-wrapper-6 {
  top: 40%;
  left: 15%;
}

.fade-wrapper-7 {
  top: 30%;
  left: 10%;
}

.fade-wrapper-8 {
  top: 20%;
  left: 105%;
}

.fade-wrapper-9 {
  top: 50%;
  left: 70%;
}

.fade-wrapper-10 {
  top: 1%;
  left: 20%;
}

.fade-wrapper-11 {
  top: 20%;
  left: 43%;
}

.fade-wrapper-12 {
  top: 45%;
  left: 90%;
}

.fade-wrapper-13 {
  top: 22%;
  left: 74%;
}

.fade-wrapper-14 {
  top: 30%;
  left: 87%;
}

 </style>
 