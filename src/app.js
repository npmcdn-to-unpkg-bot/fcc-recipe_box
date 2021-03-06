// var ReactTransitionGroup = React.addons.CSSTransitionGroup;

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
      modalInputTwoValue: "",
      ingrVisible: false
      };

    window.addEventListener("click", (e) => {
      if(e.target.id === "modal" || e.target.id === "modalEdit") {
        this.closeModal();
      }
    });
    // close modal on "Esc"
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 27) {
        if (this.state.modalAdd) {
          this.closeModal();
        } else {
          this.titleClicked();
        }
      }
    });
  }

  componentDidMount() {
    // getting data to this.state.recipes from localStorage
    let fromStorage = JSON.parse(localStorage.getItem("recipes"));
    // if no data in localStorage load sample data
    fromStorage ? fromStorage : fromStorage = sample_recipes;
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
        // visible={this.ingrVisible.bind(this, dataArr[i].show)}
        titleClicked={this.titleClicked.bind(this, dataArr, dataArr[i].id)}
        deleteRecipe={this.deleteRecipe.bind(this, dataArr, dataArr[i].id)}
        editRecipe={this.showModalEdit.bind(this, dataArr, dataArr[i].id)}
        newTitle={this.newTitle.bind(this)}
        showModalEdit={this.state.showModalEdit}
        />);
    }
    return result;
  }
  ingrVisible(is) {
    console.log("ingrVisible");
    this.setState({ingrVisible: is})
    return is;
  }
  // toggle clicked recipe
  titleClicked(arr = this.state.recipes, id = -1) {
    arr.map((item, i) => {
      if (i !== id) {
        return item.show = false;
      }
    })
    if (id > -1) {
      arr[id].show = arr[id].show ? false : true;
    }
    this.setState({
      recipes: arr
    })
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
      // newIngr: this.joinArray(arr[id].ingredients),
      newIngr: arr[id].ingredients.join(";"),
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
      ingredients = ingrList.split(";");
    }

    if (title || ingredients) {
      if (!title) {
        title = "Recipe"
      }
      recipes.push({id, title, ingredients})
    }
    // this.setState({newTitle: "", newIngr: "", modalAdd: false, recipes})
    this.setState({recipes});
    this.closeModal();
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }

  deleteRecipe(arr, i) {
    arr.splice(i, 1);
    this.setState({recipes: arr})

    // uncomment this to load default recipes if all recipes are deleted
    // if (arr.length === 0) {
    //   localStorage.removeItem("recipes");
    //   return
    // }

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

    this.setState({recipes});
    this.closeModal();
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }

  closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.add("modal-close");
    setTimeout(() => {
      this.setState({modalAdd: false, newTitle: "", newIngr: ""});
      modal.classList.remove("modal-close");
    }, 200)
  }

  newTitle(e) {
    let content = e.target.value;
    this.setState({newTitle: content})
  }

  newIngr(e) {
    let content = e.target.value;
    this.setState({newIngr: content})
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
        <button className="btn btn-add" onClick={this.showModalAdd.bind(this, this.state.recipes)}>Add recipe</button>
        <Footer />
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
    // console.log(this.props);
    const style = {
      border: "1px solid lightgray"
    }
    return (
      <div style={style}>
        <div className="recipe-title" onClick={this.props.titleClicked}>{this.props.title}</div>
        <Ingredients
          data={this.props.ingredients}
          display={this.props.visible}
          titleClicked={this.props.titleClicked}
          deleteRecipe={this.props.deleteRecipe}
          editRecipe={this.props.editRecipe} />
      </div>
    );
  }
}

class Ingredients extends React.Component {

  getItemList() {
    if (this.props.data) {
      let addClass = this.props.display ? "ingrListItem" : "ingrHideItem";
      return this.props.data.map((item, i) => {
        return <div key={i} className={addClass}>{item}</div>
      })
    }
  }
  // componentWillRender() {
  //   console.log("componentWillRender");
  // }

  render() {
    console.log(this.props);
    const display = (this.props.display) ? "block" : "none";
    let ingrListClass = "ingredientsList"


    return (
      <div className={ingrListClass} style={{display}}>
        {this.getItemList()}
        <button className="btn btn-ingr btn-red" onClick={this.props.deleteRecipe}>Delete</button>
        <button className="btn btn-ingr btn-blue" onClick={this.props.editRecipe}>Edit</button>
      </div>
    );
  }
}

class Footer extends React.Component {
  render() {
    return (
      <footer>
      <a href="https://github.com/jenovs/fcc-recipe_box" target="_blank">Source code on GitHub</a>
      </footer>
    )
  }
}

class Modal extends React.Component {
  stringifyArray(arr) {
    return arr.join(";\n")
  }

  render() {
    // console.log("modal props", this.props);
    if(this.props.ingredients) {
      const ingredients = this.stringifyArray(this.props.ingredients)
    }
    const display = (this.props.display) ? "block" : "none";
    console.log("props", this.props);
    const btnOneClicked = (this.props.type) == "Add" ? this.props.btnOneClicked : this.props.btnSaveClicked
    return (
      <div id="modal" style={{display}} className="modal-dialog">
        <div className="modal-content">
        <div className="modalTitle">{this.props.modalTitle}</div>
        <div className="inputs">
        <p>Recipe title</p>
        <textarea id="inputTitle" autoFocus rows={1} cols={40} placeholder={"Input recipe title"}
        value={this.props.modalInputOneValue} onChange={this.props.newTitle}/>
        <br />
        <p>Ingredients</p>
        <textarea id="inputIngredients" placeholder={"Input ingredients (separeted with semicolon (;))"}
          rows={4} cols={40} value={this.props.modalInputTwoValue} onChange={this.props.newIngr}/>
        <br />
        </div>
        <button className="btn btn-modal btn-blue" title={this.props.btnOne} onClick={btnOneClicked}>{this.props.btnOne}</button>
        <button className="btn btn-modal btn-red" title={this.props.btnTwo} onClick={this.props.closeModal}>{this.props.btnTwo}</button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <App />, document.getElementById('app')
  );
