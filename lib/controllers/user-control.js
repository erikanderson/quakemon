var User = require('./../models/user');
var Zip = require('./../models/zip');
var Q = require('q');

module.exports = {
  updateOrCreate: function(user){
    var deferred = Q.defer();
    User.findOne({ googleId: user.id }, function(err, results){
      if(err) return deferred.reject(err);
      if(results){
        User.update({ _id: results._id }, {
          name: user.displayName,
          plusLink: user._json.link,
          picture: user._json.picture
        }, function(err, results){
          if(err){
            return deferred.reject(err);
          } else {
            deferred.resolve(results);
          }
        })
      } else {
        User.create({
          googleId: user.id,
          name: user.displayName,
          plusLink: user._json.link,
          picture: user._json.picture
        }, function(err, results){
          if(err){
            return deferred.reject(err);
          } else {
            deferred.resolve(results);
          }
        })
      }
    })
    return deferred.promise;
  },
  getUser: function(id){
    var deferred = Q.defer();
    User.findOne({ googleId: id }, function(err, results){
      if(err){
        deferred.reject(err);
      } else {
        console.log(results);
        deferred.resolve(results);
      }
    })
    return deferred.promise;
  },
  put: function(req, res){
    delete req.body._id;
    console.log('/////////req.body in put',req.body)
    if (req.body.zip){
      console.log('zip is in the body');
      Zip.findOne({_id: req.body.zip}, 'loc', function(err, zipresult){

        if (!zipresult){
          console.log('in null if', zipresult);
          return res.json({zipError: 'Zip code not found in database'});
        }

        console.log('zip result: ', zipresult);
        console.log('zipresult.loc[0]', zipresult.loc[0]);
        req.body.longitude = zipresult.loc[0];
        req.body.latitude = zipresult.loc[1];

        User.update({ _id: req.params.id }, req.body, function(err, results){
          console.log(err, results);
          if(err){
            res.status(500).json(err);
          } else {
            res.status(200).json(results);
          }
        })
      })
    } else {
      User.update({ _id: req.params.id }, req.body, function(err, results){
          console.log(err, results);
          if(err){
            res.status(500).json(err);
          } else {
            res.status(200).json(results);
          }
      })
    }
  }
}





      // console.log('in else', req.body.zip, req.params.id);
      
      // User.findById(req.params.id, function(err, user){
      //     console.log('LONGITUDE: ',location.loc[0]);
      //     console.log('LATITUDE: ', location.loc[1]);
      //     user.latitude = location.loc[1];
      //     user.longitude = location.loc[0];
      //     user.save(function (err){
      //       //if (err) res.status(500).json(err);
      //       console.log(user);
      //       res.status(200).json(user);
      //     })
      //   })