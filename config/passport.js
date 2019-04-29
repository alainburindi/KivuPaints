import local from 'passport-local';
const LocalStrategy = local.Strategy;
import connection from './connection';
import bcrypt from 'bcrypt';

module.exports = (passport)=>{
    passport.use(
        new LocalStrategy({usernameField : 'email' }, (email, password, done)=> {
            //check if email is already in use
            const fetchAUser = "SELECT * FROM Users WHERE email = ?";
            connection.query(fetchAUser, [email], (err, result, fields) => {
                if(err){
                    throw err;
                }
                if(result == 0){
                    return done(null, false, {message : 'That email is not registered'});
                }
                // Match password
                const isValid = bcrypt.compareSync(password, result[0].password);
                if(isValid){
                    return done(null, result[0]);
                }else{
                    return done(null, false, {message : 'Password incorrect'});
                }
            })
        })
    );

    passport.serializeUser((user, done)=>{
        done(null, user.id)
    });

    passport.deserializeUser((id, done) => {
        const fetchAUser = "SELECT * FROM Users WHERE id = ?";
            connection.query(fetchAUser, [id], (err, result) => {
                if(result.length == 1){
                    return done(err, result[0])
                }
            })
    });
}