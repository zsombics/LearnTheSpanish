import React, { useContext } from 'react';
import UserContext from '../../UserContext';
import '../../styles/Home.css';

function Home() {
  const { user } = useContext(UserContext);
  return (
    <div className="main_container" id="home">
      {/* Banner Image */}
      <div className="banner_image">
        <div className="banner_content">
          <h1>
            Lingua Hispanica<br />
            <span>mutat vitam tuam.</span>
          </h1>
          <p>
          "A spanyol nyelv révén megnyílnak a világ kapui, és új jövő felé világítják az utat." Tanulj interaktív módon, és alakítsd át az életed!
          </p>
        </div>
      </div>


      {/* Services Section */}
      <div className="services" id="services">
        <h1 className="title">Szolgáltatásaink</h1>
        <p>
          Platformunk modern eszközöket kínál a spanyol nyelv elsajátításához. Fedezd fel interaktív kvízeinket, korszerű tanulási módszereinket, és támogató közösségünket, melyek segítségével hatékonyan fejlődhetsz!
        </p>

        <div className="diff_services">
          <div className="diff_service_item">
            <img src="https://www.dragnsurvey.com/blog/en/wp-content/uploads/2024/02/quiz-line-computer.jpg" alt="Service_image" />
            <h3>Interaktív Kvízek</h3>
            <p>
              Valós időben ellenőrizheted a tudásodat, és fejlődhetsz minden szinten.
            </p>
          </div>
          <div className="diff_service_item">
            <img src="https://fairgaze.com/images/UploadedImages/thumbs/0297905_0297905_Thinking.jpg" alt="Service_image" />
            <h3>Modern Módszerek</h3>
            <p>
            Az aktuális technológiák és dizájn ötvözése a hatékony tanulásért.
            </p>
          </div>
          <div className="diff_service_item">
            <img src="https://images.pexels.com/photos/3184408/pexels-photo-3184408.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Service_image" />
            <h3>Közösségi Élmény</h3>
            <p>
            Csatlakozz a tanulni vágyók közösségéhez, osszátok meg tapasztalataitokat!
            </p>
          </div>
        </div>
      </div>

      {/* About us Section */}
      <div className="about" id="about">
        <h1 className="title">Rólunk</h1>
        <p>
          A Spanyol Oktató Program egy innovatív online platform, ahol a spanyol nyelv tanulása élmény és kaland egyben. Célunk, hogy modern, interaktív és hatékony tanulási módszereket kínáljunk mindenkinek, aki szeretné elsajátítani ezt a csodálatos nyelvet, miközben mélyebb betekintést nyer a spanyol kultúrába.
        </p>
        <div className="btn">
          {user ? (
            <a href="/kviz">Kezdjen el tanulni</a>
          ) : (
            <a href="/regisztracio">Csatlakozz hozzánk</a>
          )}
        </div>
      </div>

      {/* Arrow */}
      <div className="arrow">
        <a href="/"><img src="https://i.imgur.com/wre6n0O.png" alt="up_arrow" /></a>
      </div>
    </div>
  );
}

export default Home;
