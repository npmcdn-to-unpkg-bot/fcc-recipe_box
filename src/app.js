// import React from 'react';
// import ReactDOM from 'react-dom';
// import Modal from 'Modal.js'

// Setting localStorage for testing purposes
// localStorage.setItem("recipes", '[{"title": "testMeal_1", "ingredients": ["ingredient_1", "ingredient_2"]}, {"title": "testMeal_2", "ingredients": ["ingredient_1", "ingredient_2"]}]');

class Layout extends React.Component {
  constructor() {
    super();
    this.state = {"recipes": []};
  }

  componentDidMount() {
    const recipes = JSON.parse(localStorage.getItem("recipes"));
    const url = "./sample_recipes.json";

    (!recipes) ? this.getJson(url) : this.setState({recipes});
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
        <Recipes data={this.state.recipes} />
        <AddRecipeButton />
      </div>
    );
  }
}

class Recipes extends React.Component {

  getRecipes() {
    let result = [];
    for (let i = 0; i < this.props.data.length; i++) {
      result.push(<Recipe key={i} data={this.props.data[i]}/>)
    }
    return result;
  }

  render() {
    const recipes = this.getRecipes();
    return (
      <div className="recipes">
        {recipes}
      </div>
    );
  }
}

class Recipe extends React.Component {

  getIngredients() {
    let result = [];
    for (let i = 0; i < this.props.data.length; i++) {
      result.push(<Ingredients key={i} data={this.props.data[i]["ingredients"]} />);

      // this.setState({title: this.props.data[i]["title"]});
    }
    console.log(result);
    return result;
  }
  render() {
    console.log("Recipe, render, this.props", this.props);
    // const title = this.props.data.title;
    const ingredients = this.getIngredients();
    return (
      <div>
        <RecipeTitle title={this.props.data.title} />
        <Ingredients data={this.props.data["ingredients"]} />
      </div>
    );
  }
}

class RecipeTitle extends React.Component {
  render() {
    console.log("RecipeTitle props", this.props.data);
    // console.log("RecipeTitle", this.props.data[0].title);
    return (
      <div>
        {this.props.title}
      </div>
    );
  }
}

class Ingredients extends React.Component {
  parseData() {
    const dataArr = this.props.data;
    let result = [];
    for(let i = 0; i < dataArr.length; i++) {
      result.push(<div key={i}>{dataArr[i]}</div>)
    }
    return result;
  }
  render() {
    console.log("Ingredients", this.props.data);
    const ingredients = this.parseData();
    return (
      <div>
        {ingredients}
      </div>
    );
  }
}

class AddRecipeButton extends React.Component {
  constructor() {
    super();
    this.state = {display: "none"}
    // this.state = {display: "block"}
  }

  openModal() {
    console.log("clicked");
    this.setState({display: "block"});
  }
  closeModal() {
    this.setState({display: "none"});
  }
  render() {
    console.log("AddRecipeButton this.state.display", this.state.display);
    const display = this.state.display;
    return (
      <div className="mod">
      <button id="openModal" onClick={() => this.openModal()}>
        Add Recipe
      </button>
      <Modal display={this.state.display} closeModal={this.closeModal.bind(this)} title="Add Recipe"/>
    </div>
    );
  }
}

ReactDOM.render(
  <Layout />, document.getElementById('app')
  );
