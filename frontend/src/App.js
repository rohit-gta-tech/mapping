import React, { useState, useEffect, Fragment } from 'react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { Room, Star } from '@material-ui/icons'
import axios from 'axios'
import './app.css'
import { format } from 'timeago.js'
import Register from './components/Register'
import Login from './components/Login'
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default

function App() {
  const myStorage = window.localStorage
  const [key, setKey] = useState(null)
  const [currentUser, setCurrentUser] = useState(myStorage.getItem('user') ? myStorage.getItem('user') : null)
  const [pins, setPins] = useState([])
  const [currentPlaceId, setCurrentPlaceId] = useState(null)
  const [newPlace, setNewPlace] = useState(null)
  const [title, setTitle] = useState(null)
  const [desc, setDesc] = useState(null)
  const [rating, setRating] = useState(0)
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [warning, setWarning] = useState(null)
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 46,
    longitude: 17,
    zoom: 4
  })

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get('/api/pins')
        const mapbox_key = await axios.get('api/pins/key')
        setKey(mapbox_key.data)
        setPins(res.data)
      } catch(err) {
        console.log(err)
      }
    }
    getPins()
  }, [])

  const options = {
    boxZoom : !showLogin && !showRegister,
    doubleClickZoom: currentUser && true,
    dragPan: !showLogin && !showRegister,
    dragRotate: !showLogin && !showRegister,
    keyboard: !showLogin && !showRegister,
    scrollZoom: !showLogin && !showRegister,
    touchZoomRotate: !showLogin && !showRegister
  }

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id)
    setViewport({...viewport, latitude: lat, longitude: long})
  }

  const handleAddClick = (e) => {
    const [long, lat] = e.lngLat
    if (currentUser) {
      setNewPlace({lat, long})
    } else {
      setWarning({ lat, long })
      const timer = setTimeout(() => {
        setWarning(null)
      }, 3000)
      return () => {clearTimeout(timer)}
    }
  }
  
  const handleSubmit =  async (e) => {
    e.preventDefault()
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long
    }

    try {
      const res = await axios.post('/pins', newPin)
      setPins([...pins, res.data])
      setNewPlace(null)
    } catch(error) {
      console.log(error)
    }
  }

  const openLogin = () => {
    setShowRegister(false)
    setShowLogin(true)
  }

  const openRegister = () => {
    setShowLogin(false)
    setShowRegister(true)
  }

  const handleLogout = () => {
    myStorage.removeItem('user')
    setCurrentUser(null)
  }

  return (
    <div className="App">
      {key && (
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={key}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        mapStyle='mapbox://styles/rohit-gta-tech/ckwy3dvaw0bn814p73xs7uv3s'
        onDblClick={handleAddClick}
        {...options}
      >
        {pins.length && pins.map((p, id) => (
          <Fragment key={id}>
            <Marker 
              latitude={p.lat} 
              longitude={p.long} 
              offsetLeft={-viewport.zoom * 3.5} 
              offsetTop={-viewport.zoom * 7}>
              <Room 
                style={{fontSize: viewport.zoom * 7, color: p.username === currentUser ? 'tomato' : 'slateblue', cursor:'pointer'}} 
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
              latitude={p.lat}
              longitude={p.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setCurrentPlaceId(null)}
              anchor="left"
              >
              <div className="card">
                <label>Place</label>
                <h4 classname='place'>{p.title}</h4>
                <label>Review</label>
                <p className='desc'>{p.desc}</p>
                <label>Rating</label>
                <div className='stars'>
                  {Array(p.rating).fill(<Star className='star' />)}
                </div>
                <label>Information</label>
                <span className='username'>Created by <b>{p.username}</b></span>
                <span className='date'>{format(p.createdAt)}</span>
              </div>
            </Popup>
            )}
            
          </Fragment>
        ))}
        {!currentUser && warning && !showRegister && !showLogin && (
          <Popup 
            latitude={warning.lat}
            longitude={warning.long}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setWarning(null)}
            anchor="left"
          >
            <div className="warning">
                Please login to add markers to this map!
            </div>
          </Popup>
        )}
        {currentUser && newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
            anchor="left"
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input placeholder='Enter a Title' onChange={(e) => setTitle(e.target.value)} />
                <label>Review</label>
                <textarea placeholder='Tell something about this place' onChange={(e) => setDesc(e.target.value)}></textarea>
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value='1'>1</option>
                  <option value='2'>2</option>
                  <option value='3'>3</option>
                  <option value='4'>4</option>
                  <option value='5'>5</option>
                </select>
                <button className='submitButton' type='submit'>Add Pin</button>
              </form>
            </div>
          </Popup>
        )}
        {currentUser ? (
          <button className='button logout' onClick={handleLogout}>Log Out</button>) 
          : (
          <div className="buttons">
            <button className='button login' onClick={openLogin}>Login</button>
            <button className='button register' onClick={openRegister}>Register</button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister}/> }
        {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} /> }
      </ReactMapGL>
      )}
    </div>
  );
}

export default App;