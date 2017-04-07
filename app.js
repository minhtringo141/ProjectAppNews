'user strict';
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var url = 'http://vnexpress.net/tin-tuc/the-gioi';
var mongoose = require('mongoose');
var config = require('./config.js');

//mongoose.connect('mongodb://admin:123456@ds151697.mlab.com:51697/techkids');
mongoose.connect('mongodb://localhost/app_news');
// mongoose.connect('mongodb://minhtringo141:Nhasotam328@ds155130.mlab.com:55130/project_app_news');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error: '));
db.once('open', function() {
    console.log('DB connection success! ');
});

var News = require('./server/news/news.model');

request(url, function(err, response, body) {
    if (!err && response.statusCode == 200) {
        let $ = cheerio.load(body);
        var listSourceLink = $('#col_1 #news_home li .block_image_news').toArray();
        async.eachSeries(listSourceLink, (value, next) => {
            var imagesLinkList = [];
            var sourceLink = value.children[1].children[0].attribs.href;
            imagesLinkList.push(value.children[3].children[0].next.children[0].attribs.src);
            request(sourceLink, function(err, response, body) {
                if (err) next(err);
                let $ = cheerio.load(body);
                var content = $('.block_col_480 #left_calculator .Normal').text();
                var x = $(".block_col_480 #left_calculator .tplCaption tbody tr td img").each(function() {
                    imagesLinkList.push(this.attribs.src);
                });
                var title = $(".block_col_480 .title_news").text();
                var subTitle = $(".block_col_480 .short_intro").text();
                var uploadedTime = $(".block_col_480 .block_timer_share").text();


                News.findOne({ sourceLink: sourceLink }).exec(function(err, data) {
                    if (data) {
                        console.log("Already in database !!!");
                        return;
                    } else {
                        var newNews = {
                            sourceLink: sourceLink,
                            imagesLinkList: imagesLinkList,
                            content: content,
                            title: title,
                            subTitle: subTitle,
                            uploadedTime: uploadedTime
                        }
                        console.log(newNews);
                        News.create(newNews, function(err, data) {
                            console.log("Insert to database successfully !!!");
                        });
                    }
                    next();
                });
            });
        })
    } else console.log('Request error : ', err);
})






// console.log(listSourceLink[0].children[3].children[0].next.children[0].attribs.src) GET_THUMB


// News.findOne({ sourceLink: sourceLink }).exec(function(err, data) {
//     if (data) {
//         console.log("Already");
//         return;
//     } else {
//         var newNews = {
//             sourceLink: value.children[1].children[0].attribs.href,
//             imagesLinkList: [listSourceLink[0].children[3].children[0].next.children[0].attribs.src]
//         }
//         console.log(newNews);
//         News.create(newNews, function(err, data) {
//             console.log("OK");
//         });
//     }
// });