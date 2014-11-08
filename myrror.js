Questions = new Mongo.Collection("questions");

if (Meteor.isClient) {

//    Template.body.helpers({
//        tasks: function () {
//            return Questions.find({});
//        }
//    });

    Session.setDefault("counter", 0);

    Template.upload.helpers({
        counter: function () {
            return Session.get("counter");
        }
    });

    Template.upload.events({
        'click button .upload': function () {
            Session.set("counter", Session.get("counter") + 1);
        },
        'submit .question': function () {
            Questions.insert({
                text: event.target.question.value,
                createdAt: new Date()
            });

            event.target.question.value = "";
            // Prevent default form submit
            return false;
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
