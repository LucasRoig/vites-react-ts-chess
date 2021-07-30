import React, {ChangeEvent, Component, useEffect, useMemo, useState} from 'react';
import ReactDOM from 'react-dom';
import ChessDbService, {ChessDb} from "../@core/ChessDbService";
import {Simulate} from "react-dom/test-utils";
import contextMenu = Simulate.contextMenu;
import {toast} from "react-toastify";
import {useAppDispatch, useAppSelector} from "../store";
import {CloseTabAction, OpenGameFromDbAction} from "../store/tabs/actions";
import {TemporaryGame} from "../@core/TempGamesService";
import {Modal} from "./Modal";
import {HorizontalInput} from "./inputs/HorizontalInput";
import {HorizontalField} from "./inputs/HorizontalField";
import {useFormik} from "formik";
import * as Yup from "yup";
import usePromise from "./UsePromise";
import {gameToSerializableGame} from "../libraries/chess/Game";

interface SaveGameModalProps {
  isOpen: boolean,
  hide: () => void,
  game: TemporaryGame
}

const SaveGameModal: React.FunctionComponent<SaveGameModalProps> = ({isOpen, hide, game}) => {
  const [chessDbs, setChessDb] = useState<ChessDb[]>();
  const currentTab = useAppSelector(s => s.tabs.selectedTab)
  const dispatch = useAppDispatch()
  useEffect(() => {
    ChessDbService.fetchChessDb().then(dbs => {
      if (dbs.length > 0) {
        if (game.saveData !== null) {
          let find = dbs.find(db => db.id === game.saveData?.dbId);
          if (find) {
            setChessDb([find])
            formik.values.database = find.id
          }
        } else {
          formik.values.database = dbs[0].id
          setChessDb(dbs)
        }
      }
    }).catch(err => {
      console.error(err)
      toast.error("Cannot fetch databases")
    })
  }, [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  let initialValues = useMemo(() => ({
    database: "",
      white: game.game.headers["white"] || "",
      black: game.game.headers["black"] || "",
      result: game.game.headers["result"] || "*",
      event: game.game.headers["event"] || "",
      date: game.game.headers["date"] || (new Date()).toISOString().substr(0, 10)
  }), []);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: ({ white, black, date, event, result, database}) => {
      setIsSubmitting(true)
      if (game.saveData !== null) {
        const serializableGame = gameToSerializableGame(game.game)
        ChessDbService.updateGame(serializableGame.id, serializableGame).then(() => {
          setIsSubmitting(false)
          hideAndReset()
          toast.success("Successfully saved")
        }).catch(err => {
          console.error(err)
          setIsSubmitting(false)
          toast.error("Error while saving game")
        })
      } else {
        const serializableGame = gameToSerializableGame(game.game)
        ChessDbService.createGame({
          dbId: database, white, black, date, event, result, comment: serializableGame.comment, positions: serializableGame.positions
        }).then(res => {
          setIsSubmitting(false)
          hideAndReset()
          toast.success("Successfully saved")
          if (currentTab) {
            dispatch(CloseTabAction(currentTab))
          }
          dispatch(OpenGameFromDbAction(res.id, res.db, res.white, res.black))
        }).catch(err => {
          console.log(err)
          setIsSubmitting(false)
          toast.error("Error while saving game")
        })
      }
    },
    validateOnMount: true,
    validationSchema: Yup.object().shape({
      database: Yup.string().required("Required").min(1, "Required"),
      white: Yup.string().required("Required").min(1, "Required"),
      date: Yup.string().required("Required").min(1, "Required"),
      result: Yup.string().required("Required").min(1, "Required"),
    })
  })

  const hideAndReset = () => {
    formik.resetForm();
    hide();
  }

  return isOpen ? <Modal isOpen={isOpen} hide={hideAndReset} title="Save game to database"
                buttons={<>
                  <button className={`button is-success ${isSubmitting ? 'is-loading' : ''}`} disabled={!formik.isValid}
                          onClick={formik.submitForm}>
                    Save changes
                  </button>
                  <button className="button" onClick={hideAndReset}>Cancel</button>
                </>}
                content={<>
                  <HorizontalField name="database" label="Database">
                    <div className="select is-fullwidth">
                      <select disabled={!chessDbs || chessDbs.length == 0 || game.saveData !== null}
                              onChange={formik.handleChange} value={formik.values.database}>
                        {chessDbs && chessDbs.length > 0 ? chessDbs.map(db =>
                          <option key={db.id} value={db.id}>{db.name}</option>
                        ) : <option>No database found</option>}
                      </select>
                    </div>
                  </HorizontalField>

                  <HorizontalInput name="white" label="White" placeholder="White" type="text" onChange={formik.handleChange} value={formik.values.white}/>

                  <HorizontalInput name="black" label="Black" placeholder="Black" type="text" onChange={formik.handleChange} value={formik.values.black}/>

                  <HorizontalInput name="event" label="Event" placeholder="Event" type="text" onChange={formik.handleChange} value={formik.values.event}/>

                  <HorizontalInput name="date" label="Date" type="date" onChange={formik.handleChange} value={formik.values.date}/>

                  <HorizontalField name="result" label="Result">
                    <div className="select is-fullwidth">
                      <select value={formik.values.result} onChange={formik.handleChange}>
                        <option>*</option>
                        <option>1-0</option>
                        <option>0-1</option>
                        <option>1/2-1/2</option>
                      </select>
                    </div>
                  </HorizontalField>
                </>}
  >
  </Modal> : null
}

export default SaveGameModal;
