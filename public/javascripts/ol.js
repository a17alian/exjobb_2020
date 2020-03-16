$.ajax({
    url: "http://localhost:3000/data",
    type: 'GET',
    dataType: 'json', // added data type
    success: function(res) {
        generateMarkers(res);

    }
});

function generateMarkers(floods){
    for(var i = 0; i < 10; i ++){
        console.log(floods[i]);
    }
}