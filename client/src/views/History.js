import { useEffect, useState } from 'react'

import RankList from './RankList';

import APIAuthUser from '../apis/APIAuthUser';

function History(props) {

  const [listHistory, setListHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const closeHistory = () => setShowHistory(false);
  const openHistory = () => setShowHistory(true);

  useEffect(() => {
    const loadListHistory = async () => {
      try {

        const lof = await APIAuthUser.getHistory();
        setListHistory(lof);

      } catch (err) {
        throw err;
      }
    }
    if (showHistory)
      loadListHistory();

  }, [showHistory])

  const title = `${props.name}'s History`;

  const listH = listHistory.map((el, i) => {
    return <tr key={i} >
      <td>{`${el.pos}`}</td>      
      <td>{`${el.level}`}</td>
      <td>{`${el.nWords}`}</td>
      <td>{`${el.score}`}</td>
    </tr>
  })

  return (
    <RankList title={title} list={listH} hallFame={false} icon={"History"}
    showList={showHistory} openList={openHistory} closeList={closeHistory}/>
    );
}

export default History;