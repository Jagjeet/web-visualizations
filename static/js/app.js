// Get the Roadster endpoint
const samples = "./samples.json";

// Fetch the JSON data and console log it
d3.json(samples).then(function(data) {
  console.log(data);

  // https://stackoverflow.com/questions/43121679/how-to-append-option-into-select-combo-box-in-d3
  let selector = d3.select("#selDataset");

  // Event listeners
  selector.on("change", function(){
    let dropdownMenu = d3.select("#selDataset");
    // Assign the value of the dropdown menu option to a variable
    let sampleName = dropdownMenu.property("value");
    console.log(`The dataset selected was for: ${sampleName}`);

    let sampleMetadata = data.metadata.filter(e => e.id.toString() === sampleName);
    console.log("Sample Metadata: ");
    console.log(sampleMetadata);
    let sampleSamples = data.samples.filter(e => e.id === sampleName);
    console.log("Sample Samples: ");
    console.log(sampleSamples);

    updateBarChart(sampleSamples[0]);
    updateBubbleChart(sampleSamples[0]);
    updateDemographicInfo(sampleMetadata[0]);

  });

  data.names.forEach((name) => {
      selector
          .append("option")
          .text(name)
          .property("value", name);
  });

  function initBarPlot() {
    let barData = [{
      x: data.samples[0].sample_values.slice(0, 10).reverse(),
      y: data.samples[0].otu_ids.map(e => `OTU ${e}`).slice(0, 10).reverse(),
      text: data.samples[0].otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: 'h'
    }];

    let layout = {
      height: 600,
      width: 600
    };

    Plotly.newPlot("bar", barData, layout);
  }

  // Function called by DOM changes
  function updateBarChart(sample) {
    let newBarData = {
      x: [sample.sample_values.slice(0, 10).reverse()],
      y: [sample.otu_ids.map(e => `OTU ${e}`).slice(0, 10).reverse()],
      text: [sample.otu_labels.slice(0, 10).reverse()],
      type: "bar",
      orientation: 'h'
    };

    Plotly.restyle("bar", newBarData);
  }

  function initBubblePlot() {
    // Create a bubble chart that displays each sample.
    // Use otu_ids for the x values.
    // Use sample_values for the y values.
    // Use sample_values for the marker size.
    // Use otu_ids for the marker colors.
    // Use otu_labels for the text values.

    let trace1 = {
      x: data.samples[0].otu_ids,
      y: data.samples[0].sample_values,
      mode: 'markers',
      marker: {
        size: data.samples[0].sample_values,
        color: data.samples[0].otu_ids,
      },
      text: data.samples[0].otu_labels
    };

    let bubbleData = [trace1];

    let layout = {
      title: `OTU IDs Vs Sample Values`,
      showlegend: false,
      height: 600,
      width: 1200,
      xaxis: {
        title: {
          text: 'OTU IDs',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Sample Values',
          font: {
            family: 'Courier New, monospace',
            size: 18,
            color: '#7f7f7f'
          }
        }
      }
    };

    Plotly.newPlot("bubble", bubbleData, layout);
  }

  function initDemographicInfo() {
    let metadataSelector = d3.select("#sample-metadata");

    // https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
    for (const [key, value] of Object.entries(data.metadata[0])) {
      console.log(key, value);
      metadataSelector
          .append("p")
          .text(`${key}: ${value}`);
    }
  }

  function updateDemographicInfo(metadata) {
    let metadataSelector = d3.select("#sample-metadata");

    metadataSelector.selectAll("p").remove();
    // https://stackoverflow.com/questions/34913675/how-to-iterate-keys-values-in-javascript
    for (const [key, value] of Object.entries(metadata)) {
      console.log(key, value);
      metadataSelector
          .append("p")
          .text(`${key}: ${value}`);
    }
  }


  // Function called by DOM changes
  function updateBubbleChart(sample) {
    let newBubbleData = {
      x: [sample.otu_ids],
      y: [sample.sample_values],
      mode: 'markers',
      marker: [{
        size: sample.sample_values,
        color: sample.otu_ids,
      }],
      text: [sample.otu_labels]
    };

    Plotly.restyle("bubble", newBubbleData);
  }

  initBarPlot();
  initBubblePlot();
  initDemographicInfo();

});
