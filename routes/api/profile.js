const express = require("express");
const router = express.Router();
const db = require("../../db/base");
const passport = require("passport");
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const validateProfile = require("../../validation_rules/profile");
const validateExperience = require("../../validation_rules/experience");

// Get profile matching user id
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const err = {};
    db.connectMongoose();

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name"])
      .then(profile => {
        if (!profile) {
          err.noprofile = "This user has no profile. Yet.";
          db.disconnectMongoose();
          res.status(400).json(err);
        }
        db.disconnectMongoose();
        res.status(200).json(profile);
      });
  }
);

// Create a profile
// Validate the posted data
// Store posted data in profileData-object
// Find user and update/create profile
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { validationError, isValid } = validateProfile(req.body);
    if (!isValid) {
      return res.status(400).json(validationError);
    }
    const err = {};
    const profileData = {};
    profileData.social_media = {};

    profileData.user = req.user.id;
    if (req.body.handle) profileData.handle = req.body.handle;
    if (req.body.title) profileData.title = req.body.title;
    if (req.body.location) profileData.location = req.body.location;
    if (req.body.skills) profileData.skills = req.body.skills;
    if (req.body.bio) profileData.bio = req.body.bio;
    if (req.body.location) profileData.location = req.body.location;
    if (req.body.twitter) {
      profileData.social_media.twitter = req.body.twitter;
    }
    if (req.body.facebook) {
      profileData.social_media.facebook = req.body.facebook;
    }
    if (req.body.instagram) {
      profileData.social_media.instagram = req.body.instagram;
    }

    db.connectMongoose();
    Profile.findOne({ user: req.user.id }).then(profile => {
      console.log(profile);
      if (profile) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileData },
          { new: true }
        ).then(profile => {
          db.disconnectMongoose();
          res.status(200).json(profile);
        });
      } else {
        Profile.findOne({ handle: profileData.handle }).then(profile => {
          if (profile) {
            db.disconnectMongoose();
            err.handle = "This handle already exists.";
            res.status(400).json({ err });
          } else {
            new Profile(profileData).save().then(profile => {
              db.disconnectMongoose();
              res.status(200).json(profile);
            });
          }
        });
      }
    });
  }
);

// Find profile by handle
router.get("/handle/:handle", (req, res) => {
  const err = {};
  db.connectMongoose();

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name"])
    .then(profile => {
      if (!profile) {
        err.profile = "There is no profile called: " + req.params.handle;
        db.disconnectMongoose();
        res.status(400).json(err);
      } else {
        db.disconnectMongoose();
        res.status(200).json(profile);
      }
    });
});

// Find a user by userid-param
router.get("/user/:userid", (req, res) => {
  const err = {};
  db.connectMongoose();

  Profile.findOne({ user: req.params.userid })
    .populate("user", ["name"])
    .then(profile => {
      if (!profile) {
        err.profile = "There is no profile with the id of: " + req.params.id;
        db.disconnectMongoose();
        res.status(400).json(err);
      } else {
        db.disconnectMongoose();
        res.status(200).json(profile);
      }
    })
    .catch(err =>
      res.status(400).json({
        profile: "There is no profile with the id of: " + req.params.userid
      })
    );
});

// Get all routes
router.get("/all", (req, res) => {
  const err = {};
  db.connectMongoose();

  Profile.find()
    .populate("user", ["name"])
    .then(profiles => {
      if (!profiles) {
        err.profiles = "There are no profiles.";
        db.disconnectMongoose();
        res.status(400).json(err);
      } else {
        db.disconnectMongoose();
        res.status(200).json(profiles);
      }
    });
});

// Route to handle the creation of new experiences
// Validate received data
// Find profile matching the user
// Add posted data to object and add object to db
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { validationError, isValid } = validateExperience(req.body);
    if (!isValid) {
      res.status(400).json(validationError);
    }
    const err = {};

    db.connectMongoose();

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        const experience = {
          title: req.body.title,
          company: req.body.company,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current
        };

        profile.experience.unshift(experience);
        profile.save().then(profile => {
          db.disconnectMongoose();
          res.status(200).json(profile);
        });
      } else {
        db.disconnectMongoose();
        err.profile = "Something went wrong.";
        res.status(400).json(err);
      }
    });
  }
);

// Route to handle deletion of experiences
// Find profile matching user
// Remove experience where expid-param matches experience id
router.post(
  "/deleteexperience/:expid",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    db.connectMongoose();

    Profile.findOne({ user: req.user.id }).then(profile => {
      const remove = profile.experience
        .map(experience => experience.id)
        .indexOf(req.params.expid);

      profile.experience.splice(remove, 1);

      profile.save().then(profile => {
        db.disconnectMongoose();
        res.status(200).json(profile);
      });
    });
  }
);

// Route to delete users
// Remove the profile matching the user
// Remove the user matching user(req.user.id)
router.delete(
  "/deleteuser",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    db.connectMongoose();
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() => {
        db.disconnectMongoose();
        res
          .status(200)
          .json({ message: "User has successfully been removed." });
      });
    });
  }
);

module.exports = router;
