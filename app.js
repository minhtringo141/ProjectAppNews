'user strict';
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
// var url = 'http://vnexpress.net/tin-tuc/the-gioi';
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

var cb = function() {
    console.log("DONEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
}
async.eachSeries(config.VNEXPRESS, (itemCategory, nextAsync, cb) => {
    request(itemCategory.url, { timeout: 1500 }, function(err, response, body) {
        if (!err && response.statusCode == 200) {
            let $ = cheerio.load(body);
            var listItemLink = $('#col_1 #news_home li .block_image_news').toArray();
            async.eachSeries(listItemLink, (value, next) => {
                var imagesLinkList = [];
                if (itemCategory.name == 'KINH_DOANH' || itemCategory.name == 'GIAI_TRI' || itemCategory.name == 'THE_THAO' || itemCategory.name == 'GIA_DINH') {
                    var itemLink = value.children[1].children[0].next.attribs.href;
                    imagesLinkList.push(value.children[1].children[1].children[1].attribs.src);
                    console.log(itemLink, imagesLinkList);
                } else if (itemCategory.name == 'DU_LICH') {
                    var itemLink = value.children[1].children[0].next.attribs.href;
                    imagesLinkList.push(value.children[3].children[1].children[0].attribs.src);
                    console.log(itemLink, imagesLinkList);
                } else {
                    var itemLink = value.children[1].children[0].attribs.href;
                    imagesLinkList.push(value.children[3].children[0].next.children[0].attribs.src);
                    console.log(itemLink, imagesLinkList);
                }
                request(itemLink, { timeout: 1500 }, function(err, response, body) {
                    if (err) {
                        next();
                        return;
                    }
                    let $ = cheerio.load(body);
                    var content = $('.block_col_480 #left_calculator .Normal').text();
                    $(".block_col_480 #left_calculator .tplCaption tbody tr td img").each(function() {
                        imagesLinkList.push(this.attribs.src);
                    });
                    var title = $(".block_col_480 .title_news").text();
                    var subTitle = $(".block_col_480 .short_intro").text();
                    var uploadedTime = $(".block_col_480 .block_timer_share").text();

                    next();
                    // News.findOne({ itemLink: itemLink }).exec(function(err, data) {
                    //     if (data) {
                    //         console.log("Already in database !!!");
                    //         return;
                    //     } else {
                    //         var newNews = {
                    //                 itemLink: itemLink,
                    //                 imagesLinkList: imagesLinkList,
                    //                 content: content,
                    //                 title: title,
                    //                 subTitle: subTitle,
                    //                 uploadedTime: uploadedTime,
                    //                 sourceName: 'VNPEXRESS',
                    //                 sourceIconLink: 'https://lh5.ggpht.com/MZEFSBgwcY6x12AZq8buCsP3PBHDlkKm7PQDGvJr688Emz1GLbdfuQJ3RJzaJNni-A',
                    //                 category: itemCategory.name
                    //             }
                    //             // console.log(newNews);
                    //         News.create(newNews, function(err, data) {
                    //             console.log("Insert to database successfully !!!");
                    //         });
                    //     }
                    //     next();
                    // });
                });
            });
        } else {
            console.log('Request error : ', err);
        }
        nextAsync();
    });
})







// console.log(listItemLink[0].children[3].children[0].next.children[0].attribs.src) GET_THUMB


// News.findOne({ itemLink: itemLink }).exec(function(err, data) {
//     if (data) {
//         console.log("Already");
//         return;
//     } else {
//         var newNews = {
//             itemLink: value.children[1].children[0].attribs.href,
//             imagesLinkList: [listItemLink[0].children[3].children[0].next.children[0].attribs.src]
//         }
//         console.log(newNews);
//         News.create(newNews, function(err, data) {
//             console.log("OK");
//         });
//     }
// });