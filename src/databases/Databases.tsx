import React, {ChangeEvent, useEffect, useState} from "react";
import ChessDbService, {ChessDb} from "../@core/ChessDbService";
import {toast} from "react-toastify";
import {ConfirmationModal} from "../shared-components/confirmation-modal/ConfirmationModal";
import {useAppDispatch} from "../store";
import {useFormik} from "formik"

import {OpenTabAction} from "../store/tabs/actions";
import {HorizontalInput} from "../shared-components/inputs/HorizontalInput";
import {Modal} from "../shared-components/Modal";
import {useConfirmationModalContext} from "../shared-components/confirmation-modal/ConfirmationModalContext";
import {DeleteButton} from "../shared-components/buttons/DeleteButton";

const Databases: React.FunctionComponent = () => {
  const [dbs, setDbs] = useState<ChessDb[]>([])
  useEffect(() => {
    ChessDbService.fetchChessDb().then(res => setDbs(res)).catch(() => {
      toast.error("cannot fetch databases")
    })
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
  const deleteDb = (db: ChessDb) => () => {
    ChessDbService.deleteChessDb(db).then(() => {
      toast.success(`Database ${db.name} deleted`)
      onDbDeleted(db)
    }).catch(err => {
      console.error(err);
      toast.error(`Error while deleting ${db.name}`)
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
            <DeleteButton modalTitle="Delete database" onClick={deleteDb(db)}
                          modalMessage={"Do you really want to delete the database : " + db.name}/>
          </td>
        </tr>
      )}
      </tbody>
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
    }).catch(() => {
      setCreateDbLoading(false)
      setCreateButtonEnabled(true)
      toast.error("cannot create database")
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
                    <HorizontalInput name="name" label="Name" placeholder="DatabaseName" type="text"
                                     onChange={formik.handleChange} value={formik.values.name}/>
                  </>
                }
  />
}

export {
  Databases
}
