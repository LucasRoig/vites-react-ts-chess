import React, {useEffect, useState} from "react";
import {RouteComponentProps} from "react-router-dom";
import ChessDbService, {ChessDb, ChessDbDetails, GameHeader} from "../@core/ChessDbService";
import {useAppDispatch} from "../store";
import {OpenGameFromDbAction} from "../store/tabs/actions";
import {toast} from "react-toastify";
import {DeleteButton} from "../shared-components/buttons/DeleteButton";

interface DatabaseDetailsProps extends RouteComponentProps<{id: string}> {

}

const DatabaseDetails: React.FC<DatabaseDetailsProps> = (props) => {
  const databaseId = props.match.params.id
  const [databaseDetails, setDatabaseDetails] = useState<ChessDbDetails>()

  useEffect(() => {
    ChessDbService.getDbDetails(databaseId).then(setDatabaseDetails)
  }, [])

  const removeGame = (game: GameHeader) => {
    if (databaseDetails) {
      const newGames = databaseDetails?.games.filter(g => g !== game)
      setDatabaseDetails({...databaseDetails, games: newGames})
    }
  }

  return databaseDetails ? (
    <div style={{margin: "1em"}}>
      <h1 className="title">Database : {databaseDetails.database.name}</h1>
      <GameTable games={databaseDetails.games} onGameDeleted={removeGame}/>
    </div>
  ) : (
    <div>Loading...</div>
  )
}

const GameTable: React.FC<{games: GameHeader[], onGameDeleted: (g: GameHeader) => void }> = ({games, onGameDeleted}) => {
  const dispatch = useAppDispatch();
  const deleteGame = (game: GameHeader) => () => {
    ChessDbService.deleteGame(game).then(() => {
      toast.success(`Game deleted`)
      onGameDeleted(game)
    }).catch(err => {
      console.error(err)
      toast.error('Error while deleting game')
    })
  }

  const openGame = (game: GameHeader) => () => {
    dispatch(OpenGameFromDbAction(game.id, game.db, game.white, game.black))
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
          <td style={{textAlign: "right"}}>
            <DeleteButton onClick={deleteGame(game)} modalTitle="Delete Game"
                          modalMessage={`Do you really want to delete the game : ${game.white} - ${game.black}`}/>
          </td>
        </tr>
      )}
      </tbody>
      </table>
  )
}

export {
  DatabaseDetails
}
