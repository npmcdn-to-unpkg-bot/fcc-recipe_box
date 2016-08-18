
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

        // if (!this.state.modalAdd && !this.state.showModalEdit) {
        //   console.log("no modals open");
        //   this.titleClicked();
        // }

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
        saveRecipe={this.saveRecipe.bind(this, dataArr, dataArr[i].id)}
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
      modalInputOneValue: this.state.newTitle,
      newIngr: undefined,
      modalInputTwoValue: this.state.newIngr
    })
    // closa all tabs
    this.titleClicked(arr, -1);
  }

  showModalEdit(arr, id) {
    console.log("modalEdit clicked");
    this.setState({showModalEdit: true})
    this.setState({newTitle: arr[id].title})
    this.setState({newTitle: arr[id].ingredients.join(",")})
    let title = this.state.newTitle;
    // const recipes = this.state.recipes.slice(); // arr
    // const id = this.state.recipes.length; // id
    let ingrList = this.state.newIngr;
    const ingredients = this.joinArray(ingrList);

    if (title || ingredients) {
      if (!title) {
        title = "Recipe"
      }
      // recipes.push({id, title, ingredients})
      arr[id].title = title;
      arr[id].ingredients = ingredients
    }
    this.setState({newTitle: "", newIngr: "", modalAdd: false, arr})
    localStorage.setItem("recipes", JSON.stringify(arr));

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

    console.log(title, ingredients);
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

  // editRecipe(arr, i) {
  //   console.log("editRecipe");
  //
  // }

  saveRecipe(recipes, id) {
    // console.log("save clicked", arr, id);

    let title = this.state.newTitle;
    // const recipes = this.state.recipes.slice(); // arr
    // const id = this.state.recipes.length; // id
    let ingrList = this.state.newIngr;
    const ingredients = ingrList.split(",");

    if (title || ingredients) {
      if (!title) {
        title = "Recipe"
      }
      // recipes.push({id, title, ingredients})
      recipes[id].title = title;
      recipes[id].ingredients = ingredients
    }
    this.setState({newTitle: "", newIngr: "", showModalEdit: false, recipes})
    localStorage.setItem("recipes", JSON.stringify(recipes));


  }
  parseIngrList(text='') {
    return text.split(",")
  }
  joinArray(arr) {
    return arr.join(", ")
  }
  closeModal() {
    this.setState({modalAdd: false, newTitle: "", newIngr: ""})
  }
  closeModalEdit() {
    this.setState({showModalEdit: false})
  }
  newTitle(e) {
    console.log("newTitle");
    let content = e.target.value;
    console.log(content);
    this.setState({newTitle: content})
  }
  newIngr(e) {
    let content = e.target.value;
    console.log(content);
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
    // console.log(this.state);
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
          display={this.state.modalAdd}
          modalTitle={this.state.modalTitle}
          btnOne={this.state.btnOneTitle}
          btnTwo={this.state.btnTwoTitle}
          modalInputOneValue={this.state.newTitle}
          modalInputTwoValue={this.state.newIngr}
          newTitleValue={this.state.newTitle}
          closeModal={this.closeModal.bind(this)}
          btnOneClicked={this.addRecipe.bind(this)}
          newTitle={this.newTitle.bind(this)}
          newIngr={this.newIngr.bind(this)}
          value={this.state.newTitle}
          valueIngr={this.state.newIngr} />
      </div>
    )
  }
}

class Recipe extends React.Component {
  // constructor() {
  //   super();
  //   this.state = {showModalEdit: false}
  // }
  render() {
    // console.log("recipe, props", this.props);
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
    // <ModalEdit
    //   windowTitle={"Edit recipe"}
    //   recipe={this.props.title}
    //   ingredients={this.props.ingredients}
    //   display={this.props.showModalEdit}
    //   newTitle={this.props.newTitle}
    //   closeModal={this.props.closeModalEdit}
    //   saveClicked={this.props.saveRecipe} />
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
    // console.log("ingr, props", this.props);
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
    return arr.join(",")
  }

  render() {
    if(this.props.ingredients) {
      const ingredients = this.stringifyArray(this.props.ingredients)
    }
    const display = (this.props.display) ? "block" : "none";
    // console.log("Modal Add display", display);
    // console.log(this.props.ingredients);
    return (
      <div id="modal" style={{display}} className="modal-dialog">
        <div className="modal-content">
        <div>{this.props.modalTitle}</div>
        <p>Recipe title</p>
        <textarea id="inputTitle" rows={1} cols={20} placeholder={"Input recipe title"}
        value={this.props.modalInputOneValue} onChange={this.props.newTitle}/>
        <br />
        <p>Ingredients</p>
        <textarea id="inputIngredients" placeholder={"Input ingredients (separeted with comma)"}
          rows={5} cols={20} value={this.props.modalInputTwoValue} onChange={this.props.newIngr}/>
        <br />
        <Button title={this.props.btnOne} clicked={this.props.btnOneClicked}/>
        <Button title={this.props.btnTwo} bgColor={"gray"} clicked={this.props.closeModal}/>
        </div>
      </div>
    );
  }
}

// class ModalEdit extends React.Component {
//   stringifyArray(arr) {
//     return arr.join(",")
//   }
//   render() {
//     const ingredients = this.stringifyArray(this.props.ingredients)
//     // console.log("modal edit props", this.props);
//     const display = (this.props.display) ? "block" : "none";
//     // console.log("Modal Edit display", display);
//     return (
//       <div id="modalEdit" style={{display}} className="modal-dialog">
//         <div className="modal-content">
//         <ModalTitle title={this.props.windowTitle}/>
//         <p>Recipe title</p>
//         <textarea id="editInputTitle" rows={1} cols={20} autoFocus value={"testing"} onChange={this.props.newTitle} />
//         <br />
//         <p>Ingredients</p>
//         <textarea id="editInputIngredients" rows={5} cols={20} defaultValue={ingredients} onChange={this.props.newIngr} />
//         <br />
//         <Button title={"Save"} clicked={this.props.saveClicked}/>
//         <Button title={"Close"} bgColor={"gray"} clicked={this.props.closeModal}/>
//         </div>
//       </div>
//     );
//   }
// }

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
