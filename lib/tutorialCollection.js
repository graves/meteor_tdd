Tutorials = new Meteor.Collection("tutorials");

// A Tutorial class that takes a document in its constructor
Tutorial = function(id, name, capacity, owner) {
  this._id = id;
  this._name = name;
  this._capacity = capacity;
  this._owner = owner;
};

Tutorial.prototype = {
  get id() {
    // readonly
    return this._id;
  },
  get owner() {
    // readonly
    return this._owner;
  },
  get name() {
    return this._name;
  },
  set name(value) {
    this._name = value;
  },
  get capacity() {
    return this._capacity;
  },
  set capacity(value) {
    this._capacity = value;
  },
  save: function() {
    // remember the context since in callback it is changed
    var that = this;
    var doc = {name: this.name, capacity: this.capacity};

    Tutorials.insert(doc, function(error, result) {
      that._id = result;
    });
  }
};
