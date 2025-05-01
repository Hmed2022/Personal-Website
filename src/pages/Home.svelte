<script>
	// import Box from '../components/Box.svelte';
	// import { Progress } from '@svelteuidev/core';
	import { onMount } from 'svelte';
	import Typewriter from 'svelte-typewriter';
	// import { Center, Text, Timeline } from '@svelteuidev/core';
	import PageTransitions from "../components/PageTransitions.svelte";
	import BucketList from '../components/BucketList.svelte';

	import Footer from "../components/footer.svelte"

	import pdfUrl from "../assets/CV-Ahmed Bendaly.pdf"
	import pdfUrl2 from "../assets/CV Detailed- Ahmed Bendaly .pdf"
	import CurrentImg from "../assets/Current.png"
	import AboutMe from "../assets/1.png"
	import PhotoMe from "../assets/PhotoMe.png"

	import Logo from "../assets/MyName.png"

	import Timeline from "../components/Timeline.svelte"
	// hmed



	let showParagraph = true;

	function handleTypewriterFinish() {
  		showParagraph = true;}


</script>


<body>
<!-- <Typewriter  on:done={handleTypewriterFinish}>
    <p id="IntroFirstPage"> Welcome to my personal website, a hub for showcasing my passions, projects, and creative ideas.
	Join me as I delve into new concepts and pursue exciting endeavors.
   Connect with me and like-minded individuals who share similar interests and inspire growth together.</p>
</Typewriter> -->

    <p id="IntroFirstPage"> Welcome to my personal website , a hub for showcasing my passions, <a class="project" href="/#/projects">Projects</a>, and creative ideas.
	Let's connect and bring more exciting ideas to life!</p>


<PageTransitions>
	<div class="containers">
	<div class="block-container1">
		<div class="AboutMeIcon">
			<img src="{AboutMe}" alt="About Me">
		  </div>
		<p id="AboutMe">
		My name is Ahmed, a data scientist by profession, a visual designer by passion, and a statistics nerd by confession. I'm interested in basketball, weird stats, and all things <a class="tunisia" href="https://en.wikipedia.org/wiki/Tunisia">Tunisian</a>, you’ll find a touch of my cultural heritage in some of my projects.<br> 
		<br>
		<!-- Take a look at my Resume <a class="cv" href="{pdfUrl}" target="_blank" rel="noopener noreferrer" > here</a>! 
		(detailed <a class="cv" href="{pdfUrl2}" target="_blank" rel="noopener noreferrer" > version </a>) -->
		</p>
	</div>	
	
	<div class="block-container2">
		<div class="MyPhoto">
			<img src="{PhotoMe}" alt="My Photo">
		</div>
	</div>

	<BucketList/>
</div>
	<!-- <hr class="dashed-line">
	
	<div class="CuurentProject">
		<img src="{CurrentImg}" alt="Current Project">
	</div>
	
	<div class= "current2">

		<h2> Description</h2>

		<p class="description"> This project is a departure from web-based data visualization,
			 focusing instead on creating a visually rich infographic. It serves as a comprehensive
			  representation of Tunisia, covering various facets such as politics, geography, and more.</p> -->

			  <!-- In this project, I will analyze Nobel Literature laureates' data to uncover the 
			key traits defining their success. With Bob Dylan's groundbreaking win in 2016 as the first songwriter
			 laureate, I aim to identify the essential criteria for winning and explore the exclusion of highly
			  accomplished writers from consideration.<br> The objective is to create a concise profile outlining the
			   minimum prerequisites for becoming a Nobel Literature laureate.</p>-->
	<!-- </div> 

	
	<div class= "currents">
		<div class= "current1">
			<Timeline/>
		</div>
		
		
	</div> -->
	
	</PageTransitions>
	<Footer/>
</body>



