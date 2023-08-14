const express = require ("express");
const { getAllTopics } = require("./controllers/topics.controller");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors/index.js');
const app = express();

app.get("/api/topics", getAllTopics);

// register middleware
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;