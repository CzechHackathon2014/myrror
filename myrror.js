Questions = new Mongo.Collection("questions");

Router.configure({
    layoutTemplate: 'defaultLayout' // the default layout
});

Router.route('/', function () {
    this.layout('defaultLayout');
    this.render('upload');
});
Router.route('/rate');
Router.route('/result');

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
            var button = event.target;
            if (files.length === 0) {
                return;
            }
            var file = files[0];
            var fileReader = new FileReader();
            fileReader.onload = function (event) {
                var dataUrl = event.target.result;
                template.dataUrl.set(dataUrl);
                Session.set("photo", dataUrl);
                button.style.visibility="hidden";
            };
            fileReader.readAsDataURL(file);
        }
    });

    Template.upload.created = function () {
        this.dataUrl = new ReactiveVar();
    };

    Template.rate.helpers({
        photo: function () {
            return Session.get("photo");
        },
        questionText: function () {
            return Session.get("questionText");
        },
        counter: function () {
            return Session.get("counter");
        }
    });

    Template.rate.events({
        'click #sayYes': function () {
            Questions.update({"_id": Session.get("questionId")}, {'$addToSet': {"answerYes": Meteor.userId()}});
            nextImage();
        },
        'click #sayNo': function () {
            Questions.update({"_id": Session.get("questionId")}, {'$addToSet': {"answerNo": Meteor.userId()}});
            nextImage();
        }
    });

    Template.rate.created = function () {
        nextImage();
    };

    function nextImage() {
        var counter = Session.get("counter");
        if (counter < 4) {
            var question = Questions.findOne({ "owner": {$ne: "$userId"}}, {skip: counter});
            Session.set("questionId", question._id);
            Session.set("questionText", question.text);
            Session.set("photo", question.photo);
            Session.set("counter", counter + 1);
        } else {
            Router.go("/result");
        }
    }

    Template.result.helpers({
        photo: function () {
            return Session.get("photo");
        },
        questionText: function () {
            return Session.get("questionText");
        },
        yesCount: function () {
            return Session.get("yesCount");
        },
        noCount: function () {
            return Session.get("noCount");
        },
        counter: function () {
            return Session.get("counter");
        }
    });

    Template.result.created = function () {
        Session.set("counter", 0);
        nextResult();
    };

    function nextResult() {
        var counter = Session.get("counter");
        console.log("counter: " + counter + " q: " + question);
        var question = Questions.findOne({}, {skip: counter});
        console.log("counter: " + counter + " q: " + question);
        Session.set("questionId", question._id);
        Session.set("questionText", question.text);
        if (question.answerYes) {
            Session.set("yesCount", question.answerYes.length);
        } else {
            Session.set("yesCount", 0);
        }
        if (question.answerNo) {
            Session.set("noCount", question.answerNo.length);
        } else {
            Session.set("noCount", 0);
        }
        Session.set("photo", question.photo);
        Session.set("counter", counter + 1);
    }

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
