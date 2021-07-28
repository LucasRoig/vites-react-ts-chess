import React, {ChangeEvent, useEffect, useState} from "react";
import ChessDbService, {ChessDb} from "../@core/ChessDbService";
import {toast} from "react-toastify";
import {ConfirmationModal} from "../shared-components/ConfirmationModal";
import {useAppDispatch} from "../store";
import {useFormik} from "formik"

import {OpenTabAction} from "../store/tabs/actions";
import {HorizontalField} from "../shared-components/HorizontalField";
import {Modal} from "../shared-components/Modal";

const Databases: React.FunctionComponent = () => {
  const [dbs, setDbs] = useState<ChessDb[]>([])
  useEffect(() => {
    ChessDbService.fetchChessDb().then(res => setDbs(res))
  }, [])
  const addDb = (db: ChessDb) => {
    const newDbs = [...dbs, db]
    setDbs(newDbs)
  }
  const removeDb = (db: ChessDb) => {
    const newDbs = dbs.filter(d => d !== db)
    setDbs(newDbs)
  }
  return (
    <div style={{margin: "1em"}}>
      <CreateDbForm onDbCreated={addDb}/>
      <DbTable dbs={dbs} onDbDeleted={removeDb}/>
    </div>
  )
}

const DbTable: React.FunctionComponent<{
  dbs: ChessDb[],
  onDbDeleted: (db: ChessDb) => void
}> = ({dbs, onDbDeleted}) => {
  const dispatch = useAppDispatch()
  const [isDeleteModalOpen, toggleDeleteModal] = useState(false)
  const [deleteModalMessage, setDeleteModalMessage] = useState("")
  const [deleteModalCb, setDeleteModalCb] = useState<() => void>(() => {
  })
  const openDeleteModal = (db: ChessDb) => () => {
    setDeleteModalMessage("Do you really want to delete the database : " + db.name)
    toggleDeleteModal(true)
    setDeleteModalCb(() => deleteDb(db))
  }
  const deleteDb = (db: ChessDb) => () => {
    ChessDbService.deleteChessDb(db).then(() => {
      toast.success(`Database ${db.name} deleted`)
      toggleDeleteModal(false)
      onDbDeleted(db)
    })
  }
  const openDatabase = (db: ChessDb) => () => {
    dispatch(OpenTabAction({name: db.name, path: `/databases/${db.id}`}))
  }
  return (
    <table className="table" style={{width: "100%"}}>
      <thead>
      <tr>
        <th>Database Name</th>
        <th/>
      </tr>
      </thead>
      <tbody>
      {dbs.map(db =>
        <tr key={db.id}>
          <td style={{verticalAlign: "middle"}} >
            <button className="button is-ghost" onClick={openDatabase(db)}>{db.name}</button>
          </td>
          <td style={{textAlign: "right"}}>
            <button className="button is-danger is-outlined is-small" onClick={openDeleteModal(db)}>
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


const CreateDbForm: React.FunctionComponent<{ onDbCreated: (db: ChessDb) => void }> = ({onDbCreated}) => {
  const dispatch = useAppDispatch()
  const [inputDbName, setInputDbName] = useState("")
  const [createButtonEnabled, setCreateButtonEnabled] = useState(false)
  const [isCreateDbLoading, setCreateDbLoading] = useState(false)
  const onInputDbNameChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setCreateButtonEnabled(newValue.length > 0)
    setInputDbName(newValue)
  }
  const postCreateDb = () => {
    const name = inputDbName
    setCreateDbLoading(true)
    ChessDbService.createChessDb(name).then((res) => {
      setCreateDbLoading(false)
      setInputDbName("")
      setCreateButtonEnabled(false)
      dispatch(OpenTabAction({name: res.name, path: `/databases/${res.id}`}))
      onDbCreated(res)
    })
  }
  return (
    <div className="field is-grouped">
      <p className="control">
        <input className="input" type="text" placeholder="New database" value={inputDbName}
               onChange={onInputDbNameChanged} disabled={isCreateDbLoading}/>
      </p>
      <p className="control">
        <button className={`button is-primary ${isCreateDbLoading ? "is-loading" : ""}`}
                disabled={!createButtonEnabled} onClick={postCreateDb}>Create
        </button>
      </p>
    </div>
  )
}

interface CreateDbModalProps {
  isOpen: boolean,
  hide: () => void
}

const CreateDbModal: React.FunctionComponent<CreateDbModalProps> = ({isOpen, hide}) => {
  const formik = useFormik({
    initialValues: {
      name: ""
    },
    onSubmit: values => {
      console.log(values)
    }
  })
  return <Modal isOpen={isOpen} hide={hide} title={"Create database"}
                buttons={
                  <>
                    <button className="button is-success" onClick={formik.submitForm}>Save</button>
                    <button className="button" onClick={hide}>Cancel</button>
                  </>
                }
                content={
                  <>
                    <HorizontalField name="name" label="Name" placeholder="DatabaseName" type="text"
                                     onChange={formik.handleChange} value={formik.values.name}/>
                  </>
                }
  />
}

export {
  Databases
}
