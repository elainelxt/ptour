var fs = Npm.require('fs');
var StopImages = new FS.Store.GridFS("stopImages");
var StopList = new Meteor.Collection("stopList"); 
Meteor.publish("stopList", function () { return StopList.find({}) }); 
//StopImages.remove({});
//StopList.remove({});

var pub = '../client/app/';
//Each image must be in a folder. It must have an img.json and img.JPG file.
//The folder must be prepended with the substring 'pub-'
var dirs = fs.readdirSync(pub).filter(function (file) {
    return file.indexOf('pub-') != -1 && fs.statSync(pub + file).isDirectory();
});

for(var i = 0; i < dirs.length; i++) {
    imgJSON = 
        JSON.parse((fs.readFileSync(pub + dirs[i] + "/img.json", 'ascii')));
    if (StopList.find({id:1}).count() == 0) {
        //create a new collection for each image, allowing for fine grained
        //caching
        var tmp = new FS.Collection(imgJSON.name, {stores: [StopImages]});
        tmp.insert(pub + dirs[i] + "/img.JPG");
        StopList.insert(imgJSON);
        Meteor.publish(imgJSON.name, function () { return tmp.find({}) });
        //NOTE: MUST CHECK THAT THESE WORK
        images.allow({
            download: function(userId, fileObj) { return true; },
        });
        images.deny({
            insert: function(userId, doc) { return true; },
            update: function(userId, doc, fields, modifier) { return true; },
            remove: function(userId, doc) { return true; },
        });
    }
}     
