const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomId: { type: Number, required: true },
});

module.exports = mongoose.model('Room', RoomSchema);
