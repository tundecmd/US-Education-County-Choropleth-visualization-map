const svg = d3.select('svg');
const g = svg.append('g');

const eduUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const countyUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

const pathGenerator = d3.geoPath();

var tooltip = svg
      .append('div')
      .attr('class', 'tooltip')
      .attr('id', 'tooltip')
      .style('opacity', 0);

var color = d3
  .scaleThreshold()
  .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
  .range(d3.schemeCategory10[9]);

g.append('path')
  .attr('class', 'sphere')
  .attr('d', d  => pathGenerator(d))

d3.queue()
  .defer(d3.json, countyUrl)
  .defer(d3.json, eduUrl)
  .await(function ready(error, countyData, eduData) {
    if (error) {
      throw error
    }
    //console.log(countyData.objects.counties);
    const counties = topojson.feature(countyData, countyData.objects.counties);
    console.log(eduData[0].area_name)
    const countyName = eduData.reduce((acc, d) => {
      acc[d.area_name] = d.area_name
      return acc;
    }, {})



    g.selectAll('path')
      .data(counties.features)
      .enter()
      .append('path')
      .attr('class', 'county')
      .attr('d', pathGenerator)
      .append('title')
      .text(d => {
        const result = eduData.filter((obj) => {
          return obj.fips === d.id
        })
        //console.log(result[0])
        if (result[0]) {
          return (
            result[0].area_name + 
            ', ' + 
            result[0].state + 
            ', ' + 
            result[0].bachelorsOrHigher +
            '%'
          )
        }
      })
      




  })