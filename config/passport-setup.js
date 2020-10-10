const passport = require("passport")
const MicrosoftStrategy = require("passport-microsoft").Strategy

console.log("Configuring Passport.")
passport.use(new MicrosoftStrategy({
        clientID: '56ac7b49-77e4-4eb2-961a-040358a808d0',
        clientSecret: 'Lqlb-CcGw6._OsLgx97c6WI4mN4~7oFsR1',
        callbackURL: "https://3000-ab155182-05d4-4bf5-b47e-2b757b153877.ws-eu01.gitpod.io//auth/microsoft/callback",
        scope: ['user.read']
      },
      
      function(accessToken, refreshToken, profile, done) {
        console.log(profile);
       // User.findOrCreate({ userId: profile.id }, function (err, user) {
       //   return done(err, user);
       // }
       // );
      }
    )
);