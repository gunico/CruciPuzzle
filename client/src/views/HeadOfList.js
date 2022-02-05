function HeadOfList(props) {

    return (

        props.hallFame ? 
        <thead>
            <tr>
                <th>Position</th>
                <th>Name</th>
                <th>Score</th>
            </tr>
        </thead> :
        <thead>
        <tr>
            <th>Position</th>
            <th>Level</th>
            <th>Words Found</th>
            <th>Score</th>
        </tr>
    </thead>
    )
}

export default HeadOfList;