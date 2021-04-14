describe("Users Page", () => {
  it("should load users table", () => {
    cy.visit("/");
    cy.get('[routerlink="users"]').click();
    cy.get(".mat-table");
  });
  it("should display columns name", () => {
    cy.contains("Id");
    cy.contains("Name");

    cy.contains("Email");
    cy.contains("Role");
  });
  it("should navigate to next page", () => {
    cy.get('[aria-label="Next page"]').click();
  });

  it("should filter users by Username", () => {
    cy.get('[placeholder="Search UserName"]').type("test4");
    cy.get("mat-table").find("mat-row").should("have.length", 4);
  });
});
