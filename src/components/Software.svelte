<script>
	import Gallery from 'svelte-image-gallery';
	let showText = "";
	function setShowText(value) {
		showText = value;
	}
    // import Proficiency from "../components/Proficiency.svelte";
    let profeciency =0;
    function setvalue(value) {
		profeciency =value;
	return ''}
	
</script>
  

<div class= logo2>
	<h1>
		Data Vizualisation & manipulation
	</h1>

	
	<img class=logo src="../src/assets/SoftwareLogos/Observable.svg" alt="Observable Logo" on:mouseenter={() => setShowText("Observable")}>
	<img class=logo src="../src/assets/SoftwareLogos/tableau.svg" alt="Tableau Logo" on:mouseenter={() => setShowText("Tableau")}>
    <img class=logo src="../src/assets/SoftwareLogos/Pandas.svg" alt="PandasLogo" on:mouseenter={() => setShowText("Pandas")}>
    <img class=logo src="../src/assets/SoftwareLogos/Matplotlib.svg" alt="Matplotlib Logo" on:mouseenter={() => setShowText("Matplotlib")}>


	<h1>
		Programming Languages
	</h1>
    <img class=logo src="../src/assets/SoftwareLogos/svelte.svg" alt="Svelte Logo" on:mouseenter={() => setShowText("Svelte")}>
	<img class=logo src="../src/assets/SoftwareLogos/Python.svg" alt="Python Logo" on:mouseenter={() => setShowText("Python")} >
	<img class=logo src="../src/assets/SoftwareLogos/R.svg" alt="R Logo" on:mouseenter={() => setShowText("R")}>
	<img class=logo src="../src/assets/SoftwareLogos/Java.svg" alt="Java Logo" on:mouseenter={() => setShowText("Java")}>

    <h1>
		Machine Learning
	</h1>

	<img class=logo src="../src/assets/SoftwareLogos/TF.svg" alt="TensorFlow Logo" on:mouseenter={() => setShowText("TF")} >
	<img class=logo src="../src/assets/SoftwareLogos/Keras.svg" alt="Keras Logo" on:mouseenter={() => setShowText("Keras")}>
	<img class=logo src="../src/assets/SoftwareLogos/SL.svg" alt="ScikitLearn Logo" on:mouseenter={() => setShowText("SL")}>

    <h1>
		Adobe Suite
	</h1>

	<img class=logo src="../src/assets/SoftwareLogos/PS.svg" alt="Photoshop Logo" on:mouseenter={() => setShowText("Photoshop")}>
	<img class=logo src="../src/assets/SoftwareLogos/AI.svg" alt="Illustrator Logo" on:mouseenter={() => setShowText("Illustrator")}>
	<img class=logo src="../src/assets/SoftwareLogos/XD.svg" alt="Adobe XD Logo" on:mouseenter={() => setShowText("AdobeXD")}>
	<img class=logo src="../src/assets/SoftwareLogos/PR.svg" alt="Premiere Pro Logo" on:mouseenter={() => setShowText("Premiere Pro")}>
	
</div>

