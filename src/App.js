import React from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import Game from './pages/Game';
import Setup from './pages/Setup';
import NotFound from './pages/NotFound';
import Login from './pages/Login';

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
