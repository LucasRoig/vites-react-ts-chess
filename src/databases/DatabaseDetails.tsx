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
  const dispatch = useAppDispatch();
  const databaseId = props.match.params.id
  const [databaseDetails, setDatabaseDetails] = useState<ChessDbDetails>()

  useEffect(() => {
    ChessDbService.getDbDetails(databaseId).then(setDatabaseDetails)
  }, [])

  const removeGame = (game: GameHeader) => {
    ChessDbService.deleteGame(game).then(() => {
      toast.success(`Game deleted`)
      if (databaseDetails) {
        const newGames = databaseDetails?.games.filter(g => g !== game)
        setDatabaseDetails({...databaseDetails, games: newGames})
      }
    }).catch(err => {
      console.error(err)
      toast.error('Error while deleting game')
    })
  }

  const openGame = (game: GameHeader) => {
    dispatch(OpenGameFromDbAction(game.id, game.db, game.white, game.black))
  }

  return databaseDetails ? (
    <div style={{margin: "1em"}}>
      <h1 className="title">Database : {databaseDetails.database.name}</h1>
      <GameTable games={databaseDetails.games} deleteGame={removeGame} openGame={openGame}/>
    </div>
  ) : (
    <div>Loading...</div>
  )
}

const GameTable: React.FC<
  {games: GameHeader[], deleteGame: (g: GameHeader) => void, openGame: (g: GameHeader) => void }
  > = ({games, deleteGame, openGame}) => {

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
          <td><button className="button is-ghost" onClick={openGame.bind(null,game)}>{game.white}</button></td>
          <td style={{verticalAlign: "middle"}}>{game.black}</td>
          <td style={{verticalAlign: "middle"}}>{game.result}</td>
          <td style={{verticalAlign: "middle"}}>{game.event}</td>
          <td style={{verticalAlign: "middle"}}>{game.date}</td>
          <td style={{textAlign: "right"}}>
            <DeleteButton onClick={deleteGame.bind(null, game)} modalTitle="Delete Game"
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
