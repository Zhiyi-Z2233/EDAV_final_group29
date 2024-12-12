// Inline data
    const data = [
      { year: 2015, boro: "Brooklyn", avg_score: 29 },
      { year: 2015, boro: "Manhattan", avg_score: 8.25 },
      { year: 2015, boro: "Queens", avg_score: 21 },
      { year: 2016, boro: "Bronx", avg_score: 11.8333 },
      { year: 2016, boro: "Brooklyn", avg_score: 11.8889 },
      { year: 2016, boro: "Manhattan", avg_score: 17.869 },
      { year: 2016, boro: "Queens", avg_score: 13.8375 },
      { year: 2016, boro: "Staten Island", avg_score: 9.1818 },
      { year: 2017, boro: "Bronx", avg_score: 20.7826 },
      { year: 2017, boro: "Brooklyn", avg_score: 18.1186 },
      { year: 2017, boro: "Manhattan", avg_score: 17.3301 },
      { year: 2017, boro: "Queens", avg_score: 11.9569 },
      { year: 2017, boro: "Staten Island", avg_score: 17.7576 },
      { year: 2018, boro: "Bronx", avg_score: 17.525 },
      { year: 2018, boro: "Brooklyn", avg_score: 19.831 },
      { year: 2018, boro: "Manhattan", avg_score: 16.5148 },
      { year: 2018, boro: "Queens", avg_score: 17.8576 },
      { year: 2018, boro: "Staten Island", avg_score: 19.8519 },
      { year: 2019, boro: "Bronx", avg_score: 24.2039 },
      { year: 2019, boro: "Brooklyn", avg_score: 25.9273 },
      { year: 2019, boro: "Manhattan", avg_score: 18.9486 },
      { year: 2019, boro: "Queens", avg_score: 18.0742 },
      { year: 2019, boro: "Staten Island", avg_score: 15.9701 },
      { year: 2020, boro: "Bronx", avg_score: 16.4 },
      { year: 2020, boro: "Brooklyn", avg_score: 27.9145 },
      { year: 2020, boro: "Manhattan", avg_score: 19.5831 },
      { year: 2020, boro: "Queens", avg_score: 24.4483 },
      { year: 2020, boro: "Staten Island", avg_score: 21.1429 },
      { year: 2021, boro: "Bronx", avg_score: 20.5578 },
      { year: 2021, boro: "Brooklyn", avg_score: 21.9886 },
      { year: 2021, boro: "Manhattan", avg_score: 20.4005 },
      { year: 2021, boro: "Queens", avg_score: 21.5256 },
      { year: 2021, boro: "Staten Island", avg_score: 17.1566 },
      { year: 2022, boro: "Bronx", avg_score: 20.0259 },
      { year: 2022, boro: "Brooklyn", avg_score: 21.4722 },
      { year: 2022, boro: "Manhattan", avg_score: 21.0413 },
      { year: 2022, boro: "Queens", avg_score: 21.5744 },
      { year: 2022, boro: "Staten Island", avg_score: 16.9673 },
      { year: 2023, boro: "Bronx", avg_score: 23.4268 },
      { year: 2023, boro: "Brooklyn", avg_score: 25.0217 },
      { year: 2023, boro: "Manhattan", avg_score: 24.1882 },
      { year: 2023, boro: "Queens", avg_score: 26.0298 },
      { year: 2023, boro: "Staten Island", avg_score: 22.5306 },
      { year: 2024, boro: "Bronx", avg_score: 25.3493 },
      { year: 2024, boro: "Brooklyn", avg_score: 27.9839 },
      { year: 2024, boro: "Manhattan", avg_score: 25.745 },
      { year: 2024, boro: "Queens", avg_score: 28.1502 },
      { year: 2024, boro: "Staten Island", avg_score: 24.0283 },
    ];

    const years = [...new Set(data.map(d => d.year))];
    const boroughs = [...new Set(data.map(d => d.boro))];

    const width = 800;
    const height = 600;
    const margin = { top: 40, right: 20, bottom: 50, left: 50 };

    const svg = d3.select("div#plot svg");
    const x = d3.scaleBand().range([margin.left, width - margin.right]).padding(0.2);
    const y = d3.scaleLinear().range([height - margin.bottom, margin.top]);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const sliderWidth = 800;
    const sliderHeight = 40;
    const sliderMargin = { left: 50, right: 50 };

    const sliderScale = d3.scaleLinear()
      .domain([d3.min(years), d3.max(years)])
      .range([sliderMargin.left, sliderWidth - sliderMargin.right])
      .clamp(true);

    const slider = d3.select("#slider")
      .append("g")
      .attr("transform", `translate(0,${sliderHeight / 2})`);

    slider.append("g")
      .call(d3.axisBottom(sliderScale).tickFormat(d3.format("d")).ticks(years.length))
      .attr("transform", "translate(0,10)");

    const handle = slider.append("circle")
      .attr("cx", sliderScale(years[0]))
      .attr("cy", 0)
      .attr("r", 8)
      .attr("fill", "steelblue")
      .call(d3.drag()
        .on("drag", (event) => {
          const year = Math.round(sliderScale.invert(event.x));
          if (years.includes(year)) {
            handle.attr("cx", sliderScale(year));
            drawChart(year);
          }
        }));

    const playButton = d3.select("#play-button");
    let playing = false;

    playButton.on("click", () => {
      if (playing) return;
      playing = true;
      let i = 0;
      const interval = setInterval(() => {
        if (i >= years.length) {
          clearInterval(interval);
          playing = false;
        } else {
          drawChart(years[i]);
          handle.attr("cx", sliderScale(years[i]));
          i++;
        }
      }, 1000);
    });

    function drawChart(selectedYear) {
      const yearData = data.filter(d => d.year === selectedYear);

      x.domain(yearData.map(d => d.boro));
      y.domain([0, d3.max(data, d => d.avg_score)]);

      svg.selectAll("*").remove();

      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

      svg.selectAll(".bar")
        .data(yearData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.boro))
        .attr("y", d => y(d.avg_score))
        .attr("width", x.bandwidth())
        .attr("height", d => height - margin.bottom - y(d.avg_score))
        .attr("fill", d => color(d.boro));
    }

    drawChart(years[0]);
