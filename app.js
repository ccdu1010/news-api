const express = require ("express");
const { getAllTopics } = require("./controllers/topics.controller");
const { getApi } = require("./controllers/api.controller");
const { handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors/index.js');
const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api", getApi);

// register middleware
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;