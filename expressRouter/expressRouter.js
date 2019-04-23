const express = require("express");

const db = require("../data/db");

const router = express.Router();

const sendUserError = (status, message, res) => {
  res.status(status).json({ errorMessage: message });
  return;
};

router.post("/", (req, res) => {
  const { title, contents } = req.body;
  //   console.log(req);
  //   console.log(req.body);

  if (!title || !contents) {
    sendUserError(400, "Please provide title and contents for the post.", res);
    return;
  }
  db.insert({
    title,
    contents
  })
    .then(response => {
      res.status(201).json(response);
    })
    .catch(error => {
      console.log(error);
      sendUserError(
        500,
        `{ error: "There was an error while saving the post to the database" }`,
        res
      );
      return;
    });
});

router.get("/", (req, res) => {
  db.find()
    .then(posts => {
      res.json({ posts });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The posts information could not be retrieved."
      });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(post => {
      if (post.length === 0) {
        sendUserError(
          404,
          '{ message: "The post with the specified ID does not exist." }',
          res
        );
        return;
      }
      res.json(post);
    })
    .catch(error => {
      sendUserError(
        500,
        '{ error: "The post information could not be retrieved." }',
        res
      );
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.remove(id)
    .then(post => {
      if (post === 0) {
        sendUserError(
          404,
          '{ message: "The post with the specified ID does not exist." }',
          res
        );
        return;
      }
      res.json({ success: `Post with the id: ${id} has been removed` });
    })
    .catch(error => {
      sendUserError(500, '{ error: "The post could not be removed" }', res);
      return;
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;
  //   console.log(req);
  if (!title || !contents) {
    sendUserError(
      400,
      '{ errorMessage: "Please provide title and contents for the post." }',
      res
    );
    return;
  }

  db.update(id, { title, contents }).then(response => {
    if (response === 0) {
      sendUserError(
        404,
        '{ message: "The post with the specified ID does not exist." }',
        res
      );
      return;
    }
    db.findById(id)
      .then(post => {
        if (post.length === 0) {
          sendUserError(404, "Post with that id not found", res);
          return;
        }
        res.status(201).json(post);
      })
      .catch(error => {
        sendUserError(
          500,
          '{ error: "The post information could not be modified." }',
          res
        );
        return;
      });
  });
});

module.exports = router;