<div class= Description>
	<p class= title>
		Name: {#if showText== "Svelte"}
		<p class= name>Svelte</p>
		{:else if showText== "Tableau"}
		<p class= name>Tableau</p>
		{:else if showText== "Photoshop"}
		<p class= name>Adobe Photoshop</p>
		{:else if showText== "Illustrator"}
		<p class= name>Adobe Illustrator</p>
		{:else if showText== "AdobeXD"}
		<p class= name>Adobe XD</p>
		{:else if showText== "Premiere Pro"}
		<p class= name>Adobe Premiere Pro</p>
        {:else if showText== "JS"}
		<p class= name>Java Script</p>
		{:else if showText== "CSS"}
		<p class= name>CSS</p>
		{:else if showText== "HTML"}
		<p class= name>HTML</p>
		{:else if showText== "Python"}
		<p class= name>Python</p>
		{:else if showText== "R"}
		<p class= name>R</p>
        {:else if showText== "Java"}
		<p class= name>Java</p>
        {:else if showText== "TF"}
		<p class= name>TensorFlow</p>
        {:else if showText== "Keras"}
		<p class= name>Keras</p>
        {:else if showText== "SL"}
		<p class= name>Scikit-Learn</p>
        {:else if showText== "Observable"}
		<p class= name>Observable</p>
        {:else if showText== "Pandas"}
		<p class= name>Pandas</p>
        {:else if showText== "Matplotlib"}
		<p class= name>Matplotlib</p>
		{:else}
		<p class= name>Observable</p>
		{/if} 
	</p>
    <p class= prof> Proficency:</p>
    
<div>
	<img class=ball1 src="../src/assets/Icons/ball.png" alt="">
	<img class=ball2 src="../src/assets/Icons/ball.png" alt="">
	<img class=ball3 src="../src/assets/Icons/ball.png" alt="">
	<img class=ball4 src="../src/assets/Icons/ball.png" alt="">
	<img class=ball5 src="../src/assets/Icons/ball.png" alt="">
</div>

    {#if showText== "Observable"}
        {setvalue(3)}
    {:else if showText== "Tableau"}
        {setvalue(4)}
    {:else if showText== "Matplotlib"}
    {setvalue(5)}
    {:else if showText== "Pandas"}
    {setvalue(5)}
    {:else if showText== "Svelte"}
    {setvalue(4)}
    {:else if showText== "Python"}
    {setvalue(4)}
    {:else if showText== "R"}
    {setvalue(4)}
    {:else if showText== "Java"}
    {setvalue(4)}
    {:else if showText== "TF"}
    {setvalue(4)}
    {:else if showText== "Keras"}
    {setvalue(4)}
    {:else if showText== "SL"}
    {setvalue(4)}
    {:else if showText== "Photoshop"}
    {setvalue(5)}
    {:else if showText== "Illustrator"}
    {setvalue(5)}
    {:else if showText== "Adobe XD"}
    {setvalue(5)}
    {:else if showText== "Premiere Pro"}
    {setvalue(3)}
{/if} 

{#if profeciency == 0}
    <style>
    .ball1{opacity:20%}
    .ball2{opacity:20%}
    .ball3{opacity:20%}
    .ball4{opacity:20%}
    .ball5{opacity:20%}
    </style>
{:else if profeciency == 1}
    <style>
    .ball1{opacity:100%}
    .ball2{opacity:20%}
    .ball3{opacity:20%}
    .ball4{opacity:20%}
    .ball5{opacity:20%}
    </style>
{:else if profeciency == 2}
    <style>
    .ball1{opacity:100%}
    .ball2{opacity:100%}
    .ball3{opacity:20%}
    .ball4{opacity:20%}
    .ball5{opacity:20%}
    </style>
{:else if profeciency == 3}
    <style>
    .ball1{opacity:100%}
    .ball2{opacity:100%}
    .ball3{opacity:100%}
    .ball4{opacity:20%}
    .ball5{opacity:20%}
    </style>
{:else if profeciency == 4}
    <style>
    .ball1{opacity:100%}
    .ball2{opacity:100%}
    .ball3{opacity:100%}
    .ball4{opacity:100%}
    .ball5{opacity:20%}
    </style>
{:else if profeciency == 5}
    <style>
    .ball1{opacity:100%}
    .ball2{opacity:100%}
    .ball3{opacity:100%}
    .ball4{opacity:100%}
    .ball5{opacity:100%}
    </style>
{/if}
        
    
    <p class= descp>
		Desciption:{#if showText== "Svelte"}
		<p class= name2>a JavaScript framework for building user interfaces. It's known for
             its simplicity and small size plus it's faster than other frameworks like React or Angular.</p>
		{:else if showText== "Tableau"}
		<p class= name2>data visualization tool that allows users to create interactive and shareable
             dashboards, reports, and charts.</p>
		{:else if showText== "Photoshop"}
		<p class= name2> a professional photo editing software. It's used 
            for tasks such as retouching, compositing, and creating digital artwork</p>
		{:else if showText== "Illustrator"}
		<p class= name2>a vector graphics editor used for creating logos, illustrations,
             and graphics for print and digital media.</p>
		{:else if showText== "AdobeXD"}
		<p class= name2>user experience design tool used for creating prototypes
             and wireframes for websites and mobile applications.</p>
		{:else if showText== "Premiere Pro"}
		<p class= name2>a professional video editing software known for its powerful
             features, such as advanced color correction, motion graphics, and audio editing.</p>
		{:else if showText== "Python"}
		<p class= name2>A high-level, interpreted language for web development, scientific computing, and data analysis.</p>
		{:else if showText== "R"}
		<p class= name2>A programming language and environment for statistical computing, data analysis, and graphics.</p>
        {:else if showText== "Java"}
		<p class= name2>A general-purpose, object-oriented language for building applications.</p>
        {:else if showText== "TF"}
		<p class= name2>a library for building and training machine learning models</p>
        {:else if showText== "Keras"}
		<p class= name2>a high-level neural networks API, written in Python and
             capable of running on top of TensorFlow, CNTK, or Theano</p>
        {:else if showText== "SL"}
		<p class= name2>a library for machine learning algorithms</p>
        {:else if showText== "Observable"}
		<p class= name2>an open-source platform for creating and sharing interactive data
            visualizations and documents.</p>
        {:else if showText== "Pandas"}
		<p class= name2>a  library for data analysis and manipulation</p>
        {:else if showText== "Matplotlib"}
		<p class= name2>a Python's library for data visualization</p>
		{:else}
		<p class= name2>an open-source platform for creating and sharing interactive data
             visualizations and documents.</p>
		{/if} 
    </p>
   		
</div>

<style>

    .prof{
        height: 40px;
        width: auto;
        color: #0c535d;
		font-family: DK Zonnig;
		font-size: 50px;
    }

	.title{
        height: 50px;
        width: auto;
		color: #0c535d;
		font-family: DK Zonnig;
		font-size: 50px;
	}
    .descp{
        height: 150px;
        width: auto;
        color: #0c535d;
		font-family: DK Zonnig;
		font-size: 50px;

    }
    .name2{
        margin-top: 10px;
		display: inline-block;
		color: rgb(93, 93, 93);
		font-family: DK Zonnig;
		font-size: 40px;
	}

	.name{
		display: inline-block;
		color: rgb(93, 93, 93);
		font-family: DK Zonnig;
		font-size: 40px;
	}

	.Description{
	width: 40%;
    float: right;
	}

	img { transition: all .2s;
	
	}
	img:hover { opacity: 1; transform: scale(1.5) }


	.logo{
		height:70px;
		width: auto;
		
	}
	.logo2{
        display:block;
		margin-top: 50px;
		margin-left: 200px;
		width: 40%;
    	float: left;
	}

    .ball1,.ball2,.ball3,.ball4,.ball5{
        display: inline-block;
		height: 20px;
		width: auto;
	}

	h1 {
		display: flex;
		margin: 0 auto;
		margin-top: 20px;
		display: flex;
		color: #6e6e6e;
		font-family: DK Zonnig;
		font-size: 30px;
	}
</style>
