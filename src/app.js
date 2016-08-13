// Setting localStorage for testing purposes
// localStorage.setItem("recipes", '[{"title": "testMeal_1", "ingredients": ["ingredient_1", "ingredient_2"]}, {"title": "testMeal_2", "ingredients": ["ingredient_1", "ingredient_2"]}]');

class Layout extends React.Component {
  constructor() {
    super();
    const url = "sample_recipes.json";
    const recipes = JSON.parse(localStorage.getItem("recipes"));
    this.state = recipes ? {"recipes": recipes} : {"recipes": []};
    if (!this.state.recipes.length) {
      this.getJson(url);
    }
  }

  getJson(url) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === 4 && request.status === 200) {
        this.setState({"recipes": request.response});
      }
    }
    request.open("GET", url);
    request.responseType = "json";
    request.send();
  }

  render() {
    return (
      <div>
      {JSON.stringify(this.state.recipes)}
      </div>
    );
  }
}

ReactDOM.render(
  <Layout />, document.getElementById('app')
);
