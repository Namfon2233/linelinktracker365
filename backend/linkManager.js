// backend/linkManager.js
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/links.json');

function loadLinks() {
  if (!fs.existsSync(DATA_PATH)) return [];
  return JSON.parse(fs.readFileSync(DATA_PATH));
}

function saveLinks(links) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(links, null, 2));
}

function addLink(link) {
  const links = loadLinks();
  links.push(link);
  saveLinks(links);
  return link;
}

function deleteLink(id) {
  let links = loadLinks();
  links = links.filter(link => link.id !== id);
  saveLinks(links);
}

module.exports = { loadLinks, addLink, deleteLink };
