const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
   ticket_id: {
    type: String,
    required: true,
    unique: true
  },

  citizen_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  category: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  location: {
    type: [Number], // [longitude, latitude]
    required: true
  },

  address_string: {
    type: String
  },

  image_url_initial: {
    type: String
  },

  image_url_resolved: {
    type: String
  },

  status: {
    type: String,
    enum: [
      'reported',
      'verified',
      'assigned',
      'in_progress',
      'resolved',
      'citizen_verified',
      'rejected'
    ],
    default: 'reported'
  },

  status_history: {
    type: Array,
    default: []
  },

  assigned_to_dept: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },

  assigned_to_worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  deadline: {
    type: Date
  },

},
{ timestamps: true }
);

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
