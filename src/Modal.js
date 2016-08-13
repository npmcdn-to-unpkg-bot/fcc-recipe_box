// import React from 'react'

class Modal extends React.Component {

  constructor() {
    super();
    this.state = {display: "none"};
    window.addEventListener("click", (e) => {
      if(e.target.id === "modal") {
        this.props.closeModal();
      }
    });
    //close modal on "Esc"
    document.addEventListener('keyup', (e) => {
      if (e.keyCode === 27) {
        this.props.closeModal();
      }
    });
  }

  render() {
    const display = this.props.display;
    return (
      <div id="modal" style={{display: display}} className="modal-dialog">
        <div className="modal-content">
        <ModalTitle title={this.props.title}/>
        <ModalInput />
        <ModalInput />
        <ModalButton title={"Add"} />
        <ModalButton title={"Close"} clicked={this.props.closeModal}/>
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
        <input placeholder={this.props.placeholder}>
        </input>
      </div>
    );
  }
}

ModalInput.defaultProps = {title: "Title", placeholder: "Input here..."};

class ModalButton extends React.Component {
  render() {
    return (
      <button onClick={this.props.clicked}>
        {this.props.title}
      </button>
    );
  }
}
ModalButton.defaultProps = {title: "Button", clicked: () => {console.log("click");}};

window.Modal = Modal;
