import './App.css'
import '@govtechsg/sgds/css/sgds.css';
import unionJack from './assets/unionJack.webp';
import { Col, Row, Card } from '@govtechsg/sgds-react';
import { APIProvider, Map, InfoWindow, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Polygon } from './polygon';

import { useState } from 'react';

type sharedTroops = { position: google.maps.LatLngLiteral, title: string }
const locations: sharedTroops[] = [
  {
    position: { lat: 1.42138, lng: 103.867627 },
    title: "No. 34 Squadron RAF, 8 Bristol Blenheim bombers"
  },
  {
    position: { lat: 1.413322, lng: 103.864537 },
    title: "No. 36 Squadron RAF, 9 Vickers Vildebeest bombers"
  },
  {
    position: { lat: 1.404055, lng: 103.864537 },
    title: "No.205 Squadron RAF 3PBY Catalinas flying boats"
  },
  {
    position: { lat: 1.398994, lng: 103.814420 },
    title: "No. 1 Squadron RAAF, 10 Hudson Bombers"
  },
  {
    position: { lat: 1.310649, lng: 103.896790 },
    title: "No. 243 Squadron RAF, 12 Buffalo Aircraft"
  },
  {
    position: { lat: 1.259940, lng: 103.823689 },
    title: "22nd Bridgade"
  },
  {
    position: { lat: 1.427550, lng: 103.841818 },
    title: "27th Bridgade"
  },
  {
    position: { lat: 1.269940, lng: 103.843689 },
    title: "9th Indian Division"
  },

  {
    position: { lat: 1.269940, lng: 103.823689 },
    title: "11th Indian Division"
  },
  {
    position: { lat: 1.464342, lng: 103.834328 },
    title: "HMS Durban"
  },
  {
    position: { lat: 1.460484, lng: 103.833186 },
    title: "HMS Danae"
  },
  {
    position: { lat: 1.462412, lng: 103.833298 },
    title: "HMS Dauntless"
  },
  {
    position: { lat: 1.461554, lng: 103.833855 },
    title: "HMS Tenedos"
  },
  {
    position: { lat: 1.460953, lng: 103.832482 },
    title: "HMS Thanet"
  },
];

type enemyTroops = { position: google.maps.LatLngLiteral, title: string }
const places: enemyTroops[] = [
  {
    position: { lat: 1.296299, lng: 103.849478 },
    title: "Japanese squad"
  },
  {
    position: { lat: 1.278794, lng: 103.860807 },
    title: "Last known location of Japanese tank regiment"
  },
  {
    position: { lat: 1.296642, lng: 103.836775 },
    title: "Japanese division"
  },
  {
    position: { lat: 1.284972, lng: 103.790426 },
    title: "Japanese division"
  },
  {
    position: { lat: 1.295613, lng: 103.809995 },
    title: "Japanese division"
  },

]

const PoiMarkers = (props: { pois: sharedTroops[] }) => {
  const [infoWindowOpen, setInfoWindowOpen] = useState<number | null>(null);

  return (
    <>
      {props.pois.map((poi: sharedTroops, index: number) => (
        <div key={index}>
          <AdvancedMarker
            position={poi.position}
            onClick={() => setInfoWindowOpen(index)}
          >
            <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
          </AdvancedMarker>

          {infoWindowOpen === index && (
            <InfoWindow
              position={poi.position}
              onCloseClick={() => setInfoWindowOpen(null)}
            >
              <div style={{ padding: '8px' }}>
                <strong>{poi.title}</strong>
              </div>
            </InfoWindow>
          )}
        </div>
      ))}
    </>
  );
};

const EnemyMarkers = (props: { pois: enemyTroops[] }) => {
  const [infoWindowOpen, setInfoWindowOpen] = useState<number | null>(null);

  return (
    <>
      {props.pois.map((poi: enemyTroops, index: number) => (
        <div key={index}>
          <AdvancedMarker
            position={poi.position}
            onClick={() => setInfoWindowOpen(index)}
          >
            <Pin background={'#ffffffff'} glyphColor={'#ff0000ff'} borderColor={'#000000ff'} />
          </AdvancedMarker>

          {infoWindowOpen === index && (
            <InfoWindow
              position={poi.position}
              onCloseClick={() => setInfoWindowOpen(null)}
            >
              <div style={{ padding: '8px' }}>
                <strong>{poi.title}</strong>
              </div>
            </InfoWindow>
          )}
        </div>
      ))}
    </>
  );
};

