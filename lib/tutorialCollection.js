Tutorials = new Meteor.Collection("tutorials", {
  transform: function(doc) {
    return new Tutorial(doc._id, doc.name, doc.capacity, doc.owner);
  }
});

Tutorials.allow({
  insert: function(userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    return (userId && doc.owner == Meteor.userId() && Roles.userIsInRole(userId, "admin"));
  },
  remove: function(userId, doc) {
    // the user must be logged in, and the document must be owned by the user
    return (userId && doc.owner == Meteor.userId() && Roles.userIsInRole(userId, "admin"));
  }
});

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
  save: function(callback) {
    if (!this.name) {
      throw new Meteor.Error("Name must not be empty!");
    }
    if (!this.capacity) {
      throw new Meteor.Error("Capacity mus be greater than 0");
    }
    // remember the context since in callback it is changed
    var that = this;
    var doc = {name: this.name, capacity: this.capacity, owner: Meteor.userId()};

    Tutorials.insert(doc, function(error, result) {
      that._id = result;

      if (callback != null) {
        callback.call(that, error, result);
      }
    });
  }
};

if (Meteor.isServer) {
  Meteor.methods({
    removeTutorial: function(id) {
      if (!Meteor.user() || !Roles.userIsInRole(Meteor.user(), "admin")) {
        throw new Meteor.Error(403, "Access Denied Punk");
      }
      if (TutorialRegistrations.find({tutorialId: id}).count() > 0) {
        throw new Meteor.Error(406, "Tutorial has registrations");
      }
      Tutorials.remove(id);
    }
  });
}
