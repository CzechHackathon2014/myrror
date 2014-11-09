Questions = new Mongo.Collection("questions");

Router.configure({
    layoutTemplate: 'defaultLayout' // the default layout
});

Router.route('/', function () {
    this.layout('defaultLayout');
    this.render('upload');
});
Router.route('/rate');

if (Meteor.isClient) {

    Session.setDefault("counter", 0);

    Template.upload.helpers({
        photo: function () {
            return Session.get("photo");
        }
    });

    Template.upload.events({
        'click .takePicture': function () {
            var cameraOptions = {
                width: 600,
                height: 600
            };

            MeteorCamera.getPicture(cameraOptions, function (error, data) {
                Session.set("photo", data);
            });
        },

        'submit .question': function () {
            Questions.insert({
                text: event.target.question.value,
                createdAt: new Date(),
                owner: Meteor.userId(),
                photo: Session.get("photo")
            });

            event.target.question.value = "";
            Router.go("/rate");
            return false; // Prevent default form submit
        },

        "change input[type='file']": function (event, template) {
            var files = event.target.files;
            if (files.length === 0) {
                return;
            }
            var file = files[0];
            var fileReader = new FileReader();
            fileReader.onload = function (event) {
                var dataUrl = event.target.result;
                template.dataUrl.set(dataUrl);
            };
            fileReader.readAsDataURL(file);
        },

        "submit .uploadForm": function (event, template) {
            event.preventDefault();
            console.log("uploaded: " + template.dataUrl.get());
            Session.set("photo", template.dataUrl.get());
        }
    });

    Template.upload.created = function () {
        this.dataUrl = new ReactiveVar();
    };

    Template.rate.helpers({
        photo: function () {
            return Questions.findOne({ "owner": {$ne: "$userId"}}, {skip: Session.get("counter")}).photo;
        },
        counter: function () {
            return Session.get("counter");
        }
    });


    Template.rate.events({
        'click .yes': function () {
        },
        'click .no': function () {
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
