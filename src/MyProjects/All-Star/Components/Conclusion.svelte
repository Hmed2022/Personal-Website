<script>
</script>

<h1>
	Conclusion
</h1>

<p>
    the All-Star game's decline can be attributed to several key factors, but
	the primary contributor has always been, and will likely continue to be,
	the presence or absence of the stars themselves. The essence of the event
	lies in celebrating the NBA's brightest talents, and when these stars are
	present, the game thrives, capturing the excitement and passion of basketball
	fans worldwide. However, when key players are absent due to injuries or other
	reasons, the event loses its luster and fails to deliver the same level of
	excitement. <br> <br>
	The All-Star game's decline can be attributed to on-court issues, notably the
	lack of defense, leading to high-scoring but less competitive games. 
	Moreover, players' fear of injury, especially with load management considerations
	for the regular season and playoffs, has also reduced the game's intensity
	and showcase of their abilities.
</p>
<h1>
	Data and Resources
</h1>


<p>
	The data for this project has been sourced primarily from 
	<a href="https://www.basketball-reference.com/allstar/">Basketball Reference</a>
	, with the exception of the
	Fan Interest chart data. To ensure its suitability 
	for visualization purposes, we utilized SQL to process
	and transform the raw data. If you are interested in
	exploring the complete dataset, including both the raw
	and transformed versions, you can access it through this <a href="https://www.basketball-reference.com/allstar/">
	link</a>. <br> Should you have any inquiries or
	need further information regarding this subject, feel free 
	to reach out to me at <a href = "mailto: ahmedben@umich.edu">ahmedben@umich.edu</a>. I'd be happy to assist
	you with any questions you may have.
</p>

<div id="formulas">
	<h3 >
		Formulas
	</h3>
	
	<p> <b> Team Defensive Rating (Drtg): <a href="https://www.nbastuffer.com/analytics101/defensive-efficiency/">[1]</a> </b> devised by basketball statistician Dean Oliver, is a metric that
		 estimates a team's defensive efficiency and it's calculates as follows: </p>
		 <p style="text-align: center;"><b>DRtg</b> = 100 x (Points Allowed / (Total Possessions))
	
		<p> <b> Team Offensive Rating (Oftg): <a href="https://www.nbastuffer.com/analytics101/offensive-efficiency/"> [2]</a> </b> also devised by basketball statistician Dean Oliver, is a metric that
			estimates a team's offensive efficiency and it's calculates as follows: </p>
		<p style="text-align: center;" ><b>OFtg</b> = 100 x (Points Scored / (Total Possessions))
	
			<br> <br>where <br>
			
			<b>Total Possessions <a href="https://www.nbastuffer.com/analytics101/possession/"> [3]</a></b> = 0.96 x (Field Goal Attempts + Turnovers + 0.44 x Free Throw Attempts - Offensive Rebounds)</p>
	
</div>

<style>
	p{
		text-align: justify;
        font-family: Quicksand;
        color: #403F3E;
	}

	h1 , h3{
		font-family: Futura;
        color: #403F3E
	}

	a:hover {
		background-color: #4D6473;
		color: #D9D4CC
	}
	
</style>
