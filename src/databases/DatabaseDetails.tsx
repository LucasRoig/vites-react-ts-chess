import React, {useEffect, useState} from "react";
import {RouteComponentProps} from "react-router-dom";
import ChessDbService, {ChessDb, ChessDbDetails, GameHeader} from "../@core/ChessDbService";
import {useAppDispatch} from "../store";
import {OpenGameFromDbAction} from "../store/tabs/actions";
import {ConfirmationModal} from "../shared-components/ConfirmationModal";
import {toast} from "react-toastify";

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
  const [isDeleteModalOpen, toggleDeleteModal] = useState(false)
  const [deleteModalMessage, setDeleteModalMessage] = useState("")
  const [deleteModalCb, setDeleteModalCb] = useState<() => void>(() => {
  })
  const deleteGame = (game: GameHeader) => () => {
    ChessDbService.deleteGame(game).then(() => {
      toast.success(`Game deleted`)
      toggleDeleteModal(false)
      onGameDeleted(game)
    }).catch(err => {
      console.error(err)
      toast.error('Error while deleting game')
      toggleDeleteModal(false)
    })
  }
  const openDeleteModal = (game: GameHeader) => () => {
    setDeleteModalMessage("Do you really want to delete the game : " + game.white + " - " + game.black)
    toggleDeleteModal(true)
    setDeleteModalCb(() => deleteGame(game))
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
            <button className="button is-danger is-outlined is-small" onClick={openDeleteModal(game)}>
              <span>Delete</span>
              <span className="icon is-small">
                <i className="fas fa-times"/>
              </span>
            </button>
          </td>
        </tr>
      )}
      </tbody>
      <ConfirmationModal isOpen={isDeleteModalOpen} onValidate={deleteModalCb} onCancel={() => toggleDeleteModal(false)}
                         title="Delete database" message={deleteModalMessage} validateText={"Delete"} validateClass={"is-danger"}/>
    </table>
  )
}

export {
  DatabaseDetails
}
