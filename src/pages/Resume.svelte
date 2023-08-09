<script>
	import Software from "../components/Software.svelte";
	import Header from "../components/Header.svelte";
	import Proficiency from "../components/Proficiency.svelte";
	import Volunteer from "../components/Volunteering.svelte";
	import PageTransitions from "../components/PageTransitions.svelte";
	
	let scoops =1;
</script>

  
<Header />

<PageTransitions>


<div class="Education">
	<img src="/src/Education.png" alt="Education">
</div>
<div class= "first">
	<div class="block-container1">
		<h1>University of Michigan - Dearborn</h1>
		<h2>Master's Degree in Data Science</h2>
		<p>January 2022 - Currently   MI, US</p>
		<p class="GPA">CGPA = 3.4</p>
	
		<label>
			<input type=radio bind:group={scoops} name="scoops" value={1}>
			Master's Courses
		</label>
	
		<h1>Mediterranean Institute Of Technology</h1>
		<h2>Engineering Diploma in Computer Systems</h2> 
		<p>September 2015 - December 2020    Tunis, Tunisia</p>
		<p class="GPA">CGPA = 3.11</p>
	
		<label>
			<input type=radio bind:group={scoops} name="scoops" value={2}>
			Bachelor's Courses
		</label>
	
	</div>	
	<div class="block-container2">
		<div>
			<h1>
				Courses
			</h1>
				{#if scoops === 1}
			
				<p class="Courses">
					CIS 556	Database Systems <br>
					CIS 552	Information Visualization. & Virtualization <br>
					CIS 5570	Introduction to Big Data<br>
					ECE 537	Data Mining<br>
					STAT 560	 Time Series Analysis<br>
					CIS 545	Data Security and Privacy<br>
					CIS 511	Intro Natural Lang Processing<br>
					CIS 590K	Sel Topic: Deep Learning<br>	
				</p>
			{:else}
				<p class="Courses">
					CS 341 Data Structures and Algorithms<br>
					MATH 348 Graph Theory<br>
					CS 331 Database Management Systems<br>
					CS 453 Pervasive Computing and Cloud<br>
					CS 434 Data Analytics<br>
					CS 485 Artificial Intelligence<br>
					ISS 497 Research Methods<br>	
					</p>
			{/if}
			<p class="clickHere">
				Click <a href="">here</a> to download the latest version of Resume
			</p>
		</div>
	</div>
</div>



<br>
<hr class="dashed-line">


<div class="Software">
	<img src="/src/Software.png" alt="Software">
</div>

<Software />
<br>
<hr class="dashed-line">

<div class = "Passions">
	<img src="/src/Passion.png" alt="Passion">
<Volunteer />
</div>
</PageTransitions>

<style>
	/* .first{
		margin-block-end:100px ;
	} */

	.Passions img{
		margin-top: 30px;
		width: 250px;
		height: auto;
		display: inline-block;
	}

	.Passions{
		text-align: center;
		display:block,flex;
		width: all;
		height:4000px;
		background-color: #00CAD5;

	}

	.dashed-line {
		display: flex;
		opacity: 0%;
		margin-top: 40px;
		border-top: 2px dashed rgb(79, 79, 79);
		width: 70%;
		margin-bottom: 40px;
	}
		
	p, label {
		color: rgb(93, 93, 93);
		font-family: 'Gill Sans', 'Gill Sans MT', Calibri, sans-serif;
		font-size: 20px;
	}


	.Courses{
		display: flex;
		color: rgb(93, 93, 93);
		font-family: DK Zonnig;
		font-size: 30px;
	}

	h1 {
		display: flex;
		margin: 0 auto;
		margin-top: 20px;
		display: flex;
		color: #0c535d;
		font-family: DK Zonnig;
		font-size: 50px;
	}
	h2 {
		margin: 0 auto;
		display: flex;
		font-family: DK Zonnig;
		font-size: 30px;
	}

	.GPA, label {
  	display: inline-block;
	margin:0 auto;
	}

	.Education img {
    width: 300px;
    height: auto;
	display: block;
    margin: 0 auto;
	margin-top: 50px;
	margin-bottom: 20px;
	}

	.Software {
  text-align: center;
}

.Software img {

	width: 300px;
    height: auto;
  display: inline-block;
}


	.block-container1 {
	margin-left: 200px;
    width: 40%;
    float: left;
  	}

	.block-container2 {
    width: 45%;
    float: right;
  	}

</style>