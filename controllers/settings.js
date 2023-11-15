const express = require("express");
const router = express.Router();
const Settings = require("../models/settings.js");
const { authenticateToken, checkIsAdmin } = require("../models/jwt");

//add sliders
router.post("/add-Sliders", authenticateToken, checkIsAdmin, (req, res) => {
  let body = req.body;
  let sliders = new Settings(body);
  sliders
    .save()
    .then((sliders) => {
      res.send({
        sliders,
        notice: "successfully created the Settings",
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

// ui end user
router.get("/get-sliders", (req, res) => {
  Settings.find({})
    .then((data) => {
      res.status(200).send(...data);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

// dashboard
router.get("/get-settings", (req, res) => {
  Settings.find({})
    .then((data) => {
      res.status(200).send(...data);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});




router.post('/update-top-image', authenticateToken, checkIsAdmin,(req, res) => {
    const topImage = req.body;
    Settings.findOne({},(findErr, setting) => {
        if (findErr) {
            return res.status(500).json({ error: findErr.message });
        }
        if (!setting) {
            setting = new Settings({});
        }
        setting.top_image = topImage;
        setting.save((saveErr, updatedSetting) => {
            if (saveErr) {
                return res.status(500).json({ error: saveErr.message });
            }
            const response = updatedSetting.toObject({ getters: true, versionKey: false });
            response._id = undefined;
            response.id = undefined;

            return res.json(response);

        });
    });
});


router.post('/update-social-links',authenticateToken, checkIsAdmin, (req, res) => {
    const socialLinks = req.body;
    Settings.findOne({}, (findErr, setting) => {
        if (findErr) {
            return res.status(500).json({ error: findErr.message });
        }
        if (!setting) {
            setting = new Settings({});
        }
        setting.social_link = socialLinks;
        setting.save((saveErr, updatedSetting) => {
            if (saveErr) {
                return res.status(500).json({ error: saveErr.message });
            }
            const response = updatedSetting.toObject({ getters: true, versionKey: false });
            response._id = undefined;
            response.id = undefined;

            return res.json(response);

        });
    });
});

router.post('/update-sliders', authenticateToken, checkIsAdmin, (req, res) => {
    const newSlider = req.body;
    Settings.findOne({}, (findErr, setting) => {
        if (findErr) {
            return res.status(500).json({ error: findErr.message });
        }
        if (!setting) {
            setting = new Settings({});
        }
        setting.sliders = [];
        setting.sliders.push(newSlider);
        setting.save((saveErr, updatedSetting) => {
            if (saveErr) {
                return res.status(500).json({ error: saveErr.message });
            }
            const response = updatedSetting.toObject({ getters: true, versionKey: false });
            response._id = undefined;
            response.id = undefined;
            return res.json(response);
        });
    });
});


module.exports = router;
