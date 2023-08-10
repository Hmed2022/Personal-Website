<script>
	// import Box from '../components/Box.svelte';
	// import { Progress } from '@svelteuidev/core';
	import { onMount } from 'svelte';
	import Typewriter from 'svelte-typewriter';
	// import { Center, Text, Timeline } from '@svelteuidev/core';
	import PageTransitions from "../components/PageTransitions.svelte";

	import Footer from "../components/footer.svelte"

	import pdfUrl from "../assets/Ahmed Bendaly.pdf"
	import CurrentImg from "../assets/Current.png"
	import AboutMe from "../assets/1.png"
	import PhotoMe from "../assets/PhotoMe.png"

	import Logo from "../assets/MyName.png"



	let showParagraph = true;

	function handleTypewriterFinish() {
  		showParagraph = true;}


	let progress = 0;
	const milestones = [
	{ position: 20, label: 'Step 1' },
	{ position: 50, label: 'Step 2' },
	{ position: 80, label: 'Step 3' },
	{ position: 100, label: 'Finished' },
	];

	onMount(() => {
	progress = 60
	});

	export { progress, milestones };

</script>


<body>
<!-- <Typewriter  on:done={handleTypewriterFinish}>
    <p id="IntroFirstPage"> Welcome to my personal website, a hub for showcasing my passions, projects, and creative ideas.
	Join me as I delve into new concepts and pursue exciting endeavors.
   Connect with me and like-minded individuals who share similar interests and inspire growth together.</p>
</Typewriter> -->

    <p id="IntroFirstPage"> Welcome to my personal website , a hub for showcasing my passions, <a class="project" href="/projects">Projects</a>, and creative ideas.
	Join me as I delve into new concepts and pursue exciting endeavors.
   Connect with me and like-minded individuals who share similar interests and inspire growth together.</p>






<PageTransitions>
	<div class="block-container1">
		<div class="AboutMeIcon">
			<img src="{AboutMe}" alt="About Me">
		  </div>
		<p id="AboutMe">
		Meet Ahmed Bendaly, a multi-talented data scientist, graphic designer, and engineer who weaves data into captivating stories.
		Currently, Ahmed is a graduate student at the <a href="https://umdearborn.edu/" style="color:#01274B;">University of Michigan Dearborn </a>, where he’s honing his skills
		in data science.<br>
		With a passion for original and creative work, Ahmed’s goal is to make complex subjects more accessible to the world. 
		And, as a proud <a href="https://en.wikipedia.org/wiki/Tunisia" style="color:#871B40">Tunisian</a>, you’ll find a touch of his cultural heritage in some of his projects.<br> 
		<br>
		Take a look at his Resume <a href="{pdfUrl}" target="_blank" rel="noopener noreferrer" > here</a>!
		</p>
	</div>	
	
	<div class="block-container2">
		<div class="MyPhoto">
			<img src="{PhotoMe}" alt="My Photo">
		</div>
	</div>
	
	<hr class="dashed-line">
	
	<div class="CuurentProject">
		<img src="{CurrentImg}" alt="Current Project">
	</div>
	
	
	<div class= "currents">
		<div class= current1>
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
			</Timeline>
		</div> -->
	
		<div class= current2>

			<h2> Description</h2>

			<p class="description"> In this project, I will analyze Nobel Literature laureates' data to uncover the 
				key traits defining their success. With Bob Dylan's groundbreaking win in 2016 as the first songwriter
				 laureate, I aim to identify the essential criteria for winning and explore the exclusion of highly
				  accomplished writers from consideration.<br> The objective is to create a concise profile outlining the
				   minimum prerequisites for becoming a Nobel Literature laureate.</p>
		</div>
	</div>
	
	</PageTransitions>
	<Footer/>
</body>



<!-- This is the style of the Paragraphs -->
<style>

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
		font-family: Futura;
		font-weight: 300;
		font-size: 1.5em;
		/* margin-top: 50px;
		margin-left: 20%;
		margin-right: 20%; */
	}

	Footer {
		display: flex;
	}

	.project{
		text-decoration: none;
		background-color:#F2CD1C;
		color:#707070 ;
	}

	.insideBox{
		margin: 0;
		padding: 0;
		font-family: Futura;
		font-weight: 500;
	}

	.Box{
		border-color: #CED4D9;
	}

	h2{
		text-align: center;
		font-family: Futura;
		color:#CC5B64
	}

	.desc{
		text-align: center;
		font-family: Futura;
		font-weight: 300;
	}

	.current1{
		max-width: 350px;
    	float: left;
		
	}
	.current2{
		margin-left: 10%;
    	float: right;
		
	}
	.currents{
		margin-top: 5%;
		margin-left: 20%;
		margin-right: 20%;
		display: flex;
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

	.block-container1 {
	margin-top: 50px;
	margin-left: 10%;
    width: 40%;
    float: left;
  	}

	.block-container2 {
    width: 40%;
    float: right;
  	}

  	.AboutMeIcon img {
    width: 300px;
    height: auto;
    margin-left: 200px;
	}

	#IntroFirstPage {
		text-align: center;
    	color: #707070;
		font-family: Futura;
		font-weight: 300;
		font-size: 2em;
		margin-top: 50px;
		margin-left: 20%;
		margin-right: 20%;
	}

	#AboutMe {
    	color: #707070;
		font-family: Futura;
		font-weight: 300;
		font-size: 1.5em;
		margin-top: 50px;
	}
	
  </style>