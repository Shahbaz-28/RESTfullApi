const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const { error } = require("console");

const app = express();

const PORT = 8000;

//Middleware

app.use(express.urlencoded({ extended: false }));

//Routes

app.get("/api/users", (req, res) => {
  return res.json(users);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })

  .patch((req, res) => {
    const id = Number(req.params.id);
    const updatedUser = req.body;
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (error) => {
        if (error) {
          return res
            .status(500)
            .json({ status: "error", message: "Failed to update user" });
        }
        return res.json({
          status: "success",
          message: "User updated successfully",
        });
      });
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
      users.splice(index, 1);
      fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (error) => {
        if (error) {
          return res
            .status(500)
            .json({ status: "error", message: "Failed to delete user" });
        }
        return res.json({
          status: "success",
          message: "User deleted successfully",
        });
      });
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
  });

app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (error, data) => {
    return res.json({ status: "success", id: users.length });
  });
});

app.listen(PORT, () => console.log(`Server Started at Port:${PORT}`));
