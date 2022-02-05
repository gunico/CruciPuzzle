import QCell from './QCell';


function QRow(props) {
    return (
        <>
            {
                !props.loading ?
                    Array.from({ length: props.nCol }).map((_, j) =>
                        <td key={`TD${props.nRow},${j}`} >
                            <QCell id={`${props.nRow},${j}`} letter={props.letters[j]}
                                key={`${props.nRow},${j}`} selection={props.selection} sel={props.sel} conf={props.conf}
                                loading={props.loading} wait={props.wait} />
                        </td>
                    )
                    :
                    Array.from({ length: props.nCol }).map((_, j) =>
                        <td key={`TD${props.nRow},${j}`} >
                            <QCell id={`${props.nRow},${j}`} letter={false}
                                key={`${props.nRow},${j}`} loading={props.loading} />
                        </td>
                    )

            }
        </>
    );
}

export default QRow;