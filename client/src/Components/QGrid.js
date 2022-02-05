import { Container, Row } from 'react-bootstrap';

import QRow from './QRow';


function QGrid(props) {

    return (
        <Container fluid>
            <Row md="auto">
                <table key={"T1"}>
                    <tbody key={"B1"}>
                        {
                            !props.loading ?
                                Array.from({ length: props.nRow }).map((_, i) =>
                                    <tr key={`R${i}`} >
                                        <QRow id={`R${i}`} nRow={i} nCol={props.nCol}
                                            loading={props.loading} letters={props.tableGame[i]} key={`R${i}`}
                                            selection={props.selection} sel={props.sel} conf={props.conf} wait={props.wait}
                                        /></tr>
                                )
                                :
                                Array.from({ length: props.nRow }).map((_, i) =>
                                    <tr key={`R${i}`} >
                                        <QRow id={`R${i}`} nRow={i} nCol={props.nCol}
                                            loading={props.loading} key={`R${i}`}
                                        /></tr>
                                )
                        }
                    </tbody>
                </table>
            </Row>
            <Row className={"mb-5"}></Row>
        </Container>
    )
}

export default QGrid;