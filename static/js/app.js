
function init(){
    var dropdownMenu = d3.select("#selDataset");
    d3.json("samples.json").then(function(data){
    //init() will add to the dropdown menu and also start drawing the plots
    var names = data.names
    var metadata = data.metadata
    var samples = data.samples
    names.forEach((sampleName) => {
        dropdownMenu.append("option").text(sampleName)
    })
    //Create initial Demographic Info
    initial_sample_metadata = metadata[0]
    createDemographics(initial_sample_metadata)

    //Create initial Bar Graph
    initial_sample_barGraph = samples[0]
    console.log(initial_sample_barGraph)
    var xvalues = initial_sample_barGraph.sample_values.slice(0,10).reverse()
    var yvalues = initial_sample_barGraph.otu_ids.slice(0,10).reverse()
    yvalues = yvalues.map(x => `OTU ${x}`)
    var labeltexts = initial_sample_barGraph.otu_labels.slice(0, 10).reverse()

    var barData = [{
        type: 'bar',
        x: xvalues,
        y: yvalues,
        text: labeltexts,
        orientation: 'h'
    }];
    Plotly.newPlot("bar", barData)
    
    //Create initial Bubble Graph
    initial_sample_BubbleGraph = samples[0]
    var bubbleData = [{
        mode: "markers",
        x: initial_sample_BubbleGraph.otu_ids,
        y: initial_sample_BubbleGraph.sample_values,
        marker: {
            color: initial_sample_BubbleGraph.otu_ids,
            size: initial_sample_BubbleGraph.sample_values
        },
        text: initial_sample_BubbleGraph.otu_labels
    }];
    Plotly.newPlot("bubble", bubbleData)


});
}

function createDemographics(sample){
    var sample_info = d3.select("#sample-metadata")
    sample_info.html("")
    Object.entries(sample).forEach(([key, value]) => sample_info.append("h6").text(`${key}: ${value}`))
}

function updateBarGraph(sample){
    var graph_position = d3.selectAll("#bar").node()
    var new_x = sample.sample_values.slice(0,10).reverse()
    var new_y = sample.otu_ids.slice(0,10).reverse()
    new_y = new_y.map(x => `OTU ${x}`)
    var new_labels = sample.otu_labels.slice(0, 10).reverse()

    Plotly.restyle(graph_position , "x", [new_x])
    Plotly.restyle(graph_position , "y", [new_y])
    Plotly.restyle(graph_position , "text", [new_labels])
}

function updateBubbleGraph(sample){
    var graph_position = d3.selectAll("#bubble").node()

    Plotly.restyle(graph_position, "x", [sample.otu_ids])
    Plotly.restyle(graph_position, "y", [sample.sample_values])
    Plotly.restyle(graph_position, "text", [sample.otu_labels])
    Plotly.restyle(graph_position, "marker", [{color : sample.otu_ids, size: sample.sample_values}])
    
}

function optionChanged(value) {
    console.log(value)
    //Get new sample data, from json file, and store neccessary data
    d3.json("samples.json").then(function(data){
        var allSamples = data.samples
        var graphData = allSamples.filter(sampleData => sampleData.id == value)[0]

        var allMetadata = data.metadata
        var newMetadata = allMetadata.filter(sampleData => sampleData.id == value)[0]
        console.log(graphData)
        console.log(newMetadata)
    //Change Demographics and Plots to sample
    createDemographics(newMetadata)
    updateBarGraph(graphData)
    updateBubbleGraph(graphData)
    })
}
init();


