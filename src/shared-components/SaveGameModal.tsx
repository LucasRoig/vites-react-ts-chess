import React, {useEffect, useMemo, useState} from 'react';
import ChessDbService, {ChessDb} from "../@core/ChessDbService";
import {toast} from "react-toastify";
import {useAppDispatch, useAppSelector} from "../store";
import {CloseTabAction, OpenGameFromDbAction} from "../store/tabs/actions";
import {TemporaryGame} from "../@core/TempGamesService";
import {Modal} from "./Modal";
import {HorizontalInput} from "./inputs/HorizontalInput";
import {HorizontalField} from "./inputs/HorizontalField";
import {useFormik} from "formik";
import * as Yup from "yup"
import {getHeader, HeadersKeys, setHeader} from "../libraries/chess/Game";

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
      formik.validateForm()
    }).catch(err => {
      console.error(err)
      toast.error("Cannot fetch databases")
    })
  }, [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  let initialValues = useMemo(() => ({
    database: "",
      white: getHeader(game.game, HeadersKeys.White),
      black: getHeader(game.game, HeadersKeys.Black),
      result: getHeader(game.game, HeadersKeys.Result).length ? getHeader(game.game, HeadersKeys.Result) : "*",
      event: getHeader(game.game, HeadersKeys.Event),
      date: getHeader(game.game, HeadersKeys.Date).length ? getHeader(game.game, HeadersKeys.Date) : (new Date()).toISOString().substr(0, 10)
  }), [game]);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: ({ white, black, date, event, result, database}) => {
      setIsSubmitting(true)
      setHeader(game.game, HeadersKeys.White, white)
      setHeader(game.game, HeadersKeys.Black, black)
      setHeader(game.game, HeadersKeys.Date, date)
      setHeader(game.game, HeadersKeys.Event, event)
      setHeader(game.game, HeadersKeys.Result, result)
      if (game.saveData !== null) {
        const serializableGame = game.game
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
        const serializableGame = game.game
        ChessDbService.createGame({ dbId: database, game: serializableGame}).then(res => {
          setIsSubmitting(false)
          hideAndReset()
          toast.success("Successfully saved")
          if (currentTab) {
            dispatch(CloseTabAction(currentTab))
          }
          dispatch(OpenGameFromDbAction(res.id, res.db, getHeader(res.headers, HeadersKeys.White), getHeader(res.headers, HeadersKeys.Black)))
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
                      <select value={formik.values.result} onChange={formik.handleChange} name="result">
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