<style>

  	@import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;500;700;900&display=swap');

	.um{
		color:#01274B;
	}

	.tunisia{
		color:#871B40;
	}

	.cv:hover{
		background-color:#F2CD1C;
		color:white ;
	}

	.cv{
		color: #F2CD1C
	}

	.tunisia:hover{
		background-color: #871B40;
		color:white

	}

	.um:hover{
		background-color:#01274B;
		color:white;

	}


	img {
		width: 450px;
		height: auto;
		
	  }

	  .logo {
		display: flex;
		justify-content: center;
		align-items: center;
	  }

	header{

		/* display: flex; */
		align-items: center;
		/* justify-content: space-between; */
		padding: 20px;
		/* background-color: #f1f1f1; */
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	.description{
		text-align: center;
    	color: #707070;
		font-family: 'Jost', sans-serif;
		font-weight: 300;
		font-size: 1.5em;
		/* margin-top: 50px;
		margin-left: 20%;
		margin-right: 20%; */
	}

	
	.project{
		text-decoration: none;
		background-color:#F2CD1C;
		color:#707070 ;
	}

	.project:hover{
		text-decoration: none;
		background-color:#CC5B64;
		color:white ;
	}

	.insideBox{
		margin: 0;
		padding: 0;
		font-family: 'Jost', sans-serif;
		font-weight: 500;
	}

	.Box{
		border-color: #CED4D9;
	}

	h2{
		text-align: center;
		font-family: 'Jost', sans-serif;
		color:#CC5B64
	}

	.desc{
		text-align: center;
		font-family: 'Jost', sans-serif;
		font-weight: 300;
	}

	.current1{
		max-width: 40rem;
        margin: 1rem auto;
	}
	.current2{
		max-width: 40rem;
        margin: 1rem auto;
		
	}
	.currents{
		margin-top: 5%;
		margin-left: 20%;
		margin-right: 20%;

	}
	.dashed-line {
		display: flex;
		opacity: 20%;
		border-top: 2px dashed rgb(79, 79, 79);
		width: 70%;
		margin-bottom: 40px;
	}

	.CuurentProject img {

    width: 300px;
    height: auto;
    display: inline-block;
	}

	.CuurentProject{
  text-align: center;
	}

	.MyPhoto img{ 
	margin-top: 40px;	
	margin-left: 20px;	
	width: 400px;
	height: auto;
	}

	/* .block-container1 {
	margin-top: 50px;
	margin-left: 10%;
    width: 40%;
    float: left;

  	}

	.block-container2 {
    width: 40%;
    float: right;
  	} */

	  .containers {
		display: flex;
		flex-wrap: wrap; /* This enables wrapping when the screen size is reduced */
		justify-content: space-between; /* Spacing between the containers */
		margin-left: 10%;
		margin-right:10%;
		text-align: center;
		justify-content: center;
		}

		.block-container1 {
			flex: 1; /* Take up equal space in a row, adjust as needed */
			margin-right: 20px; /* Add margin between containers */
		}

		.block-container2 {
			flex: 1; /* Take up equal space in a row, adjust as needed */
			text-align: center;
			margin-right: 0;
		}


  	.AboutMeIcon img {
    width: 300px;
    height: auto;
	}

	#IntroFirstPage {
		text-align: center;
    	color: #707070;
		font-family: 'Jost', sans-serif;
		font-weight: 300;
		font-size: 2em;
		margin-top: 50px;
		margin-left: 20%;
		margin-right: 20%;
	}

	#AboutMe {
    	color: #707070;
		font-family: 'Jost', sans-serif;
		font-weight: 300;
		font-size: 1.5em;
		margin-top: 50px;
	}

	@media (max-width: 768px) {

		#IntroFirstPage {
		text-align: center;
    	color: #707070;
		font-family: 'Jost', sans-serif;
		font-weight: 300;
		font-size: 1.3em;
		margin-top: 50px;
		margin-left: 5%;
		margin-right: 5%;
	}

	.AboutMeIcon img {
    width: 230px;
    height: auto;
	}

	

	#AboutMe {
    	color: #707070;
		font-family: 'Jost', sans-serif;
		font-weight: 300;
		font-size: 1.3em;
		margin-top: 22px;
	}

	.MyPhoto img{ 
	margin-top: 0;	
	margin-left: 0;	
	width: 280px;
	height: auto;
	}

	.CuurentProject img {

		width: 230px;
		height: auto;
		display: inline-block;
		}

		.currents{
		margin-top: 5%;
		margin-left: 0;
		margin-right: 0;

	}

	.description{
		text-align: center;
    	color: #707070;
		font-family: 'Jost', sans-serif;
		font-weight: 300;
		font-size: 1.3em;
	}

	.containers {
		display: flex;
		flex-wrap: wrap; /* This enables wrapping when the screen size is reduced */
		justify-content: space-between; /* Spacing between the containers */
		margin-left: 5%;
		margin-right:5%;
		text-align: center;
		justify-content: center;
		}
}
  </style>


<!-- <Box>
				<h2>Decoding Nobel Success: Traits of a Literary Laureate</h2>
				<p class="desc" style="color:#7F393E" >Data Analysis | Data Vizualisation</p>
			</Box>
			<Box>
				<Center>
					<p class="insideBox" style="color:#7F393E">Current task</p>
				</Center>
				<Progress value={5} label="5%" size="xl" radius="xl" color="#7F393E"/>
				<Center>
					<p class="insideBox" style="color:#7F393E">This Project Structure</p>
				</Center>
			<Progress
				mt='md'
				size="xl"
				radius="xl"
				sections={[
					{ value: 55, color: '#7F393E', label: 'Data collection' },
					{ value: 10, color: '#CC5B64', label: 'Viz' },
					{ value: 10, color: '#FF727D', label: 'Storytelling' },
					{ value: 25, color: '#FFBDC3', label: 'Development' },
				]}/>
			</Box>
		
			<Timeline color=#7F393E active={0} lineWidth={4} bulletSize={20}>
				<Timeline.Item title='Data Collection' color="#7F393E" >
				<Text color='dimmed' size='sm' >
					Collecting data for Nobel Literature Winners.</Text
				>
				<Text size='xs'>Task Started on 08/13/23</Text>
				</Timeline.Item>
			
				<Timeline.Item title='Craft the Story'>
				<Text color='dimmed' size='sm'
					> Build the story around the our data findings.
					</Text
				>
				<Text size='xs'>Task starting date is TBD</Text>
				</Timeline.Item>
			
				<Timeline.Item title='Data Visualization' lineVariant='dashed'>
				<Text color='dimmed' size='sm'
					>Vizualise the data in an interactive and insighful way.
					</Text
				>
				<Text size='xs'>Task starting date is TBD</Text>
				</Timeline.Item>
			
				<Timeline.Item title='Article Development' lineVariant='dashed'>
					<Text color='dimmed' size='sm'
						>Build the an interactive article to showcase the project.</Text
					>
					<Text size='xs'>Task starting date is TBD</Text>
					</Timeline.Item>
			</Timeline>-->