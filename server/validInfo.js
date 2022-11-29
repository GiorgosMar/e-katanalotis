module.exports = function(req, res, next) {
    const { email, username, password, conf_password } = req.body;
    
    function validEmail(userEmail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }

    function validUsername(userName) {
      return /^[a-zA-Z0-9]*$/.test(userName);
    }

    if (req.path === "/register") {
        console.log(!email.length);
        if (![email, username, password, conf_password].every(Boolean)) {
          return res.json("Missing Credentials");
        } else if (!validEmail(email)) {
          return res.json("Invalid Email");
        } else if (!validUsername(username)) {
            return res.json("Invalid Username");
        } else if(password.length < 8 || !(password.match(/[A-Z]/)) || !(password.match(/[a-z]/)) || !(password.match(/[0-9]/)) || !(password.match(/\W/))){
            return res.status(403).json("Λάθος κωδίκος");
        } else if (password !== conf_password) {
          return res.status(403).json("Οι κωδικοί δεν ταιριάζουν");
        }
    } else if (req.path === "/login") {
        if (![email, password].every(Boolean)) {
          return res.json("Missing Credentials");
        } else if (!validEmail(email)) {
          return res.json("Invalid Email");
        }
      }
    
      next();
};