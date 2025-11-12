import './App.css'
import '@govtechsg/sgds/css/sgds.css';
import { Row, Card } from '@govtechsg/sgds-react';


function councilDirectives() {
  return (
    <>
    <div className="topBar">
            <h1>Joint Cabinet Crisis</h1>
            <a className='topBarLinks' href="#/">Updates</a>
            <a className='topBarLinks' href="https://forms.gle/9QhMmUZhjLAE5cXTA" target='blank'>Directive Form</a>
            <a className='topBarLinks' href="#/editor">Map Editor</a>
            <a className='topBarLinks' href="#/council-directives">Council Directives</a>
          </div>


    <Row style={{marginTop:"7vw"}}>      
        <h1>Council Directives</h1>
      <p>Here are the latest directives from the council.</p>
      <Card style={{ marginLeft: '2vw', marginRight: '2vw', marginBottom: '4vw', width:'90%' }}>
        <Card.Title>
                I love cats
              </Card.Title>
        <Card.Body>
            <strong>Article 1: This website is funny</strong>
                <br/>
                haha go brrr
        </Card.Body>
        <Card.Link href="#">
                Link to Council Directive
              </Card.Link>
      </Card>

      </Row>

    </>
  )

}

export default councilDirectives;