import React, { Component } from "react";

import Form from "./Form";
import DeleteButton from "./DeleteButton";

class CatList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cats: [],
      formText: { name: "", age: "", race: "", description: "" }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  componentDidMount() {
    try {
      fetch("http://localhost:8000/api/cat/")
        .then(res => res.json())
        .then(cats => this.setState({ cats }));
    } catch (e) {
      console.log(e);
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState(prevState => ({
      formText: { ...prevState.formText, [name]: value }
    }));
  }

  async handleAdd(event) {
    try {
      event.preventDefault();
      const { name, age, race, description } = this.state.formText;
      const lead = { name, age, race, description };
      const endpoint = "http://localhost:8000/api/cat/";
      const config = {
        method: "post",
        body: JSON.stringify(lead),
        headers: new Headers({ "Content-Type": "application/json" })
      };
      await fetch(endpoint, config);
      fetch("http://localhost:8000/api/cat/")
        .then(res => res.json())
        .then(newCats => this.setState({ cats: newCats }));
      console.log("Dodano");
    } catch (e) {
      console.log(e);
    }
  }

  handleDelete = catId => {
    try {
      const endpoint = "http://localhost:8000/api/cat/" + catId;
      const config = {
        method: "delete",
        body: "",
        headers: new Headers({ "Content-Type": "application/json" })
      };
      fetch(endpoint, config);
      const cats = this.state.cats.filter(cat => cat.id !== catId);
      this.setState({ cats });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const Kats = this.state.cats.map(cat => (
      <div key={cat.id}>
        <h1>Imię: {cat.name}</h1>
        <h2>Wiek: {cat.age}</h2>
        <h2>Rasa: {cat.race}</h2>
        <br />
        <span>
          <b>Opis:</b> {cat.description}
        </span>
        <hr />
        <DeleteButton id={cat.id} onDelete={this.handleDelete} />
      </div>
    ));

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <Form
              onAdd={this.handleAdd}
              onChange={this.handleChange}
              formText={this.state.formText}
            />
            <br />
            {Kats}
            <br />
          </div>
        </div>
      </div>
    );
  }
}

export default CatList;