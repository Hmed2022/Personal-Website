<script>
    import IoLogoLinkedin from 'svelte-icons/io/IoLogoLinkedin.svelte';
      import IoIosMail from 'svelte-icons/io/IoIosMail.svelte';
      import IoLogoGithub from 'svelte-icons/io/IoLogoGithub.svelte'
  </script>
  
  <style>

  @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;500&display=swap');

    .center-line {
		/* margin-right:20%;
		margin-left: 20%; */
		align-content:center;
    height: 2px;
    background-color: #ccc; /* Grey color */
		opacity: 30%

  }

    .footer2 {
      /* background-color: #f2f2f2; */
      padding: 20px;
      /* width: 100%; */
      text-align: center;
      margin-top: 7%;
      margin-left: 20%;
      margin-right: 20%;
    }

    @media (max-width: 768px) {
      .footer2 {
      /* background-color: #f2f2f2; */
      padding: 20px;
      /* width: 100%; */
      text-align: center;
      margin-top: 7%;
      margin-left: 0;
      margin-right: 0;
    }
}
  
    .icons {
          display: inline-flex;
      height: 40px;
      width: auto;
      
    }
  
      .icons a {
      margin-right: 10px;
          color: #8E8E8E;
        
  }
   a {
    text-decoration-color:#8E8E8E
   }
    #linkedin:hover,#email:hover,#github:hover {
      transform: scale(1.2); /* Increase size on hover */
      transition: transform 0.2s ease-in-out;
    }
  .copy{
      color: #8E8E8E;
      font-family: 'Jost', sans-serif;
      font-weight: 300;
  }
      h2{
        color: #8E8E8E;
        font-family: 'Jost', sans-serif;
          font-weight: 500;
      }
  
      .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }

  .icon{
    max-height: 40px;
    margin: 0;
  }
  
  .container1 {
      margin-right: 20%;
          text-align: left;
          /* margin-left:20%; */
  }
  
  .container2 {
      /* margin-right: 20%; */
      flex-wrap: wrap;
  }
  
  
  
  
  </style>
  
  <div class="footer2">
    <div class="center-line"></div>
      <div class="footer">
      <div class="container1">
        <a href="/">
            <h2 > Home</h2>
        </a>
        <a href="/#/projects">
      <h2> Projects</h2>
    </a>
      </div>
  
      
      <div class="container2">
          <h2> Contact me</h2>
    
          <div class="icons">
              <div class="icon" id="linkedin">
                        <a href="https://www.linkedin.com/in/ahmed-bendaly/">
                      <IoLogoLinkedin/>  </a>
              </div>
              <div class="icon" id="email">
                       <a href="mailto:ahmedben@umich.edu">
                           <IoIosMail/> </a>
              </div>
              <div class="icon" id="github">
                       <a href="https://github.com/Hmed2022">
                           <IoLogoGithub/> </a>
              </div>
          </div>
  
      </div>
      
      </div>
      <p class="copy"> © 2023 Ahmed Bendaly</p>
  </div>
  
  
  
  