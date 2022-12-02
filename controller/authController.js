const formidable = require("formidable");
const validator = require("validator");
const authModel = require("../models/authModel");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class authController {
  registerPage = (req, res) => {
    const { crudToken } = req.cookies;
    if (crudToken) {
    } else {
      return res.render("dashboard/register", { error: "" });
    }
  };
  loginPage = (req, res) => {
    const { crudToken } = req.cookies;
    if (crudToken) {
      return res.redirect("/dashboard");
    } else {
      return res.render("dashboard/login", { error: "" });
    }
  };
  userRegister = async (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      const { name, email, password } = fields;
      const { image } = files;

      const error = {};

      if (validator.isEmpty(name)) {
        error.name = "Please provide your name";
      }
      if (validator.isEmpty(email)) {
        error.email = "Please provide your email";
      }
      if (!validator.isEmpty(email) && !validator.isEmail(email)) {
        error.email = "Please provide valid email";
      }
      if (validator.isEmpty(password)) {
        error.password = "Please provide your password";
      }
      if (validator.isEmpty(image.originalFilename)) {
        error.image = "Please provide your image";
      }
      if (Object.keys(error).length > 0) {
        return res.render("dashboard/register", { error });
      } else {
        try {
          const user = await authModel.findOne({ email });

          if (user) {
            req.flash("error", "Email already exist");
            return res.redirect("/register");
          } else {
            image.originalFilename = Date.now() + image.originalFilename;
            const disPath =
              __dirname + `/../view/assets/image/${image.originalFilename}`;

            fs.copyFile(image.filepath, disPath, async (err) => {
              if (err) {
                req.flash("error", "Image upload failed please try again");
                return res.redirect("/register");
              } else {
                const createUser = await authModel.create({
                  name,
                  email,
                  password: await bcrypt.hash(password, 9),
                  image: image.originalFilename,
                });
                const token = jwt.sign(
                  {
                    id: createUser.id,
                    name: createUser.name,
                    email: createUser.email,
                    image: createUser.image,
                  },
                  "secretkey",
                  {
                    expiresIn: "3d",
                  }
                );

                res.cookie("crudToken", token, {
                  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                });
                req.flash("success", "Your register successful");
                return res.redirect("/dashboard");
              }
            });
          }
        } catch (error) {}
      }
      // console.log(error);
    });
  };

  userLogin = async (req, res) => {
    const { email, password } = req.body;
    const error = {};

    if (validator.isEmpty(email)) {
      error.email = "Please provide your email";
    }
    if (!validator.isEmpty(email) && !validator.isEmail(email)) {
      error.email = "Please provide valid email";
    }
    if (validator.isEmpty(password)) {
      error.password = "Please provide your password";
    }
    if (Object.keys(error).length > 0) {
      return res.render("dashboard/login", { error });
    } else {
      try {
        const user = await authModel.findOne({ email });
        if (user) {
          const matchPassword = await bcrypt.compare(password, user.password);
          if (matchPassword) {
            const token = jwt.sign(
              {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
              },
              "secretkey",
              { expiresIn: "3d" }
            );
            res.cookie("crudToken", token, {
              expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            });
            req.flash("success", "Your login successful");
            return res.redirect("/dashboard");
          } else {
            req.flash("error", "Your password is invalid");
            return res.redirect("/login");
          }
        } else {
          req.flash("error", "Email doesn't exist");
          return res.redirect("/login");
        }
        // console.log(user);
      } catch (error) {}
    }
  };
}

module.exports = new authController();
