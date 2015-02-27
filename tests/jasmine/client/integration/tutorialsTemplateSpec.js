describe("Tutorials template", function() {
  it("should show a list of tutorials when there are some available", function() {
    var div = document.createElement("DIV");
    var data = {tutorials: [{}, {}]};
    data.tutorials.count = function() { return 2; }

    Blaze.renderWithData(Template.tutorials, data, div);

    expect($(div).find(".tutorialLine").length).toEqual(2);
  });

  it("should show a warning when there are no tutorials available", function() {
    var div = document.createElement("DIV");
    Blaze.renderWithData(Template.tutorials, {tutorials: {count: function() { return 0; }}}, div);

    expect($(div).find("#noTutorialsWarning")[0]).toBeDefined();
  });
});
