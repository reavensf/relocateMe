// var renderLocationInfo = function(){
//     var teleportRootUrl     = 'https://api.teleport.org/api/cities/'
//     var jobTerm             = $('.jobField').val();
//     var stateTerm           = '%2C%20' + $('.stateField').val();
//     var cityTerm            = $('.cityField').val();
//     var searchCities        = '?search=' + cityTerm;
//     var teleportSearchUrl   = teleportRootUrl + searchCities + stateTerm;


//     // var qualityOfLife

//     $.getJSON(teleportSearchUrl, function(data){
//         console.log(data);

//         var infoLink        = data._embedded["city:search-results"][0]._links["city:item"].href;
//         console.log(infoLink);

//         $.getJSON(infoLink, function(uaObj){ 
//             var urbanArea = uaObj._links["city:urban_area"].href;
//             console.log(urbanArea); 
//         });
//     });
// }



var renderJobs = function(){
    var rootUrl             = 'http://api.indeed.com/ads/apisearch?publisher=4641674221339880';
    var jobTerm             = $('.jobField').val();
    var stateTerm           = $('.stateField').val();
    var cityTerm            = $('.cityField').val();
    var searchTerm          = '&q=' + jobTerm;
    var cityState           = '&l=' + stateTerm + '%2C+' + cityTerm;
    var requiredParams      = '&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2&format=json';
    var limit               = '&limit=25'
    var indeedSearchUrl     = rootUrl + searchTerm + cityState + requiredParams + limit;


    $.getJSON(indeedSearchUrl, function(indeed){
        // console.log(indeed.results[0].jobtitle);
        
        $('.jobsBlock ul').html(indeed.results.map(function(job, index){
            
            return      '<li>' + 
                        '<a href="' + 
                        indeed.results[index].url + 
                        '" target="_blank">' + 
                        indeed.results[index].jobtitle + 
                        '</a></li>';
        }));
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
