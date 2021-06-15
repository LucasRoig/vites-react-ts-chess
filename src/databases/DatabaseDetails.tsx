import React, {useEffect, useState} from "react";
import {RouteComponentProps} from "react-router-dom";
import ChessDbService, {ChessDbDetails, GameHeader} from "../@core/ChessDbService";

interface DatabaseDetailsProps extends RouteComponentProps<{id: string}> {

}

const DatabaseDetails: React.FC<DatabaseDetailsProps> = (props) => {
  const databaseId = parseInt(props.match.params.id)
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
          <td>{game.white}</td>
          <td>{game.black}</td>
          <td>{game.result}</td>
          <td>{game.event}</td>
          <td>{game.date}</td>
        </tr>
      )}
      </tbody>
    </table>
  )
}

export {
  DatabaseDetails
}
