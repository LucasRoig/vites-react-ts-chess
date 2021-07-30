import React, {useEffect, useState} from "react";
import {RouteComponentProps} from "react-router-dom";
import ChessDbService, {ChessDbDetails, GameHeader} from "../@core/ChessDbService";
import {useAppDispatch} from "../store";
import {OpenGameFromDbAction} from "../store/tabs/actions";

interface DatabaseDetailsProps extends RouteComponentProps<{id: string}> {

}

const DatabaseDetails: React.FC<DatabaseDetailsProps> = (props) => {
  const databaseId = props.match.params.id
  const [databaseDetails, setDatabaseDetails] = useState<ChessDbDetails>()
  useEffect(() => {
    ChessDbService.getDbDetails(databaseId).then(setDatabaseDetails)
  }, [])
  return databaseDetails ? (
    <div style={{margin: "1em"}}>
      <h1 className="title">{databaseDetails.database.name}</h1>
      <GameTable games={databaseDetails.games}/>
    </div>
  ) : (
    <div>Loading...</div>
  )
}

const GameTable: React.FC<{games: GameHeader[]}> = ({games}) => {
  const dispatch = useAppDispatch();
  const openGame = (game: GameHeader) => () => {
    dispatch(OpenGameFromDbAction(game.id, game.chessDbId, game.white, game.black))
  }
  return(
    <table className="table" style={{width: "100%"}}>
      <thead>
        <tr>
          <th>White</th>
          <th>Black</th>
          <th>Result</th>
          <th>Event</th>
          <th>Date</th>
          <th/>
        </tr>
      </thead>
      <tbody>
      { games.map(game =>
        <tr key={game.id}>
          <td><button className="button is-ghost" onClick={openGame(game)}>{game.white}</button></td>
          <td style={{verticalAlign: "middle"}}>{game.black}</td>
          <td style={{verticalAlign: "middle"}}>{game.result}</td>
          <td style={{verticalAlign: "middle"}}>{game.event}</td>
          <td style={{verticalAlign: "middle"}}>{game.date}</td>
        </tr>
      )}
      </tbody>
    </table>
  )
}

export {
  DatabaseDetails
}
