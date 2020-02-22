module.exports = {
    ensureAuthenticated: function(req, res, next){
      if(req.isAuthenticated()){
        return next();
      }
      req.flash('error_msg', 'In Order to access \'sales & offers\', \'profile\' & \'check-out\'  you must to Logged in!');
      res.redirect('/login');
    }
  }

