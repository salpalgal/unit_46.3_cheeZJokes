import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component{
  constructor({numJokesToGet =10}){
    this.state={jokes:[]};
    this.getJokesIfNone = this.getJokesIfNone.bind(this)
    this.getJokes = this.getJokes.bind(this)
    this.generateNewJokes = this.generateNewJokes.bind(this)
  }
  async getJokes(){
    let j = [...this.jokes];
    let seenJokes = new Set()
    try {
      while (j.length < this.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({jokes:j});
      
    } catch (e) {
      console.log(e);
    }
  }
  getJokesIfNone(){
    if (this.jokes.length === 0) this.getJokes();
  }
 
  generateNewJokes() {
    this.setState({jokes:[]});
  }
  vote(id, delta) {
    let allJokes = allJokes => allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    this.setState({jokes:allJokes})
     
  }

  /* render: either loading spinner or list of sorted jokes. */
  render(){
    if (this.jokes.length) {
    let sortedJokes = [...this.jokes].sort((a, b) => b.votes - a.votes);
  
    return (
      <div className="JokeList">
        <button className="JokeList-getmore" onClick={this.generateNewJokes}>
          Get New Jokes
        </button>
  
        {sortedJokes.map(j => (
          <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
        ))}
      </div>
    );
  }
  return null
  }
  }

export default JokeList;
