<script>
    let profeciency =2;
    function setvalue(value) {
		profeciency =value;
	return ''}
	let showText = "";
	function setShowText(value) {
		showText = value;
	}
</script>

<div class= logo2>
	<h1>
		Data Vizualisation & manipulation
	</h1>

	
	<img class=logo src="../src/assets/SoftwareLogos/Observable.svg" alt="Observable Logo" on:mouseenter={() => setShowText("Observable")}>
	<img class=logo src="../src/assets/SoftwareLogos/tableau.svg" alt="Tableau Logo" on:mouseenter={() => setShowText("Tableau")}>
    <img class=logo src="../src/assets/SoftwareLogos/Pandas.svg" alt="PandasLogo" on:mouseenter={() => setShowText("Pandas")}>
    <img class=logo src="../src/assets/SoftwareLogos/Matplotlib.svg" alt="Matplotlib Logo" on:mouseenter={() => setShowText("Matplotlib")}>
</div>

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
{:else if showText== "Pandas"}
{setvalue(1)}
{:else if showText== "Matplotlib"}
{setvalue(0)}
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


<style>
	.ball1,.ball2,.ball3,.ball4,.ball5{
		height: 20px;
		width: auto;
	}
	img:hover { opacity: 1; transform: scale(1.5) }


	.logo{
		height:70px;
		width: auto;
		
	}
</style>
	