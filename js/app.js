var renderLocationInfo = function(){
    var teleportRootUrl     = 'https://api.teleport.org/api/cities/'
    var jobTerm             = $('.jobField').val();
    var stateTerm           = '%2C%20' + $('.stateField').val();
    var cityTerm            = $('.cityField').val();
    var searchCities        = '?search=' + cityTerm;
    var teleportSearchUrl   = teleportRootUrl + searchCities + stateTerm;

    $.getJSON(teleportSearchUrl, function(data){
        var cityInfoLink        = data._embedded["city:search-results"][0]._links["city:item"].href;
        // console.log(cityInfoLink);

        $.getJSON(cityInfoLink, function(infoObj){ 
            // console.log(infoObj); 
            var urbanArea = infoObj._links["city:urban_area"].href;

            $.getJSON(urbanArea, function(urbanAreaObj){
                // console.log(urbanAreaObj); 
                $('.cityStateInfoBlock h2 .cityName').html(urbanAreaObj.full_name);

                var uaScores = urbanAreaObj._links["ua:scores"].href;
                $.getJSON(uaScores, function(scoresOdj){
                    $('.summary').html(scoresOdj.summary);

                    $('.qualityOfLifeScores').html(scoresOdj.categories.map(function(scoreCat, index){
                        var score = Math.round(scoresOdj.categories[index].score_out_of_10);

                        if(score === 1){
                            return      '<div class="scoreCategory">' +
                                        '<h3 class="categoryTitle">' + scoresOdj.categories[index].name + '</h3>' +
                                        '<div class="scoreMeterBkg">' + '<div class="scoreMeter tenPercent" style="background-color: ' + scoresOdj.categories[index].color + ';">' + 
                                        '<p class="score">' + score + '</p>' +
                                        '</div></div>';
                        } else if (score === 2){
                            return      '<div class="scoreCategory">' +
                                        '<h3 class="categoryTitle">' + scoresOdj.categories[index].name + '</h3>' +
                                        '<div class="scoreMeterBkg">' + '<div class="scoreMeter twentyPercent" style="background-color: ' + scoresOdj.categories[index].color + ';">' + 
                                        '<p class="score">' + score + '</p>' +
                                        '</div></div>';
                        } else if (score === 3){
                            return      '<div class="scoreCategory">' +
                                        '<h3 class="categoryTitle">' + scoresOdj.categories[index].name + '</h3>' +
                                        '<div class="scoreMeterBkg">' + '<div class="scoreMeter thirtyPercent" style="background-color: ' + scoresOdj.categories[index].color + ';">' + 
                                        '<p class="score">' + score + '</p>' +
                                        '</div></div>';
                        } else if (score === 4){
                            return      '<div class="scoreCategory">' +
                                        '<h3 class="categoryTitle">' + scoresOdj.categories[index].name + '</h3>' +
                                        '<div class="scoreMeterBkg">' + '<div class="scoreMeter fourtyPercent" style="background-color: ' + scoresOdj.categories[index].color + ';">' + 
                                        '<p class="score">' + score + '</p>' +
                                        '</div></div>';
                        } else if (score === 5){
                            return      '<div class="scoreCategory">' +
                                        '<h3 class="categoryTitle">' + scoresOdj.categories[index].name + '</h3>' +
                                        '<div class="scoreMeterBkg">' + '<div class="scoreMeter fiftyPercent" style="background-color: ' + scoresOdj.categories[index].color + ';">' + 
                                        '<p class="score">' + score + '</p>' +
                                        '</div></div>';
                        } else if (score === 6){
                            return      '<div class="scoreCategory">' +
                                        '<h3 class="categoryTitle">' + scoresOdj.categories[index].name + '</h3>' +
                                        '<div class="scoreMeterBkg">' + '<div class="scoreMeter sixtyPercent" style="background-color: ' + scoresOdj.categories[index].color + ';">' + 
                                        '<p class="score">' + score + '</p>' +
                                        '</div></div>';
                        } else if (score === 7){
                            return      '<div class="scoreCategory">' +
                                        '<h3 class="categoryTitle">' + scoresOdj.categories[index].name + '</h3>' +
                                        '<div class="scoreMeterBkg">' + '<div class="scoreMeter seventyPercent" style="background-color: ' + scoresOdj.categories[index].color + ';">' + 
                                        '<p class="score">' + score + '</p>' +
                                        '</div></div>';
                        } else if (score === 8) {
                            return      '<div class="scoreCategory">' +
                                        '<h3 class="categoryTitle">' + scoresOdj.categories[index].name + '</h3>' +
                                        '<div class="scoreMeterBkg">' + '<div class="scoreMeter eightyPercent" style="background-color: ' + scoresOdj.categories[index].color + ';">' + 
                                        '<p class="score">' + score + '</p>' +
                                        '</div></div>';
                        } else if (score === 9){
                            return      '<div class="scoreCategory">' +
                                        '<h3 class="categoryTitle">' + scoresOdj.categories[index].name + '</h3>' +
                                        '<div class="scoreMeterBkg">' + '<div class="scoreMeter ninetyPercent" style="background-color: ' + scoresOdj.categories[index].color + ';">' + 
                                        '<p class="score">' + score + '</p>' +
                                        '</div></div>';
                        } else if (score === 10){
                            return      '<div class="scoreCategory">' +
                                        '<h3 class="categoryTitle">' + scoresOdj.categories[index].name + '</h3>' +
                                        '<div class="scoreMeterBkg">' + '<div class="scoreMeter oneHundredPercent" style="background-color: ' + scoresOdj.categories[index].color + ';">' + 
                                        '<p class="score">' + score + '</p>' +
                                        '</div></div>';
                        }
                    }));
                });

                var uaDetails = urbanAreaObj._links["ua:details"].href;
                $.getJSON(uaDetails, function(detailsOdj){

                });

                var uaImages = urbanAreaObj._links["ua:images"].href;
                $.getJSON(uaImages, function(imagesOdj, index){
                    console.log(imagesOdj.photos[0].image.mobile);
                    
                    // $('body').css('background-image', 'url(' + imagesOdj.photos[0].image.mobile + ')');
                });

                var uaSalaries = urbanAreaObj._links["ua:salaries"].href;
                $.getJSON(uaSalaries, function(salariesOdj){

                });

            });
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
            // console.log(data);
            $('.jobsBlock .jobResults').html(data.results.map(function(job, index){
                
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
            renderLocationInfo();
     });
 });
