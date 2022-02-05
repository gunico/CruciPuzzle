import { Offcanvas, Table } from 'react-bootstrap';

import { IconHallFame } from '../images/Icons';

import HeadOfList from './HeadOfList';

function RankList(props) {

  return (
    <>
      <span style={{ cursor: 'pointer' }} onClick={props.openList}>
        {IconHallFame} {props.icon}
      </span>

      <Offcanvas show={props.showList} onHide={props.closeList}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{props.title}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Table striped bordered hover>
            <HeadOfList hallFame={props.hallFame}/>
            <tbody>
              {props.list}
            </tbody>
          </Table>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default RankList;