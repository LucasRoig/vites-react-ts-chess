import React, {ChangeEvent, Component, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import ChessDbService, {ChessDb} from "../@core/ChessDbService";
import {Simulate} from "react-dom/test-utils";
import contextMenu = Simulate.contextMenu;
import {toast} from "react-toastify";


interface SaveGameModalProps {
  isOpen: boolean,
  hide: () => void
}

const SaveGameModal: React.FunctionComponent<SaveGameModalProps> = ({isOpen, hide}) => {
  const [chessDbs, setChessDb] = useState<ChessDb[]>();
  const [selectedDbId, setSelectedDbId] = useState<number>()
  useEffect(() => {
    ChessDbService.fetchChessDb().then(dbs => {
      setChessDb(dbs)
      if (dbs.length > 0) {
        setSelectedDbId(dbs[0].id)
      }
    })
  }, [])
  const onDatabaseChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDbId(parseInt(e.target.value))
  }
  const [result, setResult] = useState("*")
  const onResultChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    setResult(e.target.value)
  }
  const [white, setWhite] = useState("")
  const onWhiteChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setWhite(e.target.value)
  }
  const [black, setBlack] = useState("")
  const onBlackChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setBlack(e.target.value)
  }
  const [event, setEvent] = useState("")
  const onEventChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setEvent(e.target.value)
  }
  const [date, setDate] = useState((new Date()).toISOString().substr(0, 10))
  const onDateChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value)
  }
  const [canSubmit, setCanSubmit] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => {
    setCanSubmit(white.length > 0 && selectedDbId !== undefined && date.length > 0 && result.length > 0)
  }, [white, black, event, date, selectedDbId, result])
  const submit = () => {
    if (!canSubmit) {
      return
    }
    setIsSubmitting(true)
    ChessDbService.createGame({
      dbId: selectedDbId!, white, black, date, event, result
    }).then(res => {
      setIsSubmitting(false)
      console.log(res)
      hide()
      toast.success("Successfully saved")
    })
  }
  return isOpen ? ReactDOM.createPortal(
    <div className="modal is-active">
      <div className="modal-background" onClick={hide}/>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Save game to database</p>
          <button className="delete" aria-label="close" onClick={hide}/>
        </header>
        <section className="modal-card-body">
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">Database</label>
            </div>
            <div className="field-body">
              <div className="field is-narrow">
                <div className="control">
                  <div className="select is-fullwidth">
                    <select disabled={!chessDbs || chessDbs.length == 0} onChange={onDatabaseChanged}
                            value={selectedDbId}>
                      {chessDbs && chessDbs.length > 0 ? chessDbs.map(db =>
                        <option key={db.id} value={db.id}>{db.name}</option>
                      ) : <option>No database found</option>}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">White</label>
            </div>
            <div className="field-body">
              <div className="field is-narrow">
                <div className="control">
                  <input className="input" type="text" placeholder="White" value={white} onChange={onWhiteChanged}/>
                </div>
              </div>
            </div>
          </div>
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">Black</label>
            </div>
            <div className="field-body">
              <div className="field is-narrow">
                <div className="control">
                  <input className="input" type="text" placeholder="Black" value={black} onChange={onBlackChanged}/>
                </div>
              </div>
            </div>
          </div>
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">Event</label>
            </div>
            <div className="field-body">
              <div className="field is-narrow">
                <div className="control">
                  <input className="input" type="text" placeholder="Event" value={event} onChange={onEventChanged}/>
                </div>
              </div>
            </div>
          </div>
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">Date</label>
            </div>
            <div className="field-body">
              <div className="field is-narrow">
                <div className="control">
                  <input className="input" type="date" value={date} onChange={onDateChanged}/>
                </div>
              </div>
            </div>
          </div>
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">Result</label>
            </div>
            <div className="field-body">
              <div className="field is-narrow">
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={result} onChange={onResultChanged}>
                      <option>*</option>
                      <option>1-0</option>
                      <option>0-1</option>
                      <option>1/2-1/2</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="modal-card-foot">
          <button className={`button is-success ${isSubmitting ? 'is-loading' : ''}`} disabled={!canSubmit}
                  onClick={submit}>
            Save changes
          </button>
          <button className="button" onClick={hide}>Cancel</button>
        </footer>
      </div>
    </div>,
    document.body
  ) : null
}

export default SaveGameModal;
