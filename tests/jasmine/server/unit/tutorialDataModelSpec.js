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

});

})();
