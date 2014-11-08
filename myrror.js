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

//    Template.upload.helpers({
//        tasks: function () {
//            return Questions.find({});
//        },
//        counter: function () {
//            return Session.get("counter");
//        }
//    });

    Template.upload.events({
        'click .upload': function () {
        },
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
        }
    });

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
