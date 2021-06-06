import React, {Component} from 'react';
import ReactDOM from 'react-dom';


interface SaveGameModalProps {
  isOpen: boolean,
  hide: () => void
}

const SaveGameModal: React.FunctionComponent<SaveGameModalProps> = ({isOpen, hide}) => {
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
                    <select>
                      <option>DB 1</option>
                      <option>DB 2</option>
                      <option>DB 3</option>
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
                  <input className="input" type="text" placeholder="White"/>
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
                  <input className="input" type="text" placeholder="Black"/>
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
                  <input className="input" type="text" placeholder="Event"/>
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
                  <input className="input" type="date"/>
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
                    <select>
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
          <button className="button is-success">Save changes</button>
          <button className="button" onClick={hide}>Cancel</button>
        </footer>
      </div>
    </div>,
    document.body
  ) : null
}

export default SaveGameModal;
