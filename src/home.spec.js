//this is the Visual Regression test using APPLITOOLS AND CYPRESS
<reference types="cypress" />
context('Home', ()=>{

    beforeEach(() =>{
        cy.visit('http://159.203.124.196:3000');
    })

    it('should look the same', () =>{
        cy.eyesOpen({
          appName: 'Budget',
          testName: 'Hompage Check'
        });
        cy.eyesCheckWindow();
        cy.eyesClone();
      })

})
