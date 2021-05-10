import {BrowserRouter, Switch, Route} from 'react-router-dom';
import HomePage from './pages/HomePage';
import NewAsteroidField from './pages/asteroidField/NewAsteroidField';
import PersistedAsteroidField from './pages/asteroidField/PersistedAsteroidField';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <main>
      <nav className='navbar navbar-expand-lg bg-light'>
        <a className='text-sm-center nav-link' aria-current='page' href='/'>
          <i className='bi bi-house me-1' />
          Home
        </a>
        <a className='text-sm-center nav-link' href='/asteroid-field/new'>
          <i className='bi bi-plus-circle me-1' />
          New Asteroid Field
        </a>
      </nav>
      <BrowserRouter>
        <Switch>
          <Route path='/asteroid-field/new'>
            <NewAsteroidField />
          </Route>
          <Route path='/asteroid-field/:uid'>
            <PersistedAsteroidField />
          </Route>
          <Route path='/'>
            <HomePage />
          </Route>
        </Switch>
      </BrowserRouter>
    </main>
  );
}

export default App;
