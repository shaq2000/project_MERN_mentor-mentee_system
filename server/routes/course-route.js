const router = require("express").Router();
const Course = require("../models").courseModel;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("A request is coming into api...");
  next();
});

router.get("/", (req, res) => {
  Course.find({})
    .populate("mentor", ["username", "email"])
    .then((course) => {
      res.send(course);
    })
    .catch(() => {
      res.status(500).send("Error!! Cannot get course!!");
    });
});

router.get("/:_id", (req, res) => {
  let { _id } = req.params;
  Course.findOne({ _id })
    .populate("mentor", ["email"])
    .then((course) => {
      res.send(course);
    })
    .catch((e) => {
      res.send(e);
    });
});

router.get("/findByName/:name", (req, res) => {
  let { name } = req.params;
  Course.find({ title: name })
    .populate("mentor", ["username", "email"])
    .then((course) => {
      res.status(200).send(course);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

router.get("/mentee/:_mentee_id", (req, res) => {
  let { _mentee_id } = req.params;
  Course.find({ mentees: _mentee_id })
    .populate("mentor", ["username", "email"])
    .then((courses) => {
      res.status(200).send(courses);
    })
    .catch(() => {
      res.status(500).send("Cannot get data.");
    });
});

router.get("/mentor/:_mentor_id", (req, res) => {
  let { _mentor_id } = req.params;
  Course.find({ mentor: _mentor_id })
    .populate("mentor", ["username", "email"])
    .then((data) => {
      res.send(data);
    })
    .catch(() => {
      res.status(500).send("cannot get course data");
    });
});

router.post("/", async (req, res) => {
  // validate the inputs before making a new course
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { title, description, price } = req.body;
  if (req.user.isMentee()) {
    return res.status(400).send("Only instructor can post a new course.");
  }

  let newCourse = new Course({
    title,
    description,
    price,
    mentor: req.user._id,
  });

  try {
    await newCourse.save();
    res.status(200).send("New course has been saved.");
  } catch (err) {
    res.status(400).send("Cannot save course.");
  }
});

router.post("/enroll/:_id", async (req, res) => {
  let { _id } = req.params;
  let { user_id } = req.body;
  try {
    let course = await Course.findOne({ _id });
    course.mentees.push(user_id);
    await course.save();
    res.send("Done Enrollment.");
  } catch (err) {
    res.send(err);
  }
});

router.patch("/:_id", async (req, res) => {
  // validate the inputs before making a new course
  const { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let { _id } = req.params;
  let course = await Course.findOne({ _id });
  if (!course) {
    res.status(404);
    return res.json({
      success: false,
      message: "Course not found.",
    });
  }

  if (course.mentor.equals(req.user._id) || req.user.isAdmin()) {
    Course.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    })
      .then(() => {
        res.send("Course updated.");
      })
      .catch((e) => {
        res.send({
          success: false,
          message: e,
        });
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      message:
        "Only the instructor of this course or web admin can edit this course.",
    });
  }
});

router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  let course = await Course.findOne({ _id });
  if (!course) {
    res.status(404);
    return res.json({
      success: false,
      message: "Course not found.",
    });
  }

  if (course.mentor.equals(req.user._id) || req.user.isAdmin()) {
    Course.deleteOne({ _id })
      .then(() => {
        res.send("Course deleted.");
      })
      .catch((e) => {
        res.send({
          success: false,
          message: e,
        });
      });
  } else {
    res.status(403);
    return res.json({
      success: false,
      message:
        "Only the instructor of this course or web admin can delete this course.",
    });
  }
});

module.exports = router;