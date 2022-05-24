import React from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import Game from './Pages/Game';
import Setup from './Pages/Setup';
import NotFound from './Pages/NotFound';
import Login from './Pages/Login';

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={ Login } />
      <Route path="/game" component={ Game } />
      <Route path="/setup" component={ Setup } />
      <Route component={ NotFound } />
    </Switch>
  );
}
