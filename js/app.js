var clearLocationContent = function(){
    $('.summary').html('');
    $('.qualityOfLifeScores').html('');
    $('.qualityOfLifeHeader').html('');
    $('.costOfLivingHeader').html('');    
    $('.costOfLivingSection').html('');
    $('.housingHeader').html('');
    $('.housingSection').html('');
    $('.educationHeader').html('');
    $('.educationSection').html('');
    $('.trafficHeader').html('');
    $('.trafficSection').html('');
}

var renderLocationInfo = function(location){
    var teleportRootUrl     = 'https://api.teleport.org/api/cities/'
    var jobTerm             = $('.jobField').val();
    // var stateTerm           = '%2C%20' + $('.stateField').val();
    var cityTerm            = location;
    var searchCities        = '?search=' + cityTerm;
    var teleportSearchUrl   = teleportRootUrl + searchCities;
    //show loading bar
    $('.location.loadingIcon').show();
    //hide Content
    $('.cityStateInfoBlock').hide();
    $.getJSON(teleportSearchUrl, function(data){
        var cityInfoLink = data._embedded["city:search-results"][0]._links["city:item"].href;


        $.getJSON(cityInfoLink, function(infoObj){ 
            
            if(!(['city:urban_area'] in infoObj._links)){
                //hide loading bar
                $('.location.loadingIcon').hide();
                //show content
                $('.cityStateInfoBlock').show();

                clearLocationContent();
                $('.cityStateInfoBlock h2.cityStateInfoBlockTitle').html('<span class="cityName">' + infoObj.name + '</span> isn\'t a Teleport City yet...<br><span class="footnote">(Powered by: Teleport.org)</span>');
                
            } else {
                var urbanArea = infoObj._links["city:urban_area"].href;
            }

            $.getJSON(urbanArea, function(urbanAreaObj){
                $('.cityStateInfoBlock h2.cityStateInfoBlockTitle').html('<span class="cityName">' + urbanAreaObj.full_name + '</span> Details<br><span class="footnote">(Powered by: Teleport.org)</span>');

                var uaScores = urbanAreaObj._links["ua:scores"].href;
                $.getJSON(uaScores, function(scoresOdj){
                    $('.summary').html(scoresOdj.summary);

                    $('.qualityOfLifeScores').html(scoresOdj.categories.map(function(scoreCat, index){
                        var score = Math.round(scoresOdj.categories[index].score_out_of_10);
                        var scoreClass = getPercentClass(score);

                        $('.qualityOfLifeHeader').html('<i class="fa fa-trophy" aria-hidden="true"></i> Quality of Life Scores <br><span class="footnote">(scores out of 10)</span>');

                            return      '<div class="scoreCategory clearfix">' +
                                        '<h3 class="scoreCategoryTitle left">' + scoresOdj.categories[index].name + '</h3>' +
                                        '<div class="scoreMeterBkg right">' + '<div class="scoreMeter ' + scoreClass +' " style="background-color: ' + scoresOdj.categories[index].color + ';">' + 
                                        '<p class="score">' + score + '</p>' +
                                        '</div></div>';
                    }));
                    
                });

                var getPercentClass = function(score){
                    switch (score) {
                        case 0:
                            return "zeroPercent"
                        case 1:
                            return "tenPercent"
                        case 2:
                            return "twentyPercent"
                        case 3:
                            return "thirtyPercent"
                        case 4:
                            return "fortyPercent"
                        case 5:
                            return "fiftyPercent"
                        case 6:
                            return "sixtyPercent"
                        case 7:
                            return "seventyPercent"
                        case 8:
                            return "eightyPercent"
                        case 9:
                            return "ninetyPercent"
                        case 10:
                            return "oneHundredPercent"
                    }
                }
                var uaDetails = urbanAreaObj._links["ua:details"].href;
                $.getJSON(uaDetails, function(detailsOdj){
                    detailsOdj.categories.map(function(scoreType, index){

                        var getScoreData = function(scoreType){
                            var renderCostOfLiving = function(){
                                $('.costOfLivingHeader').html('<i class="fa fa-money" aria-hidden="true"></i> ' + scoreType.label);
                                    
                                $('.costOfLivingSection').html(scoreType.data.map(function(colCategories){
                                    var currencyAndFloatHandler = function(colCategories, index){
                                        if (colCategories.id === 'CONSUMER-PRICE-INDEX-TELESCORE'){
                                            return colCategories.float_value.toFixed(2)
                                        } else {
                                            return '$' + colCategories.currency_dollar_value.toFixed(2)
                                        }
                                    }
                                    var currencyOrFloat = currencyAndFloatHandler(colCategories);

                                    return      '<div class="categoryItem clearfix">' +
                                                '<p class="categoryTitle left">' + colCategories.label + '</p>' +
                                                '<p class="categoryDollarAmount right">' + currencyOrFloat + '</p>' +
                                                '</div>'
                                    }).sort());
                                }

                                var renderHousing = function(){
                                    $('.housingHeader').html('<i class="fa fa-home" aria-hidden="true"></i> ' + scoreType.label);
                                    $('.housingSection').html(scoreType.data.map(function(housingCategories){
                                        if(housingCategories.id === 'APARTMENT-RENT-SMALL' || housingCategories.id === 'APARTMENT-RENT-MEDIUM' || housingCategories.id === 'APARTMENT-RENT-LARGE'){
                                            return      '<div class="categoryItem clearfix">' +
                                                        '<p class="categoryTitle left">' + housingCategories.label + '</p>' +
                                                        '<p class="categoryDollarAmount right">$' + housingCategories.currency_dollar_value + '</p>' +
                                                        '</div>' 
                                        } 
                                    }).sort());
                                }

                                var renderEducation = function(){
                                    $('.educationHeader').html('<i class="fa fa-graduation-cap" aria-hidden="true"></i> ' + scoreType.label);
                                    $('.educationSection').html(scoreType.data.map(function(eduCategories){
                                        if(eduCategories.id === 'UNIVERSITIES-BEST-RANKED-NAME'){
                                            return      '<div class="categoryItem clearfix">' +
                                                        '<p class="categoryTitle left">' + eduCategories.label + '</p>' +
                                                        '<p class="categoryDollarAmount right">' + eduCategories.string_value + '</p>' +
                                                        '</div>' 
                                        } else if (eduCategories.id === 'UNIVERSITIES-BEST-RANKED-RANK') {
                                            return      '<div class="categoryItem clearfix">' +
                                                        '<p class="categoryTitle left">' + eduCategories.label + '</p>' +
                                                        '<p class="categoryDollarAmount right">' + eduCategories.int_value + '</p>' +
                                                        '</div>' 
                                        } else if (eduCategories.id === 'PISA-DETAIL-HAPPINESS'){
                                            return      '<div class="categoryItem clearfix">' +
                                                        '<p class="categoryTitle left">' + eduCategories.label + '</p>' +
                                                        '<p class="categoryDollarAmount right">' + eduCategories.percent_value.toFixed(2) + '%</p>' +
                                                        '</div>' 
                                        }
                                    }).sort());
                                }

                                var renderTraffic = function(){
                                    $('.trafficHeader').html('<i class="fa fa-bus" aria-hidden="true"></i> ' + scoreType.label);
                                    $('.trafficSection').html(scoreType.data.map(function(trafficCategories){
                                        if(trafficCategories.id === 'TRAFFIC-INDEX-TELESCORE'){
                                            return      '<div class="categoryItem clearfix">' +
                                                        '<p class="categoryTitle left">' + trafficCategories.label + '</p>' +
                                                        '<p class="categoryDollarAmount right">' + trafficCategories.float_value.toFixed(2) + '</p>' +
                                                        '</div>' 
                                        }
                                    }));
                                }

                                switch (scoreType.id){
                                    case "COST-OF-LIVING":
                                        renderCostOfLiving();
                                    case "EDUCATION":
                                        renderEducation();
                                    case "HOUSING":
                                        renderHousing();
                                    case "TRAFFIC":
                                        renderTraffic();
                                } // end switch
                        } // end getScoreData
                        getScoreData(scoreType);
                    });
                });

                // var uaImages = urbanAreaObj._links["ua:images"].href;
                // $.getJSON(uaImages, function(imagesOdj, index){
                //     console.log(imagesOdj.photos[0].image.mobile);
                    
                //     // $('body').css('background-image', 'url(' + imagesOdj.photos[0].image.mobile + ')');
                // });

                // var uaSalaries = urbanAreaObj._links["ua:salaries"].href;
                // $.getJSON(uaSalaries, function(salariesOdj){

                // });

                //hide loading bar
                $('.location.loadingIcon').hide();
                //show content
                $('.cityStateInfoBlock').show();

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
    var cityState           = '&l=' + cityTerm;
    var requiredParams      = '&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2&format=json';
    var limit               = '&limit=10'
    var indeedSearchUrl     = rootUrl + searchTerm + cityState + requiredParams + limit;

    // show loading bar
    $('.loadingIcon.jobs').show();
    //hide Content
    $('.jobsBlock').hide();

    $.ajax({
        beforeSend: function(request) {
            request.setRequestHeader("X-Mashape-Key", 'rs6ki2x7VImshpEMNL1WrxVUeDPRp1klZZ2jsn6tXa0K7I8fOT');
        },
        dataType: "json",
        url: indeedSearchUrl,
        success: function(data) {
            // console.log(data);
            $('.jobsBlock .jobResults').html(data.results.map(function(job, index){
                
                return      '<a href="' + data.results[index].url + '" target="_blank">' + 
                            '<div class="jobPost clearfix"> <i class="fa fa-external-link iconColor right" aria-hidden="true"></i>' +
                            '<h3>' + data.results[index].jobtitle + '</h3>' +
                            '<p> <strong>' + data.results[index].company  + '</strong> - ' +
                            data.results[index].formattedLocation + '<br>' +
                            data.results[index].snippet + '</p>' +
                            '<p class="footnote right">' + data.results[index].formattedRelativeTime + '</p>' +
                            '</div></a>';
            }));
            $('.totalJobs').html('Total Number of Jobs: ' + data.totalResults);

            //hide loading bar
            $('.loadingIcon.jobs').hide();
            //show content
            $('.jobsBlock').show();
        }
    });
}

var showResultsHandler = function(){
    $('.welcomeText').fadeOut(300);
    $('.welcomeWrapper').css({height: 'auto'});
    $('main').css({ height: '5%' });
    $('.jobSearchForm').removeClass('onWelcomeScreen');

    setTimeout(function(){
        $('main').css({
            display: 'block',
            height: 'auto',
        });

        $('.welcomeWrapper').css({display: 'block'})
        $('.resultsWrapper').show();
        renderJobs();
        renderLocationInfo(searchName);
        
    }, 700);

}


 var searchName;
 $(document).ready(function(){
     $('body').vegas({
        delay: 15000,
        transitionDuration: 2000,
        shuffle: true,
        timer: false,
        overlay: 'js/vegas/overlays/05.png',
        slides: [
            { src: 'images/wallup-28399.jpg' },
            { src: 'images/wallup-331202.jpg' },
            { src: 'images/wallup-387707.jpg' },
            { src: 'images/wallup-387705.jpg' }
        ]
    });
    TeleportAutocomplete.init('.cityField').on('change', function(locationObj) { 
        searchName = locationObj.title; 
        console.log(locationObj);
        console.log(searchName);
    }); 

    $('.jobSearchForm').submit(function(event){
        event.preventDefault();

        if ($('.jobField').val() != 'undefined' && !$('.cityField').val() != 'undefined' && !$('.stateField').val() != 'undefined') {
            console.log("submit");
            console.log(searchName);
            showResultsHandler();
        } 
     });
 });
