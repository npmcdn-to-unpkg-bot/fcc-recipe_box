
// Setting localStorage for testing purposes
// localStorage.setItem("recipes", '[{"title": "testMeal_1", "ingredients": ["ingredient_1", "ingredient_2"]}, {"title": "testMeal_2", "ingredients": ["ingredient_1", "ingredient_2"]}, {"title": "testMeal_3", "ingredients": ["ingredient_1", "ingredient_2"]}, {"title": "testMeal_4", "ingredients": ["ingredient_1", "ingredient_2"]}]');

// ==============================================================================

class App extends React.Component {
  constructor() {
    super();
    this.state = {"recipes": [],
      modalAdd: false,
      showModalEdit: false,
      modalTitle: "",
      newTitle: "",
      newIngr: [],
      modalType: "",
      modalType: "Add",
      modalInputOneValue: "",
      modalInputTwoValue: ""
      };

    window.addEventListener("click", (e) => {
      if(e.target.id === "modal" || e.target.id === "modalEdit") {
        this.closeModal();
      }
    });
    // close modal on "Esc"
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) {
        console.log("App, esc pressed");
        if (this.state.modalAdd) {
          this.closeModal();
        } else if (this.state.showModalEdit) {
          this.closeModalEdit();
        } else {
          console.log("no modals open");
          this.titleClicked();
        }
      }
    });
  }

  componentDidMount() {
    // getting data to this.state.recipes from localStorage
    let fromStorage = JSON.parse(localStorage.getItem("recipes"));
    // if no data in localStorage load sample data
    // fromStorage ? fromStorage : fromStorage = sample_recipes;
    // add "show" and "id" properties to recipes
    if (fromStorage) {
      const recipes = fromStorage.map((item, i) => {
        return Object.assign(item, {show: false}, {id: i});
      })
      this.setState({recipes});
    }
  }

  getRecipes() {
    let result = [];
    let dataArr = this.state.recipes;
    for (let i = 0; i < dataArr.length; i++) {
      result.push(
        <Recipe key={dataArr[i].id}
        title={dataArr[i].title}
        ingredients={dataArr[i].ingredients}
        visible={dataArr[i].show}
        titleClicked={this.titleClicked.bind(this, dataArr, dataArr[i].id)}
        deleteRecipe={this.deleteRecipe.bind(this, dataArr, dataArr[i].id)}
        editRecipe={this.showModalEdit.bind(this, dataArr, dataArr[i].id)}
        newTitle={this.newTitle.bind(this)}
        showModalEdit={this.state.showModalEdit}
        closeModalEdit={this.closeModalEdit.bind(this)}
        />);
    }
    return result;
  }

  // toggle clicked recipe
  titleClicked(arr=this.state.recipes, id=-1) {
      arr.map((item, i) => {
          if (i !== id) {
              return item.show = false;
          }
      })
      if(id > -1) {
        arr[id].show = arr[id].show ? false : true;
      }
      this.setState({recipes: arr})
  }

  showModalAdd(arr) {
    this.setState({
      modalAdd: true,
      modalTitle: "Add recipe",
      btnOneTitle: "Add",
      btnTwoTitle: "Cancel",
      newTitle: "",
      modalType: "Add",
      modalInputOneValue: this.state.newTitle,
      newIngr: undefined,
      modalInputTwoValue: this.state.newIngr
    })
    // closa all tabs
    this.titleClicked(arr, -1);
  }

  showModalEdit(arr, id) {
    this.setState({
      modalAdd: true,
      modalTitle: "Edit recipe",
      btnOneTitle: "Save",
      btnTwoTitle: "Cancel",
      newTitle: arr[id].title,
      id: id,
      modalType: "Save",
      modalInputOneValue: this.state.newTitle,
      newIngr: this.joinArray(arr[id].ingredients),
      modalInputTwoValue: this.state.newIngr
    })
  }

  addRecipe() {
    console.log("addRecipe");
    let ingredients;
    let title = this.state.newTitle;
    const recipes = this.state.recipes.slice();
    const id = this.state.recipes.length;
    let ingrList = this.state.newIngr;
    if (ingrList) {
      ingredients = this.parseIngrList(ingrList);
    }

    if (title || ingredients) {
      if (!title) {
        title = "Recipe"
      }
      recipes.push({id, title, ingredients})
    }
    this.setState({newTitle: "", newIngr: "", modalAdd: false, recipes})
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }

  deleteRecipe(arr, i) {
    arr.splice(i, 1);
    this.setState({recipes: arr})
    if (arr.length === 0) {
      localStorage.removeItem("recipes");
      return
    }
    arr.map((item, i) => {
      return Object.assign(item, {show: false}, {id: i})
    })
    localStorage.setItem("recipes", JSON.stringify(arr));
    const fromStorage = JSON.parse(localStorage.getItem("recipes"));
  }

  saveRecipe() {
    let recipes = this.state.recipes;
    let id = this.state.id;
    let title = this.state.newTitle;
    let ingrList = this.state.newIngr;
    const ingredients = ingrList.split(";");

    if (title || ingredients) {
      if (!title) {
        title = "Recipe"
      }
      recipes[id].title = title;
      recipes[id].ingredients = ingredients
    }

    this.setState({newTitle: "", newIngr: "", modalAdd: false, recipes})
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }

  parseIngrList(text='') {
    return text.split(";")
  }

  joinArray(arr) {
    return arr.join(";")
  }

  closeModal() {
    this.setState({modalAdd: false, newTitle: "", newIngr: ""})
  }

  closeModalEdit() {
    this.setState({showModalEdit: false})
  }

  newTitle(e) {
    let content = e.target.value;
    this.setState({newTitle: content})
  }

  newIngr(e) {
    let content = e.target.value;
    this.setState({newIngr: content})
  }

  getCurrentRecipe() {
    const recipes = this.state.recipes.slice();
    const active = recipes.map((item) => {
      if (item.visible) {
        return item
      }
    })
    return active.title
  }

  render() {
    const recipes = this.getRecipes();
    const style = {
      width: "100%",
      maxWidth: "768px",
      margin: "auto"
    }
    let title, ingredients
    return (
      <div style={style}>
        {recipes}
        <Button
          title="Add"
          clicked={this.showModalAdd.bind(this, this.state.recipes)} />
        <Modal
          type={this.state.modalType}
          id={this.state.id}
          display={this.state.modalAdd}
          modalTitle={this.state.modalTitle}
          btnOne={this.state.btnOneTitle}
          btnTwo={this.state.btnTwoTitle}
          modalInputOneValue={this.state.newTitle}
          modalInputTwoValue={this.state.newIngr}
          newTitleValue={this.state.newTitle}
          closeModal={this.closeModal.bind(this)}
          btnOneClicked={this.addRecipe.bind(this)}
          btnSaveClicked={this.saveRecipe.bind(this)}
          newTitle={this.newTitle.bind(this)}
          newIngr={this.newIngr.bind(this)}
          value={this.state.newTitle}
          valueIngr={this.state.newIngr} />
      </div>
    )
  }
}

