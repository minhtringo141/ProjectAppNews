'user strict';
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var mongoose = require('mongoose');
var config = require('./config.js');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var http = require('http');
// CONFIG DATABASE=====================================================
mongoose.connect('mongodb://localhost/app_news');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error: '));
db.once('open', function() {
    console.log('DB connection success! ');
});
var Item = require('./api/items/items.model');
var ItemsHot = require('./api/items/itemsHot.model');
// ====================================================================
var cb = function() {
    console.log("DONEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
}

var app = express();
var server = http.createServer(app);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', require('./api/items'));
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'));
module.exports = app;

// VNEXPRESS ITEM NEWS CRAWLER
// async.eachSeries(config.VNEXPRESS, (itemCategory, nextAsync, cb) => {
//     request(itemCategory.url, { timeout: 1500 }, (err, response, body) => {
//         if (!err && response.statusCode == 200) {
//             let $ = cheerio.load(body);
//             var listItemLink = $('#col_1 #news_home li .block_image_news').toArray();
//             async.eachSeries(listItemLink, (value, next) => {
//                 if (itemCategory.name == 'KINH_DOANH' || itemCategory.name == 'GIAI_TRI' || itemCategory.name == 'THE_THAO' || itemCategory.name == 'GIA_DINH') {
//                     var itemLink = value.children[1].children[0].next.attribs.href;
//                     var imagesLinkList = new Array(value.children[1].children[1].children[1].attribs.src);
//                     console.log(itemLink, imagesLinkList);
//                 } else if (itemCategory.name == 'DU_LICH') {
//                     var itemLink = value.children[1].children[0].next.attribs.href;
//                     var imagesLinkList = new Array(value.children[3].children[1].children[0].attribs.src);
//                     console.log(itemLink, imagesLinkList);
//                 } else {
//                     var itemLink = value.children[1].children[0].attribs.href;
//                     var imagesLinkList = new Array(value.children[3].children[0].next.children[0].attribs.src);
//                     console.log(itemLink, imagesLinkList);
//                 }
//                 if (itemLink.includes('video')) {
//                     console.log('Link contain video, can not crawled!');
//                     next();
//                 } else {
//                     request(itemLink, { timeout: 1500 }, (err, response, body) => {
//                         if (err) {
//                             next();
//                             return;
//                         }
//                         let $ = cheerio.load(body);
//                         var content = $('.block_col_480 #left_calculator .Normal').text().split("\n\t");
//                         $(".block_col_480 #left_calculator .tplCaption tbody tr td img").each(function() {
//                             imagesLinkList.push(this.attribs.src);
//                         });
//                         var title = $(".block_col_480 .title_news").text();
//                         var subTitle = $(".block_col_480 .short_intro").text();
//                         var uploadedTime = $(".block_col_480 .block_timer_share").text();

//                         Item.findOne({ itemLink: itemLink }).exec(function(err, data) {
//                             if (data) {
//                                 console.log("Already in database !!!");
//                                 return;
//                             } else {
//                                 var newNews = {
//                                         itemLink: itemLink,
//                                         imagesLinkList: imagesLinkList,
//                                         content: content,
//                                         title: title,
//                                         subTitle: subTitle,
//                                         uploadedTime: uploadedTime,
//                                         sourceName: 'VNEXPRESS',
//                                         sourceIconLink: 'https://lh5.ggpht.com/MZEFSBgwcY6x12AZq8buCsP3PBHDlkKm7PQDGvJr688Emz1GLbdfuQJ3RJzaJNni-A',
//                                         category: itemCategory.name
//                                     }
//                                     // console.log(newNews);
//                                 Item.create(newNews, function(err, data) {
//                                     console.log("Insert to database successfully !!!");
//                                 });
//                             }
//                             next();
//                         });
//                     });
//                 }
//             });
//         } else {
//             console.log('Request error : ', err);
//         }
//         nextAsync();
//     });
// });


// VNEXPRESS HOT NEWS BY CATEGORY
// async.eachSeries(config.VNEXPRESS, (itemCategory, nextAsync, cb) => {

//     request(itemCategory.url, { timeout: 3000 }, (err, response, body) => {
//         if (!err && response.statusCode == 200) {
//             let $ = cheerio.load(body);
//             var listItemLink = $('#box_news_top .box_sub_hot_news .content_scoller ul li').toArray();
//             async.eachSeries(listItemLink, (value, next) => {
//                 console.log(itemCategory.name)
//                 if (itemCategory.name == 'KINH_DOANH' || itemCategory.name == 'GIAI_TRI' || itemCategory.name == 'THE_THAO' || itemCategory.name == 'GIA_DINH' || itemCategory.name == 'DU_LICH') {
//                     var imagesLinkList = new Array();
//                     var itemLink = value.children[1].children[1].attribs.href
//                 } else {
//                     var imagesLinkList = new Array(value.children[3].children[1].children[0].attribs.src);
//                     var itemLink = value.children[3].children[1].attribs.href;
//                 }
//                 if (itemLink.includes('video')) {
//                     console.log('Link contain video, can not crawled !');
//                     next();
//                 } else {
//                     request(itemLink, { timeout: 3000 }, (err, response, body) => {
//                         if (err) {
//                             next();
//                         }
//                         let $ = cheerio.load(body);
//                         var content = $('.block_col_480 #left_calculator .Normal').text().split("\n\t");
//                         $(".block_col_480 #left_calculator .tplCaption tbody tr td img").each(function() {
//                             imagesLinkList.push(this.attribs.src);
//                         });
//                         var title = $(".block_col_480 .title_news").text();
//                         var subTitle = $(".block_col_480 .short_intro").text();
//                         var uploadedTime = $(".block_col_480 .block_timer_share").text();

//                         ItemsHot.findOne({ itemLink: itemLink }).exec(function(err, data) {
//                             if (data) {
//                                 console.log("Already in database !!!");
//                                 return;
//                             } else {
//                                 var newNews = {
//                                     itemLink: itemLink,
//                                     imagesLinkList: imagesLinkList,
//                                     content: content,
//                                     title: title,
//                                     subTitle: subTitle,
//                                     uploadedTime: uploadedTime,
//                                     sourceName: 'VNEXPRESS',
//                                     sourceIconLink: 'https://lh5.ggpht.com/MZEFSBgwcY6x12AZq8buCsP3PBHDlkKm7PQDGvJr688Emz1GLbdfuQJ3RJzaJNni-A',
//                                     category: itemCategory.name
//                                 }
//                                 ItemsHot.create(newNews, function(err, data) {
//                                     console.log("Insert to database successfully !!!");
//                                 });
//                             }
//                             next();
//                         });
//                     });
//                 }
//             })
//         } else {
//             console.log('Request error : ', err);
//         }
//         nextAsync();
//     });
// });


// request('http://news.zing.vn/thoi-su.html', { timeout: 1500 }, (err, response, body) => {
//     if (!err && response.statusCode == 200) {
//         let $ = cheerio.load(body);
//         var listItemLink = $('.cate_content article').toArray();
//         async.eachSeries(listItemLink, (value, next) => {
//             var imagesLinkList = [];
//             var itemLink = 'http://news.zing.vn/' + value.children[3].children[1].attribs.href;
//             imagesLinkList.push(value.children[3].children[1].children[1].attribs.src);
//             console.log(value.children[3].children[1].children[1].attribs.src, "-------------------------------------- \n");
//             next();
//         })
//     } else {
//         console.log('Request error : ', err);
//     }
// })