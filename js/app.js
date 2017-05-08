var renderLocationInfo = function(){
    var teleportRootUrl     = 'https://api.teleport.org/api/cities/'
    var jobTerm             = $('.jobField').val();
    var stateTerm           = '%2C%20' + $('.stateField').val();
    var cityTerm            = $('.cityField').val();
    var searchCities        = '?search=' + cityTerm;
    var teleportSearchUrl   = teleportRootUrl + searchCities + stateTerm;

    $.getJSON(teleportSearchUrl, function(data){
        console.log(data);

        var infoLink        = data._embedded["city:search-results"][0]._links["city:item"].href;
        console.log(infoLink);

        $.getJSON(infoLink, function(uaObj){ 
            var urbanArea = uaObj._links["city:urban_area"].href;
            console.log(urbanArea); 
        });
    });
}



var renderJobs = function(){
    var rootUrl             = 'https://indeed-indeed.p.mashape.com/apisearch?publisher=4641674221339880';
    var jobTerm             = $('.jobField').val();
    var stateTerm           = $('.stateField').val();
    var cityTerm            = $('.cityField').val();
    var searchTerm          = '&q=' + jobTerm;
    var cityState           = '&l=' + stateTerm + '%2C+' + cityTerm;
    var requiredParams      = '&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2&format=json';
    var limit               = '&limit=25'
    var indeedSearchUrl     = rootUrl + searchTerm + cityState + requiredParams + limit;

    $.ajax({
        beforeSend: function(request) {
            request.setRequestHeader("X-Mashape-Key", 'rs6ki2x7VImshpEMNL1WrxVUeDPRp1klZZ2jsn6tXa0K7I8fOT');
        },
        dataType: "json",
        url: indeedSearchUrl,
        success: function(data) {
            console.log(data);
            $('.jobsBlock').append(data.results.map(function(job, index){
                
                return      '<div class="jobPost">' + 
                            '<p>' +
                            '<a href="' + 
                            data.results[index].url + 
                            '" target="_blank">' + 
                            data.results[index].jobtitle + 
                            '</a>' + ' - ' +
                            '<strong>' + data.results[index].company  + '</strong> <span>(' + data.results[index].formattedRelativeTime + ')</span><br>' +
                            data.results[index].formattedLocation + '<br>' +
                            data.results[index].snippet + '<br>' +
                            '</p>' +
                            '</div>';
            }));
        }
    });
}


 $(document).ready(function(){
     $('.jobsForm').submit(function(event){
        event.preventDefault();

        console.log("submit");

            $('.jobsBlock').show();
            $('.cityStateInfoBlock').show();
            renderJobs();
            // renderLocationInfo();
        if($('.jobsBlock').css('display') === 'none'){
        }
     });
 });
