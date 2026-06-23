const UserModel = require("../Model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saveUser = async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if ((!name, !email, !password)) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const checkemail = await UserModel.findOne({ email });
    if (checkemail) {
      return res.status(404).json({ message: "Email already registered" });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name,
      email,
      password: hashpassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered success", user: newUser });
  } catch (error) {
    console.log(error);
    res.status(501).json({ message: "Something went wrong" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if ((!email, !password)) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not registered" });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(401).json({ message: "Incorrect Password" });
    }
    const accessToken = jwt.sign(
      {
        user: user._id,
        email: user.email,
      },
      process.env.ACCESS_SECRET_KEY,
      { expiresIn: "1m" },
    );

    const refreshToken = jwt.sign(
      {
        user: user._id,
        email: user,
        email,
      },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: "7d" },
    );
    user.refreshToken = refreshToken;
    await user.save();
    res
      .status(200)
      .json({ message: "Login success", user, accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    const user = await UserModel.findOne({ refreshToken });
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET_KEY,
      (error, decoded) => {
        if (error) {
          return res
            .status(401)
            .json({ message: "Refresh token expired or invalid" });
        }
        const accessToken = jwt.sign(
          {
            user: user._id,
            email: user.email,
          },
          process.env.ACCESS_SECRET_KEY,
          { expiresIn: "1m" },
        );
        res
          .status(200)
          .json({ message: "New access token generated ", accessToken });
      },
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
module.exports = { saveUser, loginUser, refreshToken };
