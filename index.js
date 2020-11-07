const svg = d3.select('svg');
const g = svg.append('g');

const eduUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const countyUrl = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath();

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
    console.log(counties.features[0]);



    g.selectAll('path')
      .data(counties.features)
      .enter()
      .append('path')
      .attr('class', 'county')
      .attr('d', pathGenerator)
      .attr('data-fips', d => d.id)
      .attr('data-education', function(d) {
        const result = eduData.filter(obj => {
          return obj.fips === d.id
        })
        if (result[0]) {
          return color(result[0].bachelorsOrHigher)
        }
        return 0;
        


      })




  })