import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Feedback from './pages/Feedback';
import Game from './pages/Game';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Ranking from './pages/Ranking';
import Setup from './pages/Setup';

export default function App() {
  return (
    <Switch>
      <Route exact path="/" component={ Login } />
      <Route path="/game" component={ Game } />
      <Route path="/setup" component={ Setup } />
      <Route path="/feedback/:id" component={ Feedback } />
      <Route path="/ranking" component={ Ranking } />
      <Route component={ NotFound } />
    </Switch>
  );
}
