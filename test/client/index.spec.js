let component = (
  <div>
    <h1>Test Component</h1>
  </div>
);

describe('client tests', () => {
  it('should render something', () => {
    let wrapper = shallow(component);

    expect(wrapper.contains(<h1>Test Component</h1>)).to.equal(true);
  });
});
