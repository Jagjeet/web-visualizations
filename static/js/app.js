// Get the Roadster endpoint
const samples = "./samples.json";

// Fetch the JSON data and console log it
d3.json(samples).then(function(data) {
  console.log(data);

  // https://stackoverflow.com/questions/43121679/how-to-append-option-into-select-combo-box-in-d3
  let selector = d3.select("#selDataset");

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


  });

  data.names.forEach((name) => {
      selector
          .append("option")
          .text(name)
          .property("value", name);
  });


});
