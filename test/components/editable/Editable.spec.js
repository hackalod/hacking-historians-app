import { React, TestUtils, testdom, fixtures } from '../../react-helpers';
import Editable from '../../../src/components/editable/Editable.jsx';

import Actions from '../../../src/actions/index.js';

describe("Editable", () => {
  let element;

  beforeEach(()=>{
    testdom('<html><body></body></html>');
  });

  describe("editing mode", () => {

    beforeEach(()=>{
      Actions.updateModelProp = sinon.spy();
      element = renderEditable('title', 'hello', true);
    });

    it("renders a textarea", ()=> {
      expect(element.tagName).to.equal('TEXTAREA');
    });

    it("has the correct classes", ()=> {
      let classes = element.className.split(" ");
      expect(classes).to.contain('title');
      expect(classes).to.contain('editable');
    });

    it("sets the default value", ()=> {
      expect(element.textContent).to.equal('hello');
    });

    describe("on blur", () =>{
      let value;

      beforeEach(() => {
        value = "Hello World";
        TestUtils.Simulate.blur(element, { target: { value: "Hello World" } });
      });

      it("updates the prop on the model", ()=>{
        let propName = 'title';
        expect(Actions.updateModelProp).to.be.calledWith({ propName, value });
      })
    });
  });

  describe("non-editing mode", () => {

    beforeEach(()=>{
      element = renderEditable('title', 'hello', false);
    });

    it("renders a h1 element if title", ()=> {
      expect(element.tagName).to.equal('H1');
    });

    it("renders a p element if summary", ()=> {
      element = renderEditable('summary', 'hello', false);
      expect(element.tagName).to.equal('P');
    });

    it("renders a div element by default", ()=> {
      element = renderEditable('description', 'hello', false);
      expect(element.tagName).to.equal('DIV');
    });

    it("has the correct classes", ()=> {
      let classes = element.className.split(" ");
      expect(classes).to.contain('title');
      expect(classes).to.contain('editable');
    });

    it("sets the default value", ()=> {
      expect(element.textContent).to.equal('hello');
    });
  });


  function renderEditable(fieldName, value, editing){
    let container = TestUtils.renderIntoDocument(
      <Editable fieldName={ fieldName } value={ value } editing={ editing }/>
    )
    let element = React.findDOMNode(container);
    return element;
  }
});
