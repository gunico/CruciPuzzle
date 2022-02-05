import { useEffect, useState } from 'react'

import RankList from './RankList';

import APIGenericUser from '../apis/APIGenericUser';

function HF(props) {

  const [listHallOfFame, setListHallOfFame] = useState([]);
  const [showHallFame, setShowHallFame] = useState(false);

  const closeHallFame = () => setShowHallFame(false);
  const openHallFame = () => setShowHallFame(true);

  useEffect(() => {
    const loadListOfFame = async () => {
      try {

        const lof = await APIGenericUser.getHallOfFame();
        setListHallOfFame(lof);

      } catch (err) {
        throw err;
      }
    }
    if (showHallFame)
      loadListOfFame();

  }, [showHallFame])

  const listfame = listHallOfFame.map((el, i) => {
    return <tr key={i} >
      <td>{`${el.pos}`}</td>
      <td>{`${el.name}`}</td>
      <td>{`${el.score}`}</td>
    </tr>
  })

  const title = "Hall of Fame"

  return (
    <RankList title={title} list={listfame} hallFame={true} icon={title}
    showList={showHallFame} openList={openHallFame} closeList={closeHallFame} />
    );
}

export default HF;