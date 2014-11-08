# MYRROR

Anonymous rating.

## Running Locally

Make sure you have [Meteor](https://www.meteor.com/) installed.

```sh
meteor
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

### Accessing Local MongoDB
```sh
meteor mongo
```

## Deploying

```sh
meteor deploy myrror.meteor.com
```
                               
Your app should now be running on [myrror.meteor.com](http://myrror.meteor.com/).

### Accessing Remote MongoDB
```sh
meteor mongo --url myrror.meteor.com  # this will generate connection string with password valid for one minute
```
