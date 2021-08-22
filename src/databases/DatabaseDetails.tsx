import React, {useEffect, useState} from "react";
import {RouteComponentProps} from "react-router-dom";
import ChessDbService, {ChessDbDetails, DocumentHeader, GameHeader} from "../@core/ChessDbService";
import {useAppDispatch} from "../store";
import {OpenDocumentFromDbAction, OpenGameFromDbAction} from "../store/tabs/actions";
import {toast} from "react-toastify";
import {DeleteButton} from "../shared-components/buttons/DeleteButton";
import {gameToString, getHeader, HeadersKeys} from "../libraries/chess/Game";

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
      ChessDbService.getDbDetails(databaseId).then(setDatabaseDetails)
    }).catch(err => {
      console.error(err)
      toast.error('Error while deleting game')
    })
  }

  const deleteDocument = (doc: DocumentHeader) => {
    ChessDbService.deleteDocument(doc).then(() => {
      toast.success(`Document deleted`)
      ChessDbService.getDbDetails(databaseId).then(setDatabaseDetails)
    }).catch(err => {
      console.error(err)
      toast.error('Error while deleting document')
    })
  }


  const openGame = (game: GameHeader) => {
    dispatch(OpenGameFromDbAction(game.id, game.db, getHeader(game.headers, HeadersKeys.White), getHeader(game.headers, HeadersKeys.Black)))
  }
  const openDocument = (doc: DocumentHeader) => {
    if (databaseDetails?.database){
      dispatch(OpenDocumentFromDbAction(doc.title, databaseDetails?.database.id, doc.id))
    }
  }

  return databaseDetails ? (
    <div>
      <h1 className="title">Database : {databaseDetails.database.name}</h1>
      <GameTable games={databaseDetails.games} deleteGame={removeGame} openGame={openGame} documents={databaseDetails.documents} openDocument={openDocument} deleteDocument={deleteDocument}/>
    </div>
  ) : (
    <div>Loading...</div>
  )
}

interface GameTableProps {
  games: GameHeader[],
  deleteGame: (g: GameHeader) => void,
  openGame: (g: GameHeader) => void,
  documents: DocumentHeader[],
  deleteDocument: (d: DocumentHeader) => void
  openDocument: (d: DocumentHeader) => void
}

const GameTable: React.FC<GameTableProps> =
  ({games, deleteGame, openGame, documents, deleteDocument, openDocument}) => {
  const [mergedList, setMergedList] = useState<(GameHeader | DocumentHeader)[]>([])
  useEffect(() => {
    let a: (GameHeader | DocumentHeader)[] = []
    a = a.concat(games).concat(documents)
    a.sort((i, j) => i.index - j.index)
    setMergedList(a)
  }, [games, documents])
  const isAGame = (g: GameHeader | DocumentHeader): boolean => {
    return (g as GameHeader).headers !== undefined
  }

  return(
    <table className="table" style={{width: "100%"}}>
      <thead>
        <tr>
          <th>Index</th>
          <th>White</th>
          <th>Black</th>
          <th>Result</th>
          <th>Event</th>
          <th>Date</th>
          <th/>
        </tr>
      </thead>
      <tbody>
      { mergedList.map(gameOrDoc =>
        isAGame(gameOrDoc) ?
        <tr key={gameOrDoc.id}>
          <td>{gameOrDoc.index}</td>
          <td><button className="button is-ghost" onClick={openGame.bind(null,gameOrDoc as GameHeader)}>{getHeader((gameOrDoc as GameHeader).headers, HeadersKeys.White)}</button></td>
          <td style={{verticalAlign: "middle"}}>{getHeader((gameOrDoc as GameHeader).headers, HeadersKeys.Black)}</td>
          <td style={{verticalAlign: "middle"}}>{getHeader((gameOrDoc as GameHeader).headers, HeadersKeys.Result)}</td>
          <td style={{verticalAlign: "middle"}}>{getHeader((gameOrDoc as GameHeader).headers, HeadersKeys.Event)}</td>
          <td style={{verticalAlign: "middle"}}>{getHeader((gameOrDoc as GameHeader).headers, HeadersKeys.Date)}</td>
          <td style={{textAlign: "right"}}>
            <DeleteButton onClick={deleteGame.bind(null, (gameOrDoc as GameHeader))} modalTitle="Delete Game"
                          modalMessage={`Do you really want to delete the game : ${gameToString((gameOrDoc as GameHeader).headers)}`}/>
          </td>
        </tr>
          :
          <tr key={gameOrDoc.id}>
            <td>{gameOrDoc.index}</td>
            <td><button className="button is-ghost" onClick={openDocument.bind(null,gameOrDoc as DocumentHeader)}>{(gameOrDoc as DocumentHeader).title}</button></td>
            <td/>
            <td/>
            <td/>
            <td/>
            <td style={{textAlign: "right"}}>
              <DeleteButton onClick={deleteDocument.bind(null, (gameOrDoc as DocumentHeader))} modalTitle="Delete Document"
                            modalMessage={`Do you really want to delete the document : ${(gameOrDoc as DocumentHeader).title}`}/>
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
