import React, {useEffect, useMemo, useState} from "react";
import {Modal} from "../../shared-components/Modal";
import {HorizontalField} from "../../shared-components/inputs/HorizontalField";
import ChessDbService, {ChessDb} from "../../@core/ChessDbService";
import {toast} from "react-toastify";
import {useFormik} from "formik";
import * as Yup from "yup"
import {useTextEditorContext} from "./TextEditorContext";
import {HorizontalInput} from "../../shared-components/inputs/HorizontalInput";
import ApiService from "../../@core/ApiService";
import {DocumentService} from "./DocumentService";
import {useAppDispatch, useAppSelector} from "../../store";
import {CloseTabAction, OpenDocumentFromDbAction} from "../../store/tabs/actions";

interface SaveTextModalProps {
  isOpen: boolean,
  hide: () => void,

}

const SaveTextModal: React.FC<SaveTextModalProps> = ({isOpen, hide}) => {
  const [chessDbs, setChessDb] = useState<ChessDb[]>();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const currentTab = useAppSelector(s => s.tabs.selectedTab)
  const context = useTextEditorContext()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (isOpen) {
      ChessDbService.fetchChessDb().then(dbs => {
        if (dbs.length > 0) {
          if (context.documentSaveData !== null) {
            let find = dbs.find(db => db.id === context.documentSaveData?.dbId);
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
    }
  }, [isOpen])
  const initialValues = useMemo(() => {

    return {
      database: "",
      title: context.document.title
    }
  }, [isOpen])

  const formik = useFormik({
    initialValues,
    onSubmit: ({database, title}) => {
      setIsSubmitting(true);
      const doc = context.document;
      doc.title = title;
      if (context.documentSaveData !== null) {
        DocumentService.updateDocInBase(doc, context.documentSaveData.id).then(() => {
          setIsSubmitting(false)
          hideAndReset()
          toast.success("Successfully saved")
        }).catch(err => {
          console.error(err)
          setIsSubmitting(false)
          toast.error("Error while saving document")
        })
      } else {
        DocumentService.createDocInDb(doc, database).then(({id}) => {
          setIsSubmitting(false)
          hideAndReset()
          toast.success("Successfully saved")
          if (currentTab) {
            dispatch(CloseTabAction(currentTab))
          }
          dispatch(OpenDocumentFromDbAction(title, database, id));
        }).catch(e => {
          console.log(e)
          setIsSubmitting(false)
          toast.error("Error while saving document")
        })
      }
    },
    validateOnMount: true,
    validationSchema: Yup.object().shape({
      database: Yup.string().required("Required").min(1, "Required"),
      title: Yup.string().required("Required").min(1, "Required")
    })
  })
  useEffect(() => {
    if (formik) {
      formik.setFieldValue("title", context.document.title, true)
    }
  }, [isOpen])
  const hideAndReset = () => {
    formik.resetForm();
    hide();
  }
  return <Modal isOpen={isOpen} hide={hide} title={"Save document to database"} buttons={
    <>
      <button className={`button is-success ${isSubmitting ? 'is-loading' : ''}`} disabled={!formik.isValid}
              onClick={formik.submitForm}>
        Save changes
      </button>
      <button className="button" onClick={hideAndReset}>Cancel</button>
    </>
  } content={
    <>
      <HorizontalField name="database" label="database">
        <div className="select is-fullwidth">
          <select disabled={!chessDbs || chessDbs.length === 0 || context.documentSaveData !== null} onChange={formik.handleChange} value={formik.values.database}>
            {chessDbs && chessDbs.map(db => <option key={db.id} value={db.id}>{db.name}</option>)}
            {(!chessDbs || chessDbs.length === 0 ) && <option>No database found</option>}
          </select>
        </div>
      </HorizontalField>
      <HorizontalInput name="title" label="Title" type="text" onChange={formik.handleChange} value={formik.values.title}/>
    </>
  }/>
}

export default SaveTextModal