// const polygonPaths = [
//   { lat: 1.272686, lng: 103.577527 },
//   { lat: 1.457341, lng: 103.865231 },
//   { lat: 1.369064, lng: 104.010800 },
//   { lat: 1.306596, lng: 103.815106 } // Closing the loop
// ];

function App() {
  return (
    <>
      <Row>
        <Col style={{ width: '100%', backgroundColor: "#f6eee3" }} lg="5" xs>
          <div className="topBar">
            <h1>Joint Cabinet Crisis</h1>
            <a className='topBarLinks' href="#/">Updates</a>
            <a className='topBarLinks' href="https://forms.gle/9QhMmUZhjLAE5cXTA" target='blank'>Directive Form</a>
            <a className='topBarLinks' href="#/editor">Map Editor</a>
            <a className='topBarLinks' href="#/council-directives">Council Directives</a>
          </div>
          <div className='firstFromTop'>
            <h1>
              <img src={unionJack} width="20%" style={{ margin: '2vw' }} alt="Union Jack" />
              <br />
              Crisis Updates</h1>
            <h2>The Malayan Times</h2>
          </div>

          <APIProvider apiKey={'AIzaSyDdBGrtXdcOkvVC37W-WoCQIK9TjAwYGUs'} onLoad={() => console.log('Maps API has loaded.')}>

            <Map
              className='main-map'
              defaultZoom={11.5}
              mapId={"eb87b183946a00eea25854ea"}
              defaultCenter={{ lat: 1.3521, lng: 103.8193 }}
              disableDefaultUI={true}

            >
              <Polygon paths={[
                { lat: 1.428569, lng: 103.698107 },
                { lat: 1.460144, lng: 103.836123 },
                { lat: 1.320110, lng: 104.018084 },
                { lat: 1.266565, lng: 103.733126 },
                { lat: 1.273430, lng: 103.617770 }]}
                fillColor={'#ff0000ff'}
                strokeColor={'#ff4a4aff'} />

              <PoiMarkers pois={locations} />
              <EnemyMarkers pois={places} />
            </Map>

          </APIProvider>
          {/* <Card style={{ marginLeft: '2vw', marginRight: '2vw', marginBottom: '4vw' }}>

            <Card.Body>
              <Card.Title>Haha funny</Card.Title>
              <Card.Text>
                This is where the main body of the text goes, when updating, preview on the website to see if this is what u want
              </Card.Text>
            </Card.Body>
            </Card> */}
          <Card style={{ marginLeft: '2vw', marginRight: '2vw', marginBottom: '4vw' }}>
            <Card.Body>
              <Card.Title>Test for upload on SWN network</Card.Title>
              <Card.Text>This is a test for committing on github and deploying on the SWN@SSOE network</Card.Text>
            </Card.Body>
          </Card>

          <Card style={{ marginLeft: '2vw', marginRight: '2vw', marginBottom: '4vw' }}>
            <Card.Body>
              <Card.Title>Welcome to Crisis!</Card.Title>
              <Card.Text>As our CD said, enjoy yourself today, and remember to send your dear friend backroom good directives!</Card.Text>
            </Card.Body>
          </Card>
          {/* <Card style={{ marginLeft: '2vw', marginRight: '2vw', marginBottom: '4vw' }}>
            <Card.Body>
              <Card.Title>
                Another Cool Title
              </Card.Title>
              <Card.Text>
                Some serious crisis update text goes here.<br /> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Card.Text>
              <Card.Link href="#">
                New link to new thing
              </Card.Link>
            </Card.Body>
            <Card.Img
              alt="img alternate text goes here"
              src="https://picsum.photos/300"
              variant="bottom"
            />
          </Card> */}
          {/* <Card style={{ marginLeft: '2vw', marginRight: '2vw', marginBottom: '4vw' }}>
            <Card.Img
              alt="img alternate text goes here"
              src="https://picsum.photos/600"
              variant="top"
            />
            <Card.Body>
              <Card.Title>
                Very Cool Title
              </Card.Title>
              <Card.Text>
                Some funny crisis update text goes here.<br /> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Card.Text>
              <Card.Link href="#">
                Link to something
              </Card.Link>
            </Card.Body>
          </Card> */}
        </Col>
      </Row>
    </>
  );

}

export default App;