class Recipe extends React.Component {
  render() {
    const style = {
      border: "1px solid lightgray"
    }
    return (
      <div style={style}>
        <RecipeTitle
          title={this.props.title}
          clicked={this.props.titleClicked}/>
        <Ingredients
          data={this.props.ingredients}
          display={this.props.visible}
          deleteRecipe={this.props.deleteRecipe}
          editRecipe={this.props.editRecipe} />
      </div>
    );
  }
}

class RecipeTitle extends React.Component {
  render() {
    const style = {
      backgroundColor: "lightblue"
    }
    return (
      <div style={style} onClick={this.props.clicked}>
        {this.props.title}
      </div>
    );
  }
}

class Ingredients extends React.Component {
  getItemList() {
    if (this.props.data) {
      return this.props.data.map((item, i) => {
        return <div key={i}>{item}</div>
      })
    }
  }
  render() {
    const display = (this.props.display) ? "block" : "none";
    return (
      <div style={{display}}>
        {this.getItemList()}
        <Button title={"Delete"} className="btn-red" clicked={this.props.deleteRecipe}/>
        <Button title={"Edit"} className="btn-gray" clicked={this.props.editRecipe}/>
      </div>
    );
  }
}

class Button extends React.Component {
    render() {
      return (
        <button onClick={this.props.clicked} className={this.props.className}>
          {this.props.title}
        </button>
      );
    }
}

class Modal extends React.Component {
  stringifyArray(arr) {
    return arr.join(";\n")
  }

  render() {
    console.log("modal props", this.props);
    if(this.props.ingredients) {
      const ingredients = this.stringifyArray(this.props.ingredients)
    }
    const display = (this.props.display) ? "block" : "none";
    console.log("props", this.props);
    const btnOneClicked = (this.props.type) == "Add" ? this.props.btnOneClicked : this.props.btnSaveClicked
    return (
      <div id="modal" style={{display}} className="modal-dialog">
        <div className="modal-content">
        <div>{this.props.modalTitle}</div>
        <p>Recipe title</p>
        <textarea id="inputTitle" rows={1} cols={20} placeholder={"Input recipe title"}
        value={this.props.modalInputOneValue} onChange={this.props.newTitle}/>
        <br />
        <p>Ingredients</p>
        <textarea id="inputIngredients" placeholder={"Input ingredients (separeted with semicolon (;))"}
          rows={5} cols={20} value={this.props.modalInputTwoValue} onChange={this.props.newIngr}/>
        <br />
        <Button title={this.props.btnOne} clicked={btnOneClicked}/>
        <Button title={this.props.btnTwo} bgColor={"gray"} clicked={this.props.closeModal}/>
        </div>
      </div>
    );
  }
}

class ModalTitle extends React.Component {
  render() {
    return (
      <div>
        {this.props.title}
      </div>
    );
  }
}
ModalTitle.defaultProps = {title: "ModalTitle"};

class ModalInput extends React.Component {

  render() {
    return (
      <div>
        {this.props.title}
        <input placeholder={this.props.placeholder} value={this.props.value}>
        </input>
      </div>
    );
  }
}

ModalInput.defaultProps = {title: "Title", placeholder: "Input here..."};

ReactDOM.render(
  <App />, document.getElementById('app')
  );
