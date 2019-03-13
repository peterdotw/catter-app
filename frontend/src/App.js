import React, { Component } from "react";

import Header from "./Header";
import Form from "./Form";
import DeleteButton from "./DeleteButton";

class App extends Component {
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
      fetch("http://127.0.0.1:8000/api/cat")
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

  handleAdd = event => {
    event.preventDefault();
    const { name, age, race, description } = this.state.formText;
    const lead = { name, age, race, description };
    const endpoint = "http://localhost:8000/api/cat/";
    const config = {
      method: "post",
      body: JSON.stringify(lead),
      headers: new Headers({ "Content-Type": "application/json" })
    };
    fetch(endpoint, config);
    fetch("http://127.0.0.1:8000/api/cat")
      .then(res => res.json())
      .then(cats => this.setState({ cats }));
    console.log("Dodano");
  };

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
        <hr />
        <span>
          <b>Opis:</b> {cat.description}
        </span>
        <hr />
        <DeleteButton id={cat.id} onDelete={this.handleDelete} />
      </div>
    ));

    return (
      <div>
        <Header />
        <Form
          onAdd={this.handleAdd}
          onChange={this.handleChange}
          formText={this.state.formText}
        />
        {Kats}
        <br />
      </div>
    );
  }
}

export default App;
