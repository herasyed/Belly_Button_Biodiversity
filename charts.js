function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;
    console.log(sampleData)
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var chartsArray = sampleData.filter(sampleObj => sampleObj.id == sample);
    console.log(chartsArray);
    //  5. Create a variable that holds the first sample in the array.
    var chart = chartsArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = chart.otu_ids;
    var labels = chart.otu_labels;
    var sampleValues = chart.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = ids.slice(0,10).map(OTU => "OTU " + OTU).reverse();

    // 8. Create the trace for the bar chart. 
    var trace = {
      type: "bar",
      text: labels.slice(0,10).reverse(),
      x: sampleValues.slice(0,10).reverse(),
      y: yticks,
      orientation: 'h'
    };
    
    var barData = [trace];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      width: 600, 
      height: 450, 
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar',barData, barLayout);


    // Deliverable 2
    // 1. Create the trace for the bubble chart.
    var trace2 = {
      x: ids,
      y: sampleValues,
      mode: 'markers',
      hovermode: labels,
      marker: {
        size: sampleValues,
        color: ids,
      }
    };
    
    var bubbleData = [trace2];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      showlegend: false,
      width: 1200, 
      height: 550, 
      xaxis: {title:"OTU ID"},
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // Deliverable 3

    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var wFreq = result.wfreq;
    console.log(wFreq);

    // 4. Create the trace for the gauge chart.
    var trace3 = {
      value: wFreq,
      title: {text: "Bellybutton Washing Frequency per Week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [0, 10], tickwidth: 2, tickcolor: "black" },
        bar: { color: "black" },
        steps: [
          {range: [0, 2], color: "red" },
          {range: [2, 4], color: "orange" },
          {range: [4, 6], color: "yellow"},
          {range: [6, 8], color: "yellowgreen"},
          {range: [8, 10], color: "green"}],
      }
    };
    
    var gaugeData = [trace3];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 600, height: 500, margin: { t: 0, b: 0 } };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
};
