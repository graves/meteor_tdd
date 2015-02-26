(function() {
"use strict";

describe("Tutorial", function() {
  it("should be created with name and capacity", function() {
    spyOn(Tutorials, "insert").and.callFake(function(doc, callback) {
      // simulate async return of id = "1";
      callback(null, "1");
    });

    var tutorial = new Tutorial(null, "Tutorial 1", 20);

    expect(tutorial.name).toBe("Tutorial 1");
    expect(tutorial.capacity).toBe(20);

    tutorial.save();

    // id should be defined
    expect(tutorial.id).toEqual("1");
    expect(Tutorials.insert).toHaveBeenCalledWith({name: "Tutorial 1", capacity: 20, owner: null, currentCapacity: 0}, jasmine.any(Function));
  });

  it("should not be deleted if it has active registrations", function() {
    spyOn(Roles, "userIsInRole").and.returnValue(true);
    spyOn(Tutorials, "remove");
    spyOn(TutorialRegistrations, "find").and.returnValue({count: function() { return 2 }});

    try {
      Meteor.methodMap.removeTutorial("1");
    }
    catch(ex) {
      expect(ex).toBeDefined();
    }
    expect(Meteor.methodMap.removeTutorial).toThrow();
    expect(TutorialRegistrations.find).toHaveBeenCalledWith({tutorialId: "1"});
    expect(Tutorials.remove).not.toHaveBeenCalled();
  });

  it("should not save if name is not defined", function() {
    var tut = new Tutorial(null, "", 20);

    expect(function() { tut.save(); }).toThrow();
  });

  it("should not save if capacity is not defined", function() {
    var tut = new Tutorial(null, "Name", null);

    expect(function() { tut.save(); }).toThrow();
  });

  it("should allow students to register", function() {
    var model = new Tutorial("1", "Name", 10, 5);
    var studentId = "2";
    spyOn(TutorialRegistrations, "insert").and.callFake(function(data, callback) {
      callback(null);
    });
    spyOn(Tutorials, "update");
    spyOn(Tutorials, "findOne").and.returnValue(null)
    model.registerStudent(studentId);

    expect(model.currentCapacity).toBe(6);
    expect(TutorialRegistrations.insert).toHaveBeenCalled();
    expect(TutorialRegistrations.insert.calls.mostRecent().args[0]).toEqual({ tutorialId: "1", studentId: "2" });
    expect(Tutorials.update).toHaveBeenCalledWith({_id: "1"}, {$inc: {currentCapacity: 1}});
  });

  it("should not be possible to register while at maximum capacity", function() {
    var model = new Tutorial(1, "Name", 5, 5);

    expect(function() { model.registerStudent(1) }).toThrow("Capacity of tutorial has been reached!");
  });

  it("should not be possible to register if registration present", function() {
    var tut = new Tutorial(1, "Name", 10, 9);
    spyOn(TutorialRegistrations, "findOne").and.returnValue({});

    expect(function() { tut.registerStudent(1) }).toThrow("Student already registered!");
  });

  it("should not be possible to de-register if registration not present", function() {
    var tut = new Tutorial(1, "Name", 10, 9);
    spyOn(Tutorials, "findOne").and.returnValue();

    expect(function() { tut.removeRegistration(1) }).toThrow("Student not registered!");
  });

  it("should be possible to de-register if registered", function() {
    var tut = new Tutorial(1, "Name", 10, 9);
    spyOn(TutorialRegistrations, "findOne").and.returnValue({});
    spyOn(TutorialRegistrations, "remove");
    spyOn(Tutorials, "update");
    tut.removeRegistration(2);

    expect(TutorialRegistrations.remove).toHaveBeenCalledWith({tutorialId: 1, studentId: 2});
    expect(Tutorials.update).toHaveBeenCalledWith({_id: 1}, {$inc: {currentCapacity: -1}});
  });

});

})();
