describe("Homepage", () => {
  it("should load successfuy", () => {
    cy.visit("/");
  });
  it("should contain right spelled texts", () => {
    cy.contains("Users");
    cy.contains("Admin");
    cy.contains("Login");
    cy.get("mat-select").click();
    cy.contains("Register");
  });
});
