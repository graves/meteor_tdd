"use strict";

describe("Tutorial", function() {
  it("should be created by admins", function(done) {
    // login to system and wait for callback
    Meteor.loginWithPassword("admin@example.com", "admin420", function(err) {
      // check if we correctly logged into the system
      expect(err).toBeUndefined();

      // create new tutorial
      var tut = new Tutorial();

      // save the tutorial and use callback function to check for existence
      var id = tut.save(function(error, result) {
        expect(error).toBeUndefined();

        // delete created tutorial
        Tutorials.remove(id);

        Meteor.logout(function() {
          done();
        });
      });
    });
  });

  it("should not be created by non admins", function(done) {
    // login to system and wait for callback
    Meteor.loginWithPassword("normal@example.com", "normal420", function(err) {
      // check if we correctly logged into the system
      expect(err).toBeUndefined();

      // create a new tuturial
      var tut = new Tutorial();

      // save the tuturial and use callback function to check for existence
      var id = tut.save(function(error, result) {
        expect(error.reason).toBe("Access denied");

        Meteor.logout(function() {
          done();
        });
      });
    });
  });


});
