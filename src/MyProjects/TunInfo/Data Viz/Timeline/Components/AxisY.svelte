<script>
	let yTicks = [2022, 2020, 2018, 2016, 2014, 2012, 2010, 2008, 2006, 2004, 2002, 2000, 1998, 1996, 1994, 1992, 1990, 1988, 1986, 1984, 1982, 1980, 1978, 1976, 1974, 1972, 1970, 1968, 1966, 1964, 1962, 1960, 1958];
	let yTicks_Odd = [
    2023, 2021, 2019, 2017, 2015, 2013, 2011, 2009, 2007, 2005, 
    2003, 2001, 1999, 1997, 1995, 1993, 1991, 1989, 1987, 1985, 
    1983, 1981, 1979, 1977, 1975, 1973, 1971, 1969, 1967, 1965, 
    1963, 1961, 1959]
	export let yScale;
	export let width;
// 	export let height;
</script>

<g>
{#each yTicks as tick}
	<text x="0"
				y={yScale(tick)}
				dy="-2"> {tick}</text>

<line x1='0'
				y1={yScale(tick)}
				x2={width}
				y2={yScale(tick)}
				stroke="#cecece" />
{/each}

{#each yTicks_Odd as tick}
<line x1='0'
				y1={yScale(tick)}
				x2={width}
				y2={yScale(tick)}
				stroke="#cecece"
				opacity="0.4"/>
{/each}
</g>

<style>
	text {
		font-family: Quicksand;
	}

</style>