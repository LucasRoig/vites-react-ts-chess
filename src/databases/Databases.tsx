import React, {ChangeEvent, useEffect, useState} from "react";
import ChessDbService, {ChessDb} from "../@core/ChessDbService";
import {toast} from "react-toastify";
import {useAppDispatch} from "../store";
import {useFormik} from "formik"

import {OpenTabAction} from "../store/tabs/actions";
import {HorizontalInput} from "../shared-components/inputs/HorizontalInput";
import {Modal} from "../shared-components/Modal";
import {DeleteButton} from "../shared-components/buttons/DeleteButton";
import {useCollection} from "../shared-components/UseCollection";

const Databases: React.FunctionComponent = () => {
  const databases = useCollection<ChessDb>([])
  const dispatch = useAppDispatch()

  useEffect(() => {
    ChessDbService.fetchChessDb().then(res => databases.set(res)).catch(() => {
      toast.error("cannot fetch databases")
    })
  }, [])

  const deleteDb = (db: ChessDb) =>  {
    ChessDbService.deleteChessDb(db).then(() => {
      toast.success(`Database ${db.name} deleted`)
      databases.remove(db)
    }).catch(err => {
      console.error(err);
      toast.error(`Error while deleting ${db.name}`)
    })
  }

  const openDatabase = (db: ChessDb) => {
    dispatch(OpenTabAction({name: db.name, path: `/databases/${db.id}`}))
  }

  const createDb = async (name: string) => {
    try {
      const db = await ChessDbService.createChessDb(name);
      databases.add(db)
      openDatabase(db)
    } catch (e: unknown) {
      toast.error("Error while creating database")
    }
  }

  return (
    <div>
      <CreateDbForm createDb={createDb}/>
      <DbTable dbs={databases.value} deleteDb={deleteDb} openDb={openDatabase}/>
    </div>
  )
}

const DbTable: React.FunctionComponent<{
  dbs: ChessDb[],
  deleteDb: (db: ChessDb) => void,
  openDb: (db: ChessDb) => void
}> = ({dbs, deleteDb, openDb}) => {

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
            <button className="button is-ghost" onClick={openDb.bind(null, db)}>{db.name}</button>
          </td>
          <td style={{textAlign: "right"}}>
            <DeleteButton modalTitle="Delete database" onClick={deleteDb.bind(null, db)}
                          modalMessage={"Do you really want to delete the database : " + db.name}/>
          </td>
        </tr>
      )}
      </tbody>
    </table>
  )

}


const CreateDbForm: React.FunctionComponent<{ createDb: (dbName: string) => void }> = ({createDb}) => {
  const [inputDbName, setInputDbName] = useState("")
  const [createButtonEnabled, setCreateButtonEnabled] = useState(false)
  const [isCreateDbLoading, setCreateDbLoading] = useState(false)

  const onInputDbNameChanged = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setCreateButtonEnabled(newValue.length > 0)
    setInputDbName(newValue)
  }

  const handleCreate = async () => {
    setCreateDbLoading(true)
    await createDb(inputDbName)
    setCreateDbLoading(false)
    setInputDbName("")
  }

  return (
    <div className="field is-grouped">
      <p className="control">
        <input className="input" type="text" placeholder="New database" value={inputDbName}
               onChange={onInputDbNameChanged} disabled={isCreateDbLoading}/>
      </p>
      <p className="control">
        <button className={`button is-primary ${isCreateDbLoading ? "is-loading" : ""}`}
                disabled={!createButtonEnabled} onClick={handleCreate}>Create
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
