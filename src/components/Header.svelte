<script>
	import Logo from "../assets/MyName.png";
</script>

<style>
	 @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;500&display=swap');

	 @font-face {
  font-family: "Action Cond Regular Trial";
  src: url("../assets/Fonts/dkonnig.ttf")
    format("truetype");
}

	 a {
    text-decoration-color:#707171
   }

   a:hover{
	text-decoration-color: #F2CC1D;
   }
   h2{
        color: #707171;
        font-family: dkzonnig;
         font-size: 2rem;
		  margin:0
      }

	  .navigation{
		display: flex;
		text-align: center;
		justify-content:center;
	  }
	
	header {
		align-items: center;
		padding: 20px;
		box-shadow: 0 10px 10px -10px rgba(200, 200, 200, 0.5);
	}

	img {
		width: 450px;
		max-width: 100%;
		height: auto;
	}

	.logo {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>

<header>
	<div class="logo">
		<a href="/">
			<img src="{Logo}" alt="Logo">
		</a>
	</div>
	<div class="navigation">
        <a href="/#/projects">
      <h2> Projects</h2>
    </a>
      </div>
</header>
