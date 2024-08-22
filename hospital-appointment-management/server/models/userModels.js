const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is require"],
  },
  email: {
    type: String,
    required: [true, "email is require"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  previousPasswords: [{
    type: Array,
    default:[]
  }],
  passwordCreationDate: {
    type: Date
  },
  passwordExpiryDate: {
    type: Date,
    default: function() {
      // Set default to 90 days from the current date/time
      const expiryDate = new Date(this.passwordCreationDate);
      expiryDate.setDate(expiryDate.getDate() + 90);
      return expiryDate;
    },
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  lockoutExpires: {
    type: Date,
    default: null,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isDoctor: {
    type: Boolean,
    default: false,
  },
  notifcation: {
    type: Array,
    default: [],
  },
  seennotification: {
    type: Array,
    default: [],
  },
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
