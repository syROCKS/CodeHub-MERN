import React from 'react';
import './Home.css';
import Button from '../../shared/components/FormElements/Button';

const Home = () => {
  return (
    <div className="home">
      <div className="home__main">
        <div className="home__main-text center">
          <div className="home__main-text__content">
            <h1>Welcome to CodeHub</h1>
            <h3>Code it now!</h3>
            <div className="home__main-text__actions">
              <Button to={'/auth'}>Get Started!</Button>
            </div>
          </div>
        </div>
        <div className="home__main-animation">
          <img src='/S5_Working from Home.jpg' className='home__main-animation__img'/>
        </div>
      </div>
    </div>
  );
};

export default Home;
