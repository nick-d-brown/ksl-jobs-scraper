var mongoose = require("mongoose");
var Posting = require("./../models/JobPosting");
var Note = require("./../models/Note");

module.exports = {

    scrape: function (URL) {
        request(URL, function (error, response, html) {
            var $ = cheerio.load(html);

            $("h2.job-title").each(function (i, element) {

                var result = {};

                var title = $(element).children().text();
                var link = $(element).children().attr("href");
                var compName = $(element).next().find($('.company-name')).text().trim().replace(/\\n.*/g, '');
                var desc = $(element).next().next().text().trim().replace(/\\/g, '');

                result.title = title;
                result.link = link;
                result.compName = compName;
                result.desc = desc;
                switch (URL) {
                    case "https://www.ksl.com/jobs/search/miles/0/keywords/full%20stack%20developer/page/1":
                        result.isFullStackDev = true;
                        break;
                    case "https://www.ksl.com/jobs/search/miles/0/keywords/front%20end%20developer/page/1":
                        result.isFrontEndDev = true;
                        break;
                    case "https://www.ksl.com/jobs/search/miles/0/keywords/back%20end%20developer/page/1":
                        result.isBackEndDev = true;
                        break;
                    case "https://www.ksl.com/jobs/search/miles/0/keywords/web%20developer/page/1":
                        result.isWebDev = true;
                        break;
                    case "https://www.ksl.com/jobs/search/miles/0/keywords/UI%20UX%20developer/page/1":
                        result.isUiUxDev = true;
                        break;
                }

                // checks to see if there is already a title in the db matching the one about to save
                var newPosting = new Posting(result);
                Posting.find({
                    title: result.title
                }, function (err, data) {
                    if (data.length === 0) {
                        newPosting.save(function (err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Your result was saved!\n" + data);
                            }
                        });
                    }
                });
            });
        });
        
    }

}
