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
    }

    User.update({ _id: req.params.id }, req.body, function(err, results){
      console.log(err, results);
      if(err){
        res.status(500).json(err);
      } else {
      
      console.log('in else', req.body.zip, req.params.id);
      
      Zip.findOne({_id: req.body.zip}, 'loc', function(err, loc){
        
        if (err) res.status(500).json(err);

        User.findById(req.params.id, function(err, user){
          
          if (loc.loc[1] && loc.loc[0]){
            console.log('LONGITUDE: ',loc.loc[0]);
            console.log('LATITUDE: ', loc.loc[1]);
            user.latitude = loc.loc[1];
            user.longitude = loc.loc[0];
            user.save(function (err){
              //if (err) res.status(500).json(err);
              console.log(user);
              res.status(200).json(user);
            })
          }
        })
      })
     }
   })
  }
}