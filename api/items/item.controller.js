'use strict';
var _ = require('lodash');
var async = require('async');
var ForecastIo = require('forecastio');

var User = require('./user.model');
var Item = require('./item.model');
var itemByRegion = require('./itemByRegion.model');
var SavedItem = require('./savedItem.model');
var Favourite = require('./favourite.model');
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = {
    findAllNews: function(req, res) {
        Item.find({ isHot: 0 }).sort('-createdTime').exec(function(err, data) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            res.json(data);
        });
    },
    findHotNews: function(req, res) {
        Item.find({ isHot: 1 }).sort('-createdTime').exec(function(err, data) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            res.json(data);
        });
    },
    findHotestNews: function(req, res) {
        Item.find({ isHot: 2 }).sort('-createdTime').exec(function(err, data) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            res.json(data);
        });
    },
    homepage: function(req, res) {
        var dataHomepage = {
            status: 1,
            msg: "xxxx",
            data: {
                hotNews: [],
                highlights: [],
                newsByRegion: []
            },
            weather: {}
        };
        Item.find({ isHot: 1, content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(5).exec(function(err, data) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            dataHomepage.data.hotNews = data;
            Item.find({ isHot: 2, content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(5).exec(function(err, dataX) {

                if (err) {
                    console.log('Error in get all from database', err);
                    res.send(err);
                }
                var temppp = [];
                Favourite.find().exec(function(err, dataR) {
                    if (!_.isEmpty(dataR)) {
                        async.each(dataR, (value, next) => {
                            Item.find({ category: value.category, content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(10).exec(function(err, data) {
                                data.forEach(function(val) {
                                    temppp.push(val);
                                })
                                next();
                            });
                        }, function(err) {
                            var zzz = [];
                            for (var i = 0; i < 5; i++) {
                                var rand = Math.floor((Math.random() * temppp.length));
                                dataHomepage.data.highlights.push(temppp[rand])
                            }
                            itemByRegion.find({ content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(5).exec(function(err, data) {
                                if (err) {
                                    console.log('Error in get all from database', err);
                                    res.send(err);
                                }
                                dataHomepage.data.newsByRegion = data;
                                var forecastIo = new ForecastIo('8984a9dcf9d22fb45e95250c7fe0900f');
                                var options = {
                                    units: 'si',
                                    exclude: 'hourly,flags'
                                };
                                forecastIo.forecast('21.036237', '105.790583', options).then(function(data) {
                                    delete data.currently.windBearing;
                                    async.eachSeries(data.daily.data, (value, next) => {
                                        delete value.windBearing;
                                        next();
                                    }, (err) => {
                                        dataHomepage.weather = data;
                                        res.json(dataHomepage);
                                    });
                                });
                            });

                        });
                    } else {
                        dataHomepage.data.highlights = dataX;
                        itemByRegion.find({ content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(5).exec(function(err, data) {
                            if (err) {
                                console.log('Error in get all from database', err);
                                res.send(err);
                            }
                            dataHomepage.data.newsByRegion = data;
                            var forecastIo = new ForecastIo('8984a9dcf9d22fb45e95250c7fe0900f');
                            var options = {
                                units: 'si',
                                exclude: 'hourly,flags'
                            };
                            forecastIo.forecast('21.036237', '105.790583', options).then(function(data) {
                                delete data.currently.windBearing;
                                async.eachSeries(data.daily.data, (value, next) => {
                                    delete value.windBearing;
                                    next();
                                }, (err) => {
                                    dataHomepage.weather = data;
                                    res.json(dataHomepage);
                                });
                            });
                        });
                    }
                });

            });
        });
    },
    findByCategory: function(req, res) {
        var dataHomepage = {
            status: 1,
            msg: "xxxx",
            data: []
        };
        Item.find({ category: req.params.name, content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            dataHomepage.data = dataR;
            res.json(dataHomepage);
        });
    },
    findByRegion: function(req, res) {
        var dataHomepage = {
            status: 1,
            msg: "xxxx",
            data: []
        };
        itemByRegion.find({ region: req.params.name, content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(20).exec(function(err, dataR) {
            if (err) {
                console.log('Error in get all from database', err);
                res.send(err);
            }
            dataHomepage.data = dataR;
            res.json(dataHomepage);
        });
    },
    // LIST CATEGORY
    listCategory: function(req, res) {
        var dataHomepage = {
            status: 1,
            msg: "xxxx",
            data: [{
                    category: "THỜI_SỰ",
                    image: "http://media.phunutoday.vn/files/upload_images/2016/06/10/lich-phat-song-chung-trinhh-truyen-hinh-ngay-11-6-2016_phunutoday_vn%201.jpg",
                    isAdd: 0
                },
                {
                    category: "THẾ_GIỚI",
                    image: "https://img.clipartfest.com/540e37c249524d2a300f2c6a9b0c7e82_breaking-news-world-news-free-world-news-clipart_1300-831.jpeg",
                    isAdd: 0
                },
                {
                    category: "KINH_DOANH",
                    image: "http://study.com/cimages/course-image/praxis-ii-business-education-test_118084_large.jpg",
                    isAdd: 0
                },
                {
                    category: "GIẢI_TRÍ",
                    image: "https://s4.scoopwhoop.com/v4/category/entertainment.png",
                    isAdd: 0
                },
                {
                    category: "THỂ_THAO",
                    image: "http://www.teamworkonline.com/network/assets/imgs/mobile_bg_1.jpg",
                    isAdd: 0
                },
                {
                    category: "PHÁP_LUẬT",
                    image: "http://www.openaccesslawcanada.ca/lawpic1.jpg",
                    isAdd: 0
                },
                {
                    category: "GIÁO_DỤC",
                    image: "https://emmer.house.gov/sites/emmer.house.gov/files/styles/congress_featured_image/public/featured_image/issues/Education-OpportunitySmall.jpg",
                    isAdd: 0
                },
                {
                    category: "SỨC_KHOẺ",
                    image: "http://ormeaumedical.com.au/wp-content/uploads/2013/03/pic3.jpg",
                    isAdd: 0
                },
                {
                    category: "GIA_ĐÌNH",
                    image: "http://weknowyourdreams.com/images/family/family-07.jpg",
                    isAdd: 0
                },
                {
                    category: "DU_LỊCH",
                    image: "https://blogs-images.forbes.com/robertadams/files/2016/03/the-best-travel-websites-in-the-world-1200x800.jpg?width=960",
                    isAdd: 0
                },
                {
                    category: "KHOA_HỌC",
                    image: "http://www.scienceprofessionals.co.uk/wp-content/uploads/2016/08/life-science.jpg",
                    isAdd: 0
                },
                {
                    category: "SỐ_HOÁ",
                    image: "http://www.rhiredstaffing.com/wp-content/uploads/2014/11/ict.jpg",
                    isAdd: 0
                },
                {
                    category: "CỘNG_ĐỒNG",
                    image: "http://www.demosphere.com/_uploads/58012544626dcd101f2e589d/community.jpg",
                    isAdd: 0
                },
                {
                    category: "TÂM_SỰ",
                    image: "https://s-media-cache-ak0.pinimg.com/originals/48/44/b1/4844b1ec5e4100c4106127c8f67ef7a9.jpg",
                    isAdd: 0
                }
            ]

        };
        Favourite.find().exec(function(err, dataR) {
            async.each(dataR, (value, next) => {
                dataHomepage.data.forEach(function(val) {
                    if (value.category == val.category) {
                        val.isAdd = 1;
                    }
                })
                next()
            }, function(err) {
                res.json(dataHomepage);
            });
        });
    },
    postSavedItem: function(req, res) {
        if (req.body) {
            SavedItem.findOne({ itemId: req.body.id }).exec(function(err, data) {
                if (data) {
                    res.json({ status: false, message: 'User are already exist!' })
                } else {
                    var myObjectId = new ObjectId(req.body.id);
                    Item.findOne({ _id: myObjectId }).exec(function(err, data) {
                        if (_.isEmpty(data)) {
                            itemByRegion.findOne({ _id: myObjectId }).exec(function(err, data) {
                                if (_.isEmpty(data)) {
                                    res.json({ status: false, message: 'Error in ID' });
                                } else {
                                    data.isReadlater = 1;
                                    data.save(function(err, newData) {
                                        if (err) {
                                            console.log('Save item isReadlater err', err);
                                            res.json({ status: false, message: 'Error in save data' });
                                        } else {
                                            console.log('Save item isReadlater successfully');
                                            var newItem = {
                                                item: newData,
                                                itemId: req.body.id
                                            }
                                            SavedItem.create(newItem, function(err, data) {
                                                res.json({ status: true, message: 'Success' });
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            data.isReadlater = 1;
                            data.save(function(err, newData) {
                                if (err) {
                                    console.log('Save item isReadlater err', err);
                                    res.json({ status: false, message: 'Error in save data' });
                                } else {
                                    console.log('Save item isReadlater successfully');
                                    var newItem = {
                                        item: newData,
                                        itemId: req.body.id
                                    }
                                    SavedItem.create(newItem, function(err, data) {
                                        res.json({ status: true, message: 'Success' });
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    getSavedItem: function(req, res) {
        var dataHomepage = {
            status: 1,
            msg: "xxxx",
            data: []
        };
        SavedItem.find().exec(function(err, data) {
            if (data) {
                if (_.isEmpty(data)) {
                    dataHomepage.status = 0;
                    res.json(dataHomepage);
                } else {
                    for (var i = 0; i < data.length; i++) {
                        dataHomepage.data.push(data[i].item);
                    }
                    res.json(dataHomepage);
                }
            } else {
                res.json({ error: "Not found" });
            }
        });
    },
    deleteSavedItem: function(req, res) {
        SavedItem.remove({ itemId: req.body.id }).exec(function(err, data) {
            var myObjectId = new ObjectId(req.body.id);
            Item.findOne({ _id: myObjectId }).exec(function(err, data) {
                if (_.isEmpty(data)) {
                    itemByRegion.findOne({ _id: myObjectId }).exec(function(err, data) {
                        if (_.isEmpty(data)) {
                            res.json({ status: false, message: 'Id not exist ' });
                        } else {
                            data.isReadlater = 0;
                            data.save(function(err, newData) {
                                if (err) {
                                    console.log('Save item isReadlater err', err);
                                    res.json({ status: false, message: 'Error in save data' });
                                } else {
                                    res.json({ status: true, message: 'Delete ok' });
                                }
                            });
                        }
                    });
                } else {
                    data.isReadlater = 0;
                    data.save(function(err, newData) {
                        if (err) {
                            console.log('Save item isReadlater err', err);
                            res.json({ status: false, message: 'Error in save data' });
                        } else {
                            res.json({ status: true, message: 'Delete ok' });
                        }
                    });
                }
            });
        });
    },
    postFavourite: function(req, res) {
        if (req.body) {
            Favourite.findOne({ category: req.body.name }).exec(function(err, data) {
                if (data) {
                    res.json({ status: false, message: 'User are already exist!' })
                } else {
                    var newItem = {
                        category: req.body.name
                    }
                    Favourite.create(newItem, function(err, data) {
                        res.json({ status: true, message: 'Success' });
                    });
                }
            });
        }
    },
    getFavourite: function(req, res) {
        var dataHomepage = {
            status: 1,
            msg: "xxxx",
            data: []
        };
        var temp = [{
                category: "THỜI_SỰ",
                image: "http://media.phunutoday.vn/files/upload_images/2016/06/10/lich-phat-song-chung-trinhh-truyen-hinh-ngay-11-6-2016_phunutoday_vn%201.jpg",
                isAdd: 1
            },
            {
                category: "THẾ_GIỚI",
                image: "https://img.clipartfest.com/540e37c249524d2a300f2c6a9b0c7e82_breaking-news-world-news-free-world-news-clipart_1300-831.jpeg",
                isAdd: 1
            },
            {
                category: "KINH_DOANH",
                image: "http://study.com/cimages/course-image/praxis-ii-business-education-test_118084_large.jpg",
                isAdd: 1
            },
            {
                category: "GIẢI_TRÍ",
                image: "https://s4.scoopwhoop.com/v4/category/entertainment.png",
                isAdd: 1
            },
            {
                category: "THỂ_THAO",
                image: "http://www.teamworkonline.com/network/assets/imgs/mobile_bg_1.jpg",
                isAdd: 1
            },
            {
                category: "PHÁP_LUẬT",
                image: "http://www.openaccesslawcanada.ca/lawpic1.jpg",
                isAdd: 1
            },
            {
                category: "GIÁO_DỤC",
                image: "https://emmer.house.gov/sites/emmer.house.gov/files/styles/congress_featured_image/public/featured_image/issues/Education-OpportunitySmall.jpg",
                isAdd: 1
            },
            {
                category: "SỨC_KHOẺ",
                image: "http://ormeaumedical.com.au/wp-content/uploads/2013/03/pic3.jpg",
                isAdd: 1
            },
            {
                category: "GIA_ĐÌNH",
                image: "http://weknowyourdreams.com/images/family/family-07.jpg",
                isAdd: 1
            },
            {
                category: "DU_LỊCH",
                image: "https://blogs-images.forbes.com/robertadams/files/2016/03/the-best-travel-websites-in-the-world-1200x800.jpg?width=960",
                isAdd: 1
            },
            {
                category: "KHOA_HỌC",
                image: "http://www.scienceprofessionals.co.uk/wp-content/uploads/2016/08/life-science.jpg",
                isAdd: 1
            },
            {
                category: "SỐ_HOÁ",
                image: "http://www.rhiredstaffing.com/wp-content/uploads/2014/11/ict.jpg",
                isAdd: 1
            },
            {
                category: "CỘNG_ĐỒNG",
                image: "http://www.demosphere.com/_uploads/58012544626dcd101f2e589d/community.jpg",
                isAdd: 1
            },
            {
                category: "TÂM_SỰ",
                image: "https://s-media-cache-ak0.pinimg.com/originals/48/44/b1/4844b1ec5e4100c4106127c8f67ef7a9.jpg",
                isAdd: 1
            }
        ]
        Favourite.find().exec(function(err, data) {
            if (_.isEmpty(data)) {
                dataHomepage.status = 0;
                res.json(dataHomepage);
            } else {
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < temp.length; j++) {
                        if (data[i].category == temp[j].category) {
                            dataHomepage.data.push(temp[j]);
                        }
                    }
                }
                res.json(dataHomepage);
            }
        });
    },
    deleteFavourite: function(req, res) {
        Favourite.remove({ category: req.body.name }).exec(function(err, data) {
            if (err || data.length < 1) {
                res.json({ status: false, message: 'Not found' })
            } else if (data) {
                res.json({ status: true, message: 'Success' });
            }
        });
    },
    getListFavourite: function(req, res) {
        var dataHomepage = {
            status: 1,
            msg: "xxxx",
            data: []
        };
        var temp = [{
                category: "THỜI_SỰ",
                image: "http://media.phunutoday.vn/files/upload_images/2016/06/10/lich-phat-song-chung-trinhh-truyen-hinh-ngay-11-6-2016_phunutoday_vn%201.jpg",
                isAdd: 1
            },
            {
                category: "THẾ_GIỚI",
                image: "https://img.clipartfest.com/540e37c249524d2a300f2c6a9b0c7e82_breaking-news-world-news-free-world-news-clipart_1300-831.jpeg",
                isAdd: 1
            },
            {
                category: "KINH_DOANH",
                image: "http://study.com/cimages/course-image/praxis-ii-business-education-test_118084_large.jpg",
                isAdd: 1
            },
            {
                category: "GIẢI_TRÍ",
                image: "https://s4.scoopwhoop.com/v4/category/entertainment.png",
                isAdd: 1
            },
            {
                category: "THỂ_THAO",
                image: "http://www.teamworkonline.com/network/assets/imgs/mobile_bg_1.jpg",
                isAdd: 1
            },
            {
                category: "PHÁP_LUẬT",
                image: "http://www.openaccesslawcanada.ca/lawpic1.jpg",
                isAdd: 1
            },
            {
                category: "GIÁO_DỤC",
                image: "https://emmer.house.gov/sites/emmer.house.gov/files/styles/congress_featured_image/public/featured_image/issues/Education-OpportunitySmall.jpg",
                isAdd: 1
            },
            {
                category: "SỨC_KHOẺ",
                image: "http://ormeaumedical.com.au/wp-content/uploads/2013/03/pic3.jpg",
                isAdd: 1
            },
            {
                category: "GIA_ĐÌNH",
                image: "http://weknowyourdreams.com/images/family/family-07.jpg",
                isAdd: 1
            },
            {
                category: "DU_LỊCH",
                image: "https://blogs-images.forbes.com/robertadams/files/2016/03/the-best-travel-websites-in-the-world-1200x800.jpg?width=960",
                isAdd: 1
            },
            {
                category: "KHOA_HỌC",
                image: "http://www.scienceprofessionals.co.uk/wp-content/uploads/2016/08/life-science.jpg",
                isAdd: 1
            },
            {
                category: "SỐ_HOÁ",
                image: "http://www.rhiredstaffing.com/wp-content/uploads/2014/11/ict.jpg",
                isAdd: 1
            },
            {
                category: "CỘNG_ĐỒNG",
                image: "http://www.demosphere.com/_uploads/58012544626dcd101f2e589d/community.jpg",
                isAdd: 1
            },
            {
                category: "TÂM_SỰ",
                image: "https://s-media-cache-ak0.pinimg.com/originals/48/44/b1/4844b1ec5e4100c4106127c8f67ef7a9.jpg",
                isAdd: 1
            }
        ]
        Favourite.find().exec(function(err, dataR) {
            if (!_.isEmpty(dataR)) {
                async.each(dataR, (value, next) => {
                    Item.find({ category: value.category, content: { $gt: [] }, imagesLinkList: { $gt: [] } }).sort('-createdTime').limit(3).exec(function(err, data) {
                        temp.forEach(function(val) {
                            if (value.category == val.category) {
                                dataHomepage.data.push({
                                    category: val,
                                    itemList: data
                                });
                            }
                        })
                        next()
                    });
                }, function(err) {
                    res.json(dataHomepage)
                });
            } else {
                res.json({ status: false, message: "Empty favourite" })
            }

        });
    },
    weather: function(req, res) {
        var forecastIo = new ForecastIo('8984a9dcf9d22fb45e95250c7fe0900f');
        var options = {
            units: 'si',
            exclude: 'hourly,flags'
        };
        forecastIo.forecast('21.036237', '105.790583', options).then(function(data) {
            res.json(data)
        });
    },
    signup: function(req, res) {
        User.findOne({ username: req.body.username }).exec(function(err, data) {
            if (!_.isEmpty(data)) {
                res.json({ status: false, message: 'Already in database', id: null });
            } else {
                var newUser = {
                    username: req.body.username,
                    password: req.body.password
                }
                User.create(newUser, function(err, data) {
                    res.json({ status: true, message: 'Success', id: data._id });
                });

            }
        });
    },
    login: function(req, res) {
        User.findOne({ username: req.body.username, password: req.body.password }).exec(function(err, data) {
            if (!_.isEmpty(data)) {
                res.json({ status: true, message: 'Success', user: data });
            } else {
                res.json({ status: false, message: err, user: null });
            }
        });
    }
}